import React from "react";
// import {clone, getPosDef, getGramFormAbbrs, sortEntries} from '../../utils.js';
import {getEntriesDisplay} from '../../entryDisplayFuncs.js';

const Preview = (props) => {

    const {state} = props;

    const getDisplay = () => {
        let allDisplayItems = getEntriesDisplay([state.entry], state.setup, state.etymologyTags);
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