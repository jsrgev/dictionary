// import {useEffect, useState, useRef} from 'react';
import Headword from './components/Headword';
import SenseGroup from './components/SenseGroup';
import Etymology from './components/Etymology';
import Preview from './components/Preview';
import Ipa from './components/Ipa';
import Settings from './components/Settings';
import {useEffect, useCallback} from 'react';
import {useSetState} from 'react-use';
import {capitalize, clone, generateSenseGroup, generatePos} from './utils.js';
import {languageData} from './languageSettings.js';
import {entryDefault, morphDefault, definitionDefault, phraseDefault, exampleDefault, noteDefault} from './defaults.js';
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
        newEntry.senseGroups.push(generateSenseGroup());
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
            let entryCopyPath = _.get(entryCopy, pathFrag);
            entryCopyPath.splice(index+1, 0, clone(morphDefault));
            setState({entry: entryCopy});
        },
        addDefinition: (index, pathFrag) => {
            let entryCopy = clone(state.entry);
            let entryCopyPath = _.get(entryCopy, pathFrag)
            if (entryCopyPath.definitions) {
                entryCopyPath.definitions.splice(index+1, 0, clone(definitionDefault));
            } else {
                entryCopyPath.definitions = [clone(definitionDefault)];
            }
            setState({entry: entryCopy});
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
        addExample: (index, pathFrag) => {
            let entryCopy = clone(state.entry);
            let entryCopyPath = _.get(entryCopy, pathFrag)
            if (entryCopyPath.examples) {
                entryCopyPath.examples.splice(index+1, 0, clone(exampleDefault));
            } else {
                entryCopyPath.examples = [clone(exampleDefault)];
            }
            setState({entry: entryCopy});
        },
        addNote: (index, pathFrag) => {
            let entryCopy = clone(state.entry);
            let entryCopyPath = _.get(entryCopy, pathFrag)
            if (entryCopyPath.notes) {
                entryCopyPath.notes.splice(index+1, 0, clone(noteDefault));
            } else {
                entryCopyPath.notes = [clone(noteDefault)];
            }
            setState({entry: entryCopy});
        },
        addPos: (index, pathFrag, availablePoses) => {
            let entryCopy = clone(state.entry);
            let entryCopyPath = _.get(entryCopy, pathFrag)
            entryCopyPath.splice(index+1, 0, generatePos(availablePoses[0].name));
            setState({entry: entryCopy});
        },
    };
    
	return (
        <>
        <nav>
            <ul>
                <li id="site-title">Geriadur</li>
                <li>
                {`${capitalize(languageData.languageName)}-English`}
                </li>
                <li>Word entry</li>
                <li>Dictionary</li>
                <li>Setup</li>
                <li>About</li>
            </ul>
            </nav>           
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