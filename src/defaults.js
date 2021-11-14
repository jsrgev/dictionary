export const entryDefault = {
    senses: [],
};

export const exampleDefault = {
    targetLang: "",
    meaning: ""
};

export const phraseDefault = {
    targetLang: "",
    meaning: ""
};

export const senseDefault = {
    partsOfSpeech: [],
    definition: "",
    note: "",
    examples: [JSON.parse(JSON.stringify(exampleDefault))],
    phrases: [JSON.parse(JSON.stringify(phraseDefault))]
};

export const pronunciationDefault =  {
    pronunciation: "",
    note: ""
};

export const orthForm = {
    targetLang: "",
    pronunciations: [JSON.parse(JSON.stringify(pronunciationDefault))],
}

export const secondaryFormDetailsDefault = {
    typeForm: "",
    exists: true,
    regular: true,
    forms: [JSON.parse(JSON.stringify(orthForm))],
    // targetLang: "",
    // pronunciations: [JSON.parse(JSON.stringify(pronunciationDefault))],
};