import AddPopup from '../AddPopup.js';
import GramClass from './GramClass.js';
import { clone, addPopupHandler } from '../../utils.js';
import {gramClassGroupDefault, gramClassDefault} from './defaults.js';
import React, {useState} from 'react';
import _ from 'lodash';

const GramClassGroup = props => {

    const {appState, setAppState, thisIndex, moveItem} = props;

    let pathFrag = "gramClassGroups";
    const path = _.get(appState, "tempSetup." + pathFrag);

    const [groupOpen, setGroupOpen] = useState(true);
    const [addPopupVisible, setAddPopupVisible] = useState(false);

    const handleChange = (value, field) => {
        const setupCopy = clone(appState.tempSetup);
        let setupCopyPath = _.get(setupCopy, pathFrag);
        setupCopyPath[thisIndex][field] = value;
        setAppState({tempSetup: setupCopy});
    };

    const addGroup = index => {
        const setupCopy = clone(appState.tempSetup);
        let setupCopyPath = _.get(setupCopy, pathFrag);

        let newGramClassGroup = clone(gramClassGroupDefault);
        newGramClassGroup.id = setupCopy.nextId.toString();
        setupCopy.nextId++;

        setupCopyPath.splice(index+1, 0, newGramClassGroup);
        setAppState({tempSetup: setupCopy});
    };

    const addGramClass = (index, pathFrag) => {
        console.log("adding")
        let setupCopy = clone(appState.tempSetup);
        let setupCopyPath = _.get(setupCopy, pathFrag);
        let newGramClass = clone(gramClassDefault);
        newGramClass.id = setupCopy.nextId.toString();
        setupCopy.nextId++;
        setupCopyPath.splice(index+1, 0, newGramClass);
        setAppState({tempSetup: setupCopy});
    };

    const deleteGramClassGroup = () => {
        let setupCopy = clone(appState.tempSetup);
        let setupCopyPath = _.get(setupCopy, pathFrag);
        if (setupCopyPath.length === 1) {
            let newGramClassGroup = clone(gramClassGroupDefault);
            newGramClassGroup.id = setupCopy.nextId.toString();
            setupCopy.nextId++;
            setupCopyPath.splice(0, 1, newGramClassGroup);
        } else {
            setupCopyPath.splice(thisIndex, 1);
        }
        setAppState({tempSetup: setupCopy});
    };

    const changeMultiChoice = value => {
        let setupCopy = clone(appState.tempSetup);
        let setupCopyPath = _.get(setupCopy, pathFrag);
        setupCopyPath[thisIndex].multiChoice = value;
        setAppState({tempSetup: setupCopy});
    };

    const popupItems = [
        ["Group", () => addGroup(thisIndex)],
        ["Class", () => addGramClass(path[thisIndex].gramClasses.length-1, pathFrag+`[${thisIndex}].gramClasses`)],
    ];

    const isFirst = thisIndex === 0;
    const isLast = thisIndex === path.length-1;

    const stringPathA = pathFrag + `[${thisIndex}]`;

    return (
        <>
            <div className={`row${groupOpen ? "" : " closed"}`}>
                <div className="row-controls">
                    <AddPopup popupItems={popupItems} visible={addPopupVisible} />
                    <i className="fas fa-plus" onClick={() => addPopupHandler(addPopupVisible, setAddPopupVisible)}></i>           
                    <i className="fas fa-minus" onClick={deleteGramClassGroup}></i>
                    { 
                        <i className={`fas fa-chevron-${groupOpen ? "up" : "down"}`} onClick={() => setGroupOpen(!groupOpen)}></i>
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
                <div className="row-content gram-class-setup">
                    <label htmlFor={`${pathFrag}[${thisIndex}]`}>Group</label>
                    <input htmlFor={`${pathFrag}[${thisIndex}]`} type="text" value={path[thisIndex].name} onChange={e => handleChange(e.target.value, "name")} />
                    <label>Allow multiple</label>
                    <ul>
                        <li className={path[thisIndex].multiChoice ? "selected" : ""} onClick={() => changeMultiChoice(true)} >Yes</li>
                        <li className={!path[thisIndex].multiChoice ? "selected" : ""} onClick={() => changeMultiChoice(false)} >No</li>
                    </ul>
               </div>
               { path[thisIndex].gramClasses &&
                    path[thisIndex].gramClasses.map((a, i) => (
                        <GramClass key={i} appState={appState} setAppState={setAppState} thisIndex={i} moveItem={moveItem} stringPath={stringPathA} addGramClass={addGramClass} />
                    ))
                }
            </div>
        </>
    );
};

export default GramClassGroup;