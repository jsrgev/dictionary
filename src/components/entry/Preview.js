import React from "react";
// import {clone, getPosDef, getGramFormAbbrs, sortEntries} from '../../utils.js';
import {getEntriesDisplay} from '../../entryDisplayFuncs.js';

const Preview = (props) => {

    const {appState} = props;

    const getDisplay = () => {
        let allDisplayItems = getEntriesDisplay([appState.entry], appState.setup, appState.etymologyTags);
        let finalEntries = allDisplayItems.map(a => a.display);
        return finalEntries;
    };

    return(
        <>
            <p>Preview</p>
            {appState.entry &&
            getDisplay().map((a, i) => (
                <div key={i}>{a}</div>
            ))}
        </>
    );
};

export default Preview;