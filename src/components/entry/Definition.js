import AddPopup from '../AddPopup';
import Example from './Example';
import Note from './Note';
import {definitionDefault} from '../../defaults.js'
import {clone, getIndent, handleInputBlur, addPopupHandler} from '../../utils.js';
import {useState} from 'react';
import _ from 'lodash';

const Definition = props => {

    const {appState, setAppState, prevIndentLevel, thisIndex, addFunctions, stringPath, moveItem} = props;
    const {addDefinition, addExample, addNote} = addFunctions;
    // const path = appState.entry.senseGroups[senseGroupIndex].definitions;

    let pathFrag = stringPath + ".definitions";
    const path = _.get(appState, "entry." + pathFrag);
    const upPath = _.get(appState, "entry." + stringPath);

    const [addPopupVisible, setAddPopupVisible] = useState(false);
    const [definitionOpen, setDefinitionOpen] = useState(true);

    const handleChange = (value) => {
        if (value !== undefined) {
            let entryCopy = clone(appState.entry);
            let entryCopyPath = _.get(entryCopy, pathFrag);
            entryCopyPath[thisIndex].content = value;
            setAppState({entry:entryCopy});
        }
    };

    const deleteDefinition = e => {
        let entryCopy = clone(appState.entry);
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
        setAppState({entry: entryCopy});
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
            <div className={`row${definitionOpen ? "" : " closed"}`}>
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
                    <i className={`fas fa-chevron-${definitionOpen ? "up" : "down"}`} onClick={() => setDefinitionOpen(!definitionOpen)}></i> :
                    <i></i>
                    }
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
                    <label>Definition{path.length>1 && ` ${thisIndex+1}`}</label>
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
                {path[thisIndex].examples?.map((a,i) => (
                    <Example appState={appState} setAppState={setAppState} thisIndex={i} key={i} prevIndentLevel={prevIndentLevel+1} addFunctions={addFunctions} stringPath={stringPathA} moveItem={moveItem} />
                ))
                }
            </div>
        </>
    )

};

export default Definition;