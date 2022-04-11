import AddPopup from '../../AddPopup';
import GramForm from './GramForm';
import { clone, addPopupHandler, getIndent } from '../../../utils.js';
import {gramFormDefault, gramFormGroupDefault} from '../defaults.js';
import React, {useState} from 'react';
import _ from 'lodash';

const GramFormGroup = props => {

    const {state, setState, thisIndex, moveRow, prevIndent, addGroup} = props;

    let pathFrag = "gramFormGroups";
    const path = _.get(state, "tempSetup." + pathFrag);

    const [sectionOpen, setSectionOpen] = useState(true);
    const [addPopupVisible, setAddPopupVisible] = useState(false);

    const handleChange = (value, field) => {
        const setupCopy = clone(state.tempSetup);
        let setupCopyPath = _.get(setupCopy, pathFrag);
        setupCopyPath[thisIndex][field] = value;
        setState({tempSetup: setupCopy});
    };

    const addGramForm = (index, pathFrag) => {
        let setupCopy = clone(state.tempSetup);
        let setupCopyPath = _.get(setupCopy, pathFrag);
        let newGramForm = clone(gramFormDefault);
        newGramForm.id = setupCopy.nextId.toString();
        setupCopy.nextId++;
        setupCopyPath.splice(index+1, 0, newGramForm);
        setState({tempSetup: setupCopy});
    };

    const deleteGroup = () => {
        let setupCopy = clone(state.tempSetup);
        let setupCopyPath = _.get(setupCopy, pathFrag);
        if (setupCopyPath.length === 1) {
            let newGramFormGroup = clone(gramFormGroupDefault);
            newGramFormGroup.id = setupCopy.nextId.toString();
            setupCopy.nextId++;
            setupCopyPath.splice(0, 1, newGramFormGroup);
        } else {
            setupCopyPath.splice(thisIndex, 1);
        }
        setState({tempSetup: setupCopy});
    };

    
    const popupItems = [
        ["Group", () => addGroup(thisIndex)],
        ["Form", () => addGramForm(path[thisIndex].gramForms.length-1, pathFrag+`[${thisIndex}].gramForms`)],
    ];

    const isFirst = thisIndex === 0;
    const isLast = thisIndex === path.length-1;
    
    let stringPathA =  pathFrag + `[${thisIndex}]`;


    return(
        <>
            <div className={`row${sectionOpen ? "" : " closed"}`}>
                <div className="row-controls">
                    <AddPopup popupItems={popupItems} visible={addPopupVisible} />
                    <i className="fas fa-plus" onClick={() => addPopupHandler(addPopupVisible, setAddPopupVisible)}></i>           
                    <i className="fas fa-minus" onClick={deleteGroup}></i>
                    { path[thisIndex].gramForms?.length>0 ?
                        <i className={`fas fa-chevron-${sectionOpen ? "up" : "down"}`} onClick={() => setSectionOpen(!sectionOpen)}></i>
                        : <i></i>
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
                    <label htmlFor={`${pathFrag}[${thisIndex}]`}>Group</label>
                    <input htmlFor={`${pathFrag}[${thisIndex}]`} type="text" value={path[thisIndex].name} onChange={e => handleChange(e.target.value, "name")} />
                </div>
                { path[thisIndex].gramForms &&
                    path[thisIndex].gramForms.map((a, i) => (
                        <GramForm key={i} state={state} setState={setState} thisIndex={i} moveRow={moveRow} stringPath={stringPathA} addGramForm={addGramForm} prevIndent={prevIndent+1} />
                    ))
                }
            </div>
        </>
    );
};

export default GramFormGroup;