import AddPopup from '../AddPopup.js';
// import GramFormSetup from './GramFormSetup.js';
import { clone, addPopupHandler, getIndent } from '../../utils.js';
import {useState} from 'react';
import _ from 'lodash';

const GramClassSetup = props => {

    const {appState, setAppState, thisIndex, stringPath, prevIndentLevel, moveItem, addGramClass} = props;

    let pathFrag = stringPath + ".gramClasses";
    const path = _.get(appState, "setup." + pathFrag);

    const [gramClassOpen, setGramClassOpen] = useState(true);
    const [addPopupVisible, setAddPopupVisible] = useState(false);

    const handleChange = (value, field) => {
        const setupCopy = clone(appState.setup);
        let setupCopyPath = _.get(setupCopy, pathFrag)
        setupCopyPath[thisIndex][field] = value;
        setAppState({setup: setupCopy});
    };

    const gramFormDefault = {name: "", abbr: "", basic: false, mayBeMissing: true};

    const addGramForm = index => {
        const setupCopy = clone(appState.setup);
        let setupCopyPath = _.get(setupCopy, pathFrag);
        setupCopyPath[thisIndex].gramForms.splice(index+1, 0, clone(gramFormDefault));
        setAppState({setup: setupCopy});
    };
    
    const deleteGramClass = () => {
        let setupCopy = clone(appState.setup);
        let setupCopyPath = _.get(setupCopy, pathFrag)
            setupCopyPath.splice(thisIndex, 1);
        setAppState({setup: setupCopy});
    };

    const popupItems = [
        ["GramClass", () => addGramClass(thisIndex)],
        ["Form", () => addGramForm(path[thisIndex].gramForms.length-1)],
    ];

    const isFirst = thisIndex === 0;
    const isLast = thisIndex === path.length-1;

    const stringPathA = pathFrag + `[${thisIndex}]`;
    
console.log(path[thisIndex]);

    return(
        <>
            <div className={`row${gramClassOpen ? "" : " closed"}`}>
                <div className="row-controls">
                <AddPopup popupItems={popupItems} visible={addPopupVisible} />
                <i className="fas fa-plus" onClick={() => addPopupHandler(addPopupVisible, setAddPopupVisible)}></i>           
                <i className="fas fa-minus" onClick={deleteGramClass}></i>
                { path[thisIndex].gramForms.length>0 ?
                    <i className={`fas fa-chevron-${gramClassOpen ? "up" : "down"}`} onClick={() => setGramClassOpen(!gramClassOpen)}></i>
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
                <div className="row-content" style={getIndent(prevIndentLevel)}>
                    <label>Class</label>
                    <input type="text" value={path[thisIndex].name} onChange={e => handleChange(e.target.value, "name")} />
                    <label>Abbreviation</label>
                    <input type="text" value={path[thisIndex].abbr} onChange={e => handleChange(e.target.value, "abbr")} />
               </div>
               {/* { path[thisIndex].gramForms.length>0 &&
                path[thisIndex].gramForms.map((a, i) => (
                    <GramFormSetup appState={appState} setAppState={setAppState} key={i} thisIndex={i} stringPath={stringPathA} prevIndentLevel={prevIndentLevel+1} moveItem={moveItem} addGramForm={addGramForm} />
                ))

               } */}
            </div>
        </>
    )
};

export default GramClassSetup;