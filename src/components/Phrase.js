import AddPopup from './AddPopup';
import Definition from './Definition';
import Example from './Example';
import Note from './Note';
import {phraseDefault} from '../defaults.js'
import {clone, getIndent, handleInputBlur, addPopupHandler} from '../utils.js';
import {useState} from 'react';
import _ from 'lodash';

const Phrase = props => {

    const {appState, setAppState, prevIndentLevel, thisIndex, addFunctions, stringPath} = props;
    const {addDefinition, addPhrase, addNote} = addFunctions;

    let pathFrag = stringPath + ".phrases";
    const path = _.get(appState, "entry." + pathFrag);
    const upPath = _.get(appState, "entry." + stringPath);

    const [addPopupVisible, setAddPopupVisible] = useState(false);
    const [phraseOpen, setPhraseOpen] = useState(true);

    const handleChange = value => {
        if (value !== undefined) {
            let entryCopy = clone(appState.entry);
            let entryCopyPath = _.get(entryCopy, pathFrag);
            entryCopyPath[thisIndex].content = value;
            setAppState({entry:entryCopy});
        }
    };

    const deletePhrase = e => {
        let entryCopy = clone(appState.entry);
        let entryCopyPath = _.get(entryCopy, pathFrag)
        if (path.length === 1) {
            if (!upPath.definitions) {
                entryCopyPath.splice(0, 1, clone(phraseDefault));
            } else {
                let entryCopyUpPath = _.get(entryCopy, stringPath);
                delete entryCopyUpPath.phrases;
            }
        } else {
            entryCopyPath.splice(thisIndex, 1);
        }
        setAppState({entry: entryCopy});
    }; 

    // console.log(path[thisIndex])

    const popupItems = [
        ["Phrase", () => addPhrase(thisIndex, stringPath)],
        ["Definition", () => addDefinition(path[thisIndex].definitions.length-1, stringPath+`.phrases[${thisIndex}]`)],
        // ["Example", () => {
        //     let index = (path[thisIndex].examples) ? path[thisIndex].examples.length-1 : 0;
        //     addExample(index, pathFrag+`[${thisIndex}]`);
        // }],
        ["Note", () => {
            let index = (path.notes) ? path.notes.length-1 : 0;
            addNote(index, pathFrag+`[${thisIndex}]`);
        }],
    ];

    let stringPathA =  pathFrag + `[${thisIndex}]`;

    return (
        <>
            <div className={`row${phraseOpen ? "" : " closed"}`}>
                <div className="row-controls">
                    <AddPopup popupItems={popupItems} visible={addPopupVisible} />
                    <i className="fas fa-plus"
                    onClick={() => addPopupHandler(addPopupVisible, setAddPopupVisible)}
                    ></i>
                    <i
                    className={`fas fa-minus${path.length === 1 && path[thisIndex].content.trim() === "" && !upPath.definitions ? " disabled" : ""}`}
                    onClick={deletePhrase}
                    ></i>            
                    <i className={`fas fa-chevron-${phraseOpen ? "up" : "down"}`} onClick={() => setPhraseOpen(!phraseOpen)}></i>
                </div>
                <div className="row-content" style={getIndent(prevIndentLevel)}>
                    <label>Phrase{path.length>1 && ` ${thisIndex+1}`}</label>
                    <input type="text"
                    value={path[thisIndex].content}
                    onChange={e => handleChange(e.target.value)}
                    onBlur={e => handleChange(handleInputBlur(e))}
                    />
                </div>
                {path[thisIndex].notes?.map((a,i) => (
                    <Note appState={appState} setAppState={setAppState} thisIndex={i} key={i} stringPath={stringPathA} prevIndentLevel={prevIndentLevel+1} addFunctions={addFunctions} />
                ))
                }
                {path[thisIndex].definitions.map((a,i) => (
                    <Definition appState={appState} setAppState={setAppState} thisIndex={i} key={i} prevIndentLevel={prevIndentLevel+1} addFunctions={addFunctions} stringPath={stringPathA} />
                ))
                }
                {path[thisIndex].examples?.map((a,i) => (
                    <Example appState={appState} setAppState={setAppState} thisIndex={i} key={i} prevIndentLevel={prevIndentLevel+1} addFunctions={addFunctions} stringPath={stringPathA} />
                    ))
                }
            </div>
        </>
    )

};

export default Phrase;