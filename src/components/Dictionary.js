import React from 'react';
import {getEntriesDisplay} from '../entryDisplayFuncs.js';

const Dictionary = props => {

    const {state} = props;

    const getInitial = string => {
        return string.normalize('NFD').toLowerCase()[0];
    }

    const splitEntries = (allDisplayItems) => {
        // const sortOrder = state.setup.sortOrder;
        let arr = [];
        let currentLetter = "";
        allDisplayItems.forEach(a => {
            const firstLetter = getInitial(a.sortTerm[0]);
            if (firstLetter === currentLetter) {
                arr[arr.length - 1].items.push(a.display);
            } else {
                let obj = {
                    letter: firstLetter,
                    items: [a.display]
                }
                arr.push(obj);
                currentLetter = firstLetter;
            }
        })
        return arr;
    };
    

    const getDisplay = () => {
        let allDisplayItems = getEntriesDisplay(state.allEntries, state.setup, state.etymologyTags);
        let finalEntries = splitEntries(allDisplayItems);
        return finalEntries;
    };

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