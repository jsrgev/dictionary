import AddPopup from '../AddPopup.js';
import { clone, addPopupHandler, capitalize, getIndent } from '../../utils.js';
import {useState} from 'react';
import _ from 'lodash';

const GramFormLimitations = props => {

    const {appState, setAppState, moveItem, addConstraint, stringPath, thisIndex, availableForLimitationGroups} = props;

    let pathFrag = stringPath + ".allowedGramClassGroups";
    const path = _.get(appState, "setup." + pathFrag);

    const [addPopupVisible, setAddPopupVisible] = useState(false);

    const handleGroupClick = gramClassGroupId => {
        if (path[thisIndex].refId === gramClassGroupId) {
            return;
        }
        let setupCopy = clone(appState.setup);
        let setupCopyPath = _.get(setupCopy, pathFrag);
        let gramClasses = getGramClasses(gramClassGroupId);
        let obj = {
            refId: gramClassGroupId,
            gramClasses: [
                {
                    refId: gramClasses[0].id
                }
            ]
        };
        setupCopyPath[thisIndex] = obj;
        setAppState({setup: setupCopy});
    };
    
    const handleGramClassClick = gramClassId => {
        let setupCopy = clone(appState.setup);
        let setupCopyPath = _.get(setupCopy, stringPath + `.allowedGramClassGroups[${thisIndex}].gramClasses`);
        // console.log(gramClassId)
        // console.log(setupCopyPath.allowedGramClassGroups[thisIndex].gramClasses)
        // console.log(setupCopyPath);
        // return
        // if (setupCopyPath.excluded) {
            let index = setupCopyPath.findIndex(a => a.refId === gramClassId);
            console.log(index);
            if (index < 0) {
                setupCopyPath.push({refId: gramClassId});
                // console.log(setupCopyPath);
            } else if (setupCopyPath.length === 1) {
                return;
            } else {
                setupCopyPath.splice(index, 1);
            }
        // } else {
        //     setupCopyPath.excluded = [gramClassId];
        // }
        setAppState({setup: setupCopy});
    };

    const deleteConstraint = () => {
        let setupCopy = clone(appState.setup);
        let setupCopyPath = _.get(setupCopy, pathFrag);
        console.log(setupCopyPath[thisIndex]);
        if (path.length === 1) {
            let setupCopyUpPath = _.get(setupCopy, stringPath);
            delete setupCopyUpPath.allowedGramClassGroups;
        } else {
            setupCopyPath.splice(thisIndex, 1);
        }
        setAppState({setup: setupCopy});

    };

    const isCurrentSelection = gramClassGroupId =>  {
        return path[thisIndex].refId === gramClassGroupId;
    };

    const isSelected = gramClassId =>  {
        return path[thisIndex].gramClasses.some(a => a.refId === gramClassId);
    };


    const isAvailable = gramClassGroupId => {
        return availableForLimitationGroups.some(a => a.id === gramClassGroupId);
    };

    const getGramClasses = gramClassGroupId => {
        let gramClassGroup = appState.setup.gramClassGroups.find(a => a.id === gramClassGroupId);
        return gramClassGroup.gramClasses
    };

    const popupItems = [
        ["Delete", deleteConstraint]
    ];

    // console.log

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
                    <label>Only for group</label>
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
                    <label>Class</label>
                    <ul>
                        {getGramClasses(path[thisIndex].refId).map((a, i) => (
                            <li key={i} value={a.id} className={ isSelected(a.id) ? "selected" : "" } onClick={e => handleGramClassClick(a.id)}>{capitalize(a.name)}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    )
};

export default GramFormLimitations;