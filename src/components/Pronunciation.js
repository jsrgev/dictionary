import AddPopup from './AddPopup';
import Note from './Note';
import {clone, handleInputBlur, getIndent} from '../utils.js';
import {pronunciationDefault} from '../defaults.js';
import {useState} from 'react';
import _ from "lodash";

const Pronunciation = (props) => {

    const {appState, setAppState, thisIndex, prevIndentLevel, stringPath, addFunctions, addPronunciation} = props;
    const {addNote} = addFunctions;
    // const path = appState.entry.headword[morphIndex].pronunciations;

    let pathFrag = stringPath + ".pronunciations";
    const path = _.get(appState, "entry." + pathFrag);

    const [addPopupVisible, setAddPopupVisible] = useState(false);

    const handleChange = (value, field) => {
        if (value !== undefined) {
            let entryCopy = clone(appState.entry);
            let entryCopyPath = _.get(entryCopy, pathFrag)
            entryCopyPath[thisIndex].pronunciation = value;
            setAppState({entry:entryCopy});    
        }
    }

    const deletePronunciation = (e) => {
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
    }

    const addPopupHandler = () => {
        setAddPopupVisible(!addPopupVisible);
        setTimeout(() => {
            window.addEventListener("click", closePopup);
        }, 100)
    }

    const popupItems = [
        ["Pronunciation", e => addPronunciation(e, thisIndex)],
        // ["Note", e => addNote(path[thisIndex].notes.length-1, pathFrag+`[${thisIndex}]`)]

        ["Note", () => {
            let index = (path[thisIndex].notes) ? path[thisIndex].notes.length-1 : 0;
            addNote(index, pathFrag+`[${thisIndex}]`);
            }
        ]
    ]

    // console.log(path[]);
    // console.log(path[thisIndex])

    let stringPathA  = pathFrag + `[${thisIndex}]`;

    return (
        <>
            <div className="row-controls">
                <AddPopup popupItems={popupItems} visible={addPopupVisible} />
                <i className="fas fa-plus" onClick={addPopupHandler}></i>           
                <i className={`fas fa-minus${path.length === 1 && path[thisIndex].pronunciation.trim() === "" ? " disabled" : ""}`} onClick={deletePronunciation}></i>           
            </div>
            <div className="row-content" style={getIndent(prevIndentLevel)}>
                <label>Pronunciation{path.length>1 && ` ${thisIndex+1}`}</label>
                <input type="text"
                value={path[thisIndex].pronunciation}
                onChange={e => handleChange(e.target.value, "pronunciation")}
                onBlur={e => handleChange(handleInputBlur(e), "pronunciation")}
                />
            </div>
            {path[thisIndex].notes &&
            path[thisIndex].notes.map((a,i) => (
                <Note appState={appState} setAppState={setAppState} key={i} thisIndex={i} prevIndentLevel={prevIndentLevel+1} stringPath={stringPathA} addFunctions={addFunctions} />

            ))
            }
            {/* <div className="row">
                <div className="row-controls"></div>
                <div className="row-content" style={getIndent(prevIndentLevel+1)} >
                    <label forhtml={`morph-${morphIndex}-pronunciation-${thisIndex}-note`}>Note</label>
                    <input id={`morph-${morphIndex}-pronunciation-${thisIndex}-note`} type="text"
                    value={path[thisIndex].note}
                    onChange={e => handleChange(e.target.value, "note")}
                    onBlur={e => handleChange(handleInputBlur(e), "note")}
                    />
                </div>
            </div> */}
        </>
    )
};

export default Pronunciation;