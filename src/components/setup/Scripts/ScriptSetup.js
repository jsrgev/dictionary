import AddPopup from '../../AddPopup';
import {useState} from 'react';
import {clone, addPopupHandler, getIndent} from '../../../utils.js';
import {scriptDefault} from '../defaults.js';
import _ from 'lodash';

const ScriptSection = props => {

    const {state, setState, thisIndex, moveRow, addScript} = props;

    const pathFrag = "scripts";
    const path = _.get(state, "tempSetup." + pathFrag);

    const [addPopupVisible, setAddPopupVisible] = useState(false);
    const [rowOpen, setRowOpen] = useState(true);

    const handleChange = (field, value) => {
        const tempSetupCopy = clone(state.tempSetup);
        let tempSetupCopyPath = _.get(tempSetupCopy, pathFrag);
        tempSetupCopyPath[thisIndex][field] = value;
        setState({tempSetup: tempSetupCopy});
    };
    
    const changeSortOrder = (field, value) => {
        const tempSetupCopy = clone(state.tempSetup);
        let tempSetupCopyPath = _.get(tempSetupCopy, pathFrag);
        tempSetupCopyPath[thisIndex][field] = value.split(" ");
        setState({tempSetup: tempSetupCopy});
    };

    const deleteScript = () => {
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
    };


    const popupItems = [
        ["Script", () => addScript(thisIndex)],
    ];

    const isFirst = thisIndex === 0;
    const isLast = thisIndex === path.length-1;

    console.log(path[thisIndex].writingDirection === "rtl");
    
    return(
        <div className="row"> 
            <div className="row">
                <div className="row">
                    <div className="row-controls">
                        <AddPopup popupItems={popupItems} visible={addPopupVisible} />
                        <i className="fas fa-plus" onClick={() => addPopupHandler(addPopupVisible, setAddPopupVisible)}></i>
                        <i className="fas fa-minus" onClick={deleteScript}></i>
                        <i className={`fas fa-chevron-${rowOpen ? "up" : "down"}`} onClick={() => setRowOpen(!rowOpen)}></i>
                        <i
                            className={`fas fa-arrow-up${isFirst ? " disabled" : ""}`}
                            onClick={e => moveRow(e, thisIndex, pathFrag, true)}
                        ></i>
                        <i
                            className={`fas fa-arrow-down${isLast ? " disabled" : ""}`}
                            onClick={e => moveRow(e, thisIndex, pathFrag, false)}>
                        </i>
                    </div>
                    <div className="row-content double-input">
                        <label htmlFor={`script[${thisIndex}]-name`}>Name</label>
                        <input id={`script[${thisIndex}]-name`} type="text" value={path[thisIndex].name} onChange={e => handleChange("name", e.target.value)} />
                        <label htmlFor={`script[${thisIndex}]-name`}>Abbreviation</label>
                        <input id={`script[${thisIndex}]-abbr`} type="text" value={path[thisIndex].abbr} onChange={e => handleChange("abbr", e.target.value)} />
                    </div>
                    <div className="row-controls"></div>
                    <div className="row-content double-input" style={getIndent(0)}>
                        {/* <label htmlFor={`script[${thisIndex}]-writingDirection`}>Writing Direction</label> */}
                        <input id={`script[${thisIndex}]-writingDirection-ltr`} type="radio" name={`script[${thisIndex}]-writingDirection`} checked={path[thisIndex].writingDirection === "ltr" ? true : false} onChange={e => handleChange("writingDirection", "ltr")} />
                        <label htmlFor={`script[${thisIndex}]-writingDirection-ltr`}>Left to right</label>
                        <input id={`script[${thisIndex}]-writingDirection-rtl`} type="radio" name={`script[${thisIndex}]-writingDirection`} checked={path[thisIndex].writingDirection === "rtl" ? true : false} onChange={e => handleChange("writingDirection", "rtl")} />
                        <label htmlFor={`script[${thisIndex}]-writingDirection-rtl`}>Right to left</label>
                    </div>
                    <div className="row-controls"></div>
                    <div className="row-content" style={getIndent(0)}>
                        <label htmlFor={`script[${thisIndex}]-name`}>Letter Order</label>
                        <input id={`script[${thisIndex}]-letterOrder`} type="text" value={path[thisIndex].letterOrder.join(" ")} onChange={e => changeSortOrder("letterOrder", e.target.value)} />
                        {/* <input className="for norm" id={`${pathFrag}[${thisIndex}].characters`} type="text" value={path[thisIndex].characters.join(" ")} onChange={e => changeSortOrder(e.target.value)} /> */}
                    </div>
                    <div className="row-controls"></div>
                    <div className="row-content" style={getIndent(0)}>
                        <label htmlFor={`script[${thisIndex}]-name`}>Diacritic Order</label>
                        <input id={`script[${thisIndex}]-diacriticOrder`} type="text" value={path[thisIndex].diacriticOrder.join(" ")} onChange={e => changeSortOrder("diacriticOrder", e.target.value)} />
                        {/* <input className="for norm" id={`${pathFrag}[${thisIndex}].characters`} type="text" value={path[thisIndex].characters.join(" ")} onChange={e => changeSortOrder(e.target.value)} /> */}
                    </div>
                </div>
            </div>
        </div>
    );

};

export default ScriptSection;