import AddPopup from '../AddPopup';
import Note from './Note';
import {clone, handleInputBlur, getIndent, addPopupHandler} from '../../utils.js';
// import {scriptFormDefault} from '../../defaults.js';
import {useState} from 'react';
import _ from "lodash";

const ScriptForm = (props) => {

    const {state, setState, thisIndex, prevIndent, stringPath, addFunctions, addScriptForm, moveItem} = props;
    const {addNote} = addFunctions;
    // const path = state.entry.headword[morphIndex].scriptForms;

    let pathFrag = stringPath + ".scriptForms";
    const path = _.get(state, "entry." + pathFrag);

    const [scriptFormOpen, setScriptFormOpen] = useState(true);
    const [addPopupVisible, setAddPopupVisible] = useState(false);

    const handleChange = value => {
        if (value !== undefined) {
            let entryCopy = clone(state.entry);
            let entryCopyPath = _.get(entryCopy, pathFrag);
            entryCopyPath[thisIndex].content = value;
            setState({entry:entryCopy});    
        }
    };

    const popupItems = [
        ["Note", () => {
            let index = (path[thisIndex].notes) ? path[thisIndex].notes.length-1 : 0;
            addNote(index, pathFrag+`[${thisIndex}]`);
        }]
    ];

    let stringPathA  = pathFrag + `[${thisIndex}]`;

    console.log(state.entry.headword);

    return (
        <>
            <div className={`row${scriptFormOpen ? "" : " closed"}`}>
                <div className="row-controls">
                    <AddPopup popupItems={popupItems} visible={addPopupVisible} />
                    <i className="fas fa-plus" onClick={() => addPopupHandler(addPopupVisible, setAddPopupVisible)}></i>           
                    <i></i>
                    {path[thisIndex].notes ?
                        <i className={`fas fa-chevron-${scriptFormOpen ? "up" : "down"}`} onClick={() => setScriptFormOpen(!scriptFormOpen)}></i>
                        :
                        <i></i>
                    }

                    {/* <i
                    className={`fas fa-arrow-up${isFirst ? " disabled" : ""}`}
                    onClick={e => moveItem(e, thisIndex, pathFrag, true)}
                    ></i>
                    <i
                    className={`fas fa-arrow-down${isLast ? " disabled" : ""}`}
                    onClick={e => moveItem(e, thisIndex, pathFrag, false)}
                    ></i> */}
                </div>
                <div className="row-content" style={getIndent(prevIndent)}>
                    <label htmlFor={`${pathFrag}[${thisIndex}]`}>Script form{path.length>1 && ` ${thisIndex+1}`}</label>
                    <input type="text" id={`${pathFrag}[${thisIndex}]`}
                    className="for norm"
                    value={path[thisIndex].content}
                    onChange={e => handleChange(e.target.value)}
                    onBlur={e => handleChange(handleInputBlur(e))}
                    />
                </div>
                {path[thisIndex].notes?.map((a,i) => (
                    <Note state={state} setState={setState} key={i} thisIndex={i} prevIndent={prevIndent+1} stringPath={stringPathA} addFunctions={addFunctions} />
                ))}
                </div>
        </>
    );
};

export default ScriptForm;