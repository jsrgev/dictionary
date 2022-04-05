import { Route, Routes} from "react-router-dom";
import Entry from "./components/entry/Entry.js";
import NavBar from "./components/NavBar.js";
import Setup from './components/setup/Setup';
import Dictionary from './components/Dictionary';
import About from './components/About';
import {useSetState} from 'react-use';

import {useEffect} from 'react';
import {API_BASE} from './utils.js';
import {partsOfSpeechDefsDefault} from './components/setup/defaults.js';

const App = () => {

    const [state, setState] = useSetState({
        allEntries: [],
        entry: null,
        entryCopy: null,
        setup: null,
        tempSetup: {
            nextId: 101,
            targetLanguageName: "Melfem",
            sourceLanguageName: "English",
            partsOfSpeechDefs: partsOfSpeechDefsDefault,
            showPronunciation: true,
            palettes: [
                {
                    name: "IPA",
                    color: "#3b345a",
                    display: true,
                    groupSeparator: "none",    
                    content: [
                        {
                            name: "consonants",
                            characters: ["p","b","t","k","m","n","ɸ","θ","ð","s","ɬ","ʃ","χ","w","l","j","w","ɾ"],
                            bgColor: "#9ac0ff",
                            textColor: "#000000",
                        },
                        {
                            name: "vowel",
                            characters: ["i","u","o","ə̥","ɛ","ɔ","a"],
                            bgColor: "#ff7db5",
                            textColor: "#000000",
                        },
                        {
                            name: "rising diphthongs",
                            characters: ["o̯͡ɛ", "o̯͡a", "o̯͡ɔ"],
                            bgColor: "#ffbe0b",
                            textColor: "#000000",
                        },
                        {
                            name: "falling diphthongs",
                            characters: ["i͡ə̯", "ə͡a̯", "a͡ɪ̯", "a͡ə̯", "u͡a̯", "u͡o̯"],
                            bgColor: "#fda981",
                            textColor: "#000000",
                        },
                        {
                            name: "other",
                            characters: ["ˈ","ˌ","."],
                            bgColor: "#bf99f5",
                            textColor: "#000000",
                        },
                    ]      
                },
            ],
            scripts: [
                {
                    id: "33",
                    name: "Roman",
                    abbr: "Rom",
                    letterOrder: ['A/a', 'B/b', 'C/c', 'D/d', 'E/e', 'F/f', 'G/g', 'H/h', 'I/i', 'J/j', 'K/k', 'L/l', 'M/m', 'N/n', 'O/o', 'P/p', 'Q/q', 'R/r', 'S/s', 'T/t', 'U/u', 'V/v', 'W/w', 'X/x', 'Y/y', 'Z/z'],
                    diacriticOrder: []
                }
            ],
            gramClassGroups: [
                {
                    id: "9",
                    name: "gender",
                    multiChoice: false,
                    gramClasses: [
                        {
                            id: "10",
                            name: "masculine",
                            abbr: "m",
                        },
                        {
                            id: "11",
                            name: "feminine",
                            abbr: "f",
                        },
                    ],
                },
                {
                    id: "12",
                    name: "number system",
                    multiChoice: false,
                    gramClasses: [
                        {
                            id: "13",
                            name: "none",
                            abbr: "none",
                        },
                        {
                            id: "14",
                            name: "singular-plural",
                            abbr: "sp",
                        },
                        {
                            id: "15",
                            name: "collective-singulative",
                            abbr: "cs",
                        },
                    ],
                },
                {
                    id: "16",
                    name: "transitivity",
                    multiChoice: true,
                    gramClasses: [
                        {
                            id: "17",
                            name: "intransitive",
                            abbr: "i",
                        },
                        {
                            id: "18",
                            name: "transitive",
                            abbr: "tr",
                        },
                    ],
                },
            ],
            gramFormGroups: [
                {
                    id: "19",
                    name: "number",
                    gramForms: [
                        {
                            id: "20",
                            name: "singular",
                            abbr: "sg",
                        },
                        {
                            id: "21",
                            name: "plural",
                            abbr: "pl",
                        },
                        {
                            id: "22",
                            name: "collective",
                            abbr: "col",
                        },
                        {
                            id: "23",
                            name: "singulative",
                            abbr: "sv",
                        },
                    ],
                },
                {
                    id: "24",
                    name: "definiteness",
                    gramForms: [
                        {
                            id: "25",
                            name: "indefinite",
                            abbr: "ind",
                        },
                        {
                            id: "26",
                            name: "definite",
                            abbr: "def",
                        },
                        ],
                },
            ],
            etymologyAbbrs: [
                {id: "27", abbr: "ext", name: "extended form of"},
                {id: "28", abbr: "obs", name: "obsolete"},
                {id: "29", abbr: "old", name: "older form"},
                {id: "30", abbr: "pos", name: "possibly"},
                {id: "31", abbr: "rel", name: "related to"},
                {id: "32", abbr: "tr", name: "truncation"},
            ],
        },
        etymologyTags: [
            {
                id: "1",
                name: "foreign word",
                displayOpen: "[foreign]",
                displayClose: "[/foreign]",
                getCode: string => <span className="for">{string}</span>,
            },
            {
                id: "2",
                name: "stem",
                displayOpen: "[stem]",
                displayClose: "[/stem]",
                getCode: string => <span className="for">{string}</span>,
            },
            {
                id: "3",
                name: "prefix",
                displayOpen: "[prefix]",
                displayClose: "[/prefix]",
                getCode: string => <><span className="for">{string}</span>-</>,
            },
            {
                id: "4",
                name: "suffix",
                displayOpen: "[suffix]",
                displayClose: "[/suffix]",
                getCode: string => <>-<span className="for">{string}</span></>,
            },
            {
                id: "5",
                name: "infix",
                displayOpen: "[infix]",
                displayClose: "[/infix]",
                getCode: string => <>-<span className="for">{string}</span>-</>,
            },
            {
                id: "6",
                name: "gloss",
                displayOpen: "[gloss]",
                displayClose: "[/gloss]",
                getCode: string => <>‘{string}’</>,
            }
        ]
    });

    const fetchEntries = () => {
        // console.log("fetching entries");
        fetch(API_BASE + '/entry/getall')
        .then(res => res.json())
        .then(data => {
            if (data) {
                setState({allEntries: data});
            }
        })
        .catch(err => console.error(`Error: ${err}`));
    };

    const fetchSetup = () => {
        // console.log("fetching setup");
        fetch(API_BASE + '/setup/get')
        .then(res => res.json())
        .then(data => {
            // there will be data if previous setup has been saved already
            if (data) {
                setState({setup: data, tempSetup: data});
            } else {
                setState({setup: state.tempSetup});
            }
        })
        .catch(err => console.error(`Error: ${err}`));

    };

    useEffect(() => {
        fetchSetup();
        fetchEntries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);
    
	return (
        <>
        <header>
            <NavBar />
        </header>
        <Routes>
            <Route exact path="/" element={<Entry state={state} setState={setState} />} />
            <Route exact path="/setup" element={<Setup state={state} setState={setState} />} />
            <Route exact path="/dictionary" element={<Dictionary state={state} />} />
            <Route exact path="/about" element={<About />} />
            {/* <Route exact path="/entry" component={Home} /> */}
        </Routes>
        </>
	);
}

export default App;