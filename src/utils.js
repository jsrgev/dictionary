import {senseDefault, secondaryFormDetailsDefault} from './defaults.js';
import {secondaryFormTypes, allPartsOfSpeech} from './languageSettings.js';

export const capitalize = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export const clone = a => JSON.parse(JSON.stringify(a));

export const generateSense = () => {
    let newSense = clone(senseDefault);
    newSense.partsOfSpeech.push(generatePos());
    // newSense.definition = clone(definitionDefault);
    return newSense;
}

export const generatePos = () => {
    let pos = getPosDef();
    let defaultType = getDefaultPosType(pos);        
    let obj = {
        name: pos.name,
        type: defaultType.name,
        typeForms: []
    }
    if (defaultType.secondaryFormType) {
        obj.basic = getBasicSecondary(defaultType.secondaryFormType);
        obj.typeForms = getSecondaryFormValues(defaultType.secondaryFormType);
    }
    return clone(obj);
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

export const getPosObj = posName => {
    let posDef = getPosDef(posName);
    let defaultType = getDefaultPosType(posDef);
    let obj = {
        name: posDef.name,
        type: defaultType.name,
        typeForms: []
    }
    if (defaultType.secondaryFormType) {
        obj.basic = getBasicSecondary(defaultType.secondaryFormType);
        obj.typeForms = getSecondaryFormValues(defaultType.secondaryFormType);
    }
    return obj;
};

export const getBasicSecondary = secondaryFormType => {
    return secondaryFormTypes[secondaryFormType].basic;
}

export const getTypes = pos => {
    let posDef = allPartsOfSpeech.find(a => a.name === pos);
    return posDef.types;
}
