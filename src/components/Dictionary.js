import React from 'react';
import {getEntriesDisplay} from '../entryDisplayFuncs.js';

const Dictionary = props => {

    const {state} = props;

    // let entryPreview = getEntriesDisplay(state.entry, state.setup);

    const splitEntries = (allDisplayItems) => {
        let arr = [];
        let lastLetter = "";
        allDisplayItems.forEach(a => {
            if (a.sortTerm[0] === lastLetter) {
                arr[arr.length - 1].items.push(a.display);
            } else {
                let obj = {
                    letter: a.sortTerm[0],
                    items: [a.display]
                }
                arr.push(obj);
                lastLetter = a.sortTerm[0];
            }
        })
        return arr;
    };
    

    const getDisplay = () => {
        // console.log(state.allEntries);
        let allDisplayItems = getEntriesDisplay(state.allEntries, state.setup);
        let finalEntries = splitEntries(allDisplayItems);
        return finalEntries;
    };

    // let entries = getEntriesDisplay(state.allEntries, state.setup);

    return (
        <main>
            {(state.allEntries && state.setup) ?
            <>
            {getDisplay().map((a, i) => (
                <React.Fragment key={i}>
                    <div className="dic" id={`letter-${a.letter}`}><h3>{a.letter}</h3></div>
                    {a.items.map((b, j) => (
                        <div key={j}>{b}</div>
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