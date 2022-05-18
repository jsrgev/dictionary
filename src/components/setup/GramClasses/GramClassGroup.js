import AddPopup from '../../AddPopup';
import GramClass from './GramClass';
import { clone, addPopupHandler, getIndent } from '../../../utils.js';
import {gramClassGroupDefault, gramClassDefault} from '../defaults.js';
import React, {useState} from 'react';
import _ from 'lodash';

const GramClassGroup = props => {

    const {state, setState, thisIndex, moveRow, addGroup, prevIndent} = props;

    let pathFrag = "gramClassGroups.items";
    const path = _.get(state, "tempSetup." + pathFrag);

    const [sectionOpen, setSectionOpen] = useState(true);
    const [addPopupVisible, setAddPopupVisible] = useState(false);

    const handleChange = (value, field) => {
        const setupCopy = clone(state.tempSetup);
        let setupCopyPath = _.get(setupCopy, pathFrag);
        setupCopyPath[thisIndex][field] = value;
        setState({tempSetup: setupCopy});
    };

    const addGramClass = (index, pathFrag) => {
        console.log("adding")
        let setupCopy = clone(state.tempSetup);
        let setupCopyPath = _.get(setupCopy, pathFrag);
        let newGramClass = clone(gramClassDefault);
        newGramClass.id = setupCopy.nextId.toString();
        setupCopy.nextId++;
        setupCopyPath.splice(index+1, 0, newGramClass);
        setState({tempSetup: setupCopy});
    };

    const deleteGramClassGroup = () => {
        let setupCopy = clone(state.tempSetup);
        let setupCopyPath = _.get(setupCopy, pathFrag);
        if (setupCopyPath.length === 1) {
            let newGramClassGroup = clone(gramClassGroupDefault);
            newGramClassGroup.id = setupCopy.nextId.toString();
            setupCopy.nextId++;
            setupCopyPath.splice(0, 1, newGramClassGroup);
        } else {
            setupCopyPath.splice(thisIndex, 1);
        }
        setState({tempSetup: setupCopy});
    };

    const changeMultiChoice = value => {
        let setupCopy = clone(state.tempSetup);
        let setupCopyPath = _.get(setupCopy, pathFrag);
        setupCopyPath[thisIndex].multiChoice = value;
        setState({tempSetup: setupCopy});
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
            <div className={`row${sectionOpen ? "" : " closed"}`}>
                <div className="row-controls">
                    <AddPopup popupItems={popupItems} visible={addPopupVisible} />
                    <i className="fas fa-plus" onClick={() => addPopupHandler(addPopupVisible, setAddPopupVisible)}></i>           
                    <i className="fas fa-minus" onClick={deleteGramClassGroup}></i>
                    { 
                        <i className={`fas fa-chevron-${sectionOpen ? "up" : "down"}`} onClick={() => setSectionOpen(!sectionOpen)}></i>
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
                <div className="row-content double-input" style={getIndent(prevIndent)}>
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
                        <GramClass key={i} state={state} setState={setState} thisIndex={i} moveRow={moveRow} stringPath={stringPathA} addGramClass={addGramClass} prevIndent={prevIndent+1} />
                    ))
                }
            </div>
        </>
    );
};

export default GramClassGroup;