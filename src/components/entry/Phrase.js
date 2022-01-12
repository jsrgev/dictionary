import AddPopup from '../AddPopup';
import Definition from './Definition';
import Note from './Note';
import {phraseDefault} from '../../defaults.js'
import {clone, getIndent, handleInputBlur, addPopupHandler} from '../../utils.js';
import {useState} from 'react';
import _ from 'lodash';

const Phrase = props => {

    const {state, setState, prevIndent, thisIndex, addFunctions, stringPath, moveItem} = props;
    const {addDefinition, addPhrase, addNote} = addFunctions;

    let pathFrag = stringPath + ".phrases";
    const path = _.get(state, "entry." + pathFrag);
    const upPath = _.get(state, "entry." + stringPath);

    const [addPopupVisible, setAddPopupVisible] = useState(false);
    const [phraseOpen, setPhraseOpen] = useState(true);

    const handleChange = value => {
        if (value !== undefined) {
            let entryCopy = clone(state.entry);
            let entryCopyPath = _.get(entryCopy, pathFrag);
            entryCopyPath[thisIndex].content = value;
            setState({entry:entryCopy});
        }
    };

    const deletePhrase = e => {
        let entryCopy = clone(state.entry);
        let entryCopyPath = _.get(entryCopy, pathFrag);
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
        setState({entry: entryCopy});
    }; 

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

    const isFirst = thisIndex === 0;
    const isLast = thisIndex === path.length-1;

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
                    <i
                    className={`fas fa-arrow-up${isFirst ? " disabled" : ""}`}
                    onClick={e => moveItem(e, thisIndex, pathFrag, true)}
                    ></i>
                    <i
                    className={`fas fa-arrow-down${isLast ? " disabled" : ""}`}
                    onClick={e => moveItem(e, thisIndex, pathFrag, false)}
                    ></i>
                </div>
                <div className="row-content" style={getIndent(prevIndent)}>
                    <label htmlFor={`${pathFrag}[${thisIndex}]`}>Phrase{path.length>1 && ` ${thisIndex+1}`}</label>
                    <input type="text" id={`${pathFrag}[${thisIndex}]`}
                    value={path[thisIndex].content}
                    onChange={e => handleChange(e.target.value)}
                    onBlur={e => handleChange(handleInputBlur(e))}
                    />
                </div>
                {path[thisIndex].notes?.map((a,i) => (
                    <Note state={state} setState={setState} thisIndex={i} key={i} stringPath={stringPathA} prevIndent={prevIndent+1} addFunctions={addFunctions} />
                ))
                }
                {path[thisIndex].definitions.map((a,i) => (
                    <Definition state={state} setState={setState} thisIndex={i} key={i} prevIndent={prevIndent+1} addFunctions={addFunctions} stringPath={stringPathA} moveItem={moveItem} />
                ))
                }
            </div>
        </>
    );
};

export default Phrase;