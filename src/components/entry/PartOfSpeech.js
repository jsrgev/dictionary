import {capitalize, clone, generatePos, getIndent, addPopupHandler, getGramClasses} from '../../utils';
import AddPopup from '../AddPopup';
// import {partsOfSpeechDefs} from '../../languageSettings.js';
import ParadigmForm from './ParadigmForm';
import {useState, useEffect} from 'react';
import _ from 'lodash';

const PartOfSpeech = (props) => {
    const {appState, setAppState, thisIndex, prevIndentLevel, stringPath, addFunctions, availablePoses, moveItem} = props;
    const {addPos} = addFunctions;

    let pathFrag = stringPath + ".partsOfSpeech";
    const path = _.get(appState, "entry." + pathFrag);

    const [posOpen, setPosOpen] = useState(true);
    const [formsOpen, setFormsOpen] = useState(false);
    const [addPopupVisible, setAddPopupVisible] = useState(false);

    const deletePos = (e) => {
        let entryCopy = clone(appState.entry);
        let entryCopyPath = _.get(entryCopy, pathFrag);
        if (path.length === 1) {
            entryCopyPath.splice(0, 1, generatePos(appState.setup.partsOfSpeechDefs[0].name));
        } else {
            entryCopyPath.splice(thisIndex, 1);
        }
        setAppState({entry: entryCopy});
    };

    const handlePosClick = async e => {
        let value = e.target.getAttribute("value");
        if (!isAvailable(value)) {
            return;
        }
        let entryCopy = clone(appState.entry);
        let entryCopyPath = _.get(entryCopy, pathFrag);
        entryCopyPath[thisIndex] = generatePos(value, appState.setup.partsOfSpeechDefs, appState.setup.gramClassGroups);
        setAppState({entry: entryCopy});
        return;
    };

    const cleanUpGramForms = () => {
        let irregulars = path[thisIndex].irregulars;
        if (!irregulars) {
            return;
        }
        let irregularsToDelete = [];
        irregulars.forEach((a, i) => {
            let gramFormSet = a.gramFormSet;
            let formShouldntExist = !allGramForms.some(b => {
                return gramFormSet.every(c => {
                    return b.some(d => d === c);
                })
            })
            if (formShouldntExist) irregularsToDelete.push(i);
        });
        if (irregularsToDelete.length > 0) {
            let entryCopy = clone(appState.entry);
            let entryCopyPath = _.get(entryCopy, `${pathFrag}[${thisIndex}].irregulars`);
            irregularsToDelete.reverse().forEach(a => {
                entryCopyPath.splice(a, 1);
            });
            setAppState({entry: entryCopy});
        }
    };
    
    const handleGramClassClick = (e, i, classGroupId) => {
        let value = e.target.getAttribute("value");
        const isMultiChoice = appState.setup.gramClassGroups.find(a => a.id === classGroupId).multiChoice;
        let entryCopy = clone(appState.entry);
        let entryCopyPath = _.get(entryCopy, pathFrag);
        let index = entryCopyPath[thisIndex].gramClassGroups[i].gramClasses.findIndex(a => a === value);

        if (!isMultiChoice) {
            if (index === 0) {
                return;
            } else {
                entryCopyPath[thisIndex].gramClassGroups[i].gramClasses.splice(0, 1, value);
            }
        } else {
            if (index >= 0) {
                if (entryCopyPath[thisIndex].gramClassGroups[i].gramClasses.length === 1) {
                    return;
                } else {
                    entryCopyPath[thisIndex].gramClassGroups[i].gramClasses.splice(index, 1);
                }
            } else {
                entryCopyPath[thisIndex].gramClassGroups[i].gramClasses.push(value);
            }
        }
        setAppState({entry: entryCopy});
    }

    const gramClassGroups = path[thisIndex].gramClassGroups;

    useEffect(() => {
        cleanUpGramForms();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[gramClassGroups]);

    const isAvailable = posId => {
        return availablePoses.some(a => a.id === posId);
    }

    const isCurrentSelection = posId =>  {
        return path[thisIndex].refId === posId;
    }

    const getAllGramForms = () => {
        let posDef = appState.setup.partsOfSpeechDefs.find(a => a.id === path[thisIndex].refId);
        let gramFormGroups = posDef.gramFormGroups;
        if (!gramFormGroups) {
            return [];
        }
        let groups = [];
        gramFormGroups.forEach(a => {
            // "gramForms" could be actual gramForms or gramClasses (forms to agree with classes)
            let gramFormGroupDef = appState.setup.gramFormGroups.find(b => b.id === a.refId) || appState.setup.gramClassGroups.find(b => b.id === a.refId);
            let arr = [];
            let gramForms = gramFormGroupDef.gramForms || gramFormGroupDef.gramClasses;
            gramForms.forEach(gramFormDef => {
                let applicable = true;  
                if (gramFormDef.constraints) {
                    gramFormDef.constraints.forEach(group => {
                        let allCurrentGramClasses = [];
                        path[thisIndex].gramClassGroups.forEach(a => {
                            a.gramClasses.forEach(b => {
                                allCurrentGramClasses.push(b);
                            });
                        })
                        let match = group.excludedGramClasses.some(a => {
                            return allCurrentGramClasses.some(b => b === a);
                        });
                        if (match) {
                            applicable = false;
                        }
                    });
                }
                if (applicable) {
                    arr.push(gramFormDef.id);
                }
            })
            groups.push(arr);
        })
        // get all combinations - from https://stackoverflow.com/questions/12303989/cartesian-product-of-multiple-arrays-in-javascript
        const cartesian = (...a) => a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())));

        // cartesian doesn't work right for single array, e.g. just [sg., pl.]
        let allGramForms = groups.length === 1 ? _.chunk(...groups, 1) : cartesian(...groups);
        let x = _.chunk(...groups, 1);
        return (typeof(allGramForms[0]) === "string") ? [allGramForms] : allGramForms;
    };

    const allGramForms = getAllGramForms();
    const popupItems = [];

    if (availablePoses.length > 0) {
        popupItems.push(["Part of speech", () => addPos(thisIndex, pathFrag, availablePoses)]);
    }

    const isFirst = thisIndex === 0;
    const isLast = thisIndex === path.length-1;

    const stringPathA = pathFrag + `[${thisIndex}]`;

    return (
        <>
            <div className={`row${posOpen ? "" : " closed"}`}>
                <div className="row-controls">
                    <AddPopup popupItems={popupItems} visible={addPopupVisible} />
                    <i className={`fas fa-plus${popupItems.length === 0 ? " disabled" : ""}`} onClick={popupItems.length === 0 ? undefined : () => addPopupHandler(addPopupVisible, setAddPopupVisible)}></i>           
                    <i className="fas fa-minus" onClick={deletePos}></i>           
                    <i className={`fas fa-chevron-${posOpen ? "up" : "down"}`} onClick={() => setPosOpen(!posOpen)}></i>
                    <i
                    className={`fas fa-arrow-up${isFirst ? " disabled" : ""}`}
                    onClick={e => moveItem(e, thisIndex, pathFrag, true)}
                    ></i>
                    <i
                    className={`fas fa-arrow-down${isLast ? " disabled" : ""}`}
                    onClick={e => moveItem(e, thisIndex, pathFrag, false)}
                    ></i>
                </div>
                <div className="row-content" style={getIndent(prevIndentLevel)}>
                    <span>Part of speech</span>
                    <ul className="parts-of-speech">
                        {appState.setup.partsOfSpeechDefs.map((a,i) => (
                            <li key={i} value={a.id} className={ isCurrentSelection(a.id) ? "selected" : isAvailable(a.id) ? ""  : "disabled" } onClick={handlePosClick}>{capitalize(a.name)}</li>
                        ))}
                    </ul>   
                </div>
                { path[thisIndex].gramClassGroups?.map((a, i) => (
                        <div className="row" key={i}>
                            <div className="row-controls"></div>
                            <div className="row-content" style={getIndent(prevIndentLevel+1)}>
                                <span>{capitalize(appState.setup.gramClassGroups.find(b => b.id === a.refId).name)}</span>
                                <ul>
                                    { getGramClasses(path[thisIndex].refId, a.refId, appState.setup.partsOfSpeechDefs, appState.setup.gramClassGroups).map((b,j) => (
                                        <li key={j} value={b.id} 
                                        className={ a.gramClasses.some(a => a === b.id) ? "selected" : ""} 
                                        onClick={e => handleGramClassClick(e, i, a.refId)}>{capitalize(b.name)}</li>
                                        ))
                                    }
                                </ul>
                            </div>
                        </div>
                    ))
                }
                { allGramForms.length > 0 &&
                    <div className={`row${formsOpen ? "" : " closed"}`}>
                        <div className="row-controls">
                            <i></i>
                            <i></i>
                            <i className={`fas fa-chevron-${formsOpen ? "up" : "down"}`} onClick={() => setFormsOpen(!formsOpen)}></i>
                        </div>
                        <div className="row-content" style={getIndent(prevIndentLevel+1)}>
                            <div>Forms:</div>
                        </div>
                        {allGramForms.map((a, i) => (
                            <ParadigmForm key={i} thisIndex={i} gramFormSet={a} appState={appState} setAppState={setAppState} prevIndentLevel={prevIndentLevel+2} stringPath={stringPathA} addFunctions={addFunctions} moveItem={moveItem} />
                        ))}
                    </div>
                }
            </div>
    </>
    )
};

export default PartOfSpeech;