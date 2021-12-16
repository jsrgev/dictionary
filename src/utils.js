import {senseGroupDefault, gramFormDefault} from './defaults.js';
// import {gramFormSets, partsOfSpeechDefs} from './languageSettings.js';


export const API_BASE = "http://localhost:3001/dictionary";
// export const API_BASE = "http://jsrgev.net/dictionary"


export const getIndent = (prevIndentLevel = 0) => {
    const indentAmount = 2;
    return {marginLeft: (prevIndentLevel+1)*indentAmount + "rem"} ;
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

// export const setGramForms = (posObj, gramClassDef, gramFormGroups) => {
//     if (posObj.gramClasses) {
//         let matches = posObj.gramClasses[0] === gramClassDef.name;
//         if (matches && posObj.gramClasses.length === 1) {
//             return posObj;
//         }
//     } else {
//         posObj.gramClasses = [];
//         posObj.paradigmForms = [];    
//     }
//     if (gramClassDef) {
//         let isMultiChoice = getPosDef(posObj.name).multiChoice;
//         if (isMultiChoice) {
//             let classIndex = posObj.gramClasses.findIndex(a => a===gramClassDef.name);
//             if (classIndex >= 0) {
//                 posObj.gramClasses.splice(classIndex,1);
//             } else {
//                 posObj.gramClasses.push(gramClassDef.name)
//             }
//         } else {
//             posObj.gramClasses = [gramClassDef.name];
//         }
//         posObj.paradigmForms = gramClassDef.gramFormSet ? getGramForms(gramClassDef.gramFormSet, gramFormGroups) : [];
//     }
//     return posObj;
// };

// const getGramClasses = (gramClassGroupId, gramClassGroups) => {
//     let thisGroupsGramClasses = gramClassGroups.find(a => a.id === gramClassGroupId );
//     let posDef = appState.savedSetup.partsOfSpeechDefs.find(a => a.id === path[thisIndex].refId);
//     // get classes that aren't allowed for this POS
//     let excluded = posDef.gramClassGroups.find(a => a.refId === gramClassGroupId).excluded || [];
//     // filter out classes that aren't allowed for this POS
//     let included = thisGroupsGramClasses.gramClasses.filter(a => {
//         return !excluded.some(b => b === a.id);
//     })
//     return included;
// };

export const getGramClasses = (posId, gramClassGroupId, partsOfSpeechDefs, gramClassGroups) => {
    let posDef = getPosDef(posId, partsOfSpeechDefs);
    // console.log(posDef.gramClassGroups);
    // console.log(gramClassGroupId);
    // console.log(posDef.gramClassGroups.find(a => a.refId === gramClassGroupId));
    // console.log(posDef.gramClassGroups.find(a => a.refId === gramClassGroupId) || []);
    let excluded = posDef.gramClassGroups.find(a => a.refId === gramClassGroupId).excluded || [];


    // get classes that aren't allowed for this POS:
    // this POS's gramClassGroups:
    // let thisGramClassGroups = posDef.gramClassGroups.find(a => {
    //     console.log(a);
    //     console.log(a.refId)
    //     console.log(gramClassGroupId)
    //     console.log(a.refId === gramClassGroupId);
    //     return a.refId === gramClassGroupId
    // });
    // console.log(thisGramClassGroups);

    // filter out classes that aren't allowed for this POS
    // let excluded = thisGramClassGroups.excluded || []

    // let excluded = posDef.gramClassGroups.find(a => {
    //     console.log(a.refId)
    //     console.log(gramClassGroupId)
    //     console.log(a.refId === gramClassGroupId);
    //     return a.refId === gramClassGroupId
    // }).excluded || [];
    // console.log(gramClassGroups.find(a => a.id === gramClassGroupId));
    // console.log(gramClassGroups.filter(a => a.id === gramClassGroupId));

    let thisGroupsGramClasses = gramClassGroups.find(a => a.id === gramClassGroupId);
    let gramClasses = thisGroupsGramClasses.gramClasses.filter(a => {
        return !excluded.some(b => b === a.id);
    });
    return gramClasses;
};

export const getGramClassGroup = (posId, partsOfSpeechDefs) => {
    let posDef = getPosDef(posId, partsOfSpeechDefs);
    let defaultGramClassGroupId = posDef.gramClassGroups?.[0].refId;
    // console.log(posDef.gramClassGroups);
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
                    gramClasses: [{refId: gramClasses[0].id}]
                }
            );            
        })
    };
    return obj;
};

export const handleInputBlur = e => {
    let hoverItems = document.querySelectorAll( ":hover" );
    let clickedItem = hoverItems[hoverItems.length-1];
    if (clickedItem === undefined || !clickedItem.closest("#ipa")) {
        return;
    };
    e.target.focus();
    if (clickedItem.tagName !== "SPAN") {
        return;
    }
    let inputNode = e.target;
    let {value} = inputNode;

    let selectionStart = inputNode.selectionStart ?? value.length;
    let selectionEnd = inputNode.selectionEnd ?? value.length;

    const newValue = value.substring(0, selectionStart) + clickedItem.textContent + value.substring(selectionEnd);
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

export const sortEntries = entries => {
    return entries.sort((a,b) => {
        return ( a.content < b.content ) ? -1 : ( a.content > b.content ) ? 1 : 0;
      }
    );
};