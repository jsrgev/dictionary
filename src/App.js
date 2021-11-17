// import {useEffect, useState, useRef} from 'react';
import Primary from './components/Primary';
import SenseGroup from './components/SenseGroup';
import Etymology from './components/Etymology';
import Preview from './components/Preview';
import Ipa from './components/Ipa';
import {useEffect, useCallback} from 'react';
import {useSetState} from 'react-use';
import {capitalize, generateSenseGroup, clone} from './utils.js';
import {languageData} from './languageSettings.js';
import {entryDefault, orthForm} from './defaults.js';


// const API_BASE = "http://localhost:3001";

// const Details = () => {
// };

const App = () => {
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

    const [state, setState] = useSetState({
        entry: undefined
    });

    const initializeEntry = useCallback(() => {
        let newEntry = clone(entryDefault);
        newEntry.primary = [clone(orthForm)];
        newEntry.senseGroups.push(generateSenseGroup());
        // console.log(newEntry.senseGroups)
        newEntry.etymology = "";
        setState({entry: newEntry});
    }, [setState])

    useEffect(() => {
        initializeEntry();
    },[initializeEntry])

    const handleKeyDown = e => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    }

	return (
        <>
        <header>
            <h1><a href="../">Josh Regev</a></h1>
            <h1>{`${capitalize(languageData.languageName)}-English Dictionary Entry`}</h1>
        </header>
        <main>
            <div>
                <form id="entryForm" onKeyDown={handleKeyDown}>
                <Primary appState={state} setAppState={setState} />
                {state.entry &&
                    state.entry.senseGroups.map((a,i) => (
                        <SenseGroup appState={state} setAppState={setState} key={i} senseGroupIndex={i} />
                    ))
                }
                <Etymology />
                {state.entry &&
                    <Preview appState={state} setAppState={setState} />
                }
                <fieldset id="submit">
                    <input id="submitInput" type="submit" value="Save to Dictionary" />
                </fieldset>
                </form>
            </div>
        </main>
        <Ipa />
        </>
	);
}

export default App;