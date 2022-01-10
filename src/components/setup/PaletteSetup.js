import AddPopup from '../AddPopup.js';
import GramClass from './GramClass.js';
import IpaSetup from './IpaSetup';
import { clone, addPopupHandler } from '../../utils.js';
import {gramClassGroupDefault, gramClassDefault} from './defaults.js';
import React, {useState} from 'react';
import _ from 'lodash';

const PaletteSetup = props => {
    
    const {state, setState, thisIndex, stringPath, moveItem} = props;

    let pathFrag = stringPath;
    const path = _.get(state, pathFrag);

    const changeSeparator = (field, value) => {
        const tempSetupCopy = clone(state.tempSetup);
        tempSetupCopy[field].groupSeparator = value;
        setState({tempSetup: tempSetupCopy});
    };


    return (
            <>
                <div className="row setting">
                    <label>Group separator</label>
                    <ul>
                        <li className={path.groupSeparator === "none" ? "selected" : ""} onClick={() => changeSeparator("ipa", "none")}>None</li>
                        <li className={path.groupSeparator === "space" ? "selected" : ""} onClick={() => changeSeparator("ipa", "space")}>Space</li>
                        <li className={path.groupSeparator === "line" ? "selected" : ""} onClick={() => changeSeparator("ipa", "line")}>Line</li>
                    </ul>
                </div>
                <div className="row">
                    {path.content.map((a,i) => (
                        <IpaSetup key={i} state={state} setState={setState} thisIndex={i} moveItem={moveItem} />
                    ))}
                </div>
            </>
    );
};

export default PaletteSetup;