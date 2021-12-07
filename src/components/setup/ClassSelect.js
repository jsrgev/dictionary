import AddPopup from '../AddPopup.js';
import { clone, capitalize, getIndent, addPopupHandler } from '../../utils.js';
import {useState} from 'react';
import _ from 'lodash';
import Limitations from './Limitations.js';

const ClassSelect = props => {

    const {appState, setAppState, thisIndex, moveItem, stringPath, addGramClassOption, availableClassGroups} = props;

    let pathFrag = stringPath + ".gramClassGroups";
    const path = _.get(appState, "setup." + pathFrag);

    const [classSelectOpen, setClassSelectOpen] = useState(true);
    const [addPopupVisible, setAddPopupVisible] = useState(false);

    // const handleChange = (value, field) => {
    //     const setupCopy = clone(appState.setup);
    //     let setupCopyPath = _.get(setupCopy, pathFrag);
    //     setupCopyPath[thisIndex][field] = value;
    //     setAppState({setup: setupCopy});
    // };

    const handleClick = async (e, i) => {
        let value = e.target.getAttribute("value");
        if (!isAvailable(value)) {
            return;
        }
        let setupCopy = clone(appState.setup);
        let setupCopyPath = _.get(setupCopy, pathFrag);
        setupCopyPath[thisIndex] = clone(appState.setup.gramClassGroups[i]);
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


    const addGramClass = index => {
        let setupCopy = clone(appState.setup);
        let setupCopyPath = _.get(setupCopy, pathFrag);
        setupCopyPath[thisIndex].gramClasses.splice(index+1, 0, clone(gramClassDefault));
        setAppState({setup: setupCopy});
    };
    
    const deletePos = () => {
        let setupCopy = clone(appState.setup);
        let setupCopyPath = _.get(setupCopy, pathFrag);
        setupCopyPath.splice(thisIndex, 1);
        setAppState({setup: setupCopy});
    };



    const popupItems = [];


    if (availableClassGroups.length > 0) {
        popupItems.push(["Class option", () => addGramClassOption(thisIndex)]);
    };

    const isAvailable = gramClassGroup => {
        return availableClassGroups.some(a => a.name === gramClassGroup);
    };
    

    const isCurrentSelection = gramClassGroup =>  {
        return path[thisIndex].name === gramClassGroup;
    }

    const stringPathA = pathFrag + `[${thisIndex}]`;

    const isFirst = thisIndex === 0;
    const isLast = thisIndex === path.length-1;


    const gramClassAndFormGroups = clone(appState.setup.gramClassGroups).concat(clone(appState.setup.gramFormGroups));

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
                    <div>Class options</div>
                    <ul>
                        {appState.setup.gramClassGroups.map((a, i) => (
                            <li key={i} value={a.name} className={ isCurrentSelection(a.name) ? "selected" : isAvailable(a.name) ? ""  : "disabled" } onClick={e => handleClick(e, i)}>{capitalize(a.name)}</li>
                        ))}
                    </ul>
                </div>
                <Limitations appState={appState} setAppState={setAppState} stringPath={stringPathA} />
            </div>
        </>
    )
};

export default ClassSelect;