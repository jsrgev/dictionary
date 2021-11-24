import AddPopup from './AddPopup';
import Example from './Example';
import {definitionDefault} from '../defaults.js'
import {clone, getIndent, handleInputBlur, addPopupHandler} from '../utils.js';
import {useState} from 'react';
import _ from 'lodash';

const Definition = props => {

    const {appState, setAppState, prevIndentLevel, thisIndex, addFunctions, stringPath} = props;
    const {addDefinition, addExample} = addFunctions;
    // const path = appState.entry.senseGroups[senseGroupIndex].definitions;

    let pathFrag = stringPath + ".definitions";
    const path = _.get(appState, "entry." + pathFrag);
    const upPath = _.get(appState, "entry." + stringPath);

    const [addPopupVisible, setAddPopupVisible] = useState(false);

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
        let entryCopyPath = _.get(entryCopy, pathFrag)
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
        ["Example", () => {
            let index = (path[thisIndex].examples) ? path[thisIndex].examples.length-1 : 0;
            addExample(index, pathFrag+`[${thisIndex}]`);
        }],
    ];

    let stringPathA =  pathFrag + `[${thisIndex}]`;


    // console.log(popupItems)
    // console.log(path[thisIndex])
    console.log(path[thisIndex].examples)
    // console.log(pathFrag+`[${thisIndex}]`)
    

    return (
        <>
            <div className="row">
                <div className="row-controls">
                    <AddPopup popupItems={popupItems} visible={addPopupVisible} />
                    <i className="fas fa-plus"
                    onClick={() => addPopupHandler(addPopupVisible, setAddPopupVisible)}
                    ></i>
                    <i
                    className={`fas fa-minus${path.length === 1 && path[thisIndex].content.trim() === "" && !upPath.phrases ? " disabled" : ""}`}
                    onClick={deleteDefinition}
                    ></i>
                </div>
                <div className="row-content" style={getIndent(prevIndentLevel)}>
                    <div>Definition</div>
                    <input type="text"
                    value={path[thisIndex].content}
                    onChange={e => handleChange(e.target.value)}
                    onBlur={e => handleChange(handleInputBlur(e))}
                    />
                </div>
                {path[thisIndex].examples &&
                    path[thisIndex].examples.map((a,i) => (
                        <Example appState={appState} setAppState={setAppState} thisIndex={i} key={i} prevIndentLevel={prevIndentLevel+1} addFunctions={addFunctions} stringPath={stringPathA} />
                    ))
                }
            </div>
        </>
    )

};

export default Definition;