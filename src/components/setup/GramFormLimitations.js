import AddPopup from '../AddPopup.js';
import { clone, addPopupHandler, capitalize, getIndent } from '../../utils.js';
import {useState} from 'react';
import _ from 'lodash';

const GramFormLimitations = props => {

    const {appState, setAppState, moveItem, addConstraint, stringPath, thisIndex, availableForLimitationGroups} = props;

    let pathFrag = stringPath + ".constraints";
    const path = _.get(appState, "setup." + pathFrag);

    const [addPopupVisible, setAddPopupVisible] = useState(false);

    const handleGroupClick = gramClassGroupId => {
        if (path[thisIndex].refId === gramClassGroupId) {
            return;
        }
        let setupCopy = clone(appState.setup);
        let setupCopyPath = _.get(setupCopy, pathFrag);
        let gramClassesToExclude = availableForLimitationGroups[0].gramClasses.map(a => a.id);
        gramClassesToExclude.shift();
        let obj = {
            refId: availableForLimitationGroups[0].id,
            excludedGramClasses: gramClassesToExclude
        };
        setupCopyPath[thisIndex] = obj;
        setAppState({setup: setupCopy});
    };
    
    const handleGramClassClick = (gramClassId, numOfClasses) => {
        let setupCopy = clone(appState.setup);
        let setupCopyPath = _.get(setupCopy, pathFrag + `.${thisIndex}.excludedGramClasses`);
        let index = setupCopyPath.findIndex(a => a === gramClassId);
        if (index >= 0 ) {
            setupCopyPath.splice(index, 1);
        } else if (setupCopyPath.length === numOfClasses-1) {
            return;
        } else {
            setupCopyPath.push(gramClassId);
        }
        setAppState({setup: setupCopy});
    };
  
    const deleteConstraint = () => {
        let setupCopy = clone(appState.setup);
        let setupCopyPath = _.get(setupCopy, pathFrag);
        console.log(setupCopyPath[thisIndex]);
        if (path.length === 1) {
            let setupCopyUpPath = _.get(setupCopy, stringPath);
            delete setupCopyUpPath.constraints;
        } else {
            setupCopyPath.splice(thisIndex, 1);
        }
        setAppState({setup: setupCopy});

    };

    const isCurrentSelection = gramClassGroupId =>  {
        return path[thisIndex].refId === gramClassGroupId;
    };

    const isSelected = gramClassId =>  {
        return !path[thisIndex].excludedGramClasses.some(a => a === gramClassId);
    };

    const isAvailable = gramClassGroupId => {
        return availableForLimitationGroups.some(a => a.id === gramClassGroupId);
    };

    const getGramClasses = gramClassGroupId => {
        let gramClassGroup = appState.setup.gramClassGroups.find(a => a.id === gramClassGroupId);
        return gramClassGroup.gramClasses;
    };

    const popupItems = [
        ["Delete", deleteConstraint]
    ];

    
    if (availableForLimitationGroups.length > 0) {
        popupItems.push(["Constraint", () => addConstraint(thisIndex+1)]);
    };

    const isFirst = thisIndex === 0;
    const isLast = thisIndex === path.length-1;

    return(
        <>
            <div className="row">
                <div className="row-controls">
                    <AddPopup popupItems={popupItems} visible={addPopupVisible} />
                    <i className="fas fa-plus" onClick={() => addPopupHandler(addPopupVisible, setAddPopupVisible)}></i>           
                    <i className="fas fa-minus" onClick={deleteConstraint}></i>
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
                <div className="row-content" style={getIndent(1)}>
                    <label>In group</label>
                    <ul>
                        {appState.setup.gramClassGroups.map((a, i) => (
                            <li key={i} value={a.id} className={ isCurrentSelection(a.id) ? "selected" : isAvailable(a.id) ? ""  : "disabled" } onClick={() => handleGroupClick(a.id)}>{capitalize(a.name)}</li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="row">
                <div className="row-controls"></div>
                <div className="row-content" style={getIndent(2)}>
                    <label>Only occurs for</label>
                    <ul>
                        {getGramClasses(path[thisIndex].refId).map((a, i, arr) => (
                            <li key={i} value={a.id} className={ isSelected(a.id) ? "selected" : "" } onClick={e => handleGramClassClick(a.id, arr.length)}>{capitalize(a.name)}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    )
};

export default GramFormLimitations;