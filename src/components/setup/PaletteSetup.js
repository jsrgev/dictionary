// import AddPopup from '../AddPopup.js';
// import GramClass from './GramClass.js';
import PaletteGroupSetup from './PaletteGroupSetup';
import { clone, addPopupHandler } from '../../utils.js';
// import {gramClassGroupDefault, gramClassDefault} from './defaults.js';
import React, {useState} from 'react';
import _ from 'lodash';

const PaletteSetup = props => {
    
    const {state, setState, thisIndex, stringPath, moveItem} = props;

    let pathFrag = stringPath;
    const path = _.get(state, "tempSetup." + pathFrag);


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

    // console.log(path);
    const stringPathA = stringPath + `[${thisIndex}]`;

    return (
            <>
                    <div className="row setting">
                        <label htmlFor={`show-palette[${thisIndex}]`}>Show palette</label>
                        <input id={`show-palette[${thisIndex}]`} type="checkbox" checked={path[thisIndex].display ? true : false} onChange={e => changeCheck("display")} />
                    </div>
                <div className="row setting">
                    <label>Group separator</label>
                    <ul>
                        <li className={path[thisIndex].groupSeparator === "none" ? "selected" : ""} onClick={() => changeSeparator("none")}>None</li>
                        <li className={path[thisIndex].groupSeparator === "space" ? "selected" : ""} onClick={() => changeSeparator("space")}>Space</li>
                        <li className={path[thisIndex].groupSeparator === "line" ? "selected" : ""} onClick={() => changeSeparator("line")}>Line</li>
                    </ul>
                </div>
                <div className="row">
                    {path[thisIndex].content.map((a,i) => (
                        <PaletteGroupSetup key={i} state={state} setState={setState} thisIndex={i} moveItem={moveItem} stringPath={stringPathA} />
                    ))}
                </div>
            </>
    );
};

export default PaletteSetup;