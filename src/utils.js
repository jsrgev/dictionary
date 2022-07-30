import {senseGroupDefault, gramFormDefault} from './defaults.js';
// import {gramFormSets, partsOfSpeechDefs} from './languageSettings.js';


export const API_BASE = "http://localhost:3001/dictionary";
// export const API_BASE = "http://jsrgev.net/dictionary"

export const getIndent = (prevIndent = 0) => {
    const indentAmount = 2;
    return {marginLeft: (prevIndent+1)*indentAmount + "rem"} ;
};

export const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1);

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
    // console.log(thisGroupsGramClasses);
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

const splitEntry = (string, letterOrder2) => {
    let splitString = string.normalize('NFD').split("");
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

const compareCapitals = (a, b) => {
    for (let i = 0; i < a.length; i++) {
        // console.log(a)
        // console.log(a.capitalValue)
        if (a[i].capitalValue < b[i].capitalValue) return true;
        if (a[i].capitalValue > b[i].capitalValue) return false;
    }
    return true;
};


const compareDiacritics = (a, b) => {
    // console.log("comparing")
    for (let i = 0; i < a.length; i++) {
        let aDiacritics = a[i].diacriticValues.sort();
        let bDiacritics = b[i].diacriticValues.sort();
        // letters with more diacritics always come after those with fewer:
        if (aDiacritics.length < bDiacritics.length) return true;
        if (aDiacritics.length > bDiacritics.length) return false;
        // if same number of diacritics:
        if (aDiacritics.length === 0) continue;
        for (let j = 0; j < aDiacritics.length; j++) {
            if (aDiacritics[j] < bDiacritics[j]) return true;
            if (aDiacritics[j] > bDiacritics[j]) return false;
        }
    }
    // console.log(a, b);
    // if items are still identical, check for capital/final/etc. letter forms
    return compareCapitals(a, b);
};

const comesBefore = (a, b) => {
    for (let i = 0; i < a.length; i++) {
        if (a[i].letterValue < b[i].letterValue) return true;
        if (a[i].letterValue > b[i].letterValue) return false;
        // if they are equal:
        // console.log("equal")
        if (!a[i+1] && b[i+1]) return true; // if second word is longer
        if (a[i+1] && !b[i+1]) return false; // if first word is longer
        // console.log(i);
        // console.log (!a[i+1], !b[i+1]);
        if (!a[i+1] && !b[i+1]) return compareDiacritics(a, b); // if same length, check diacritics
    }
};

const collatorSort = entries => {
    const collator = new Intl.Collator();          
    return entries.sort((a, b) => {
        return collator.compare(a.sortTerm || a.content, b.sortTerm || b.content);
        }
    );
};   

export const sortEntries = (entries, letterOrder, diacriticOrder) => {
    // console.log(entries)
    if (letterOrder.length === 0) return collatorSort(entries);
    let letterOrder2 = letterOrder.map(a => a.split("/"));
    let diacriticOrder2 = diacriticOrder.map(a => {
        let normalized = a.normalize('NFD').split("");
        return normalized[1];
    });
    entries.forEach(a => {
        // console.log(a);
        a.segments = splitEntry(a.sortTerm || a.content, letterOrder2);
        a.values = [];
        a.segments.forEach(segment => {
            let value = letterOrder2.findIndex(a => a.some(b => b === segment));
            if (value > -1) {
                a.values.push(
                    {
                        letterValue: value,
                        capitalValue: letterOrder2[value].findIndex(a => a === segment),
                        diacriticValues: []
                    });
                    // console.log(a.values)
            } else {
                value = diacriticOrder2.findIndex(a => a === segment);
                // in case a diacritic is entered with no letter before it
                if (a.values.length === 0) {
                    a.values.push(
                        {
                            letterValue: -1,
                            capitalValue: 0,
                            diacriticValues: []
                        });
                } 
                a.values.at(-1).diacriticValues.push(value);
            }
        }) 
    });
    let sortedEntries = entries.sort((a, b) => {
        let result = (comesBefore(a.values, b.values)) ? -1 : 1;
        return result;
    });
    return sortedEntries;
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