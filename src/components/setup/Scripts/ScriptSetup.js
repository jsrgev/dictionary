import AddPopup from '../../AddPopup';
import {useState} from 'react';
import {clone, addPopupHandler, getIndent} from '../../../utils.js';
import {scriptDefault} from '../defaults.js';
import _ from 'lodash';

const ScriptSection = props => {

    const {state, setState, thisIndex, addScript, setSectionClosed} = props;

    const pathFrag = "scripts.items";
    const path = _.get(state, "tempSetup." + pathFrag);

    const [addPopupVisible, setAddPopupVisible] = useState(false);

    const handleChange = (field, value) => {
        const tempSetupCopy = clone(state.tempSetup);
        let tempSetupCopyPath = _.get(tempSetupCopy, pathFrag);
        // console.log(tempSetupCopyPath);
        tempSetupCopyPath[thisIndex][field] = value;
        // console.log(tempSetupCopyPath[thisIndex][field]);
        setState({tempSetup: tempSetupCopy});
    };
    
    // const changeCheck = field => {
    //     const tempSetupCopy = clone(state.tempSetup);
    //     let tempSetupCopyPath = _.get(tempSetupCopy, pathFrag);
    //     let value = tempSetupCopyPath[field];
    //     // let value = _.get(tempSetupCopy, `[${field}]`);
    //     _.set(tempSetupCopyPath, `[${field}]`, !value);
    //     setState({tempSetup: tempSetupCopy});
    // };

    const changeCheck = field => {
        const tempSetupCopy = clone(state.tempSetup);
        let tempSetupCopyPath = _.get(tempSetupCopy, pathFrag);
        let value = tempSetupCopyPath[thisIndex][field];
        // console.log(value);
        _.set(tempSetupCopyPath, `[${thisIndex}][${field}]`, !value);
        // console.log(tempSetupCopyPath);
        setState({tempSetup: tempSetupCopy});
    };
    
    // const changeSortOrder = (field, value) => {
    //     const tempSetupCopy = clone(state.tempSetup);
    //     let tempSetupCopyPath = _.get(tempSetupCopy, pathFrag);
    //     tempSetupCopyPath[thisIndex][field] = value.split(" ");
    //     setState({tempSetup: tempSetupCopy});
    // };

    const checkScriptInUse = scriptId => {
        const {allEntries} = state;
        let areMatches = false;
        for (let entry of allEntries) {
            for (let morph of entry.headword.morphs) {
                for (let scriptForm of morph.scriptForms) {
                    if (scriptForm.refId === scriptId) {
                        areMatches = true;
                        break;
                    };
                }
            }
        }
        if (areMatches) {
            return areMatches;
        }
        for (let entry of allEntries) {
            for (let senseGroup of entry.senseGroups) {
                for (let partOfSpeech of senseGroup.partsOfSpeech) {
                    if (partOfSpeech.irregulars) {
                        for (let irregular of partOfSpeech.irregulars) {
                            if (irregular.morphs) {
                                for (let morph of irregular.morphs) {
                                    for (let scriptForm of morph.scriptForms) {
                                        if (scriptForm.refId === scriptId) {
                                            areMatches = true;
                                            break;
                                        };
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return areMatches;
    };

    const deleteScript = () => {
        const scriptId = path[thisIndex].id;
        const isInUse = checkScriptInUse(scriptId);
        // console.log(isInUse);
        if (isInUse) {
            let response = window.confirm("Are you sure you want to delete this script? If so, all forms already saved for this script will be deleted from their entries after you save the setup.");
            if (!response) {
                return;
            }

            const tempSetupCopy = clone(state.tempSetup);
            let tempSetupCopyPath = _.get(tempSetupCopy, pathFrag);
            if (path.length === 1) {
                let newScript = clone(scriptDefault);
                newScript.id = tempSetupCopy.nextId.toString();
                tempSetupCopy.nextId++;
                tempSetupCopyPath.splice(0, 1, newScript);
            } else {
                tempSetupCopyPath.splice(thisIndex, 1);
            }
            const changesCopy = clone(state.changes);
            changesCopy.scriptsToDelete.push(scriptId);

            setState({tempSetup: tempSetupCopy, changes: changesCopy});    
        } else {

            let tempSetupCopy = clone(state.tempSetup);
            let tempSetupCopyPath = _.get(tempSetupCopy, pathFrag);
            if (path.length === 1) {
                let newScript = clone(scriptDefault);
                newScript.id = tempSetupCopy.nextId.toString();
                tempSetupCopy.nextId++;
                tempSetupCopyPath.splice(0, 1, newScript);
            } else {
                tempSetupCopyPath.splice(thisIndex, 1);
            }
            setState({tempSetup: tempSetupCopy});
        }
    };

    const moveRow = (e, up) => {
        if (e.target.classList.contains("disabled")) return;
        let position = up ? thisIndex-1 : thisIndex+1;
        let tempSetupCopy = clone(state.tempSetup);
        let tempSetupCopyPath = _.get(tempSetupCopy, pathFrag);
        let thisItemCopy = clone(tempSetupCopyPath[thisIndex]);
        tempSetupCopyPath.splice(thisIndex, 1);
        tempSetupCopyPath.splice(position, 0, thisItemCopy);
        _.set(tempSetupCopyPath, `[0][display]`, true);
        setState({tempSetup: tempSetupCopy});
    };
    
    const popupItems = [
        ["Script", () => addScript(thisIndex)],
    ];

    const isFirst = thisIndex === 0;
    const isLast = thisIndex === path.length-1;

    return(
        <div className="row"> 
            <div className="row">
                <div className={`row${ path[thisIndex].sectionClosed ? " closed" : ""}`}>
                    <div className="row-controls">
                        <AddPopup popupItems={popupItems} visible={addPopupVisible} />
                        <i className="fas fa-plus" onClick={() => addPopupHandler(addPopupVisible, setAddPopupVisible)}></i>
                        <i className="fas fa-minus" onClick={deleteScript}></i>
                        <i className={`fas fa-chevron-${path[thisIndex].sectionClosed ? "down" : "up"}`} onClick={() => setSectionClosed(`${pathFrag}[${thisIndex}]`)}></i>
                        <i
                            className={`fas fa-arrow-up${isFirst ? " disabled" : ""}`}
                            onClick={e => moveRow(e, true)}
                        ></i>
                        <i
                            className={`fas fa-arrow-down${isLast ? " disabled" : ""}`}
                            onClick={e => moveRow(e, false)}>
                        </i>
                    </div>
                    <div className="row-content triple-input-2" style={getIndent(0)}>
                        <input id={`script[${thisIndex}]-display`} type="checkbox" value={path[thisIndex].display} onChange={e => changeCheck("display")} />
                        <label htmlFor={`script[${thisIndex}]-display`}>Display</label>
                        <label htmlFor={`script[${thisIndex}]-name`}>Name</label>
                        <input id={`script[${thisIndex}]-name`} type="text" value={path[thisIndex].name} onChange={e => handleChange("name", e.target.value)} />
                        <label htmlFor={`script[${thisIndex}]-abbr`}>Abbreviation</label>
                        <input id={`script[${thisIndex}]-abbr`} type="text" value={path[thisIndex].abbr} onChange={e => handleChange("abbr", e.target.value)} />
                    </div>
                    <div className="row">
                        {/* <div className="row-controls"></div>
                        <div className="row-content double-radio-buttons" style={getIndent(0)}>
                            <label htmlFor={`script[${thisIndex}]-writingDirection`}>Writing Direction</label>
                            <input id={`script[${thisIndex}]-writingDirection-ltr`} type="radio" name={`script[${thisIndex}]-writingDirection`} checked={path[thisIndex].writingDirection === "ltr" ? true : false} onChange={e => handleChange("writingDirection", "ltr")} />
                            <label htmlFor={`script[${thisIndex}]-writingDirection-ltr`}>Left to right</label>
                            <input id={`script[${thisIndex}]-writingDirection-rtl`} type="radio" name={`script[${thisIndex}]-writingDirection`} checked={path[thisIndex].writingDirection === "rtl" ? true : false} onChange={e => handleChange("writingDirection", "rtl")} />
                            <label htmlFor={`script[${thisIndex}]-writingDirection-rtl`}>Right to left</label>
                        </div> */}
                        {/* <div className="row-controls"></div>
                        <div className="row-content" style={getIndent(0)}>
                            <label htmlFor={`script[${thisIndex}]-name`}>Letter Order</label>
                            <input id={`script[${thisIndex}]-letterOrder`} type="text" value={path[thisIndex].letterOrder.join(" ")} onChange={e => changeSortOrder("letterOrder", e.target.value)} />
                        </div>
                        <div className="row-controls"></div>
                        <div className="row-content" style={getIndent(0)}>
                            <label htmlFor={`script[${thisIndex}]-name`}>Diacritic Order</label>
                            <input id={`script[${thisIndex}]-diacriticOrder`} type="text" value={path[thisIndex].diacriticOrder.join(" ")} onChange={e => changeSortOrder("diacriticOrder", e.target.value)} />
                        </div>
                        <div className="row-controls"></div>
                        <div className="row-content" style={getIndent(0)}>
                            <input id={`script[${thisIndex}].display`} disabled={thisIndex === 0 ? true : false} type="checkbox" checked={path[thisIndex].display ? true : false} onChange={e => changeCheck("display")} />
                            <label htmlFor={`script[${thisIndex}].display`}>Display script</label>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );

};

export default ScriptSection;