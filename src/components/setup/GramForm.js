import AddPopup from '../AddPopup.js';
import { clone, addPopupHandler, getIndent } from '../../utils.js';
import {gramFormDefault} from './defaults.js';
import React, {useState} from 'react';
import _ from 'lodash';
import GramFormLimitations from './GramFormLimitations.js';

const GramForm = props => {

    const {appState, setAppState, thisIndex, moveItem, stringPath, addGramForm} = props;

    let pathFrag = stringPath + ".gramForms";
    const path = _.get(appState, "setup." + pathFrag);

    const [addPopupVisible, setAddPopupVisible] = useState(false);

    const handleChange = (value, field) => {
        const setupCopy = clone(appState.setup  );
        let setupCopyPath = _.get(setupCopy, pathFrag)
        setupCopyPath[thisIndex][field] = value;
        setAppState({setup: setupCopy});
    };
    
    const deleteGroup = () => {
        let setupCopy = clone(appState.setup);
        let setupCopyPath = _.get(setupCopy, pathFrag);
        if (setupCopyPath.length === 1) {
            setupCopyPath.splice(0, 1, clone(gramFormDefault));
        } else {
            setupCopyPath.splice(thisIndex, 1);
        }
        setAppState({setup: setupCopy});
    };


    // const handleClick = async (e) => {
    //     let gramClassId = e.target.getAttribute("value");
    //     if (!isAvailable(gramClassId)) {
    //         return;
    //     }
    //     let setupCopy = clone(appState.setup);
    //     let setupCopyPath = _.get(setupCopy, pathFrag);
    //     let obj = {refId: gramClassId};
    //     _.set(setupCopy, `[${pathFrag[thisIndex]}]`, obj);
    //     setupCopyPath[thisIndex] = obj;

    //     setAppState({setup: setupCopy});
    // };



    const addConstraint = () => {
        let setupCopy = clone(appState.setup);
        let setupCopyPath = _.get(setupCopy, pathFrag);
        // console.log(setupCopyPath[thisIndex]);

        let arr = [
            {
                refId: appState.setup.gramClassGroups[0].id,
                gramClasses: [
                    {
                        refId: appState.setup.gramClassGroups[0].gramClasses[0].id
                    }
                ]
            }
        ];
        // console.log(obj);
        _.set(setupCopy, `[${pathFrag[thisIndex].excludedGramClassGroups}]`, "asd");
        // console.log(_.get(setupCopy, `[${pathFrag[thisIndex]}]`));
        // console.log(thisIndex)
        setupCopyPath[thisIndex].excludedGramClassGroups = arr;
        // console.log(setupCopyPath);

        setAppState({setup: setupCopy});
        // let gramClassGroups = appState.setup.gramClassGroups;
        // console.log(gramClassGroups);
    }


    
    const popupItems = [
        ["Form", () => addGramForm(thisIndex, pathFrag)],
        ["Constraint", () => addConstraint(thisIndex, pathFrag)],
    ];

    const isFirst = thisIndex === 0;
    const isLast = thisIndex === path.length-1;
    
    // console.log(path[thisIndex]);

    const stringPathA = pathFrag + `[${thisIndex}]`;

    return(
        <>
            <div className="row">
                <div className="row-controls">
                    <AddPopup popupItems={popupItems} visible={addPopupVisible} />
                    <i className="fas fa-plus" onClick={() => addPopupHandler(addPopupVisible, setAddPopupVisible)}></i>           
                    <i className="fas fa-minus" onClick={deleteGroup}></i>
                    {/* { path[thisIndex].gramForms?.length>0 ?
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
                <div className="row-content gram-form-setup" style={getIndent(0)}>
                    {
                        <>
                            <label>Form</label>
                            <input type="text" value={path[thisIndex].name} onChange={e => handleChange(e.target.value, "name")} />
                            <label>Abbreviation</label>
                            <input type="text" value={path[thisIndex].abbr} onChange={e => handleChange(e.target.value, "abbr")} />
                        </>
                    }
                </div>
                {path[thisIndex].excludedGramClassGroups?.map((a, i) => (
                    <GramFormLimitations appState={appState} setAppState={setAppState} thisIndex={i} key={i} stringPath={stringPathA} />
                ))

                }
            </div>
        </>
    )
};

export default GramForm;