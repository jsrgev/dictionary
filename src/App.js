import { Route, Routes } from "react-router-dom";
// import {capitalize} from './utils.js';
// import {languageData} from './languageSettings.js';
import Entry from "./components/Entry.js";
import NavBar from "./components/NavBar.js";
import Setup from './components/Setup';
import {useSetState} from 'react-use';

// const API_BASE = "http://localhost:3001";

// const Details = () => {
// };

const App = () => {

    const [state, setState] = useSetState({
        setup: {
            languageName: "",
            partsOfSpeechDefs: [
                {name: "adjective", abbr: "a", multichoice: false, types: []},
                {name: "adverb", abbr: "adv", multichoice: false, types: []},
                {name: "determiner", abbr: "d", multichoice: false, types: []},
                {name: "interjection", abbr: "i", multichoice: false, types: []},
                {name: "noun", abbr: "n", multichoice: false, types: []},
                {name: "preposition", abbr: "pre", multichoice: false, types: []},
                {name: "verb", abbr: "v", multichoice: false, types: []},
                {name: "pronoun", abbr: "pro", multichoice: false, types: []},
            ],
            ipa: [
                {
                    group: "consonants",
                    characters: "",
                    color: "#9ac0ff",
                },
                {
                    group: "vowel",
                    characters: "",
                    color: "#ff7db5",
                },
                {
                    group: "rising diphthongs",
                    characters: "",
                    color: "#ffbe0b",
                },
                {
                    group: "falling diphthongs",
                    characters: "",
                    color: "#fda981",
                },
                {
                    group: "other",
                    characters: "ˈ ˌ ː",
                    color: "#bf99f5",
                },
            ],
            secondaryFormTypes: [],
            typeFormAbbrs: [],
            showPronunciation: true,
            showIpaPalette: true,
            showOrthographyPalette: false,
        },
    });

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
            <Route exact path="/" element={<Entry />} />
            <Route exact path="/setup" element={<Setup appState={state} setAppState={setState} />} />
            {/* <Route exact path="/entry" component={Home} /> */}
        </Routes>
        </>
	);
}

export default App;