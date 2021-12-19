import AddPopup from '../AddPopup.js';
import { clone, capitalize, getIndent, addPopupHandler } from '../../utils.js';
import {useState} from 'react';
import _ from 'lodash';
import GramFormLimitations from './GramFormLimitations.js';

const GramFormSelect = props => {

    const {appState, setAppState, thisIndex, moveItem, stringPath, addGramFormOption, gramClassAndFormGroups, availableGramClassAndFormGroups} = props;

    let pathFrag = stringPath + ".gramFormGroups";
    const path = _.get(appState, "setup." + pathFrag);

    const [classSelectOpen, setClassSelectOpen] = useState(true);
    const [addPopupVisible, setAddPopupVisible] = useState(false);


    const handleClick = async e => {
        let value = e.target.getAttribute("value");
        if (!isAvailable(value)) {
            return;
        }
        let setupCopy = clone(appState.setup);
        let setupCopyPath = _.get(setupCopy, pathFrag);

        let obj = {refId: value};
        _.set(setupCopy, `[${pathFrag[thisIndex]}]`, obj);

        setupCopyPath[thisIndex] = obj;

        setAppState({setup: setupCopy});
    };

    
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

    const isAvailable = gramFormGroupId => {
        // console.log(gramFormGroupId);
        // console.log(availableGramClassAndFormGroups);
        return availableGramClassAndFormGroups.some(a => a.id === gramFormGroupId);
    };
    

    const isCurrentSelection = gramFormGroupId =>  {
        return path[thisIndex].refId === gramFormGroupId;
    }

    const stringPathA = pathFrag + `[${thisIndex}]`;

    const isFirst = thisIndex === 0;
    const isLast = thisIndex === path.length-1;

    console.log(path[thisIndex]);


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
                            <li key={i} value={a.id} className={ isCurrentSelection(a.id) ? "selected" : isAvailable(a.id) ? ""  : "disabled" } onClick={e => handleClick(e)}>{capitalize(a.name)}</li>
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