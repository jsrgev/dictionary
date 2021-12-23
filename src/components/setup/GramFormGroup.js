import AddPopup from '../AddPopup.js';
import GramForm from './GramForm.js';
import { clone, addPopupHandler } from '../../utils.js';
import {gramFormDefault, gramFormGroupDefault} from './defaults.js';
import React, {useState} from 'react';
import _ from 'lodash';

const GramFormGroup = props => {

    const {appState, setAppState, thisIndex, moveItem} = props;

    let pathFrag = "gramFormGroups";
    const path = _.get(appState, "tempSetup." + pathFrag);

    const [groupOpen, setGroupOpen] = useState(true);
    const [addPopupVisible, setAddPopupVisible] = useState(false);

    const handleChange = (value, field) => {
        const setupCopy = clone(appState.tempSetup);
        let setupCopyPath = _.get(setupCopy, pathFrag);
        setupCopyPath[thisIndex][field] = value;
        setAppState({tempSetup: setupCopy});
    };

    const addGroup = () => {
        let setupCopy = clone(appState.tempSetup);
        let setupCopyPath = _.get(setupCopy, pathFrag);
        let newGramFormGroup = clone(gramFormGroupDefault);
        newGramFormGroup.id = setupCopy.nextId.toString();
        setupCopy.nextId++;
        setupCopyPath.splice(thisIndex+1, 0, newGramFormGroup);
        setAppState({tempSetup: setupCopy});
    };

    const addGramForm = (index, pathFrag) => {
        let setupCopy = clone(appState.tempSetup);
        let setupCopyPath = _.get(setupCopy, pathFrag);
        let newGramForm = clone(gramFormDefault);
        newGramForm.id = setupCopy.nextId.toString();
        setupCopy.nextId++;
        setupCopyPath.splice(index+1, 0, newGramForm);
        setAppState({tempSetup: setupCopy});
    };

    const deleteGroup = () => {
        let setupCopy = clone(appState.tempSetup);
        let setupCopyPath = _.get(setupCopy, pathFrag);
        if (setupCopyPath.length === 1) {
            let newGramFormGroup = clone(gramFormGroupDefault);
            newGramFormGroup.id = setupCopy.nextId.toString();
            setupCopy.nextId++;
            setupCopyPath.splice(0, 1, newGramFormGroup);
        } else {
            setupCopyPath.splice(thisIndex, 1);
        }
        setAppState({tempSetup: setupCopy});
    };

    
    const popupItems = [
        ["Group", () => addGroup()],
        ["Form", () => addGramForm(path[thisIndex].gramForms.length-1, pathFrag+`[${thisIndex}].gramForms`)],
    ];

    const isFirst = thisIndex === 0;
    const isLast = thisIndex === path.length-1;
    
    let stringPathA =  pathFrag + `[${thisIndex}]`;


    return(
        <>
            <div className={`row${groupOpen ? "" : " closed"}`}>
                <div className="row-controls">
                    <AddPopup popupItems={popupItems} visible={addPopupVisible} />
                    <i className="fas fa-plus" onClick={() => addPopupHandler(addPopupVisible, setAddPopupVisible)}></i>           
                    <i className="fas fa-minus" onClick={deleteGroup}></i>
                    { path[thisIndex].gramForms?.length>0 ?
                        <i className={`fas fa-chevron-${groupOpen ? "up" : "down"}`} onClick={() => setGroupOpen(!groupOpen)}></i>
                        : <i></i>
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
                <div className="row-content">
                    <label>Group</label>
                    <input type="text" value={path[thisIndex].name} onChange={e => handleChange(e.target.value, "name")} />
                </div>
                { path[thisIndex].gramForms &&
                    path[thisIndex].gramForms.map((a, i) => (
                        <GramForm key={i} appState={appState} setAppState={setAppState} thisIndex={i} moveItem={moveItem} stringPath={stringPathA} addGramForm={addGramForm} />
                    ))
                }
            </div>
        </>
    );
};

export default GramFormGroup;