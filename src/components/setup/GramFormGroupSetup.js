import AddPopup from '../AddPopup.js';
import GramFormSetup from './GramFormSetup.js';
import { clone, addPopupHandler, getIndent } from '../../utils.js';
import React, {useState} from 'react';
import _ from 'lodash';

const GramFormGroupSetup = props => {

    const {appState, setAppState, thisIndex, moveItem} = props;

    let pathFrag = ".gramFormGroups";
    const path = _.get(appState, "setup" + pathFrag);

    const groupDefault = {
        name: "",
        gramForms: [
            {
                name: "",
                abbr: "",
            },
        ],
    };

    const [formGroupOpen, setFormGroupOpen] = useState(true);
    const [addPopupVisible, setAddPopupVisible] = useState(false);

    const handleChange = (value, field) => {
        const setupCopy = clone(appState.setup);
        let setupCopyPath = _.get(setupCopy, pathFrag)
        setupCopyPath[thisIndex][field] = value;
        setAppState({setup: setupCopy});
    };

    const addGroup = () => {
        let setupCopy = clone(appState.setup);
        let setupCopyPath = _.get(setupCopy, pathFrag);
        setupCopyPath.splice(thisIndex+1, 0, clone(groupDefault));
        setAppState({setup: setupCopy});
    };
    
    const deleteGroup = () => {
        let setupCopy = clone(appState.setup);
        let setupCopyPath = _.get(setupCopy, pathFrag)
        if (setupCopyPath.length === 1) {
            console.log(setupCopyPath)
            setupCopyPath.splice(0, 1, clone(groupDefault));
        } else {
            setupCopyPath.splice(thisIndex, 1);
        }
        setAppState({setup: setupCopy});
    };

    
    const popupItems = [
        ["Group", () => addGroup()],
    ];

    const isFirst = thisIndex === 0;
    const isLast = thisIndex === path.length-1;
    
    let stringPathA =  pathFrag + `[${thisIndex}]`;

    return(
        <>
            <div className="row">
                <div className="row-controls">
                    <AddPopup popupItems={popupItems} visible={addPopupVisible} />
                    <i className="fas fa-plus" onClick={() => addPopupHandler(addPopupVisible, setAddPopupVisible)}></i>           
                    <i className="fas fa-minus" onClick={deleteGroup}></i>
                    { path[thisIndex].gramForms?.length>0 ?
                        <i className={`fas fa-chevron-${formGroupOpen ? "up" : "down"}`} onClick={() => setFormGroupOpen(!formGroupOpen)}></i>
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
                {/* <div className="row"> */}
                    {/* <div className="row-controls"> */}
                    {/* </div> */}
                    {/* <div className="row-content" style={getIndent(0)}> */}
                        {/* <label>Forms</label> */}
                        </div>
                            {/* {
                                path[thisIndex].gramForms.map((a, i) => (
                                    <GramFormSetup key={i} appState={appState} setAppState={setAppState} thisIndex={i} moveItem={moveItem} stringPath={stringPathA} />
                                ))
                            } */}
                    {/* </div> */}
            {/* </div> */}
        </>
    )
};

export default GramFormGroupSetup;