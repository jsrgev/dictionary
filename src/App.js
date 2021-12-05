import { Route, Routes } from "react-router-dom";
// import {capitalize} from './utils.js';
// import {languageData} from './languageSettings.js';
import Entry from "./components/entry/Entry.js";
import NavBar from "./components/NavBar.js";
import Setup from './components/setup/Setup';
import Dictionary from './components/Dictionary';
import About from './components/About';
import {useSetState} from 'react-use';

import {useEffect, useCallback} from 'react';
import {clone, generateSenseGroup} from './utils.js';
import {entryDefault} from './defaults.js';


// const API_BASE = "http://localhost:3001";

const App = () => {

    const [state, setState] = useSetState({
        entry: undefined,
        setup: {
            languageName: "",
            partsOfSpeechDefs: [
                {name: "noun", abbr: "n", multichoice: false, gramClassSets: []},
                {name: "verb", abbr: "v", multichoice: false, gramClassSets: []},
                {name: "adjective", abbr: "a", multichoice: false, gramClassSets: []},
                {name: "adverb", abbr: "adv", multichoice: false, gramClassSets: []},
                {name: "preposition", abbr: "pre", multichoice: false, gramClassSets: []},
                {name: "interjection", abbr: "i", multichoice: false, gramClassSets: []},
                {name: "determiner", abbr: "d", multichoice: false, gramClassSets: []},
                {name: "pronoun", abbr: "pro", multichoice: false, gramClassSets: []},
            ],
            ipa: [
                {
                    group: "consonants",
                    characters: ["p","b","t","k","m","n","ɸ","θ","ð","s","ɬ","ʃ","χ","w","l","j","w","ɾ"],
                    bgColor: "#9ac0ff",
                    textColor: "#000000",
                },
                {
                    group: "vowel",
                    characters: ["i","u","o","ə̥","ɛ","ɔ","a"],
                    bgColor: "#ff7db5",
                    textColor: "#000000",
                },
                {
                    group: "rising diphthongs",
                    characters: ["o̯͡ɛ", "o̯͡a", "o̯͡ɔ"],
                    bgColor: "#ffbe0b",
                    textColor: "#000000",
                },
                {
                    group: "falling diphthongs",
                    characters: ["i͡ə̯", "ə͡a̯", "a͡ɪ̯", "a͡ə̯", "u͡a̯", "u͡o̯"],
                    bgColor: "#fda981",
                    textColor: "#000000",
                },
                {
                    group: "other",
                    characters: ["ˈ","ˌ","."],
                    bgColor: "#bf99f5",
                    textColor: "#000000",
                },      
            ],
            gramClasses: [
                
            ],
            gramClassSets: [
                {
                    name: "gender",
                    gramForms: [
                        {
                            name: "masculine",
                            abbr: "m",
                        },
                        {
                            name: "feminine",
                            abbr: "f",
                        },
                    ],
                },
                {
                    name: "number system",
                    gramForms: [
                        {
                            name: "singular-plural",
                            abbr: "sp",
                        },
                        {
                            name: "collective-singulative",
                            abbr: "cs",
                        },
                    ],
                },
                {
                    name: "transitivity",
                    gramForms: [
                        {
                            name: "intrasitive",
                            abbr: "i",
                        },
                        {
                            name: "trasitive",
                            abbr: "tr",
                        },
                    ],
                },
            ],
            gramFormGroups: [
                {
                    name: "number",
                    gramForms: [
                        {
                            name: "singular",
                            abbr: "sg",
                        },
                        {
                            name: "plural",
                            abbr: "pl",
                        },
                        {
                            name: "collective",
                            abbr: "col",
                        },
                        {
                            name: "singulative",
                            abbr: "sv",
                        },
                    ],
                },
                {
                    name: "case",
                    gramForms: [
                        {
                            name: "singular",
                            abbr: "sg",
                        },
                        {
                            name: "plural",
                            abbr: "pl",
                        },
                    ],
                },
            ],
            // gramFormAbbrs: [],
            showPronunciation: true,
            showIpaPalette: true,
            groupSeparator: "none",
            showOrthographyPalette: false,
        },
    });

    const initializeEntry = useCallback(() => {
        console.log("initializing");
        let newEntry = clone(entryDefault);
        newEntry.senseGroups.push(generateSenseGroup(state.setup.partsOfSpeechDefs[0].name));
        newEntry.etymology = "";
        setState({entry: newEntry});
    }, [setState]);
// }, [setState, state.setup.partsOfSpeechDefs]);

    useEffect(() => {
        initializeEntry();
    },[initializeEntry]);


    // const [todos, setTodos] = useState([]);
    // const [popupActive, setPopupActive] = useState(false);
    // const [newTodo, setNewTodo] = useState("");

    // useEffect(() => {
    //     GetTodos();
    //     console.log(todos);
    // },[])

    // const GetTodos = () => {
    //     fetch(API_BASE + "/todos")
    //     .then(res => res.json())
    //     .then(data => setTodos(data))
    //     .catch(err => console.error(`Error: ${err}`));
    // };

    // const completeTodo = async id => {
    //     const data = await fetch(API_BASE + "/todo/complete/" + id)
    //     .then(res => res.json());
    //     setTodos(todos => todos.map(todo => {
    //         if (todo._id === data._id) {
    //             todo.complete = data.complete;
    //         }
    //         return todo;
    //     }))
    // }

    // const deleteToDo = async id => {
    //     const data = await fetch(API_BASE + "/todo/delete/" + id, {method: "DELETE"})
    //     .then(res => res.json());
    //     setTodos(todos => todos.filter(todo => todo._id !== data._id));

    // }

    // const addTodo = async () => {
    //     const data = await fetch(API_BASE + "/todo/new", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify({
    //             text: newTodo
    //         })
    //     })
    //     .then(res => res.json());
    //     setTodos([...todos, data]);
    //     setPopupActive(false);
    //     setNewTodo("");
    // }


    
	return (
        <>
        <header>
            <NavBar />
        </header>
        <Routes>
            <Route exact path="/" element={<Entry state={state} setState={setState} />} />
            <Route exact path="/setup" element={<Setup appState={state} setAppState={setState} />} />
            <Route exact path="/dictionary" element={<Dictionary />} />
            <Route exact path="/about" element={<About />} />
            {/* <Route exact path="/entry" component={Home} /> */}
        </Routes>
        </>
	);
}

export default App;