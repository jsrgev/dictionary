export const noteDefault = {
    type: "general",
    content: ""
};

export const definitionDefault = {
    definition: "",
};

export const pronunciationDefault =  {
    pronunciation: "",
};

export const morphDefault = {
    targetLang: "",
    pronunciations: [JSON.parse(JSON.stringify(pronunciationDefault))],
};

export const entryDefault = {
    headword: {
        morphs: [JSON.parse(JSON.stringify(morphDefault))],
    },
    senseGroups: [],
};

export const exampleDefault = {
    targetLang: "",
    definitions: [JSON.parse(JSON.stringify(definitionDefault))],
};

export const phraseDefault = {
    targetLang: "",
    definitions: [JSON.parse(JSON.stringify(definitionDefault))],
};

export const senseGroupDefault = {
    partsOfSpeech: [],
    definitions: [JSON.parse(JSON.stringify(definitionDefault))],
};

export const secondaryFormDetailsDefault = {
    typeForm: "",
    exists: true,
    regular: true,
    morphs: [JSON.parse(JSON.stringify(morphDefault))],
    // targetLang: "",
    // pronunciations: [JSON.parse(JSON.stringify(pronunciationDefault))],
};