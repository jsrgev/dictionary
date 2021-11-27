import {capitalize, clone, generatePos, getAllTypes, setSecondary, getTypeDef, getPosDef, getIndent, addPopupHandler} from '../utils';
import AddPopup from './AddPopup';
import {partsOfSpeechDefs} from '../languageSettings.js';
import ParadigmForm from './ParadigmForm';
import {useState} from 'react';
import _ from 'lodash';

const PartOfSpeech = (props) => {
    const {appState, setAppState, thisIndex, prevIndentLevel, stringPath, addFunctions, availablePoses} = props;
    const {addPos} = addFunctions;
    // const path = appState.entry.senseGroups[senseGroupIndex].partsOfSpeech;

    let pathFrag = stringPath + ".partsOfSpeech";
    const path = _.get(appState, "entry." + pathFrag);

    const [posOpen, setPosOpen] = useState(true);
    const [formsOpen, setFormsOpen] = useState(false);
    const [addPopupVisible, setAddPopupVisible] = useState(false);

    const deletePos = (e) => {
        let entryCopy = clone(appState.entry);
        let entryCopyPath = _.get(entryCopy, pathFrag)
        if (path.length === 1) {
            entryCopyPath.splice(0, 1, generatePos());
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
        setSecondary(entryCopyPath[thisIndex], type);
        setAppState({entry:entryCopy});
    }

    const isAvailable = posName => {
        return availablePoses.some(a => a.name === posName);
    }

    const isCurrentSelection = posName =>  {
        return path[thisIndex].name === posName;
    }

    const popupItems = [
        ["Part of speech", () => addPos(thisIndex, pathFrag, availablePoses)],
        // ["Note", e => addNote(path[thisIndex].notes.length-1, pathFrag+`[${thisIndex}]`)]
    ]

    const stringPathA = pathFrag + `[${thisIndex}]`;


    return (
        <>
            <div className={`row${posOpen ? "" : " closed"}`}>
                <div className="row-controls">
                    <AddPopup popupItems={popupItems} visible={addPopupVisible} />
                    <i className={`fas fa-plus${availablePoses.length===0 ? " disabled" : ""}`} onClick={() => addPopupHandler(addPopupVisible, setAddPopupVisible)}></i>           
                    <i className="fas fa-minus" onClick={deletePos}></i>           
                    <i className={`fas fa-chevron-${posOpen ? "up" : "down"}`} onClick={() => setPosOpen(!posOpen)}></i>
                </div>
                <div className="row-content" style={getIndent(prevIndentLevel)}>
                    <span>Part of speech</span>
                    <ul className="parts-of-speech">
                        {partsOfSpeechDefs.map((a,i) => (
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

                        { path[thisIndex].paradigmForms.length>0 &&
                            <div className={`row${formsOpen ? "" : " closed"}`}>
                                <div className="row-controls">
                                    <i></i>
                                    <i></i>
                                    <i className={`fas fa-chevron-${formsOpen ? "up" : "down"}`} onClick={() => setFormsOpen(!formsOpen)}></i>
                                </div>
                                <div className="row-content" style={getIndent(prevIndentLevel+1)}>
                                    <div>Forms</div>
                                </div>
                                {path[thisIndex].paradigmForms.map((a,i) => (
                                        <ParadigmForm key={i} thisIndex={i} appState={appState} setAppState={setAppState} prevIndentLevel={prevIndentLevel+2} stringPath={stringPathA} addFunctions={addFunctions} />
                                    ))}
                            </div>
                        }


                    </div>
                }
            </div>
    </>
    )
};

export default PartOfSpeech;