import AddPopup from '../AddPopup';
import Example from './Example';
import Note from './Note';
import {definitionDefault} from '../../defaults.js'
import {clone, getIndent, handleInputBlur, addPopupHandler} from '../../utils.js';
import {useState} from 'react';
import _ from 'lodash';

const Definition = props => {

    const {state, setState, prevIndent, thisIndex, addFunctions, stringPath, moveRow} = props;
    const {addDefinition, addExample, addNote} = addFunctions;
    // const path = state.entry.senseGroups[senseGroupIndex].definitions;

    let pathFrag = stringPath + ".definitions";
    const path = _.get(state, "entry." + pathFrag);
    const upPath = _.get(state, "entry." + stringPath);

    const [addPopupVisible, setAddPopupVisible] = useState(false);
    const [sectionOpen, setSectionOpen] = useState(true);

    const handleChange = (value) => {
        if (value !== undefined) {
            let entryCopy = clone(state.entry);
            let entryCopyPath = _.get(entryCopy, pathFrag);
            entryCopyPath[thisIndex].content = value;
            setState({entry:entryCopy});
        }
    };

    const deleteDefinition = e => {
        let entryCopy = clone(state.entry);
        let entryCopyPath = _.get(entryCopy, pathFrag);
        if (path.length === 1) {
            if (!upPath.phrases) {
                entryCopyPath.splice(0, 1, clone(definitionDefault));
            } else {
                let entryCopyUpPath = _.get(entryCopy, stringPath);
                delete entryCopyUpPath.definitions;
            }
        } else {
            entryCopyPath.splice(thisIndex, 1);
        }
        setState({entry: entryCopy});
    }; 

    const popupItems = [
        ["Definition", () => addDefinition(thisIndex, stringPath)],
        ["Note", () => {
            let index = (path.notes) ? path.notes.length-1 : 0;
            addNote(index, pathFrag+`[${thisIndex}]`);
        }]
    ];

    // to test if parent is example  - if so, disallow further example underneath
    const pattern = /examples\[\d+?\]/;

    if (!pattern.test(stringPath)) {
        popupItems.push(
            ["Example", () => {
                let index = (path[thisIndex].examples) ? path[thisIndex].examples.length-1 : 0;
                addExample(index, pathFrag+`[${thisIndex}]`);
            }]
        );
    }

    const isFirst = thisIndex === 0;
    const isLast = thisIndex === path.length-1;

    let stringPathA =  pathFrag + `[${thisIndex}]`;

    return (
        <>
            <div className={`row${sectionOpen ? "" : " closed"}`}>
                <div className="row-controls">
                    <AddPopup popupItems={popupItems} visible={addPopupVisible} />
                    <i className="fas fa-plus"
                    onClick={() => addPopupHandler(addPopupVisible, setAddPopupVisible)}
                    ></i>
                    <i
                    className={`fas fa-minus${path.length === 1 && path[thisIndex].content.trim() === "" && !upPath.phrases ? " disabled" : ""}`}
                    onClick={deleteDefinition}
                    ></i>
                    {(path[thisIndex].notes || path[thisIndex].examples) ?
                    <i className={`fas fa-chevron-${sectionOpen ? "up" : "down"}`} onClick={() => setSectionOpen(!sectionOpen)}></i> :
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
                    <label htmlFor={`${pathFrag}[${thisIndex}]`}>Definition{path.length>1 && ` ${thisIndex+1}`}</label>
                    <input type="text" id={`${pathFrag}[${thisIndex}]`}
                    value={path[thisIndex].content}
                    onChange={e => handleChange(e.target.value)}
                    onBlur={e => handleChange(handleInputBlur(e))}
                    />
                </div>
                {path[thisIndex].notes?.map((a,i) => (
                    <Note state={state} setState={setState} thisIndex={i} key={i} stringPath={stringPathA} prevIndent={prevIndent+1} addFunctions={addFunctions} moveRow={moveRow} />
                ))
                }
                {path[thisIndex].examples?.map((a,i) => (
                    <Example state={state} setState={setState} thisIndex={i} key={i} prevIndent={prevIndent+1} addFunctions={addFunctions} stringPath={stringPathA} moveRow={moveRow} />
                ))
                }
            </div>
        </>
    )

};

export default Definition;