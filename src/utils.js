import {senseGroupDefault, secondaryFormDetailsDefault} from './defaults.js';
import {secondaryFormTypes, allPartsOfSpeech} from './languageSettings.js';

export const getIndent = (prevIndentLevel = 0) => {
    const indentAmount = 2;
    return {marginLeft: (prevIndentLevel+1)*indentAmount + "rem"} ;
};

export const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1);

export const clone = a => JSON.parse(JSON.stringify(a));

export const generateSenseGroup = posName => {
    let newSenseGroup = clone(senseGroupDefault);
    newSenseGroup.partsOfSpeech.push(generatePos(posName));
    return newSenseGroup;
};

export const getPosDef = (posName = allPartsOfSpeech[0].name) => {
    return allPartsOfSpeech.find(a => a.name === posName);
};

export const getSecondaryFormValues = secondaryFormType => {
    let secondaryFormValues = secondaryFormTypes[secondaryFormType].forms;
    let paradigmForms = secondaryFormValues.map(a => {
        let item = clone(secondaryFormDetailsDefault);
        item.typeForm = a;
        return item;
    });
    return paradigmForms; 
};

export const getBasicForm = pos => {
    let posDef = allPartsOfSpeech.find(a => a.name===pos.name);
    let typeDef = posDef.types.find(a => a.name===pos.types[0]);
    let secondaryFormType = typeDef.secondaryFormType;
    return secondaryFormTypes[secondaryFormType].basic
};

export const getTypeDef = (posName, typeName) =>  {
    let posDef = getPosDef(posName);
    return posDef.types.find(a => a.name === typeName);
};

export const getAllTypes = pos => {
    let posDef = allPartsOfSpeech.find(a => a.name === pos);
    return posDef.types;
};

export const setSecondary = (posObj, typeDef) => {
    if (posObj.types) {
        let matches = posObj.types[0] === typeDef.name;
        if (matches && posObj.types.length === 1) {
            return posObj;
        }
    } else {
        posObj.types = [];
        posObj.paradigmForms = [];    
    }
    if (typeDef) {
        let isMultiChoice = getPosDef(posObj.name).multiChoice;
        if (isMultiChoice) {
            let typeIndex = posObj.types.findIndex(a => a===typeDef.name);
            if (typeIndex >= 0) {
                posObj.types.splice(typeIndex,1);
            } else {
                posObj.types.push(typeDef.name)
            }
        } else {
            posObj.types = [typeDef.name];
        }
        posObj.paradigmForms = typeDef.secondaryFormType ? getSecondaryFormValues(typeDef.secondaryFormType) : [];
    }
    return posObj;
};


export const generatePos = posName => {
    let posDef = getPosDef(posName);
    let obj = {
        name: posDef.name,
    }
    let typeDef = posDef.types[0];
    return setSecondary(obj, typeDef);
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