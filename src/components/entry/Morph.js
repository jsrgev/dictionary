import Pronunciation from './Pronunciation';
import AddPopup from '../AddPopup';
import ScriptForm from './ScriptForm';
import Note from './Note';
import {clone, getIndent, handleInputBlur, addPopupHandler} from '../../utils.js';
import {morphDefault, pronunciationDefault} from '../../defaults.js';
import {useState} from 'react';
import _ from "lodash";

const Morph = props => {

    const {state, setState, thisIndex, stringPath, prevIndent, labels, addFunctions, moveRow} = props;
    const {addMorph, addNote} = addFunctions;

    let pathFrag = stringPath + "";
    const path = _.get(state, "entry." + pathFrag);

    const [addPopupVisible, setAddPopupVisible] = useState(false);
    const [morphOpen, setMorphOpen] = useState(true);

    const handleChange = value => {
        if (value !== undefined) {
            let entryCopy = clone(state.entry);
            let entryCopyPath = _.get(entryCopy, pathFrag);
            // console.log(currentScript);
            // return;
            entryCopyPath[thisIndex].scriptForms.find(a => a.refId === currentScript.id).content = value;
            setState({entry: entryCopy});
        }
    }

    const deleteMorph = e => {
        let entryCopy = clone(state.entry);
        let entryCopyPath = _.get(entryCopy, pathFrag);
        if (entryCopyPath.length === 1) {
            entryCopyPath.splice(0, 1, clone(morphDefault));
        } else {
            entryCopyPath.splice(thisIndex, 1);
        }
        setState({entry: entryCopy});
    };

    const addPronunciation = (e, index) => {
        index = index ?? path[thisIndex].pronunciations.length-1;
        let entryCopy = clone(state.entry);
        let entryCopyPath = _.get(entryCopy, pathFrag);
        entryCopyPath[thisIndex].pronunciations.splice(index+1, 0, clone(pronunciationDefault));
        setState({entry: entryCopy});
    };

    const popupItems = [
        ["Alternate form", () => addMorph(thisIndex, pathFrag)],
        ["Note", () => {
            let index = (path.notes) ? path.notes.length-1 : 0;
            addNote(index, pathFrag+`[${thisIndex}]`);
        }]
    ];
    
    if (state.setup.showPronunciation) {
        popupItems.splice(1, 0, ["Pronunciation", addPronunciation]);
    }

    // console.log(path[thisIndex]);
    const currentScript = state.setup.scripts[0];

    const getNumber = () => {
        if (labels[0] === "Basic form") {
            if (path.length > 2 && thisIndex > 0) return ` ${thisIndex}`;
        } else {
            if (path.length > 1) return ` ${thisIndex+1}`; 
        }
    };

    const isFirst = thisIndex === 0;
    const isLast = thisIndex === path.length-1;

    let stringPathA = `${stringPath}[${thisIndex}]`;

    const scriptLabel = state.setup.scripts.length > 1 ? `- ${currentScript.abbr}` : null;

    return (
        <>
            <div className={`row${morphOpen ? "" : " closed"}`}>
                <div className="row-controls">
                    <AddPopup popupItems={popupItems} visible={addPopupVisible} />
                    <i className="fas fa-plus" onClick={() => addPopupHandler(addPopupVisible, setAddPopupVisible)}></i>
                    <i className={`fas fa-minus${path.length === 1 && path[thisIndex].scriptForms[0].content.trim() === "" ? " disabled" : ""}`} onClick={deleteMorph}></i>
                    <i className={`fas fa-chevron-${morphOpen ? "up" : "down"}`} onClick={() => setMorphOpen(!morphOpen)}></i>
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
                    <label htmlFor={`${pathFrag}[${thisIndex}]`} >{thisIndex===0 ? labels[0] : labels[1]}{getNumber()}{scriptLabel}</label>
                    <input id={`${pathFrag}[${thisIndex}]`} type="text"
                    className="for norm"
                    value={path[thisIndex].scriptForms.find(a => a.refId === currentScript.id).content}
                    // value={path[thisIndex].scriptForms?.[0].content}
                    onChange={e => handleChange(e.target.value)}
                    onBlur={e => handleChange(handleInputBlur(e))}
                    />
                </div>
                {/* <div className="row"> */}
                    { state.setup.scripts &&
                    path[thisIndex].scriptForms?.map((a,i) => (
                        (a.refId !== currentScript.id) &&
                        <ScriptForm state={state} setState={setState} key={i} thisIndex={i} prevIndent={prevIndent+1} stringPath={stringPathA} addFunctions={addFunctions} moveRow={moveRow}
                        />
                    ))}
                    { state.setup.showPronunciation &&
                    path[thisIndex].pronunciations.map((a,i) => (
                        <Pronunciation state={state} setState={setState} key={i} thisIndex={i} prevIndent={prevIndent+1} stringPath={stringPathA} addPronunciation={addPronunciation} addFunctions={addFunctions} moveRow={moveRow}
                        />
                    ))}
                    {state.entry &&
                    path[thisIndex].notes?.map((a,i) => (
                        <Note state={state} setState={setState} thisIndex={i} key={i} stringPath={stringPathA} prevIndent={prevIndent+1} addFunctions={addFunctions} moveRow={moveRow} />
                    ))
                    }
                {/* </div> */}
            </div>
        </>
    )
};

export default Morph;