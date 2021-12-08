import AddPopup from '../AddPopup.js';
import { clone, capitalize, getIndent, addPopupHandler } from '../../utils.js';
import {useState} from 'react';
import _ from 'lodash';
import GramFormLimitations from './GramFormLimitations.js';

const GramFormSelect = props => {

    const {appState, setAppState, thisIndex, moveItem, stringPath, addGramFormOption, gramClassAndFormGroups, availableGramClassAndFormGroups} = props;

    let pathFrag = stringPath + ".gramFormGroups";
    const path = _.get(appState, "setup." + pathFrag);

    // console.log(gramClassAndFormGroups[thisIndex]);

    const [classSelectOpen, setClassSelectOpen] = useState(true);
    const [addPopupVisible, setAddPopupVisible] = useState(false);

    // const handleChange = (value, field) => {
    //     const setupCopy = clone(appState.setup);
    //     let setupCopyPath = _.get(setupCopy, pathFrag);
    //     setupCopyPath[thisIndex][field] = value;
    //     setAppState({setup: setupCopy});
    // };

    const handleClick = async (e, definition) => {
        let value = e.target.getAttribute("value");
        if (!isAvailable(value)) {
            return;
        }
        let setupCopy = clone(appState.setup);
        let setupCopyPath = _.get(setupCopy, pathFrag);
        let gramFormsToClone = definition.gramClasses || definition.gramForms;
        setupCopyPath[thisIndex] = {name: definition.name, gramForms: clone(gramFormsToClone)};
        setAppState({setup: setupCopy});
    };


    const changeMultichoice = value => {
        let setupCopy = clone(appState.setup);
        let setupCopyPath = _.get(setupCopy, pathFrag);
        setupCopyPath[thisIndex].multiChoice = value;
        setAppState({setup: setupCopy});
    }


    const posDefault = {name: "", abbr: "", multiChoice: false, gramClassGroups: [], agrGramFormGroups: [], intGramFormGroups: [] };
    const gramClassDefault = {name: "", abbr: "", gramForms: []};


    // const addGramClass = index => {
    //     let setupCopy = clone(appState.setup);
    //     let setupCopyPath = _.get(setupCopy, pathFrag);
    //     setupCopyPath[thisIndex].gramClasses.splice(index+1, 0, clone(gramClassDefault));
    //     setAppState({setup: setupCopy});
    // };
    
    const deletePos = () => {
        let setupCopy = clone(appState.setup);
        let setupCopyPath = _.get(setupCopy, pathFrag);
        setupCopyPath.splice(thisIndex, 1);
        setAppState({setup: setupCopy});
    };



    const popupItems = [];


    if (availableGramClassAndFormGroups.length > 0) {
        popupItems.push(["Form group", () => addGramFormOption(thisIndex)]);
    };

    const isAvailable = gramFormGroupName => {
        return availableGramClassAndFormGroups.some(a => a.name === gramFormGroupName);
    };
    

    const isCurrentSelection = gramFormGroupName =>  {
        return path[thisIndex].name === gramFormGroupName;
    }

    const stringPathA = pathFrag + `[${thisIndex}]`;

    const isFirst = thisIndex === 0;
    const isLast = thisIndex === path.length-1;


    // const gramClassAndFormGroups = clone(appState.setup.gramClassGroups).concat(clone(appState.setup.gramFormGroups));

    return(
        <>
            <div className={`row${classSelectOpen ? "" : " closed"}`}>
                <div className="row-controls">
                <AddPopup popupItems={popupItems} visible={addPopupVisible} />
                <i className="fas fa-plus" onClick={() => addPopupHandler(addPopupVisible, setAddPopupVisible)}></i>           
                <i className="fas fa-minus" onClick={deletePos}></i>
                <i className={`fas fa-chevron-${classSelectOpen ? "up" : "down"}`} onClick={() => setClassSelectOpen(!classSelectOpen)}></i>
                <i
                    className={`fas fa-arrow-up${isFirst ? " disabled" : ""}`}
                    onClick={e => moveItem(e, thisIndex, pathFrag, true)}
                ></i>
                <i
                    className={`fas fa-arrow-down${isLast ? " disabled" : ""}`}
                    onClick={e => moveItem(e, thisIndex, pathFrag, false)}>
                </i>
                </div>
                <div className="row-content pos-options" style={getIndent(0)}>
                    <div>Form group</div>
                    <ul>
                        {gramClassAndFormGroups.map((a, i) => (
                            <li key={i} value={a.name} className={ isCurrentSelection(a.name) ? "selected" : isAvailable(a.name) ? ""  : "disabled" } onClick={e => handleClick(e, a)}>{capitalize(a.name)}</li>
                            // <li key={i} value={a.name}  onClick={e => handleClick(e, i)}>{capitalize(a.name)}</li>
                        ))}
                    </ul>
                </div>
                <GramFormLimitations appState={appState} setAppState={setAppState} stringPath={stringPathA} />
            </div>
        </>
    )
};

export default GramFormSelect;