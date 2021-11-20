import AddPopup from './AddPopup';
import {definitionDefault} from '../defaults.js'
import {clone, getIndent, handleInputBlur, addPopupHandler} from '../utils.js';
import {useState} from 'react';
import _ from 'lodash';

const Definition = props => {

    const {appState, setAppState, prevIndentLevel, thisIndex, addFunctions, stringPath} = props;
    const {addDefinition} = addFunctions;
    // const path = appState.entry.senseGroups[senseGroupIndex].definitions;

    let pathFrag = stringPath + ".definitions";
    const path = _.get(appState, "entry." + pathFrag);
    const upPath = _.get(appState, "entry." + stringPath);

    const [addPopupVisible, setAddPopupVisible] = useState(false);

    const handleChange = (value, field) => {
        if (value !== undefined) {
            let entryCopy = clone(appState.entry);
            let entryCopyPath = _.get(entryCopy, pathFrag);
            entryCopyPath[thisIndex][field] = value;
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
        ["Definition", () => addDefinition(thisIndex, stringPath)]
    ];

    return (
        <>
            <div className="row">
                <div className="row-controls">
                    <AddPopup popupItems={popupItems} visible={addPopupVisible} />
                    <i className="fas fa-plus"
                    onClick={() => addPopupHandler(addPopupVisible, setAddPopupVisible)}
                    ></i>
                    <i
                    className={`fas fa-minus${path.length === 1 && path[thisIndex].definition.trim() === "" && !upPath.phrases ? " disabled" : ""}`}
                    onClick={deleteDefinition}
                    ></i>
                </div>
                <div className="row-content" style={getIndent(prevIndentLevel)}>
                    <div>Definition</div>
                    <input type="text"
                    value={path[thisIndex].definition}
                    onChange={e => handleChange(e.target.value, "definition")}
                    onBlur={e => handleChange(handleInputBlur(e), "definition")}
                    />
                </div>
            </div>
        </>
    )

};

export default Definition;