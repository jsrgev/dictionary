import AddPopup from './AddPopup';
import Note from './Note';
import {clone, handleInputBlur, getIndent, addPopupHandler} from '../utils.js';
import {pronunciationDefault} from '../defaults.js';
import {useState} from 'react';
import _ from "lodash";

const Pronunciation = (props) => {

    const {appState, setAppState, thisIndex, prevIndentLevel, stringPath, addFunctions, addPronunciation, moveItem} = props;
    const {addNote} = addFunctions;
    // const path = appState.entry.headword[morphIndex].pronunciations;

    let pathFrag = stringPath + ".pronunciations";
    const path = _.get(appState, "entry." + pathFrag);

    const [addPopupVisible, setAddPopupVisible] = useState(false);

    const handleChange = value => {
        if (value !== undefined) {
            let entryCopy = clone(appState.entry);
            let entryCopyPath = _.get(entryCopy, pathFrag)
            entryCopyPath[thisIndex].content = value;
            setAppState({entry:entryCopy});    
        }
    };

    const deletePronunciation = e => {
        let entryCopy = clone(appState.entry);
        let entryCopyPath = _.get(entryCopy, pathFrag)

        if (path.length === 1) {
            entryCopyPath.splice(0, 1, clone(pronunciationDefault));
        } else {
            entryCopyPath.splice(thisIndex, 1);
        }
        // console.log(entryCopyPath)
        // console.log(entryCopy)
        setAppState({entry: entryCopy});
    };

    const closePopup = () => {
        setAddPopupVisible(false)
        window.removeEventListener("click", closePopup);
    };

    const popupItems = [
        ["Pronunciation", e => addPronunciation(e, thisIndex)],
        ["Note", () => {
            let index = (path[thisIndex].notes) ? path[thisIndex].notes.length-1 : 0;
            addNote(index, pathFrag+`[${thisIndex}]`);
        }]
    ];

    const isFirst = thisIndex === 0;
    const isLast = thisIndex === path.length-1;

    let stringPathA  = pathFrag + `[${thisIndex}]`;

    return (
        <>
            <div className="row-controls">
                <AddPopup popupItems={popupItems} visible={addPopupVisible} />
                <i className="fas fa-plus" onClick={() => addPopupHandler(addPopupVisible, setAddPopupVisible)}></i>           
                <i className={`fas fa-minus${path.length === 1 && path[thisIndex].content.trim() === "" ? " disabled" : ""}`} onClick={deletePronunciation}></i>
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
                <label>Pronunciation{path.length>1 && ` ${thisIndex+1}`}</label>
                <input type="text"
                value={path[thisIndex].content}
                onChange={e => handleChange(e.target.value)}
                onBlur={e => handleChange(handleInputBlur(e))}
                />
            </div>
            {path[thisIndex].notes?.map((a,i) => (
                <Note appState={appState} setAppState={setAppState} key={i} thisIndex={i} prevIndentLevel={prevIndentLevel+1} stringPath={stringPathA} addFunctions={addFunctions} />
            ))}
        </>
    )
};

export default Pronunciation;