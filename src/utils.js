import {senseGroupDefault, gramFormDefault} from './defaults.js';
// import {gramFormSets, partsOfSpeechDefs} from './languageSettings.js';


export const API_BASE = "http://localhost:3001/dictionary";
// export const API_BASE = "http://jsrgev.net/dictionary"


export const getIndent = (prevIndent = 0) => {
    const indentAmount = 2;
    return {marginLeft: (prevIndent+1)*indentAmount + "rem"} ;
};

export const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1);

// export const capitalize = string => {
//     console.log(string);
//     console.log(string.charAt(0));
//     return string.charAt(0).toUpperCase() + string.slice(1)
// };


export const clone = a => JSON.parse(JSON.stringify(a));

export const generateSenseGroup = (posId, partsOfSpeechDefs, gramClassGroups) => {
    let newSenseGroup = clone(senseGroupDefault);
    let pos = generatePos(posId, partsOfSpeechDefs, gramClassGroups);
    newSenseGroup.partsOfSpeech.push(pos);
    return newSenseGroup;
};

export const getPosDef = (posId, partsOfSpeechDefs) => {
    return partsOfSpeechDefs.find(a => a.id === posId);
};

export const getGramForms = (gramFormSet, gramFormSets) => {
    let gramForms = gramFormSets[gramFormSet].gramForms;
    let paradigmForms = gramForms.map(a => {
        let item = clone(gramFormDefault);
        item.gramForm = a;
        return item;
    });
    return paradigmForms; 
};


export const getGramClassDef = (posName, className, partsOfSpeechDefs) =>  {
    let posDef = getPosDef(posName, partsOfSpeechDefs);
    return posDef.gramClasses.find(a => a.name === className);
};

export const getAllGramClassGroups = (posId, partsOfSpeechDefs) => {
    let posDef = partsOfSpeechDefs.find(a => a.id === posId);
    return posDef.gramClassGroups;
};

export const getGramClasses = (posId, gramClassGroupId, partsOfSpeechDefs, gramClassGroups) => {
    let posDef = getPosDef(posId, partsOfSpeechDefs);
    let excluded = posDef.gramClassGroups.find(a => a.refId === gramClassGroupId).excluded || [];

    let thisGroupsGramClasses = gramClassGroups.find(a => a.id === gramClassGroupId);
    let gramClasses = thisGroupsGramClasses.gramClasses.filter(a => {
        return !excluded.some(b => b === a.id);
    });
    return gramClasses;
};

export const getGramClassGroup = (posId, partsOfSpeechDefs) => {
    let posDef = getPosDef(posId, partsOfSpeechDefs);
    let defaultGramClassGroupId = posDef.gramClassGroups?.[0].refId;
    return defaultGramClassGroupId;
};

export const getGramClassGroupIds = (posId, partsOfSpeechDefs) => {
    let posDef = getPosDef(posId, partsOfSpeechDefs);
    let defaultGramClassGroupIds = posDef.gramClassGroups?.map(a => a.refId);
    return defaultGramClassGroupIds;
};

export const generatePos = (posId, partsOfSpeechDefs, gramClassGroups) => {
    let posDef = getPosDef(posId, partsOfSpeechDefs);
    let obj = {
        refId: posDef.id,
    };
    let gramClassGroupIds = getGramClassGroupIds(posId, partsOfSpeechDefs );
    if (gramClassGroupIds) {
        obj.gramClassGroups = [];
        gramClassGroupIds.forEach(gramClassGroupId => {
            let gramClasses = getGramClasses(posId, gramClassGroupId, partsOfSpeechDefs, gramClassGroups);
            obj.gramClassGroups.push(
                {
                    refId: gramClassGroupId,
                    gramClasses: [gramClasses[0].id]
                }
            );
        })
    };
    return obj;
};

export const handleInputBlur = e => {
    const hoverItems = document.querySelectorAll( ":hover" );
    const clickedItem = hoverItems[hoverItems.length-1];
    if (clickedItem === undefined || !clickedItem.closest(".palette")) {
        return;
    };
    e.target.focus();
    if (clickedItem.tagName !== "SPAN") {
        return;
    }
    const inputNode = e.target;
    const {value} = inputNode;

    const selectionStart = inputNode.selectionStart ?? value.length;
    const selectionEnd = inputNode.selectionEnd ?? value.length;

    const clickedItemValue = clickedItem.textContent;
    const newValue = value.substring(0, selectionStart) + clickedItemValue + value.substring(selectionEnd);
    const positionsToSkip = clickedItemValue.length;
    const newCursorPosition = selectionStart + positionsToSkip;

    setTimeout(() => {
        e.target.selectionStart = newCursorPosition;
        e.target.selectionEnd = newCursorPosition;
    }, 5);


    return newValue;
};

const closePopup = (setAddPopupVisible) => {
    setAddPopupVisible(false)
};

export const addPopupHandler = (addPopupVisible, setAddPopupVisible) => {
    setAddPopupVisible(!addPopupVisible);
    if (!addPopupVisible) {
        setTimeout(() => {
            window.addEventListener("click", () => closePopup(setAddPopupVisible), {once: true});
        }, 100)
    }
};

const splitEntry = (string, letterOrder2, diacriticOrder2) => {
    let splitString = string.split("");
    let result = [];
    splitString.forEach((a, i) => {
        if (i === 0) {
            result.push(a);
        } else {
            let sequence = result.at(-1) + a;
            let matches = letterOrder2.some(a => a.some(b => b === sequence));
            if (matches) {
                result.splice(-1, 1, sequence);
            } else {
                result.push(a);
            };
        }
    });
    return result;
};


export const sortEntries = (entries, letterOrder, diacriticOrder=[]) => {
    let letterOrder2 = letterOrder.map(a => a.split("/"));
    let diacriticOrder2 = diacriticOrder.map(a => a.split("/"));
    // console.log(entryArray);
    // let result = entries.sort((a,b) => {

        // let arrayA = splitEntry(a);
        // let arrayB = splitEntry(b);
    // });
    // console.log(entries);
    entries.forEach(a => {
        a.segments = splitEntry(a.sortTerm || a.content, letterOrder2, diacriticOrder2);
        a.values = a.segments.map(segment => letterOrder2.findIndex(a => a.some(b => b === segment)));
        // return {segments, values};
    });
    let sortedEntries = entries.sort((a, b) => {
        const comesBefore = (c, d) => {
            if (c[1] === 26) {
                // console.log(c, d);
            }
            for (let i = 0; i < c.length; i++) {
                // console.log("i: " + i, c[i], d[i])
                if (c[1] === 26) {
                    // console.log(c[i], d[i], c[i] > d[i]);
                }                    
                if (c[i] < d[i]) return true;
                if (c[i] > d[i]) return false;
                // if they are equal:
                // console.log(c[i], d[i]);
                if (!c[i+1] && !d[i+i]) {
                    console.log("they're equal")
                    continue;
                } else if (!c[i+1] && d[i+1]) {
                    return true;
                } else if (c[i+1] && !d[i+i]) {
                    return false;
                }
            }
        }
            // console.log(a.segments, b.segments);
        // console.log(b.values);
        // if (compare(a.values, b.values)) return 1;
        // if (a.values < b.values) return -1;
        // if (a.values === b.values) return 0;
        if (a.segments[1] === 26) {
            // console.log(comesBefore(a.values, b.values));
        }

        let result = (comesBefore(a.values, b.values)) ? -1 : 1;
        // console.log(result);
        return result;
    });
    // console.log(sortedEntries);
    return sortedEntries;
    // const collator = new Intl.Collator();          
    // return entries.sort((a, b) => {
    //     return collator.compare(a.sortTerm || a.content, b.sortTerm || b.content);
    //     }
    // );
};


export const getGramFormAbbrs = (gramFormSet, gramFormGroupDefs) => {
    let gramFormNames = gramFormSet.map(a => {
        let gramForm = gramFormGroupDefs.reduce((acc2, b) => {
            let result = b.gramForms.find(c => c.id === a);
            return result ? (acc2 += `${result.abbr}.`) : acc2;
        }, ""); 
        return gramForm;
    });
    let filteredGramFormNames = gramFormNames.filter(a => a);        
    return filteredGramFormNames.join(" ");
};