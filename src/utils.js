import {senseDefault, secondaryFormDetailsDefault} from './defaults.js';
import {secondaryFormTypes, allPartsOfSpeech} from './languageSettings.js';

export const getIndent = (prevIndentLevel = 0) => {
    const indentAmount = 2;
    return {marginLeft: (prevIndentLevel+1)*indentAmount + "rem"} ;
}

export const capitalize = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export const clone = a => JSON.parse(JSON.stringify(a));

export const generateSense = posName => {
    let newSense = clone(senseDefault);
    newSense.partsOfSpeech.push(generatePos(posName));
    return newSense;
}

export const getPosDef = posName => {
    if (posName) {
        return allPartsOfSpeech.find(a => a.name === posName );
    } else {
        return allPartsOfSpeech.find(a => a.default);
    }
};

export const getDefaultPosType = posDef => {
    return posDef.types.find(a => a.default);
};

export const getSecondaryFormValues = secondaryFormType => {
    let secondaryFormValues = secondaryFormTypes[secondaryFormType].forms;
    let typeForms = secondaryFormValues.map(a => {
        let item = clone(secondaryFormDetailsDefault);
        item.typeForm = a;
        return item;
    });
    return typeForms; 
};

export const getBasicForm = pos => {
    let posDef = allPartsOfSpeech.find(a => a.name===pos.name);
    let typeDef = posDef.types.find(a => a.name===pos.types[0]);
    let secondaryFormType = typeDef.secondaryFormType;
    return secondaryFormTypes[secondaryFormType].basic
}

export const getTypeDef = (posName, typeName) =>  {
    let posDef = getPosDef(posName);
    return posDef.types.find(a => a.name === typeName);
}

export const getAllTypes = pos => {
    let posDef = allPartsOfSpeech.find(a => a.name === pos);
    return posDef.types;
}

export const setSecondary = (posObj, type) => {
    let multiChoice = getPosDef(posObj.name).multiChoice;
    if (posObj.types) {
        let matches = posObj.types[0] === type.name;
        if (matches && posObj.types.length === 1) {
            return posObj;
        }
    } else {
        posObj.types = [];
        posObj.typeForms = [];    
    }
    // posObj.types = posObj.types ?? [];
    // posObj.typeForms = posObj.typeForms ?? [];
    if (type) {
        if (multiChoice) {
            let typeIndex = posObj.types.findIndex(a => a===type.name);
            if (typeIndex >= 0) {
                posObj.types.splice(typeIndex,1);
            } else {
                posObj.types.push(type.name)
            }
        } else {
            posObj.types = [type.name];
        }
        if (type.secondaryFormType) {
            // posObj.basic = getBasicSecondary(type.secondaryFormType);
            posObj.typeForms = getSecondaryFormValues(type.secondaryFormType);
        } else {
            // delete posObj.basic;
            posObj.typeForms = [];    
        }
    }
    return clone(posObj);
}



export const generatePos = posName => {
    let posDef = getPosDef(posName);
    let defaultType = getDefaultPosType(posDef);        
    let obj = {
        name: posDef.name,
    }
    return setSecondary(obj,defaultType);
}



export const handleBlur = e => {
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
    let {value} = e.target;

    let selectionStart = inputNode.selectionStart ?? value.length
    let selectionEnd = inputNode.selectionEnd ?? value.length;

    const newValue = value.substring(0, selectionStart) + clickedItem.textContent + value.substring(selectionEnd);
    return newValue;
}