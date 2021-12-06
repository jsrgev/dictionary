import AddPopup from '../AddPopup.js';
// import GramFormSetup from './GramFormSetup.js';
import { clone, addPopupHandler, getIndent } from '../../utils.js';
import React, {useState} from 'react';
import _ from 'lodash';

const GramClassGroupSetup = props => {

    // const {appState, setAppState, thisIndex, stringPath, prevIndentLevel, moveItem, addGramClass} = props;
    const {appState, setAppState, thisIndex, moveItem} = props;

    let pathFrag = "gramClassGroups";
    const path = _.get(appState, "setup." + pathFrag);

    const [gramClassOpen, setGramClassOpen] = useState(true);
    const [addPopupVisible, setAddPopupVisible] = useState(false);

    const handleChange = (value, field) => {
        const setupCopy = clone(appState.setup);
        let setupCopyPath = _.get(setupCopy, pathFrag)
        setupCopyPath[thisIndex][field] = value;
        setAppState({setup: setupCopy});
    };

    const gramClassGroupDefault = {
        name: "",
        gramForms: [
            {
                name: "",
                abbr: "",
            }
        ]
    }

    const addGramClassGroup = index => {
        const setupCopy = clone(appState.setup);
        let setupCopyPath = _.get(setupCopy, pathFrag);
        // console.log(setupCopyPath)
        setupCopyPath.splice(index+1, 0, clone(gramClassGroupDefault));
        setAppState({setup: setupCopy});
    };
    
    const deleteGramClassGroup = () => {
        let setupCopy = clone(appState.setup);
        let setupCopyPath = _.get(setupCopy, pathFrag)
        // console.log(setupCopyPath);
        // return;
        setupCopyPath.splice(thisIndex, 1);
        setAppState({setup: setupCopy});
    };

    const popupItems = [
        ["Class Group", () => addGramClassGroup(thisIndex)],
        // ["Form", () => addGramForm(path[thisIndex].gramForms.length-1)],
    ];


    const isFirst = thisIndex === 0;
    const isLast = thisIndex === path.length-1;

    const stringPathA = pathFrag + `[${thisIndex}]`;
    

    return (
        <>
            <div className={`row${gramClassOpen ? "" : " closed"}`}>
                <div className="row-controls">
                    <AddPopup popupItems={popupItems} visible={addPopupVisible} />
                    <i className="fas fa-plus" onClick={() => addPopupHandler(addPopupVisible, setAddPopupVisible)}></i>           
                    <i className="fas fa-minus" onClick={deleteGramClassGroup}></i>
                    { 
                        <i className={`fas fa-chevron-${gramClassOpen ? "up" : "down"}`} onClick={() => setGramClassOpen(!gramClassOpen)}></i>
                    }
                    <i
                        className={`fas fa-arrow-up${isFirst ? " disabled" : ""}`}
                        onClick={e => moveItem(e, thisIndex, pathFrag, true)}
                    ></i>
                    <i
                        // className={`fas fa-arrow-down${isLast ? " disabled" : ""}`}
                        onClick={e => moveItem(e, thisIndex, pathFrag, false)}
                    ></i>
                </div>
                <div className="row-content gram-class-setup">
                    <label>Group</label>
                    <input type="text" value={path[thisIndex].name} onChange={e => handleChange(e.target.value, "name")} />
               </div>
               { path[thisIndex].gramForms.length>0 &&
                path[thisIndex].gramForms.map((a, i) => (
                    <div className="row" key={i}>
                        <div className="row-controls">
                        </div>
                        <div className="row-content gram-class-setup" style={getIndent(0)} >
                                <label>Form</label>
                                <input type="text" value={a.name} onChange={e => handleChange(e.target.value, "name")} />
                                <label>Abbreviation</label>
                                <input type="text" value={a.abbr} onChange={e => handleChange(e.target.value, "abbr")} />
                        </div>
                    </div>
                ))

               }
            </div>
        </>
    )
};

export default GramClassGroupSetup;