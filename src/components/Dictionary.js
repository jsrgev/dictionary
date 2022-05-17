import React from 'react';
import {getEntriesDisplay} from '../entryDisplayFuncs.js';

const Dictionary = props => {

    const {state} = props;

    const getInitial = string => {
        return string.normalize('NFD').toLowerCase()[0];
    }

    const splitEntries = (allDisplayItems) => {
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
        let allDisplayItems = getEntriesDisplay(state.allEntries, state.setup, state.etymologySettings.etymologyTags);
        let finalEntries = splitEntries(allDisplayItems);
        return finalEntries;
    };

    const getAllAbbr = () => {
        let arr = [];
        const pushAbbrs = set => {
            set.forEach(a => {
                arr.push([a.abbr, a.name]);
            })
        }
        pushAbbrs(state.setup.partsOfSpeechDefs.items);
        pushAbbrs(state.setup.etymologySettings.etymologyAbbrs);
        state.setup.gramClassGroups.forEach(a => pushAbbrs(a.gramClasses));
        state.setup.gramFormGroups.forEach(a => pushAbbrs(a.gramForms));
        const filteredArr = arr.filter(a => a[0] !== "");
        return filteredArr.sort();
    };


    return (
        <main className="dictionary">
            {(state.allEntries && state.setup) ?
            <>
                <div id="abbreviations">
                    <h1>Abbrevations</h1>
                    <ul className='terms'>
                        {getAllAbbr().map((a, i) => (
                        <li key={i}><span>{a[0]}</span><span>{a[1]}</span></li>
                        ))}
                    </ul>
                </div>
            {getDisplay().map((a, i) => (
                <div className="entries" id={`letter-${a.letter}`} key={i}>
                    <h1>{a.letter}</h1>
                    {a.items.map((b, j) => (
                        <p key={j}>{b}</p>
                    ))}
                </div>
            ))}
            </>
            :
            <div>Loading</div>
            }
        </main>
    )

}


export default Dictionary