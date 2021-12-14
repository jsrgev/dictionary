import Headword from './Headword';
import SenseGroup from './SenseGroup';
import Etymology from './Etymology';
import Preview from './Preview';
import EntriesList from './EntriesList';
import IpaPalette from '../IpaPalette';
import {API_BASE, clone, generateSenseGroup, generatePos} from '../../utils.js';
import {entryDefault, morphDefault, definitionDefault, phraseDefault, exampleDefault, noteDefault} from '../../defaults.js';
import _  from 'lodash';
import axios from 'axios';
import {useEffect} from 'react';
import {usePrompt} from '../../Blocker';


const Entry = props => {

    const {state, setState} = props;
    
    const isDirty = () => JSON.stringify(state.entry) !== JSON.stringify(state.entryCopy);

    const initializeEntry = () => {
        console.log("initializing");
        let newEntry = clone(entryDefault);
        const defaultPosId = state.savedSetup.partsOfSpeechDefs[0].id;
        newEntry.senseGroups.push(generateSenseGroup(defaultPosId, state.savedSetup.partsOfSpeechDefs, state.savedSetup.gramClassGroups));
        setState({entry: newEntry, entryCopy: newEntry});
    };

    useEffect(() => {
        state.savedSetup &&
        initializeEntry();
    },[state.savedSetup]);

    useEffect(() => {
        return () => {
            setState({entry: null, entryCopy: null});
        }
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

    const moveItem = (e, index, pathFrag, up) => {
        if (e.target.classList.contains("disabled")) return;
        let position = up ? index-1 : index+1;
        let entryCopy = clone(state.entry);
        let entryCopyPath = _.get(entryCopy, pathFrag)
        let thisItemCopy = clone(entryCopyPath[index]);
        entryCopyPath.splice(index, 1);
        entryCopyPath.splice(position, 0, thisItemCopy);
        setState({entry: entryCopy});
    };

    const addToEntries = (newEntry) => {
        let allEntriesCopy = clone(state.allEntries);
        allEntriesCopy.push(newEntry);
        console.log(allEntriesCopy);
        setState({allEntries: allEntriesCopy});
    };

    // console.log(state.allEntries);

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
        }
            )
        .catch(err => console.log(err));
    };

    const handleSaveNewClick = () => {
        addEntry();
    };

    const handleSaveExistingClick = () => {
        updateEntry();
    };

    const handleDeleteClick = () => {
        let response = window.confirm("Are you sure you want to delete this entry?");
        if (!response) {
            return;
        }
        initializeEntry();
    };

    const handleCopyToNewEntryClick = () => {
        let entryClone = clone(state.entry);
        delete entryClone._id;
        initializeEntry();
        setState({entry: entryClone});
    };

    const handleNewBlankEntryClick = () => {
        if (isDirty()) {
            let response = window.confirm("Are you sure you want to leave? The new entry will not be saved.");
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
            { (!state.savedSetup || !state.entry) ?
                <div>Loading</div> :
                <>
                    <EntriesList state={state} setState={setState} isDirty={isDirty} />
                    <div id="entryForm" onKeyDown={handleKeyDown}>
                        {state.entry._id ?
                        <div>Editing Entry: <span className="hw">{state.entry.headword.morphs[0].content}</span></div> :
                        <div>New Entry: <span className="hw">{state.entry.headword.morphs[0].content}</span></div>
                        }
                        <Headword appState={state} setAppState={setState} addFunctions={addFunctions} moveItem={moveItem} />
                        {state.entry &&
                            state.entry.senseGroups.map((a,i) => (
                                <SenseGroup appState={state} setAppState={setState} key={i} thisIndex={i} addFunctions={addFunctions} moveItem={moveItem} />
                            ))
                        }
                        <Etymology />
                        <div id="submit">
                            {state.entry._id ?
                            <>
                                <button onClick={handleDeleteClick}>Delete</button>
                                <button onClick={handleSaveExistingClick}>Save Changes</button>
                                <button onClick={handleCopyToNewEntryClick}>Copy to New Entry</button>
                                <button onClick={handleNewBlankEntryClick}>New Blank Entry</button>
                            </>
                            :
                            <>
                                <button onClick={initializeEntry}>Clear All</button>
                                <button onClick={handleSaveNewClick}>Save</button>
                            </>
                            }
                        </div>
                    </div>
                    <div id="preview">
                    {state.entry &&
                        <Preview appState={state} setAppState={setState} />
                    }
                    </div>
                    { state.savedSetup.ipa.showPalette &&
                        <IpaPalette appState={state} />
                    }
                </>
            }
        </main>
    )
};

export default Entry;