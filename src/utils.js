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

export const generateSenseGroup = (posId, partsOfSpeechDefs) => {
    let newSenseGroup = clone(senseGroupDefault);
    newSenseGroup.partsOfSpeech.push(generatePos(posId, partsOfSpeechDefs));
    return newSenseGroup;
};

export const getPosDef = (posId, partsOfSpeechDefs) => {
    // console.log(posId);
    // console.log(partsOfSpeechDefs);
    return partsOfSpeechDefs.find(a => a.id === posId);
};

export const getGramForms = (gramFormSet, gramFormSets) => {
    console.log(gramFormSet);
    let gramForms = gramFormSets[gramFormSet].gramForms;
    let paradigmForms = gramForms.map(a => {
        let item = clone(gramFormDefault);
        item.gramForm = a;
        return item;
    });
    return paradigmForms; 
};

// export const getBasicForm = (pos, partsOfSpeechDefs) => {
//     let posDef = partsOfSpeechDefs.find(a => a.name===pos.name);
//     let gramClassDef = posDef.gramClasses.find(a => a.name===pos.gramClasses[0]);
//     let gramFormSet = gramClassDef.gramFormSet;
//     return gramFormSets[gramFormSet].basic
// };

export const getGramClassDef = (posName, className, partsOfSpeechDefs) =>  {
    let posDef = getPosDef(posName, partsOfSpeechDefs);
    return posDef.gramClasses.find(a => a.name === className);
};

export const getAllGramClassGroups = (posId, partsOfSpeechDefs) => {
    // console.log(posId);
    // console.log(partsOfSpeechDefs);
    let posDef = partsOfSpeechDefs.find(a => a.id === posId);
    // console.log(posDef)
    return posDef.gramClassGroups;
};

export const setGramForms = (posObj, gramClassDef, gramFormGroups) => {
    // console.log(gramClassDef)
    if (posObj.gramClasses) {
        let matches = posObj.gramClasses[0] === gramClassDef.name;
        if (matches && posObj.gramClasses.length === 1) {
            return posObj;
        }
    } else {
        posObj.gramClasses = [];
        posObj.paradigmForms = [];    
    }
    if (gramClassDef) {
        let isMultiChoice = getPosDef(posObj.name).multiChoice;
        if (isMultiChoice) {
            let classIndex = posObj.gramClasses.findIndex(a => a===gramClassDef.name);
            if (classIndex >= 0) {
                posObj.gramClasses.splice(classIndex,1);
            } else {
                posObj.gramClasses.push(gramClassDef.name)
            }
        } else {
            posObj.gramClasses = [gramClassDef.name];
        }
        posObj.paradigmForms = gramClassDef.gramFormSet ? getGramForms(gramClassDef.gramFormSet, gramFormGroups) : [];
    }
    return posObj;
};

export const generatePos = (posId, partsOfSpeechDefs) => {
    // console.log(posId);
    // console.log(partsOfSpeechDefs);
    let posDef = getPosDef(posId, partsOfSpeechDefs);
    // console.log(posDef)
    let obj = {
        refId: posDef.id,
    }
    // console.log(posDef.gramClassGroups[0]);
    if (posDef.gramClassGroups?.length > 0) {
        obj.gramClassGroups = [
            {
                refId: posDef.gramClassGroups[0].refId,
                // gramClassRefId: posDef.gramClassGroups[0].gramClasses[0].id
            }
        ];
    }
    // if (posDef.gramFormGroups.length > 0) {
    //     obj.gramFormGroups = [];
    // }
    // console.log(posDef);
    // let gramClassDef = posDef.gramClassGroups[0];
    // return setGramForms(obj, gramClassDef);
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