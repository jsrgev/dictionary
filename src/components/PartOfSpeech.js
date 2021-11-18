import {capitalize, clone, generatePos, getAllTypes, setSecondary, getTypeDef, getPosDef, getIndent} from '../utils';
import {allPartsOfSpeech} from '../languageSettings.js';
import ParadigmForm from './ParadigmForm';
import {useState} from 'react';
import _ from 'lodash';

const PartOfSpeech = (props) => {
    const {appState, setAppState, senseGroupIndex, thisIndex, prevIndentLevel, stringPath} = props;
    // const path = appState.entry.senseGroups[senseGroupIndex].partsOfSpeech;

    let pathFrag = stringPath + ".partsOfSpeech";
    const path = _.get(appState, "entry." + pathFrag);


    const addPos = e => {
        e.preventDefault();
        if (e.target.classList.contains("disabled")) {
            return;
        }
        let entryCopy = clone(appState.entry);
        let entryCopyPath = _.get(entryCopy, pathFrag)
        entryCopyPath.splice(thisIndex+1, 0, generatePos(availablePoses[0].name));
        setAppState({entry: entryCopy});
    };

    const deletePos = (e) => {
        e.preventDefault();
        let entryCopy = clone(appState.entry);
        let entryCopyPath = _.get(entryCopy, pathFrag)
        if (path.length === 1) {
            entryCopyPath = [generatePos()];
        } else {
            entryCopyPath.splice(thisIndex, 1);
        }
        setAppState({entry: entryCopy});
    };

    const handlePOSClick = async e => {
        let value = e.target.getAttribute("value");
        if (!isAvailable(value)) {
            return;
        }
        let entryCopy = clone(appState.entry);
        let entryCopyPath = _.get(entryCopy, pathFrag)
        entryCopyPath[thisIndex] = generatePos(value);
        setAppState({entry: entryCopy});
    };

    const handleTypeClick = e => {
        let value = e.target.getAttribute("value");
        if (value === path[thisIndex].type) {
            return;
        }
        let entryCopy = clone(appState.entry);
        let entryCopyPath = _.get(entryCopy, pathFrag)
        let type = getTypeDef(entryCopyPath[thisIndex].name, value);
        let posDef = getPosDef(entryCopyPath[thisIndex].name);
        if (posDef.multiChoice) {

        }
        // console.log(senseGroupIndex)
        // console.log(entryCopy.senseGroups);
        setSecondary(entryCopyPath[thisIndex], type);
        setAppState({entry:entryCopy});
    }

    const handleBarClick = e => {
        if (!e.target.classList.contains("no-secondary")) {
            setSecondaryShown(!secondaryShown);
        }
    }

    const [posShown, setPosShown] = useState(true);
    const [secondaryShown, setSecondaryShown] = useState(true);
    
    let areSecondaryForms = path[thisIndex].typeForms.length > 0 ? true : false;

    const availablePoses = allPartsOfSpeech.filter(a => {
        let alreadySelected = path.some(b => b.name === a.name);
        if (!alreadySelected) {
            return a;
        }
    })

    const isAvailable = posName => {
        return availablePoses.some(a => a.name === posName);
    }

    const isCurrentSelection = posName =>  {
        return path[thisIndex].name === posName;
    }

    const stringPathA = pathFrag + `[${thisIndex}]`;


    return (
        <>
            {/* <div className="bar">
                <div className="bar-pos" onClick={() => setPosShown(!posShown)}>Part of speech <i className={posShown? "fas fa-chevron-up" : "fas fa-chevron-down"}></i></div>
                <div className={`bar-secondary${areSecondaryForms ? "" : " no-secondary"}`} onClick={handleBarClick}>
                    Secondary Forms {areSecondaryForms && <i className={secondaryShown? "fas fa-chevron-up" : "fas fa-chevron-down"}></i>}
                    </div>
            </div> */}

            {/* <fieldset className={`pos ${posShown ? "" : "hidden"}`}> */}
                <div className="row-controls">
                    <i className={`fas fa-plus${availablePoses.length===0 ? " disabled" : ""}`} onClick={addPos}></i>           
                    <i className="fas fa-minus" onClick={deletePos}></i>           

                </div>
                <div className="row-content" style={getIndent(prevIndentLevel)}>
                    <span>Part of speech</span>
                    <ul className="parts-of-speech">
                        {allPartsOfSpeech.map((a,i) => (
                            <li key={i} value={a.name} className={ isCurrentSelection(a.name) ? "selected" : isAvailable(a.name) ? ""  : "disabled" } onClick={handlePOSClick}>{capitalize(a.name)}</li>
                        ))}
                    </ul>
                </div>
                { path[thisIndex].types.length>0 &&
                    <div className="row">
                        <div className="row-controls"></div>
                        <div className="row-content" style={getIndent(prevIndentLevel+1)}>
                            <span>Type</span>
                            <ul className="types-of-POS">
                                { getAllTypes(path[thisIndex].name).map((a,i) => (
                                <li key={i} value={a.name} className={path[thisIndex].types.find((b => b===a.name)) ? "selected" : ""} onClick={handleTypeClick}>{capitalize(a.name)}</li>
                                )) }
                            </ul>
                        </div>

                        { path[thisIndex].typeForms.length>0 &&
                            <div className={`row ${secondaryShown ? "" : "hidden"}`}>
                                <div className="row-controls"></div>
                                <div className="row-content" style={getIndent(prevIndentLevel+1)}>
                                    <div>Forms</div>
                                    <div></div>
                                </div>
                                {path[thisIndex].typeForms.map((a,i) => (
                                        <ParadigmForm key={i} thisIndex={i} appState={appState} setAppState={setAppState} prevIndentLevel={prevIndentLevel+2} stringPath={stringPathA} />
                                    ))}
                            </div>
                        }


                    </div>
                }
            {/* </fieldset> */}

    </>
    )
};

export default PartOfSpeech;