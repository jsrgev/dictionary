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
    
    const didHomographsChange = () => {
        const editHomographsWithoutCurrent = clone(state.editHomographs);
        for (let homographSet of editHomographsWithoutCurrent) {
            for (let i = 0; i < homographSet.items.length; i++ ) {
                if (homographSet.items[i].current) {
                    homographSet.items.splice(i, 1);
                    break;
                }
            }
        }
        return JSON.stringify(state.savedHomographs) !== JSON.stringify(editHomographsWithoutCurrent);
    }

    const isDirty = () => (JSON.stringify(state.entry) !== JSON.stringify(state.entryCopy)) || didHomographsChange();
    
    const initializeEntry = () => {
        // console.log("initializing");
        let newEntry = clone(entryDefault);
        const defaultPosId = state.setup.partsOfSpeechDefs.items[0].id;
        newEntry.senseGroups.push(generateSenseGroup(defaultPosId, state.setup.partsOfSpeechDefs.items, state.setup.gramClassGroups.items));
        addFunctions.setScriptForms(newEntry.headword.morphs[0]);
        setState({entry: newEntry, entryCopy: newEntry, savedHomographs: [], editHomographs: []});
    };

    useEffect(() => {
        state.setup &&
        initializeEntry();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[state.setupIsSet]);

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
        setScriptForms: obj => {
            let tempSetupCopy = clone(state.tempSetup);
            obj.scriptForms = [];
            state.setup.scripts.items.forEach(a => {
                // console.log(a);
                let newId = "sf" + tempSetupCopy.nextId;
                let scriptForm = {
                    id: newId,
                    scriptRefId: a.id,
                    content: "",
                    homograph: 0,
                }
                tempSetupCopy.nextId++;
                obj.scriptForms.push(scriptForm);
                setState({tempSetup: tempSetupCopy});
                setState({setup: tempSetupCopy});
            });
        },
        addMorph: (index, pathFrag) => {
            let entryCopy = clone(state.entry);
            let entryCopyPath = _.get(entryCopy, pathFrag);
            let obj = clone(morphDefault);
            addFunctions.setScriptForms(obj);
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
            entryCopyPath.splice(index+1, 0, generatePos(availablePoses[0].id, state.setup.partsOfSpeechDefs.items, state.setup.gramClassGroups.items));
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

    const generateNumberedHomographs = allHomographs => {
        // console.log(allHomographs)
        allHomographs.items.sort((a,b) => a.homograph - b.homograph);
        let index = allHomographs.items.findIndex(a => a.current);
        if (allHomographs.items[index].homograph === 0) {
            allHomographs.items.push(...allHomographs.items.splice(index, 1));
        }

        let numberedHomographs = clone(allHomographs);
        for (let i=0; i < numberedHomographs.items.length; i++) {
            let newNumber = i+1;
            numberedHomographs.items[i].homograph = newNumber;
        }

        return numberedHomographs;
    };


    const updateHomographs = () => {
        
        let newSavedHomographs = [];
        let newEditHomographs = [];

        for (let morph of state.entry.headword.morphs) {
            for (let scriptForm of morph.scriptForms) {

                let homographsFound = getHomographs(scriptForm);
                // console.log(homographsFound)
                if (homographsFound.length === 0) return;
                newSavedHomographs.push(homographsFound.otherEntriesHomographs);

                let allHomographs = clone(homographsFound.otherEntriesHomographs);
                allHomographs.items.push(homographsFound.currentHomograph)

                let numberedHomographs = generateNumberedHomographs(allHomographs);
                newEditHomographs.push(numberedHomographs);
            }
        }

        setState({savedHomographs: newSavedHomographs, editHomographs: newEditHomographs});
    };

    // console.log(state.editHomographs);

    // const updateHomographs = (thisScriptForm) => {
    //     // index of array for current scriptForm in state.editHomographs
    //     let index = state.editHomographs.findIndex(a => a.id === path[thisIndex].id);
        
    //     // if there is something saved to state.editHomographs        
    //     if (index > -1) {
    //         // if no change return
    //         if (state.editHomographs[index].scriptForm === thisScriptForm)
    //         return;
    //     // if nothing saved ad this is blank, return
    //     } else if (thisScriptForm === "") return;
                
    //     // get all homographs based on currently entered text

    //     let savedHomographsCopy = clone(state.savedHomographs);
    //     let editHomographsCopy = clone(state.editHomographs);

    //     let homographsFound;
    //     let numberedHomographs;

    //     const determineAction = () => {
    //         if (index > -1 && thisScriptForm === "") return "splice";                
    //         homographsFound = getHomographs();
    //         console.log(homographsFound);
    //         if (!homographsFound) {
    //             return (index > -1) ? "splice" : "return";
    //         }
    //         let allHomographs = clone(homographsFound.otherEntriesHomographs);
    //         // console.log(allHomographs);
    //         allHomographs.items.push(homographsFound.currentHomograph)
    //         numberedHomographs = generateNumberedHomographs(allHomographs);
    //         return (index > -1) ? "replace" : "push";
    //     };
        
    //     let action = determineAction();
    //     console.log(action);
    //     console.log(state.savedHomographs);
    //     console.log(state.editHomographs);
    //     if (action === "return") return;
    //     if (action === "splice") {
    //         // reset homograph# for this scriptForm to 0
    //         savedHomographsCopy.splice(index, 1);
    //         editHomographsCopy.splice(index, 1);
    //         // ... delete homograph# from entry
    //     } else if (action === "replace") {
    //         savedHomographsCopy[index] = homographsFound.otherEntriesHomographs;
    //         editHomographsCopy[index] = numberedHomographs;
    //     } else if (action === "push") {
    //         savedHomographsCopy.push(homographsFound.otherEntriesHomographs);
    //         editHomographsCopy.push(numberedHomographs);
    //     }

    //     setState({savedHomographs: savedHomographsCopy, editHomographs: editHomographsCopy});
    //     setThisEditHomographs(state.editHomographs.find(a => a.id === path[thisIndex].id));
    // };



    const getHomographs = (currentScriptForm) => {
        if (currentScriptForm.content === "") return [];
        let otherEntriesHomographs = {
            id: currentScriptForm.id,
            scriptForm: currentScriptForm.content,
            items: []
        };

        // for each homograph, need entry id, morph index, scriptForm index

        // add forms for all other saved entries
        for (let entry of state.allEntries) {
            if (entry._id !== state.entry._id) {
                let {morphs} = entry.headword;
                for (let i = 0; i < morphs.length; i++) {

                    // this gets first script, has to be amended to allow for multiple scripts

                    // let index = morphs[i].scriptForms.findIndex(a => a.scriptRefId === currentScriptId);
                    let index = 0;
                    let scriptForm = morphs[i].scriptForms[index];
                    if (scriptForm.content === currentScriptForm.content) {
                        let item = {
                            id: scriptForm.id,
                            entryId: entry._id,
                            scriptForm: scriptForm.content,
                            homograph: scriptForm.homograph
                        }
                        otherEntriesHomographs.items.push(item);
                    }
                }
            }
        }

        if (otherEntriesHomographs.items.length === 0) return [];
        otherEntriesHomographs.items.sort((a,b) => a.homograph - b.homograph);

        // if homographs were found, add current form from current entry
        let currentHomograph = {
            id: currentScriptForm.id,
            entryId: state.entry._id,
            scriptForm: currentScriptForm.content,
            homograph: currentScriptForm.homograph,
            current: true
        }
        
        // current form, if 0, should be last in list
        // there could be two 0s, if only 2 homographs
        // but still need to sort all forms including current, if current already has another 

        return {otherEntriesHomographs, currentHomograph};
    };

    useEffect( () => {
        if (state.entry) {
            updateHomographs();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[state.entry]);

    const updateEntryHomographs = () => {
        if (state.editHomographs.length < 1) return null;

        let homographsToUpdate = [];
        state.editHomographs.forEach(a => homographsToUpdate.push(...a.items));

        let entryCopy = clone(state.entry);
        let {morphs} = state.entry.headword;
        for (let i=0; i < morphs.length; i++) {
            const {scriptForms} = morphs[i];
            for (let j=0; j < scriptForms.length; j++) {
                const scriptForm = scriptForms[j];
                let homograph = homographsToUpdate.find(a => a.id === scriptForm.id);
                if (!homograph) continue;
                if (homograph.homograph === scriptForm.homograph) continue;
                entryCopy.headword.morphs[i].scriptForms[j].homograph = homograph.homograph;
            }
        }
        return entryCopy;
    };


    const getOtherHomographsToUpdate = () => { 
        if (state.editHomographs.length < 1) return [];
        let homographsToUpdate = [];
        for (let i = 0; i < state.editHomographs.length; i++) {
            let items = state.editHomographs[i].items;
            for (let item of items) {
                let savedVersion = state.savedHomographs[i].items.find(a => a.id === item.id);
                if (!savedVersion) continue;
                if (item.homograph === savedVersion.homograph) continue;
                homographsToUpdate.push(item);
            }
        }
        return homographsToUpdate;
    };

    const getEntryClones = (otherHomographsToUpdate) => {
        let entriesToUpdate = [];
        for (let item of otherHomographsToUpdate) {
            let entry = state.allEntries.find(a => a._id === item.entryId);
            let entryClone = clone(entry);
            // for each morph of headword, for each scriptForm, replace homographNum with the one from state.editHomographs
            for (let morph of entryClone.headword.morphs) {
                for (let scriptForm of morph.scriptForms) {
                    if (scriptForm.id === item.id) {
                        scriptForm.homograph = item.homograph;
                        entriesToUpdate.push(entryClone);
                    }
                }
            }
        }
        return entriesToUpdate;
    };
    
    const getObjToSend = async (updatedEntry) => {
        return {
            setupId: state.tempSetup._id,
            nextId: state.tempSetup.nextId,
            entryFields: updatedEntry || state.entry,
        }
    };
    
    const updateOtherEntryHomographs = otherEntriesToUpdate => {
        console.log(otherEntriesToUpdate);
        if (otherEntriesToUpdate.length < 1) return;
        otherEntriesToUpdate.forEach(entryToUpdate => {
            axios.post(`${API_BASE}/entry/updateOtherEntryHomographs`, {entryToUpdate})
            .then(response => response)
            .catch(err => console.log(err));
        });
    };

    const updateStateAllEntries = (entries, entryToDelete) => {
        let allEntriesClone = clone(state.allEntries);
        entries.forEach(entry => {
            entry.dateModified = new Date();
            let index = allEntriesClone.findIndex(a => a._id === entry._id);
            if (index > -1) {
                allEntriesClone[index] = clone(entry);
            } else {
                allEntriesClone.push(clone(entry));
            }
        });
        if (entryToDelete) {
            console.log("delete");
            let index = allEntriesClone.findIndex(a => a._id === entryToDelete);
            allEntriesClone.splice(index, 1);
        }
        setState({allEntries: allEntriesClone});
    };


    const updateEntry = async () => {
        const otherHomographsToUpdate = getOtherHomographsToUpdate();
        const otherEntriesToUpdate = getEntryClones(otherHomographsToUpdate);
        if (otherEntriesToUpdate.length > 0) updateOtherEntryHomographs(otherEntriesToUpdate);

        const updatedEntry = updateEntryHomographs();
        const obj = await getObjToSend(updatedEntry);

        axios.post(`${API_BASE}/entry/update`, obj)
        .then(response => {
            updateStateAllEntries([updatedEntry, ...otherEntriesToUpdate]);
            initializeEntry();
        })
        .catch(err => console.log(err));
    };
    
    // console.log(state.entry?.headword.morphs[0].scriptForms[0]);

    const addEntry = async () => {
        const otherHomographsToUpdate = getOtherHomographsToUpdate();
        const otherEntriesToUpdate = getEntryClones(otherHomographsToUpdate);
        if (otherEntriesToUpdate.length > 0) updateOtherEntryHomographs(otherEntriesToUpdate);
        
        let newEntry = updateEntryHomographs();
        const obj = await getObjToSend(newEntry);
        axios.post(`${API_BASE}/entry/add`, obj)
        .then(response => {
            updateStateAllEntries([response.data, ...otherEntriesToUpdate]);
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

    const deleteOtherHomographs = () => {
        if (state.editHomographs.length === 0) return [];
        let otherHomographsToUpdate = [];
        let editHomographsCopy = clone(state.editHomographs);        
        for (let homographSet of editHomographsCopy) {
            let {items} = homographSet;
            // remove current item
            for (let i = 0; i < items.length; i++ ) {
                if (items[i].current) {
                    items.splice(i, 1);
                    break;
                }
            }
            // reassign numbers to reaming homographs
            for (let i=0; i < items.length; i++) {
                items[i].homograph = items.length === 1 ? 0 : i+1;
                otherHomographsToUpdate.push(items[i]);
            }
        }
        const otherEntriesToUpdate = getEntryClones(otherHomographsToUpdate);
        if (otherEntriesToUpdate.length > 0) updateOtherEntryHomographs(otherEntriesToUpdate);
        return otherEntriesToUpdate;
    };

    const handleDeleteClick = () => {
        let entryId = state.entry._id;
        let response = window.confirm("Are you sure you want to delete this entry?");
        if (!response) return;
        let otherEntriesToUpdate = deleteOtherHomographs();
        
        axios.post(`${API_BASE}/entry/delete`, {id: entryId})
        .then(response => {
            updateStateAllEntries(otherEntriesToUpdate, entryId);
            initializeEntry();
        })
        .catch(err => console.log(err));
    };

    const handleCopyToNewEntryClick = () => {
        let entryClone = clone(state.entry);
        delete entryClone._id;
        initializeEntry();
        setState({entry: entryClone, savedHomographs: [], editHomographs: []});
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

    // console.log(state.setup.etymologySettings.etymologyTags[0]);

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
                        <Headword state={state} setState={setState} addFunctions={addFunctions} moveRow={moveRow} updateHomographs={updateHomographs} />
                        {state.entry &&
                            state.entry.senseGroups.map((a,i) => (
                                <SenseGroup state={state} setState={setState} key={i} thisIndex={i} addFunctions={addFunctions} moveRow={moveRow} />
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
                                <button onClick={handleNewBlankEntryClick}>New Entry</button>
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