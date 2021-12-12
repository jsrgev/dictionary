import {capitalize, clone, generatePos, getAllGramClassGroups, setGramForms, getGramClassDef, getPosDef, getIndent, addPopupHandler} from '../../utils';
import AddPopup from '../AddPopup';
// import {partsOfSpeechDefs} from '../../languageSettings.js';
import ParadigmForm from './ParadigmForm';
import {useState} from 'react';
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
        let entryCopyPath = _.get(entryCopy, pathFrag)
        if (path.length === 1) {
            entryCopyPath.splice(0, 1, generatePos(appState.savedSetup.partsOfSpeechDefs[0].name));
        } else {
            entryCopyPath.splice(thisIndex, 1);
        }
        setAppState({entry: entryCopy});
    };

    const handlePOSClick = async e => {
        let value = e.target.getAttribute("value");
        // console.log(value);
        if (!isAvailable(value)) {
            return;
        }
        // console.log(value);
        let entryCopy = clone(appState.entry);
        let entryCopyPath = _.get(entryCopy, pathFrag)
        entryCopyPath[thisIndex] = generatePos(value, appState.setup.partsOfSpeechDefs);
        setAppState({entry: entryCopy});
    };

    const handleGramClassClick = e => {
        let value = e.target.getAttribute("value");
        if (value === path[thisIndex].class) {
            return;
        }
        let entryCopy = clone(appState.entry);
        let entryCopyPath = _.get(entryCopy, pathFrag)
        let gramClass = getGramClassDef(entryCopyPath[thisIndex].name, value, appState.savedSetup.partsOfSpeechDefs);
        let posDef = getPosDef(entryCopyPath[thisIndex].name);
        if (posDef.multiChoice) {

        }
        setGramForms(entryCopyPath[thisIndex], gramClass, appState.setup.gramFormGroups);
        setAppState({entry:entryCopy});
    }

    const isAvailable = posId => {
        return availablePoses.some(a => a.id === posId);
    }

    const isCurrentSelection = posId =>  {
        return path[thisIndex].refId === posId;
    }

    const popupItems = [
        ["Part of speech", () => addPos(thisIndex, pathFrag, availablePoses)],
    ]

    const isFirst = thisIndex === 0;
    const isLast = thisIndex === path.length-1;

    const stringPathA = pathFrag + `[${thisIndex}]`;

    // console.log(path[thisIndex]);
    // console.log(appState.savedSetup.partsOfSpeechDefs);
    // console.log(getAllGramClassGroups(path[thisIndex].refId, appState.savedSetup.partsOfSpeechDefs));

    const getGramClasses = (gramClassGroupId, gramClassGroups) => {
        let thisGroupsGramClasses = gramClassGroups.find(a => a.id === gramClassGroupId );
        // console.log(gramClassesThisPos)
        let posDef = appState.setup.partsOfSpeechDefs.find(a => a.id === path[thisIndex].refId);

        let excluded = posDef.gramClassGroups.find(a => a.refId === gramClassGroupId).excluded;
        // filter out classes that aren't allowed for this POS
        let included = thisGroupsGramClasses.gramClasses.filter(a => {
            return !excluded.some(b => b === a.id);
        })
        return included;
    }

    
    const gramClassGroups = getAllGramClassGroups(path[thisIndex].refId, appState.savedSetup.partsOfSpeechDefs);
    // console.log(gramClassGroups)

    const isCurrentGramClassSelection = (gramClassId) => {
        // console.log(gramClassId);
        // console.log(path[thisIndex].gramClassGroups)
        // path[thisIndex].gramClassGroups.find(b => b.refId === a.id);
        return false;
    }

    return (
        <>
            <div className={`row${posOpen ? "" : " closed"}`}>
                <div className="row-controls">
                    <AddPopup popupItems={popupItems} visible={addPopupVisible} />
                    <i className={`fas fa-plus${availablePoses.length===0 ? " disabled" : ""}`} onClick={() => addPopupHandler(addPopupVisible, setAddPopupVisible)}></i>           
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
                        {appState.savedSetup.partsOfSpeechDefs.map((a,i) => (
                            <li key={i} value={a.id} className={ isCurrentSelection(a.id) ? "selected" : isAvailable(a.id) ? ""  : "disabled" } onClick={handlePOSClick}>{capitalize(a.name)}</li>
                        ))}
                    </ul>   
                </div>
                { path[thisIndex].gramClassGroups?.map((a, i) => (
                        <div className="row" key={i}>
                            <div className="row-controls"></div>
                            <div className="row-content" style={getIndent(prevIndentLevel+1)}>
                                <span>{capitalize(appState.setup.gramClassGroups.find(b => b.id === a.refId).name)}</span>
                                <ul>
                                    { getGramClasses(a.refId, appState.savedSetup.gramClassGroups).map((a,i) => (
                                    <li key={i} value={a.name} 
                                    className={ isCurrentGramClassSelection(a.id) ? "selected" : ""} 
                                    onClick={handleGramClassClick}>{capitalize(a.name)}</li>
                                    )) }
                                </ul>
                                {/* <ul>
                                    { gramClassGroups.map((a,i) => (
                                    <li key={i} value={a.name} 
                                    className={path[thisIndex].gramClassGroups.find(b => b.gramClassGroupId === a.id) ? "selected" : ""} 
                                    onClick={handleGramClassClick}>{capitalize(a.name)}</li>
                                    )) }
                                </ul> */}
                            </div>
                        </div>
                    ))
                }


                        {/* { path[thisIndex].paradigmFormGroups?.length>0 &&
                            <div className={`row${formsOpen ? "" : " closed"}`}>
                                <div className="row-controls">
                                    <i></i>
                                    <i></i>
                                    <i className={`fas fa-chevron-${formsOpen ? "up" : "down"}`} onClick={() => setFormsOpen(!formsOpen)}></i>
                                </div>
                                <div className="row-content" style={getIndent(prevIndentLevel+1)}>
                                    <div>Forms</div>
                                </div>
                                {path[thisIndex].paradigmFormsGroups.map((a,i) => (
                                        <ParadigmForm key={i} thisIndex={i} appState={appState} setAppState={setAppState} prevIndentLevel={prevIndentLevel+2} stringPath={stringPathA} addFunctions={addFunctions} />
                                ))}
                            </div>
                        } */}


                    {/* </div> */}
            </div>
    </>
    )
};

export default PartOfSpeech;