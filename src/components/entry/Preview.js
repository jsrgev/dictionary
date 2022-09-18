import React from "react";
// import {clone, getPosDef, getGramFormAbbrs, sortEntries} from '../../utils.js';
import {getEntriesDisplay} from '../../entryDisplayFuncs.js';

const Preview = (props) => {

    const {state} = props;

    const getDisplay = () => {
        // console.log(state.eymologyTags);
        let currentScriptId = state.setup.scripts.items[0].id;
        let allDisplayItems = getEntriesDisplay([state.entry], state.setup, currentScriptId, state.etymologyTags);
        let finalEntries = allDisplayItems.map(a => a.display);
        return finalEntries;
    };

    return(
        <>
            <h2>Preview</h2>
            {state.entry &&
            getDisplay().map((a, i) => (
                <p key={i}>{a}</p>
            ))}
        </>
    );
};

export default Preview;