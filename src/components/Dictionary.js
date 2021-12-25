import React from 'react';
import {getEntriesDisplay} from '../entryDisplayFuncs.js';

const Dictionary = props => {

    const {state} = props;

    // let entryPreview = getEntriesDisplay(state.entry, state.setup);

    let entries = getEntriesDisplay(state.allEntries, state.setup);

    return (
        <main>
            {(entries && state.setup) ?
            <>
            {entries.map((a, i) => (
                <React.Fragment key={i}>
                    <div className="dic"><h3>{a.letter}</h3></div>
                    {a.items.map((b, j) => (
                        <div>{b}</div>
                    ))}
                </React.Fragment>
            ))}
            </>
            :
            <div>Loading</div>
            }
        </main>
    )

}


export default Dictionary