import React from 'react';
import {getEntriesDisplay} from '../entryDisplayFuncs.js';

const Dictionary = props => {

    const {state} = props;

    // let entryPreview = getEntriesDisplay(state.entry, state.setup);

    return (
        <main>
            {(state.allEntries && state.setup) ?
            <div>{getEntriesDisplay(state.allEntries, state.setup)}</div>
            :
            <>"No entries"</>
            }
        </main>
    )

}


export default Dictionary