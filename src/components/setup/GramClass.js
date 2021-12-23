import AddPopup from '../AddPopup.js';
import { clone, addPopupHandler, getIndent } from '../../utils.js';
import {gramClassDefault} from './defaults.js';
import React, {useState} from 'react';
import _ from 'lodash';

const GramForm = props => {

    const {appState, setAppState, thisIndex, moveItem, stringPath, addGramClass} = props;

    const pathFrag = stringPath + ".gramClasses";
    const path = _.get(appState, "tempSetup." + pathFrag);

    const [addPopupVisible, setAddPopupVisible] = useState(false);

    const handleChange = (value, field) => {
        const setupCopy = clone(appState.tempSetup  );
        let setupCopyPath = _.get(setupCopy, pathFrag);
        setupCopyPath[thisIndex][field] = value;
        setAppState({tempSetup: setupCopy});
    };

    
    const deleteGroup = () => {
        let setupCopy = clone(appState.tempSetup);
        let setupCopyPath = _.get(setupCopy, pathFrag);
        if (setupCopyPath.length === 1) {
            let newGramClass = clone(gramClassDefault);
            newGramClass.id = setupCopy.nextId.toString();
            setupCopy.nextId++;
            setupCopyPath.splice(0, 1, newGramClass);
        } else {
            setupCopyPath.splice(thisIndex, 1);
        }
        setAppState({tempSetup: setupCopy});
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
                <div className="row-content gram-class-setup" style={getIndent(0)}>
                    {
                        <>
                            <label>Class</label>
                            <input type="text" value={path[thisIndex].name} onChange={e => handleChange(e.target.value, "name")} />
                            <label>Abbreviation</label>
                            <input type="text" value={path[thisIndex].abbr} onChange={e => handleChange(e.target.value, "abbr")} />
                        </>
                    }
                </div>
            </div>
        </>
    );
};

export default GramForm;