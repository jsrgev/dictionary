import {capitalize, clone, generatePos, getAllGramClasses, setGramForms, getGramClassDef, getPosDef, getIndent, addPopupHandler} from '../../utils';
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
            entryCopyPath.splice(0, 1, generatePos(appState.setup.partsOfSpeechDefs[0].name));
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

    const handleGramClassClick = e => {
        let value = e.target.getAttribute("value");
        if (value === path[thisIndex].class) {
            return;
        }
        let entryCopy = clone(appState.entry);
        let entryCopyPath = _.get(entryCopy, pathFrag)
        let gramClass = getGramClassDef(entryCopyPath[thisIndex].name, value);
        let posDef = getPosDef(entryCopyPath[thisIndex].name);
        if (posDef.multiChoice) {

        }
        setGramForms(entryCopyPath[thisIndex], gramClass);
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
    ]

    const isFirst = thisIndex === 0;
    const isLast = thisIndex === path.length-1;

    const stringPathA = pathFrag + `[${thisIndex}]`;


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
                        {appState.setup.partsOfSpeechDefs.map((a,i) => (
                            <li key={i} value={a.name} className={ isCurrentSelection(a.name) ? "selected" : isAvailable(a.name) ? ""  : "disabled" } onClick={handlePOSClick}>{capitalize(a.name)}</li>
                        ))}
                    </ul>
                </div>
                { path[thisIndex].gramClasses.length>0 &&
                    <div className="row">
                        <div className="row-controls"></div>
                        <div className="row-content" style={getIndent(prevIndentLevel+1)}>
                            <span>Class</span>
                            <ul>
                                { getAllGramClasses(path[thisIndex].name).map((a,i) => (
                                <li key={i} value={a.name} className={path[thisIndex].gramClasses.find((b => b===a.name)) ? "selected" : ""} onClick={handleGramClassClick}>{capitalize(a.name)}</li>
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