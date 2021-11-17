export const languageData = {
    languageName: "melfem",
    creator: "josh regev",
    creatorEmail: ""
}

export const ipa = {
    consonant: ["p","b","t","k","m","n","ɸ","θ","ð","s","ɬ","ʃ","χ","w","l","j","w","ɾ"],
    vowel: ["i","u","o","ə̥","ɛ","ɔ","a"],
    "risingDiphthong": ["o̯͡ɛ", "o̯͡a", "o̯͡ɔ"],
    "fallingDiphthong": ["i͡ə̯", "ə͡a̯", "a͡ɪ̯", "a͡ə̯", "u͡a̯", "u͡o̯"],
    other: ["ˈ","ˌ","."],
}

export const secondaryFormTypes = {
    "singularPlural": {forms: [ "singular","plural"], basic: "singular"},
    "collectiveSingulative": {forms: ["collective","singulative"], basic: "collective"},
    "singularPluralNoun": {forms: ["singular","singular definite", "plural","plural definite"], basic: "singular"},
    "collectiveSingulativeNoun": {forms: ["collective","collective definite","singulative","singulative definite"], basic: "collective"},
};

export const allPartsOfSpeech = [
    {name: "adjective", abbr: "adj", types: [
        {name: "general", abbr: "gen"},
        {name: "singular-plural", abbr: "s-p", secondaryFormType: "singularPlural"},
    ]},
    {name: "adverb", abbr: "adv", types: [
        {name: "general", abbr: "gen"},
        {name: "singular-plural", abbr: "s-p", secondaryFormType: "singularPlural"},
    ]},
    {name: "determiner", abbr: "d", types: [
        {name: "general", abbr: "gen"},
        {name: "singular-plural", abbr: "s-p", secondaryFormType: "singularPlural"},
    ]},
    {name: "interjection", abbr: "i", types: [
        {name: "general", abbr: "gen"},
        {name: "singular-plural", abbr: "s-p", secondaryFormType: "singularPlural"},
    ]},
    {name: "noun", abbr: "n", types: [
        {name: "singular-plural", abbr: "s-p", secondaryFormType: "singularPluralNoun"},
        {name: "collective-singulative", abbr: "c-s", secondaryFormType: "collectiveSingulativeNoun"},
    ]},
    {name: "number", abbr: "num", types: []},
    {name: "preposition", abbr: "pre", types: []},
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
    {name: "pronoun", abbr: "pro", types: []},
];