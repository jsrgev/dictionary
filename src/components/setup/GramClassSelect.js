import AddPopup from '../AddPopup.js';
import { clone, capitalize, getIndent, addPopupHandler } from '../../utils.js';
import {useState} from 'react';
import _ from 'lodash';
import Limitations from './Limitations.js';

const GramClassSelect = props => {

    const {appState, setAppState, thisIndex, moveItem, stringPath, addGramClassOption, availableGramClassGroups} = props;

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

    const handleClick = async (e) => {
        let gramClassId = e.target.getAttribute("value");
        if (!isAvailable(gramClassId)) {
            return;
        }
        // console.log("sdfasfd");
        // return;
        let setupCopy = clone(appState.setup);
        let setupCopyPath = _.get(setupCopy, pathFrag);
        // console.log(gramClassId);
        // console.log(setupCopy);
        // console.log(thisIndex);
        // return;
        let obj = {refId: gramClassId};
        _.set(setupCopy, `[${pathFrag[thisIndex]}]`, obj);
        // setupCopyPath[thisIndex] = ;
        setupCopyPath[thisIndex] = obj;

        setAppState({setup: setupCopy});
    };

    console.log(path);

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


    if (availableGramClassGroups.length > 0) {
        popupItems.push(["Class option", () => addGramClassOption(thisIndex)]);
    };

    const isAvailable = gramClassGroupId => {
        return availableGramClassGroups.some(a => a.id === gramClassGroupId);
    };
    

    const isCurrentSelection = gramClassGroupId =>  {
        return path[thisIndex].refId === gramClassGroupId;
    }

    const stringPathA = pathFrag + `[${thisIndex}]`;
    // console.log(stringPathA)

    const isFirst = thisIndex === 0;
    const isLast = thisIndex === path.length-1;


    const gramClassAndFormGroups = clone(appState.setup.gramClassGroups).concat(clone(appState.setup.gramFormGroups));

    // console.log(path);

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
                    <div>Class group</div>
                    <ul>
                        {appState.setup.gramClassGroups.map((a, i) => (
                            <li key={i} value={a.id} className={ isCurrentSelection(a.id) ? "selected" : isAvailable(a.id) ? ""  : "disabled" } onClick={e => handleClick(e)}>{capitalize(a.name)}</li>
                        ))}
                    </ul>
                </div>
                <Limitations appState={appState} setAppState={setAppState} stringPath={stringPathA} />
            </div>
        </>
    )
};

export default GramClassSelect;