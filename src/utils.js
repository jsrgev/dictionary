import {senseDefault, secondaryFormDetailsDefault} from './defaults.js';
import {secondaryFormTypes, allPartsOfSpeech} from './languageSettings.js';

export const capitalize = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export const clone = a => JSON.parse(JSON.stringify(a));

export const generateSense = () => {
    let newSense = clone(senseDefault);
    newSense.partsOfSpeech.push(generatePos());
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
    return posDef.types.find(a => a.default) || {name: ""};
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

export const getBasicSecondary = secondaryFormType => {
    return secondaryFormTypes[secondaryFormType].basic;
}

export const getTypes = pos => {
    let posDef = allPartsOfSpeech.find(a => a.name === pos);
    return posDef.types;
}

export const setSecondary = (obj, type) => {
    obj.type = type.name;
    obj.typeForms = [];
    if (type.secondaryFormType) {
        obj.basic = getBasicSecondary(type.secondaryFormType);
        obj.typeForms = getSecondaryFormValues(type.secondaryFormType);
    }
    return clone(obj);
}

export const generatePos = (posName) => {
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
    return(newValue);
    // handleChange(newValue, "pronunciation");
}