import Pronunciation from './Pronunciation';
import AddPopup from './AddPopup';
import {clone, getIndent, handleInputBlur, addPopupHandler} from '../utils.js';
import {morphDefault, pronunciationDefault} from '../defaults.js';
import {useState} from 'react';
import _ from "lodash";

const Morph = props => {

    const {appState, setAppState, thisIndex, stringPath, prevIndentLevel, labels, addFunctions} = props;
    const {addMorph} = addFunctions;
    // const path = appState.entry.headword[thisIndex];

    let pathFrag = stringPath + "";
    const path = _.get(appState, "entry." + pathFrag);

    const [addPopupVisible, setAddPopupVisible] = useState(false);
    const [morphOpen, setMorphOpen] = useState(true);

    const handleChange = value => {
        if (value !== undefined) {
            let entryCopy = clone(appState.entry);
            let entryCopyPath = _.get(entryCopy, pathFrag)
            entryCopyPath[thisIndex].targetLang = value;
            setAppState({entry:entryCopy});
        }
    }

    const deleteMorph = e => {
        let entryCopy = clone(appState.entry);
        let entryCopyPath = _.get(entryCopy, pathFrag)
        if (entryCopyPath.length === 1) {
            entryCopyPath.splice(0, 1, clone(morphDefault));
        } else {
            entryCopyPath.splice(thisIndex, 1);
        }
        setAppState({entry: entryCopy});
    };

    const addPronunciation = (e, index) => {
        index = index ?? path[thisIndex].pronunciations.length-1;
        let entryCopy = clone(appState.entry);
        let entryCopyPath = _.get(entryCopy, pathFrag)
        entryCopyPath[thisIndex].pronunciations.splice(index+1, 0, clone(pronunciationDefault));
        setAppState({entry: entryCopy});
    };

    const popupItems = [
        ["Alternate form", () => addMorph(thisIndex, pathFrag)],
        ["Pronunciation", addPronunciation]
    ];
    
    const getNumber = () => {
        if (labels[0] === "Basic form") {
            if (path.length > 2 && thisIndex > 0) return ` ${thisIndex}`;
        } else {
            if (path.length > 1) return ` ${thisIndex+1}`; 
        }
    };

    let stringPathA = `${stringPath}[${thisIndex}]`;

    return (
        <>
            <div className={`row${morphOpen ? "" : " closed"}`}>
                <div className="row-controls">
                    <AddPopup popupItems={popupItems} visible={addPopupVisible} />
                    <i className="fas fa-plus" onClick={() => addPopupHandler(addPopupVisible, setAddPopupVisible)}></i>
                    <i className={`fas fa-minus${path.length === 1 && path[thisIndex].targetLang.trim() === "" ? " disabled" : ""}`} onClick={deleteMorph}></i>           
                    <i className={`fas fa-chevron-${morphOpen ? "up" : "down"}`} onClick={() => setMorphOpen(!morphOpen)}></i>
                </div>
                <div className="row-content" style={getIndent(prevIndentLevel)}>
                    <label forhtml={`targetLang-${thisIndex}`} >{thisIndex===0 ? labels[0] : labels[1]}{getNumber()}</label>
                    <input id={`targetLang-${thisIndex}`} type="text"
                    value={path[thisIndex].targetLang}
                    onChange={e => handleChange(e.target.value)}
                    onBlur={e => handleChange(handleInputBlur(e))}
                    />
                </div>
                <div className="row">
                    {path[thisIndex].pronunciations.map((a,i) => (
                        <Pronunciation appState={appState} setAppState={setAppState} key={i} thisIndex={i} prevIndentLevel={prevIndentLevel+1} stringPath={stringPathA} addPronunciation={addPronunciation} addFunctions={addFunctions}
                        />
                    ))}
                </div>
            </div>
        </>
    )
};

export default Morph;