export const noteDefault = {
    type: "general",
    content: ""
};

export const definitionDefault = {
    content: "",
};

export const pronunciationDefault =  {
    content: "",
};

export const morphDefault = {
    content: "",
    pronunciations: [JSON.parse(JSON.stringify(pronunciationDefault))],
};

export const entryDefault = {
    headword: {
        morphs: [JSON.parse(JSON.stringify(morphDefault))],
    },
    senseGroups: [],
};

export const exampleDefault = {
    content: "",
    definitions: [JSON.parse(JSON.stringify(definitionDefault))],
};

export const phraseDefault = {
    content: "~",
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
};