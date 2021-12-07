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
    gramClasses: [JSON.parse(JSON.stringify(gramClassDefault))]
};

export const partsOfSpeechDefsDefault = [
    {name: "noun", abbr: "n", multichoice: false, gramClassGroups: [], gramFormGroups: []},
    {name: "verb", abbr: "v", multichoice: false, gramClassGroups: [], gramFormGroups: []},
    {name: "adjective", abbr: "a", multichoice: false, gramClassGroups: [], gramFormGroups: []},
    {name: "adverb", abbr: "adv", multichoice: false, gramClassGroups: [], gramFormGroups: []},
    {name: "preposition", abbr: "pre", multichoice: false, gramClassGroups: [], gramFormGroups: []},
    {name: "interjection", abbr: "i", multichoice: false, gramClassGroups: [], gramFormGroups: []},
    {name: "determiner", abbr: "d", multichoice: false, gramClassGroups: [], gramFormGroups: []},
    {name: "pronoun", abbr: "pro", multichoice: false, gramClassGroups: [], gramFormGroups: []},
];