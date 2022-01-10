import AddPopup from '../AddPopup.js';
import { clone, addPopupHandler, getIndent } from '../../utils.js';
import {gramClassDefault} from './defaults.js';
import React, {useState} from 'react';
import _ from 'lodash';

const GramForm = props => {

    const {state, setState, thisIndex, moveItem, stringPath, addGramClass} = props;

    const pathFrag = stringPath + ".gramClasses";
    const path = _.get(state, "tempSetup." + pathFrag);

    const [addPopupVisible, setAddPopupVisible] = useState(false);

    const handleChange = (value, field) => {
        const setupCopy = clone(state.tempSetup  );
        let setupCopyPath = _.get(setupCopy, pathFrag);
        setupCopyPath[thisIndex][field] = value;
        setState({tempSetup: setupCopy});
    };

    
    const deleteGroup = () => {
        let setupCopy = clone(state.tempSetup);
        let setupCopyPath = _.get(setupCopy, pathFrag);
        if (setupCopyPath.length === 1) {
            let newGramClass = clone(gramClassDefault);
            newGramClass.id = setupCopy.nextId.toString();
            setupCopy.nextId++;
            setupCopyPath.splice(0, 1, newGramClass);
        } else {
            setupCopyPath.splice(thisIndex, 1);
        }
        setState({tempSetup: setupCopy});
    };

    const popupItems = [
        ["Class", () => addGramClass(thisIndex, pathFrag)],
    ];

    const isFirst = thisIndex === 0;
    const isLast = thisIndex === path.length-1;
    
    return(
        <>
            <div className="row">
                <div className="row-controls">
                    <AddPopup popupItems={popupItems} visible={addPopupVisible} />
                    <i className="fas fa-plus" onClick={() => addPopupHandler(addPopupVisible, setAddPopupVisible)}></i>           
                    <i className="fas fa-minus" onClick={deleteGroup}></i>
                    {/* { path[thisIndex].gramClasses?.length>0 ?
                        <i className={`fas fa-chevron-${formGroupOpen ? "up" : "down"}`} onClick={() => setFormGroupOpen(!formGroupOpen)}></i>
                        : <i></i>
                    } */}
                    <i></i>
                    <i
                        className={`fas fa-arrow-up${isFirst ? " disabled" : ""}`}
                        onClick={e => moveItem(e, thisIndex, pathFrag, true)}
                    ></i>
                    <i
                        className={`fas fa-arrow-down${isLast ? " disabled" : ""}`}
                        onClick={e => moveItem(e, thisIndex, pathFrag, false)}
                    ></i>
                </div>
                <div className="row-content double-input" style={getIndent(0)}>
                    {
                        <>
                            <label htmlFor={`${pathFrag}[${thisIndex}].name`}>Class</label>
                            <input id={`${pathFrag}[${thisIndex}].name`} type="text" value={path[thisIndex].name} onChange={e => handleChange(e.target.value, "name")} />
                            <label htmlFor={`${pathFrag}[${thisIndex}].abbr`}>Abbreviation</label>
                            <input id={`${pathFrag}[${thisIndex}].abbr`} type="text" value={path[thisIndex].abbr} onChange={e => handleChange(e.target.value, "abbr")} />
                        </>
                    }
                </div>
            </div>
        </>
    );
};

export default GramForm;