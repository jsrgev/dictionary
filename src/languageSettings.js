export const languageData = {
    languageName: "language",
}

export const ipa = {
    consonant: ["p","b","t","k","m","n","ɸ","θ","ð","s","ɬ","ʃ","χ","w","l","j","w","ɾ"],
    vowel: ["i","u","o","ə̥","ɛ","ɔ","a"],
    "risingDiphthong": ["o̯͡ɛ", "o̯͡a", "o̯͡ɔ"],
    "fallingDiphthong": ["i͡ə̯", "ə͡a̯", "a͡ɪ̯", "a͡ə̯", "u͡a̯", "u͡o̯"],
    other: ["ˈ","ˌ","."],
}

export const typeFormAbbrs = {
    singular: "sg",
    plural: "pl",
    collective: "col",
    singulative: "sv",
    definite: "def",
}

export const secondaryFormTypes = {
    "singularPlural": {forms: [ "singular","plural"], basic: "singular"},
    "collectiveSingulative": {forms: ["collective","singulative"], basic: "collective"},
    "singularPluralNoun": {forms: ["singular","singular definite","plural","plural definite"], basic: "singular"},
    "collectiveSingulativeNoun": {forms: ["collective","collective definite","singulative","singulative definite"], basic: "collective"},
};

export const partsOfSpeechDefs = [
    {name: "adjective", abbr: "a", multiChoice: false, types: [
        {name: "general", abbr: "gen", unmarked: true},
        {name: "singular-plural", abbr: "sp", secondaryFormType: "singularPlural"},
    ]},
    {name: "adverb", abbr: "adv", multiChoice: false, types: [
        {name: "general", abbr: "gen", unmarked: true},     
        {name: "singular-plural", abbr: "sp", secondaryFormType: "singularPlural"},
    ]},
    {name: "determiner", abbr: "d", multiChoice: false, types: [
        {name: "general", abbr: "gen", unmarked: true},
        {name: "singular-plural", abbr: "sp", secondaryFormType: "singularPlural"},
    ]},
    {name: "interjection", abbr: "i", multiChoice: false, types: [
        {name: "general", abbr: "gen", unmarked: true},
        {name: "singular-plural", abbr: "sp", secondaryFormType: "singularPlural"},
    ]},
    {name: "noun", abbr: "n", multiChoice: false, types: [
        {name: "singular-plural", abbr: "sp", secondaryFormType: "singularPluralNoun", unmarked: true},
        {name: "collective-singulative", abbr: "cs", secondaryFormType: "collectiveSingulativeNoun"},
    ]},
    {name: "number", abbr: "num", multiChoice: false, types: []},
    {name: "preposition", abbr: "pre", multiChoice: false, types: []},
    {name: "verb", abbr: "v", multiChoice: true, types: [
        {name: "ablative", abbr: "ab"},
        {name: "allative", abbr: "al"},
        {name: "intransitive", abbr: "i"},
        {name: "locative", abbr: "l"},
        {name: "perlative", abbr: "p"},
        {name: "sentential", abbr: "s"},
        {name: "transitive", abbr: "t"},
        {name: "verbal", abbr: "v"},
    ]},
    {name: "pronoun", abbr: "pro", multiChoice: false, types: []},
];