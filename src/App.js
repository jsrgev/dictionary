import { Route, Routes} from "react-router-dom";
// import {capitalize} from './utils.js';
// import {languageData} from './languageSettings.js';
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
        savedSetup: null,
        setup: {
            targetLanguageName: "Melfem",
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
                    id: "9",
                    name: "gender",
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
                    gramClasses: [
                        {
                            id: "13",
                            name: "singular-plural",
                            abbr: "sp",
                        },
                        {
                            id: "14",
                            name: "collective-singulative",
                            abbr: "cs",
                        },
                        {
                            id: "15",
                            name: "none",
                            abbr: "none",
                        },
                    ],
                },
                {
                    id: "16",
                    name: "transitivity",
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
            nextId: 101,
        },
    });

    const fetchEntries = () => {
        console.log("fetching entries");
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
        console.log("fetching setup");
        fetch(API_BASE + '/setup/get')
        .then(res => res.json())
        .then(data => {
            // there will be data if previous setup has been saved already
            if (data) {
                setState({setup: data, savedSetup: data});
            } else {
                setState({savedSetup: state.setup});
            }
        })
        .catch(err => console.error(`Error: ${err}`));

    };

    // console.log(state.entries)

    useEffect(() => {
        fetchSetup();
        fetchEntries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);


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

;

    
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