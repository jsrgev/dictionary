import AddPopup from '../AddPopup';
import Note from './Note';
import {clone, handleInputBlur, getIndent, addPopupHandler} from '../../utils.js';
import {pronunciationDefault} from '../../defaults.js';
import {useState} from 'react';
import _ from "lodash";

const Pronunciation = (props) => {

    const {state, setState, thisIndex, prevIndent, stringPath, addFunctions, addPronunciation, moveRow} = props;
    const {addNote} = addFunctions;
    // const path = state.entry.headword[morphIndex].pronunciations;

    let pathFrag = stringPath + ".pronunciations";
    const path = _.get(state, "entry." + pathFrag);

    const [pronunciationOpen, setPronunciationOpen] = useState(true);
    const [addPopupVisible, setAddPopupVisible] = useState(false);

    const handleChange = value => {
        if (value !== undefined) {
            let entryCopy = clone(state.entry);
            let entryCopyPath = _.get(entryCopy, pathFrag);
            entryCopyPath[thisIndex].content = value;
            setState({entry:entryCopy});    
        }
    };

    const deletePronunciation = () => {
        let entryCopy = clone(state.entry);
        let entryCopyPath = _.get(entryCopy, pathFrag);

        if (path.length === 1) {
            entryCopyPath.splice(0, 1, clone(pronunciationDefault));
        } else {
            entryCopyPath.splice(thisIndex, 1);
        }
        setState({entry: entryCopy});
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
            <div className={`row${pronunciationOpen ? "" : " closed"}`}>
                <div className="row-controls">
                    <AddPopup popupItems={popupItems} visible={addPopupVisible} />
                    <i className="fas fa-plus" onClick={() => addPopupHandler(addPopupVisible, setAddPopupVisible)}></i>           
                    <i className={`fas fa-minus${path.length === 1 && path[thisIndex].content.trim() === "" ? " disabled" : ""}`} onClick={deletePronunciation}></i>
                    {path[thisIndex].notes ?
                        <i className={`fas fa-chevron-${pronunciationOpen ? "up" : "down"}`} onClick={() => setPronunciationOpen(!pronunciationOpen)}></i>
                        :
                        <i></i>
                    }

                    <i
                    className={`fas fa-arrow-up${isFirst ? " disabled" : ""}`}
                    onClick={e => moveRow(e, thisIndex, pathFrag, true)}
                    ></i>
                    <i
                    className={`fas fa-arrow-down${isLast ? " disabled" : ""}`}
                    onClick={e => moveRow(e, thisIndex, pathFrag, false)}
                    ></i>
                </div>
                <div className="row-content" style={getIndent(prevIndent)}>
                    <label htmlFor={`${pathFrag}[${thisIndex}]`}>Pronunciation{path.length>1 && ` ${thisIndex+1}`}</label>
                    <input type="text" id={`${pathFrag}[${thisIndex}]`}
                    className="for norm"
                    value={path[thisIndex].content}
                    onChange={e => handleChange(e.target.value)}
                    onBlur={e => handleChange(handleInputBlur(e))}
                    />
                </div>
                {path[thisIndex].notes?.map((a,i) => (
                    <Note state={state} setState={setState} key={i} thisIndex={i} prevIndent={prevIndent+1} stringPath={stringPathA} addFunctions={addFunctions} moveRow={moveRow} />
                ))}
                </div>
        </>
    );
};

export default Pronunciation;