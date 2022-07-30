import AddPopup from '../../AddPopup';
import { clone, addPopupHandler, getIndent } from '../../../utils.js';
import {gramClassDefault} from '../defaults.js';
import React, {useState} from 'react';
import _ from 'lodash';

const GramForm = props => {

    const {state, setState, thisIndex, moveRow, stringPath, addGramClass, prevIndent} = props;

    const pathFrag = stringPath + ".gramClasses";
    const path = _.get(state, "tempSetup." + pathFrag);

    const [addPopupVisible, setAddPopupVisible] = useState(false);

    const handleChange = (value, field) => {
        const setupCopy = clone(state.tempSetup  );
        let setupCopyPath = _.get(setupCopy, pathFrag);
        setupCopyPath[thisIndex][field] = value;
        setState({tempSetup: setupCopy});
    };


    const cleanUpPosDefs = setupCopy => {
        for (let posDef of setupCopy.partsOfSpeechDefs.items) {
            if (posDef.gramClassGroups) {
                for (let gramClassGroup of posDef.gramClassGroups) {
                    if (gramClassGroup.excluded) {
                        let index = gramClassGroup.excluded.findIndex(a => a === path[thisIndex].id)
                        if (index > -1) {
                            if (gramClassGroup.excluded.length === 1) {
                                delete gramClassGroup.excluded;
                            } else {
                                gramClassGroup.excluded.splice(index, 1);
                            }
                        }
                    }
                }
            }
        }
    };



    const cleanUpGramFormLimitations = setupCopy => {
        console.log(path[thisIndex].id)
        for (let gramFormGroup of setupCopy.gramFormGroups.items) {
            for (let gramForm of gramFormGroup.gramForms) {
                if (gramForm.constraints) {

                    for (let constraint of gramForm.constraints) {
                        
                        
                        let index = constraint.excludedGramClasses.findIndex(a => a === path[thisIndex].id)
                        if (index > -1) {
                            // console.log(gramForm)
                            // if (gramForm.constraints.length === 1) {
                                // delete gramForm.constraints;
                            // } else {
                                constraint.excludedGramClasses.splice(index, 1);
                            // }
                            // console.log(gramForm)
                        }
                    }
                }
            }
        }
    };

    // gramFormGroups > items > [] > gramForms > [] > constraints > [] > refId > excludedGramClasses > []


    
    const deleteGramClass = () => {
        let setupCopy = clone(state.tempSetup);
        cleanUpPosDefs(setupCopy);
        cleanUpGramFormLimitations(setupCopy);
        setState({tempSetup: setupCopy});
        // return;
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
                    <i className="fas fa-minus" onClick={deleteGramClass}></i>
                    <i></i>
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