import AddPopup from '../AddPopup';
import Definition from './Definition';
import Note from './Note';
import {clone, getIndent, handleInputBlur, addPopupHandler} from '../../utils.js';
import {useState} from 'react';
import _ from 'lodash';

const Example = props => {

    const {appState, setAppState, prevIndentLevel, thisIndex, addFunctions, stringPath, moveItem} = props;
    const {addDefinition, addExample, addNote} = addFunctions;

    let pathFrag = stringPath + ".examples";
    const path = _.get(appState, "entry." + pathFrag);
    // const upPath = _.get(appState, "entry." + stringPath);

    const [addPopupVisible, setAddPopupVisible] = useState(false);
    const [exampleOpen, setExampleOpen] = useState(true);

    const handleChange = value => {
        if (value !== undefined) {
            let entryCopy = clone(appState.entry);
            let entryCopyPath = _.get(entryCopy, pathFrag);
            entryCopyPath[thisIndex].content = value;
            setAppState({entry:entryCopy});
        }
    };

    const deleteExample = e => {
        let entryCopy = clone(appState.entry);
        let entryCopyPath = _.get(entryCopy, pathFrag)
        if (path.length === 1) {
            // if (!upPath.definitions) {
            //     entryCopyPath.splice(0, 1, clone(exampleDefault));
            // } else {
                let entryCopyUpPath = _.get(entryCopy, stringPath);
                delete entryCopyUpPath.examples;
            // }
        } else {
            entryCopyPath.splice(thisIndex, 1);
        }
        setAppState({entry: entryCopy});
    }; 

    const popupItems = [
        ["Example", () => addExample(thisIndex, stringPath)],
        ["Definition", () => addDefinition(path[thisIndex].definitions.length-1, stringPath+`.examples[${thisIndex}]`)],
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
            <div className={`row${exampleOpen ? "" : " closed"}`}>
                <div className="row-controls">
                    <AddPopup popupItems={popupItems} visible={addPopupVisible} />
                    <i className="fas fa-plus"
                    onClick={() => addPopupHandler(addPopupVisible, setAddPopupVisible)}
                    ></i>
                    <i
                    className="fas fa-minus"
                    onClick={deleteExample}
                    ></i>            
                    <i className={`fas fa-chevron-${exampleOpen ? "up" : "down"}`} onClick={() => setExampleOpen(!exampleOpen)}></i>
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
                    <label>Example{path.length>1 && ` ${thisIndex+1}`}</label>
                    <input type="text"
                    value={path[thisIndex].content}
                    onChange={e => handleChange(e.target.value)}
                    onBlur={e => handleChange(handleInputBlur(e))}
                    />
                </div>
                {path[thisIndex].notes?.map((a,i) => (
                    <Note appState={appState} setAppState={setAppState} thisIndex={i} key={i} stringPath={stringPathA} prevIndentLevel={prevIndentLevel+1} addFunctions={addFunctions} />
                ))  }
                {path[thisIndex].definitions.map((a,i) => (
                    <Definition appState={appState} setAppState={setAppState} thisIndex={i} key={i} prevIndentLevel={prevIndentLevel+1} addFunctions={addFunctions} stringPath={stringPathA} moveItem={moveItem} />
                ))}
            </div>
        </>
    )

};

export default Example;