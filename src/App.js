import { Route, Routes } from "react-router-dom";
// import {capitalize} from './utils.js';
// import {languageData} from './languageSettings.js';
import Entry from "./components/entry/Entry.js";
import NavBar from "./components/NavBar.js";
import Setup from './components/setup/Setup';
import Dictionary from './components/Dictionary';
import About from './components/About';
import {useSetState} from 'react-use';

import {useState, useEffect, useCallback} from 'react';
import {API_BASE, clone, generateSenseGroup} from './utils.js';
import {entryDefault} from './defaults.js';
import {partsOfSpeechDefsDefault} from './components/setup/defaults.js';

const App = () => {

    const [state, setState] = useSetState({
        allEntries: [],
        entry: undefined,
        savedSetup: null,
        setup: {
            targetLanguageName: "",
            sourceLanguageName: "English",
            partsOfSpeechDefs: partsOfSpeechDefsDefault,
            showPronunciation: true,
            ipa: {
                showPalette: true,
                groupSeparator: "none",    
                content: [
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
                ]      
            },
            orthography: {
                showPalette: false,
                groupSeparator: "none",    
                content: []      
            },
            gramClassGroups: [
                {
                    name: "gender",
                    gramClasses: [
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
                    gramClasses: [
                        {
                            name: "singular-plural",
                            abbr: "sp",
                        },
                        {
                            name: "collective-singulative",
                            abbr: "cs",
                        },
                        {
                            name: "none",
                            abbr: "none",
                        },
                    ],
                },
                {
                    name: "transitivity",
                    gramClasses: [
                        {
                            name: "intransitive",
                            abbr: "i",
                        },
                        {
                            name: "transitive",
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
                    name: "definiteness",
                    gramForms: [
                        {
                            name: "indefinite",
                            abbr: "ind",
                        },
                        {
                            name: "definite",
                            abbr: "def",
                        },
                        ],
                },
            ],
        },
    });

    const defaultPos = state.setup.partsOfSpeechDefs[0].name;
    
    const initializeEntry = useCallback(() => {
        console.log("initializing");
        let newEntry = clone(entryDefault);
        newEntry.senseGroups.push(generateSenseGroup(defaultPos));
        newEntry.etymology = "";
        setState({entry: newEntry});
    }, [setState, defaultPos]);

    const fetchSetup = () => {   
        fetch(API_BASE + '/setup/getsetup')
        .then(res => res.json())
        .then(data => {
            // console.log(data);
            if (data) {
                setState({setup: data});
                setState({savedSetup: data});
            } else {
                setState({savedSetup: state.setup});
            }
        })
        .catch(err => console.error(`Error: ${err}`));
    }

    const loadData = useCallback(() => {
        fetchSetup();
    }, [fetchSetup]);

    useEffect(() => {
        loadData();
        initializeEntry();
    },[initializeEntry]);

    // const [todos, setTodos] = useState([]);
    // const [popupActive, setPopupActive] = useState(false);
    // const [newTodo, setNewTodo] = useState("");

    // useEffect(() => {
    //     getTest();
    // },[])

    const getTest = () => {
        fetch(API_BASE + "/test")
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.error(`Error: ${err}`));
    };

    const testSave = () => {
        fetch(API_BASE + "/addEntry")
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.error(`Error: ${err}`));
    };

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
            <Route exact path="/" element={<Entry state={state} setState={setState} testSave={testSave} />} />
            <Route exact path="/setup" element={<Setup appState={state} setAppState={setState} />} />
            <Route exact path="/dictionary" element={<Dictionary />} />
            <Route exact path="/about" element={<About />} />
            {/* <Route exact path="/entry" component={Home} /> */}
        </Routes><button onClick={loadData}>Test Test Test Test Test Test Test</button>
        </>
	);
}

export default App;