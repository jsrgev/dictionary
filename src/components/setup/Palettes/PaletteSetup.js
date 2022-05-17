import AddPopup from '../../AddPopup';
import PaletteGroupSetup from './PaletteGroupSetup';
import { clone, addPopupHandler, getIndent } from '../../../utils.js';
import React, {useState} from 'react';
import _ from 'lodash';

const PaletteSetup = props => {
    
    const {state, setState, thisIndex, stringPath, moveRow, prevIndent, addPalette} = props;

    let pathFrag = stringPath;
    const path = _.get(state, "tempSetup." + pathFrag+".items");

    const [sectionOpen, setSectionOpen] = useState(true);
    const [addPopupVisible, setAddPopupVisible] = useState(false);

    const handleChange = value => {
        const tempSetupCopy = clone(state.tempSetup);
        let tempSetupCopyPath = _.get(tempSetupCopy, pathFrag);
        tempSetupCopyPath[thisIndex].name = value;
        setState({tempSetup: tempSetupCopy});
    };

    const changeCheck = field => {
        const tempSetupCopy = clone(state.tempSetup);
        let tempSetupCopyPath = _.get(tempSetupCopy, pathFrag);
        let value = tempSetupCopyPath[thisIndex][field];
        tempSetupCopyPath[thisIndex][field] = !value;
        setState({tempSetup: tempSetupCopy});
    };

    const changeSeparator = value => {
        const tempSetupCopy = clone(state.tempSetup);
        let tempSetupCopyPath = _.get(tempSetupCopy, pathFrag);
        tempSetupCopyPath[thisIndex].groupSeparator = value;
        setState({tempSetup: tempSetupCopy});
    };

    const deletePalette = index => {
        let tempSetupCopy = clone(state.tempSetup);
        tempSetupCopy.palettes.items.splice(thisIndex, 1);
        setState({tempSetup: tempSetupCopy});
    };

    const popupItems =[
        ["Palette", () => addPalette(thisIndex)],
    ];

    const isFirst = thisIndex === 0;
    const isLast = thisIndex === path.length-1;

    const stringPathA = stringPath + `[items.${thisIndex}]`;

    return (
            <>
                <div className={`row${sectionOpen ? "" : " closed"}`}>
                    <div className="row-controls">
                        <AddPopup popupItems={popupItems} visible={addPopupVisible} />
                        <i className="fas fa-plus" onClick={() => addPopupHandler(addPopupVisible, setAddPopupVisible)}></i>
                        <i className="fas fa-minus" onClick={deletePalette}></i>
                        <i className={`fas fa-chevron-${sectionOpen ? "up" : "down"}`} onClick={() => setSectionOpen(!sectionOpen)}></i>
                        <i
                            className={`fas fa-arrow-up${isFirst ? " disabled" : ""}`}
                            onClick={e => moveRow(e, thisIndex, pathFrag, true)}
                        ></i>
                        <i
                            className={`fas fa-arrow-down${isLast ? " disabled" : ""}`}
                            onClick={e => moveRow(e, thisIndex, pathFrag, false)}
                        ></i>
                    </div>
                    <div className="row-content triple-input" style={getIndent(prevIndent)}>
                        <label htmlFor={`palette[${thisIndex}].name`}>Palette name</label>
                        <input id={`palette[${thisIndex}].name`} type="text" value={path[thisIndex].name} onChange={e => handleChange(e.target.value)} />
                        <label>Group separator</label>
                        <ul>
                            <li className={path[thisIndex].groupSeparator === "none" ? "selected" : ""} onClick={() => changeSeparator("none")}>None</li>
                            <li className={path[thisIndex].groupSeparator === "space" ? "selected" : ""} onClick={() => changeSeparator("space")}>Space</li>
                            <li className={path[thisIndex].groupSeparator === "line" ? "selected" : ""} onClick={() => changeSeparator("line")}>Line</li>
                        </ul>
                        <label htmlFor={`palette[${thisIndex}].display`}>Show palette</label>
                        <input id={`palette[${thisIndex}].display`} type="checkbox" checked={path[thisIndex].display ? true : false} onChange={e => changeCheck("display")} />
                    </div>
                    <div className="row">
                        {path[thisIndex].content.map((a,i) => (
                            <PaletteGroupSetup key={i} state={state} setState={setState} thisIndex={i} moveRow={moveRow} stringPath={stringPathA} prevIndent={prevIndent+1} />
                            ))}
                    </div>
                </div>
            </>
    );
};

export default PaletteSetup;