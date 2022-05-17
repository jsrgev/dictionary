import Headword from './Headword';
import SenseGroup from './SenseGroup';
import Etymology from './Etymology';
import Preview from './Preview';
import EntriesList from './EntriesList';
import Palette from '../Palette';
import {API_BASE, clone, generateSenseGroup, generatePos} from '../../utils.js';
import {entryDefault, morphDefault, definitionDefault, phraseDefault, exampleDefault, noteDefault} from '../../defaults.js';
import _  from 'lodash';
import axios from 'axios';
import {useEffect} from 'react';
import {usePrompt} from '../../Blocker';


const Entry = props => {

    const {state, setState} = props;
    
    const isDirty = () => JSON.stringify(state.entry) !== JSON.stringify(state.entryCopy);

    const setScriptForms = obj => {
        obj.scriptForms = state.setup.scripts.items.map(a => {
            let obj = {
                refId: a.id,
                content: ""
            }
            return obj;
        });
    };

    const initializeEntry = () => {
        // console.log("initializing");
        let newEntry = clone(entryDefault);
        const defaultPosId = state.setup.partsOfSpeechDefs.items[0].id;
        newEntry.senseGroups.push(generateSenseGroup(defaultPosId, state.setup.partsOfSpeechDefs.items, state.setup.gramClassGroups));
        setScriptForms(newEntry.headword.morphs[0]);
        // newEntry.headword.morphs[0].scriptForms = state.setup.scripts.items.map(a => {
        //     let obj = {
        //         refId: a.id,
        //         content: ""
        //     }
        //     return obj;
        // });
        // console.log(newEntry.headword.morphs[0]);
        setState({entry: newEntry, entryCopy: newEntry});
    };

    useEffect(() => {
        state.setup &&
        initializeEntry();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[state.setup]);

    useEffect(() => {
        return () => {
            setState({entry: null, entryCopy: null});
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleKeyDown = e => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    };

    const addFunctions = {
        addMorph: (index, pathFrag) => {
            let entryCopy = clone(state.entry);
            let entryCopyPath = _.get(entryCopy, pathFrag);
            let obj = clone(morphDefault);
            setScriptForms(obj);
            entryCopyPath.splice(index+1, 0, obj);
            setState({entry: entryCopy});
        },
        addDefinition: (index, pathFrag) => {
            let entryCopy = clone(state.entry);
            let entryCopyPath = _.get(entryCopy, pathFrag);
            if (entryCopyPath.definitions) {
                entryCopyPath.definitions.splice(index+1, 0, clone(definitionDefault));
            } else {
                entryCopyPath.definitions = [clone(definitionDefault)];
            }
            setState({entry: entryCopy});
        },
        addPhrase: (index, pathFrag) => {
            let entryCopy = clone(state.entry);
            let entryCopyPath = _.get(entryCopy, pathFrag);
            if (entryCopyPath.phrases) {
                entryCopyPath.phrases.splice(index+1, 0, clone(phraseDefault));
            } else {
                entryCopyPath.phrases = [clone(phraseDefault)];
            }
            setState({entry: entryCopy});
        },
        addExample: (index, pathFrag) => {
            let entryCopy = clone(state.entry);
            let entryCopyPath = _.get(entryCopy, pathFrag);
            if (entryCopyPath.examples) {
                entryCopyPath.examples.splice(index+1, 0, clone(exampleDefault));
            } else {
                entryCopyPath.examples = [clone(exampleDefault)];
            }
            setState({entry: entryCopy});
        },
        addNote: (index, pathFrag) => {
            let entryCopy = clone(state.entry);
            let entryCopyPath = _.get(entryCopy, pathFrag);
            if (entryCopyPath.notes) {
                entryCopyPath.notes.splice(index+1, 0, clone(noteDefault));
            } else {
                entryCopyPath.notes = [clone(noteDefault)];
            }
            setState({entry: entryCopy});
        },
        addPos: (index, pathFrag, availablePoses) => {
            let entryCopy = clone(state.entry);
            let entryCopyPath = _.get(entryCopy, pathFrag);
            // console.log(state.setup.gramClassGroups);
            // return;
            entryCopyPath.splice(index+1, 0, generatePos(availablePoses[0].id, state.setup.partsOfSpeechDefs.items, state.setup.gramClassGroups));
            setState({entry: entryCopy});
        },
    };

    const moveRow = (e, index, pathFrag, up) => {
        if (e.target.classList.contains("disabled")) return;
        let position = up ? index-1 : index+1;
        let entryCopy = clone(state.entry);
        let entryCopyPath = _.get(entryCopy, pathFrag);
        let thisItemCopy = clone(entryCopyPath[index]);
        entryCopyPath.splice(index, 1);
        entryCopyPath.splice(position, 0, thisItemCopy);
        setState({entry: entryCopy});
    };

    const addToEntries = (newEntry) => {
        let allEntriesCopy = clone(state.allEntries);
        allEntriesCopy.push(newEntry);
        setState({allEntries: allEntriesCopy});
    };

    const addEntry = () => {
        axios.post(`${API_BASE}/entry/add`, clone(state.entry))
        .then(response => {
            addToEntries(response.data);
            initializeEntry();
        }
            )
        .catch(err => console.log(err));
    };

    const updateEntry = () => {
        axios.post(`${API_BASE}/entry/update`, clone(state.entry))
        .then(response => {
            let allEntriesClone = clone(state.allEntries);

            let entryClone = clone(state.entry);
            entryClone.dateModified = new Date();

            let index = allEntriesClone.findIndex(a => a._id === state.entry._id);
            allEntriesClone[index] = clone(entryClone);
            setState({allEntries: allEntriesClone});
            initializeEntry();
        })
        .catch(err => console.log(err));
    };

    const revertToSaved = () => {
        setState({entry: state.entryCopy});
    };

    const handleSaveNewClick = () => {
        addEntry();
    };

    const handleUpdateClick = () => {
        updateEntry();
    };

    const handleDeleteClick = () => {
        let entryId = state.entry._id;
        let response = window.confirm("Are you sure you want to delete this entry?");
        if (!response) {
            return;
        }
        axios.post(`${API_BASE}/entry/delete`, {id: entryId})
        .then(response => {
            let allEntriesClone = clone(state.allEntries);
            let index = allEntriesClone.findIndex(a => a._id === entryId);
            allEntriesClone.splice(index, 1);
            setState({allEntries: allEntriesClone});
            initializeEntry();
        })
        .catch(err => console.log(err));
    };

    const handleCopyToNewEntryClick = () => {
        let entryClone = clone(state.entry);
        delete entryClone._id;
        initializeEntry();
        setState({entry: entryClone});
    };

    const handleNewBlankEntryClick = () => {
        if (isDirty()) {
            let response = window.confirm("Are you sure you want to leave? Changes to this entry will not be saved.");
            if (!response) {
                return;
            }
        }
        initializeEntry();
    };


    usePrompt(
            "Are you sure you want to leave? The new entry will not be saved.",
        isDirty() 
    );

    return (
        <main id="entry">
            { (!state.setup || !state.entry) ?
                <div>Loading</div> :
                <>
                    <div id="sidebar">
                        <EntriesList state={state} setState={setState} isDirty={isDirty} />
                        <div id="preview">
                        {state.entry &&
                            <Preview state={state} setState={setState} />
                        }
                        </div>
                    </div>
                    <div id="entryForm" onKeyDown={handleKeyDown}>
                        <h1>{state.entry._id ? "Editing Entry: " : "New Entry: "}<span className="hw">{state.entry.headword.morphs[0].scriptForms[0].content}</span></h1>
                        <Headword state={state} setState={setState} addFunctions={addFunctions} moveRow={moveRow} />
                        {state.entry &&
                            state.entry.senseGroups.map((a,i) => (
                                <SenseGroup state={state} setState={setState} key={i} thisIndex={i} addFunctions={addFunctions} moveRow={moveRow} setScriptForms={setScriptForms} />
                            ))
                        }
                        {(state.entry && state.setup.entrySettings.showEtymology) &&
                            <Etymology state={state} setState={setState} />
                        }
                    </div>
            <div id="bottom-bar">
                <div>
                    { state.setup.palettes?.items.map((a, i) => {
                        let result = null;
                        if (a.display) {
                            const isNotEmpty = a.content.some(b => {
                                const filteredArr = b.characters.filter(c => c !== "");
                                return filteredArr.length > 0
                            });
                            if (isNotEmpty) {
                                result = <Palette state={state} thisIndex={i} key={i} />;
                            }
                        }
                        return result;
                        })
                    }
                </div>
                <div>
                    {state.entry._id ?
                    <>
                        <button onClick={handleCopyToNewEntryClick}>Copy to New Entry</button>
                        <button onClick={handleNewBlankEntryClick}>New Blank Entry</button>
                        <button onClick={revertToSaved}>Revert to Saved</button>
                        <button onClick={handleDeleteClick}>Delete</button>
                        <button onClick={handleUpdateClick}>Save Changes</button>
                    </>
                    :
                    <>
                        <button onClick={initializeEntry}>Clear All</button>
                        <button onClick={handleSaveNewClick}>Save</button>
                    </>
                    }
                </div>
            </div>
            </>
            }
        </main>
    );
};

export default Entry;