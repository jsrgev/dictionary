// import {useEffect, useState, useRef} from 'react';
import Headword from './components/Headword';
import SenseGroup from './components/SenseGroup';
import Etymology from './components/Etymology';
import Preview from './components/Preview';
import Ipa from './components/Ipa';
import {useEffect, useCallback} from 'react';
import {useSetState} from 'react-use';
import {capitalize, generateSenseGroup, clone} from './utils.js';
import {languageData} from './languageSettings.js';
import {entryDefault, morphDefault, definitionDefault, phraseDefault, noteDefault} from './defaults.js';
import _  from 'lodash';

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
        // newEntry.headword = [clone(headwordDefault)];
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

    const addFunctions = {
        addMorph: (index, pathFrag) => {
            console.log(pathFrag)
            let entryCopy = clone(state.entry);
            let entryCopyPath = _.get(entryCopy, pathFrag)
            entryCopyPath.splice(index+1, 0, clone(morphDefault));
            setState({entry: entryCopy});
        },
        addDefinition: (index, pathFrag) => {
            let entryCopy = clone(state.entry);
            let entryCopyPath = _.get(entryCopy, pathFrag)
            // console.log(index)
            // console.log(pathFrag)
            // console.log(entryCopyPath)
            // return;
            if (entryCopyPath.definitions) {
                entryCopyPath.definitions.splice(index+1, 0, clone(definitionDefault));
            } else {
                entryCopyPath.definitions = [clone(definitionDefault)];
            }
            // console.log(entryCopy);
            setState({entry: entryCopy});
            // console.log(state.entry);
        },
        addPhrase: (index, pathFrag) => {
            let entryCopy = clone(state.entry);
            let entryCopyPath = _.get(entryCopy, pathFrag)
            if (entryCopyPath.phrases) {
                entryCopyPath.phrases.splice(index+1, 0, clone(phraseDefault));
            } else {
                entryCopyPath.phrases = [clone(phraseDefault)];
            }
            setState({entry: entryCopy});
        },
        addNote: (index, pathFrag) => {
            // console.log(pathFrag)
            // console.log(index)
            // return;
            let entryCopy = clone(state.entry);
            let entryCopyPath = _.get(entryCopy, pathFrag)

            if (entryCopyPath.notes) {
                entryCopyPath.notes.splice(index+1, 0, clone(noteDefault));
            } else {
                entryCopyPath.notes = [clone(noteDefault)];
            }
            // entryCopyPath[index].note = clone(noteDefault);
            // console.log(entryCopyPath);
            setState({entry: entryCopy});
            // console.log(state.entry)
        }
    };
    
	return (
        <>
        {/* <header> */}
            <nav>
                <ul>
                    <li id="site-title">Geriadur</li>
                    <li>
                    {`${capitalize(languageData.languageName)}-English`}
                    </li>
                    <li>Word entry</li>
                    <li>Dictionary</li>
                    <li>Settings</li>
                    <li>About</li>
                </ul>
                </nav>           
                 {/* <h1>{`${capitalize(languageData.languageName)}-English Dictionary Entry`}</h1> */}
        {/* </header> */}
        <main>
            <div id="wordlist">
                <p>Entries</p>
            </div>
            <div id="entryForm" onKeyDown={handleKeyDown}>
                <Headword appState={state} setAppState={setState} addFunctions={addFunctions} />
                {state.entry &&
                    state.entry.senseGroups.map((a,i) => (
                        <SenseGroup appState={state} setAppState={setState} key={i} thisIndex={i} addFunctions={addFunctions} />
                    ))
                }
                <Etymology />
                <fieldset id="submit">
                    <input id="submitInput" type="submit" value="Save to Dictionary" />
                </fieldset>
            </div>
            <div id="preview">
                {state.entry &&
                    <Preview appState={state} setAppState={setState} />
                }
            </div>
        </main>
        <Ipa />
        </>
	);
}

export default App;