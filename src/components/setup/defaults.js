export const gramFormDefault = {
    name: "",
    abbr: "",
};

export const gramFormGroupDefault = {
    name: "",
    gramForms: [JSON.parse(JSON.stringify(gramFormDefault))]
};

export const gramClassDefault = {
    name: "",
    abbr: "",
    // enabled: true,
};

export const gramClassGroupDefault = {
    name: "",
    gramClasses: [JSON.parse(JSON.stringify(gramClassDefault))],
    multiChoice: false
};

export const partsOfSpeechDefsDefault = [
    {id: "1", name: "noun", abbr: "n"},
    {id: "2", name: "verb", abbr: "v"},
    {id: "3", name: "adjective", abbr: "a"},
    {id: "4", name: "adverb", abbr: "adv"},
    {id: "5", name: "preposition", abbr: "pre"},
    {id: "6", name: "interjection", abbr: "i"},
    {id: "7", name: "determiner", abbr: "d"},
    {id: "8", name: "pronoun", abbr: "pro"},
];

export const posDefault = {
    name: "",
    abbr: "",
};

export const groupDefault = {
    name: "",
    characters: [],
    bgColor: "#9ac0ff",
    textColor: "#000000",
};

export const paletteDefault = {
    display: true,
    groupSeparator: "none",
    name: "",
    color: "#3b345a",
    content: [JSON.parse(JSON.stringify(groupDefault))],
};