import Headword from "./Headword";
import SenseGroup from "./SenseGroup";
import Etymology from "./Etymology";
import Preview from "./Preview";
import EntriesList from "./EntriesList";
import Palette from "../Palette";
import { API_BASE, clone, generateSenseGroup, generatePos } from "../../utils.js";
import { entryDefault, morphDefault, definitionDefault, phraseDefault, exampleDefault, noteDefault } from "../../defaults.js";
import _ from "lodash";
import axios from "axios";
import { useEffect } from "react";
import { usePrompt } from "../../Blocker";

const Entry = props => {
  const { state, setState } = props;

  const didHomographsChange = () => {
    const editHomographsWithoutCurrent = clone(state.editHomographs);
    for (let homographSet of editHomographsWithoutCurrent) {
      for (let i = 0; i < homographSet.items.length; i++) {
        if (homographSet.items[i].current) {
          homographSet.items.splice(i, 1);
          break;
        }
      }
    }
    return JSON.stringify(state.savedHomographs) !== JSON.stringify(editHomographsWithoutCurrent);
  };

  const isDirty = () => JSON.stringify(state.entry) !== JSON.stringify(state.entryCopy) || didHomographsChange();

  const initializeEntry = () => {
    // console.log("initializing");
    let newEntry = clone(entryDefault);
    const defaultPosId = state.setup.partsOfSpeechDefs.items[0].id;
    newEntry.senseGroups.push(generateSenseGroup(defaultPosId, state.setup.partsOfSpeechDefs.items, state.setup.gramClassGroups.items));
    addFunctions.setScriptForms(newEntry.headword.morphs[0]);
    setState({ entry: newEntry, entryCopy: newEntry, savedHomographs: [], editHomographs: [] });
  };

  useEffect(() => {
    state.setup && initializeEntry();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.setupIsSet]);

  useEffect(() => {
    return () => {
      setState({ entry: null, entryCopy: null });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleKeyDown = e => {
    if (e.key === "Enter") {
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
        };
        tempSetupCopy.nextId++;
        obj.scriptForms.push(scriptForm);
        setState({ tempSetup: tempSetupCopy });
        setState({ setup: tempSetupCopy });
      });
    },
    addMorph: (index, pathFrag) => {
      let entryCopy = clone(state.entry);
      let entryCopyPath = _.get(entryCopy, pathFrag);
      let obj = clone(morphDefault);
      addFunctions.setScriptForms(obj);
      entryCopyPath.splice(index + 1, 0, obj);
      setState({ entry: entryCopy });
    },
    addDefinition: (index, pathFrag) => {
      let entryCopy = clone(state.entry);
      let entryCopyPath = _.get(entryCopy, pathFrag);
      if (entryCopyPath.definitions) {
        entryCopyPath.definitions.splice(index + 1, 0, clone(definitionDefault));
      } else {
        entryCopyPath.definitions = [clone(definitionDefault)];
      }
      setState({ entry: entryCopy });
    },
    addPhrase: (index, pathFrag) => {
      let entryCopy = clone(state.entry);
      let entryCopyPath = _.get(entryCopy, pathFrag);
      if (entryCopyPath.phrases) {
        entryCopyPath.phrases.splice(index + 1, 0, clone(phraseDefault));
      } else {
        entryCopyPath.phrases = [clone(phraseDefault)];
      }
      setState({ entry: entryCopy });
    },
    addExample: (index, pathFrag) => {
      let entryCopy = clone(state.entry);
      let entryCopyPath = _.get(entryCopy, pathFrag);
      if (entryCopyPath.examples) {
        entryCopyPath.examples.splice(index + 1, 0, clone(exampleDefault));
      } else {
        entryCopyPath.examples = [clone(exampleDefault)];
      }
      setState({ entry: entryCopy });
    },
    addNote: (index, pathFrag) => {
      let entryCopy = clone(state.entry);
      let entryCopyPath = _.get(entryCopy, pathFrag);
      if (entryCopyPath.notes) {
        entryCopyPath.notes.splice(index + 1, 0, clone(noteDefault));
      } else {
        entryCopyPath.notes = [clone(noteDefault)];
      }
      setState({ entry: entryCopy });
    },
    addPos: (index, pathFrag, availablePoses) => {
      let entryCopy = clone(state.entry);
      let entryCopyPath = _.get(entryCopy, pathFrag);
      entryCopyPath.splice(
        index + 1,
        0,
        generatePos(availablePoses[0].id, state.setup.partsOfSpeechDefs.items, state.setup.gramClassGroups.items)
      );
      setState({ entry: entryCopy });
    },
  };

  const moveRow = (e, index, pathFrag, up) => {
    if (e.target.classList.contains("disabled")) return;
    let position = up ? index - 1 : index + 1;
    let entryCopy = clone(state.entry);
    let entryCopyPath = _.get(entryCopy, pathFrag);
    let thisItemCopy = clone(entryCopyPath[index]);
    entryCopyPath.splice(index, 1);
    entryCopyPath.splice(position, 0, thisItemCopy);
    setState({ entry: entryCopy });
  };

  const generateNumberedHomographs = allHomographs => {
    // console.log(allHomographs)
    allHomographs.items.sort((a, b) => a.homograph - b.homograph);
    let index = allHomographs.items.findIndex(a => a.current);
    if (allHomographs.items[index].homograph === 0) {
      allHomographs.items.push(...allHomographs.items.splice(index, 1));
    }

    let numberedHomographs = clone(allHomographs);
    for (let i = 0; i < numberedHomographs.items.length; i++) {
      let newNumber = i + 1;
      numberedHomographs.items[i].homograph = newNumber;
    }

    return numberedHomographs;
  };

  //   console.log(state.editHomographs);

  const updateHomographs = (scriptFormId, newScriptFormContent) => {
    // console.log(`updateHomographs: ${scriptFormId}`);
    const index = state.editHomographs.findIndex(a => a.id === scriptFormId);
    const prevScriptFormContent = state.editHomographs[index]?.scriptForm;
    // console.log(`${prevScriptFormContent} → ${newScriptFormContent}`);
    // console.log(index);
    // console.log(state.editHomographs);
    let editHomographsCopy = clone(state.editHomographs);
    // console.log(editHomographsCopy);
    // this scriptForm is being changed, so if there were already homographs for it, they are no loger relevant and must be deleted from state.
    // console.log(index, scriptFormId);
    // return;
    // let savedHomographsCopy = clone(state.savedHomographs);
    if (index > -1) {
      //   let editHomographsCopy = clone(state.editHomographs);
      //   let savedHomographsCopy = clone(state.savedHomographs);

      // if this is an existing entry, changing this scriptForm so it is not a homograph may leave a gap in numbering of the other homographs. they have to be renumbered before this one is deleted.
      // updated versions of those relevant entries will be saved to state.potentialEntryUpdates. they'll only actually be updated if/when this entry is saved
      if (state.entry._id) {
        let editHomographsCopy2 = clone(state.editHomographs);
        let otherHomographsToUpdate = renumberHomographs(editHomographsCopy2[index]);
        const otherEntriesToUpdate = getEntryClones(otherHomographsToUpdate);

        let potentialEntryUpdatesCopy = clone(state.potentialEntryUpdates);
        let obj = { scriptFormId, scriptFormContent: prevScriptFormContent, otherEntriesToUpdate };
        potentialEntryUpdatesCopy.push(obj);
        setState({ potentialEntryUpdates: potentialEntryUpdatesCopy });
      }
      //   return;
      //   editHomographsCopy.splice(index, 1);
      //   savedHomographsCopy.splice(index, 1);
      //   setState({
      //     editHomographs: editHomographsCopy,
      //     savedHomographs: savedHomographsCopy,
      //   });
      //   return;
    } else {
      let potentialUpdatesIndex = state.potentialEntryUpdates?.findIndex(
        a => a.scriptFormId === scriptFormId && a.scriptFormContent === newScriptFormContent
      );

      if (potentialUpdatesIndex > -1) {
        //   console.log("it's there");
        let potentialEntryUpdatesCopy = clone(state.potentialEntryUpdates);
        potentialEntryUpdatesCopy.splice(potentialUpdatesIndex, 1);
        setState({ potentialEntryUpdates: potentialEntryUpdatesCopy });
      }
    }
    // console.log("here");
    let newSavedHomographs = [];
    let newEditHomographs = [];
    for (let morph of state.entry.headword.morphs) {
      for (let scriptForm of morph.scriptForms) {
        let homographsFound = getHomographs(scriptForm);
        if (homographsFound.length === 0) continue;

        newSavedHomographs.push(homographsFound.otherEntriesHomographs);

        let allHomographs = clone(homographsFound.otherEntriesHomographs);
        allHomographs.items.push(homographsFound.currentHomograph);

        let numberedHomographs = generateNumberedHomographs(allHomographs);
        newEditHomographs.push(numberedHomographs);
      }
    }
    // console.log(newEditHomographs);
    // return;
    if (index > -1 && prevScriptFormContent !== newScriptFormContent) {
      //   console.log("here");
      let x = editHomographsCopy[index];
      //   let { items } = x;
      //   console.log(x);
      let { items } = x;
      for (let i = items.length - 1; i >= 0; i--) {
        if (items[i].current) {
          items[i].homograph = 0;
        } else {
          items.splice(i, 1);
        }
      }
      //   console.log(x);
      newEditHomographs.push(x);
    }
    // return;
    // console.log(newEditHomographs);

    setState({ savedHomographs: newSavedHomographs, editHomographs: newEditHomographs });
  };

  //   console.log(state.editHomographs);
  //   console.log(state.potentialEntryUpdates);

  const getHomographs = currentScriptForm => {
    if (currentScriptForm.content === "") return [];
    let otherEntriesHomographs = {
      id: currentScriptForm.id,
      scriptForm: currentScriptForm.content,
      items: [],
    };

    // for each homograph, need entry id, morph index, scriptForm index

    // add forms for all other saved entries
    for (let entry of state.allEntries) {
      if (entry._id !== state.entry._id) {
        let { morphs } = entry.headword;
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
              homograph: scriptForm.homograph,
            };
            otherEntriesHomographs.items.push(item);
          }
        }
      }
    }

    if (otherEntriesHomographs.items.length === 0) return [];
    otherEntriesHomographs.items.sort((a, b) => a.homograph - b.homograph);

    // if homographs were found, add current form from current entry
    let currentHomograph = {
      id: currentScriptForm.id,
      entryId: state.entry._id,
      scriptForm: currentScriptForm.content,
      homograph: currentScriptForm.homograph,
      current: true,
    };

    // current form, if 0, should be last in list
    // there could be two 0s, if only 2 homographs
    // but still need to sort all forms including current, if current already has another

    return { otherEntriesHomographs, currentHomograph };
  };

  useEffect(() => {
    if (state.entry?._id) {
      console.log("useEffect");
      updateHomographs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.entry?._id]);

  const updateEntryHomographs = () => {
    if (state.editHomographs.length < 1) return state.entry;

    let homographsToUpdate = [];
    state.editHomographs.forEach(a => homographsToUpdate.push(...a.items));

    let entryCopy = clone(state.entry);
    let { morphs } = state.entry.headword;
    for (let i = 0; i < morphs.length; i++) {
      const { scriptForms } = morphs[i];
      for (let j = 0; j < scriptForms.length; j++) {
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
    console.log(state.editHomographs);
    for (let i = 0; i < state.editHomographs.length; i++) {
      let savedSet = state.savedHomographs.find(a => a.id === state.editHomographs[i].id);
      if (!savedSet) continue;
      let items = state.editHomographs[i].items;
      //   console.log(savedSet);
      for (let item of items) {
        // if (!savedSet) {
        let savedVersion = savedSet.items.find(a => a.id === item.id);
        if (!savedVersion) continue;
        if (item.homograph === savedVersion.homograph) continue;
        // }
        homographsToUpdate.push(item);
      }
    }
    // for (let i = 0; i < state.editHomographs.length; i++) {
    //   let items = state.editHomographs[i].items;
    //   for (let item of items) {
    //     let savedVersion = state.savedHomographs[i].items.find(a => a.id === item.id);
    //     if (!savedVersion) continue;
    //     if (item.homograph === savedVersion.homograph) continue;
    //     homographsToUpdate.push(item);
    //   }
    // }
    return homographsToUpdate;
  };

  const getEntryClones = otherHomographsToUpdate => {
    if (otherHomographsToUpdate.length === 0) return [];
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

  const getObjToSend = async updatedEntry => {
    return {
      setupId: state.tempSetup._id,
      nextId: state.tempSetup.nextId,
      entryFields: updatedEntry || state.entry,
    };
  };

  const updateOtherEntryHomographs = () => {
    const otherHomographsToUpdate = getOtherHomographsToUpdate();
    // console.log(otherHomographsToUpdate);
    // return;
    const otherEntriesToUpdate = getEntryClones(otherHomographsToUpdate);
    // console.log(otherEntriesToUpdate);
    // return;

    // console.log(state.potentialEntryUpdates);
    for (let entrySet of state.potentialEntryUpdates) {
      //   console.log(entrySet);
      for (let entry of entrySet.otherEntriesToUpdate) {
        let savedEntry = state.allEntries.find(a => a._id === entry._id);
        if (JSON.stringify(entry) !== JSON.stringify(savedEntry)) {
          otherEntriesToUpdate.push(entry);
        }
      }
    }
    // console.log(otherEntriesToUpdate);

    // return;
    if (otherEntriesToUpdate.length === 0) return [];

    // console.log(otherEntriesToUpdate);
    // return;
    // if (otherEntriesToUpdate.length < 1) return;
    otherEntriesToUpdate.forEach(entryToUpdate => {
      axios
        .post(`${API_BASE}/entry/updateOtherEntryHomographs`, { entryToUpdate })
        .then(response => response)
        .catch(err => console.log(err));
    });
    return otherEntriesToUpdate;
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
      //   console.log("delete");
      let index = allEntriesClone.findIndex(a => a._id === entryToDelete);
      allEntriesClone.splice(index, 1);
    }
    setState({ allEntries: allEntriesClone });
  };

  const updateEntry = async () => {
    const otherEntriesToUpdate = updateOtherEntryHomographs();
    // return;
    const updatedEntry = updateEntryHomographs();
    // console.log(updatedEntry);
    const obj = await getObjToSend(updatedEntry);
    axios
      .post(`${API_BASE}/entry/update`, obj)
      .then(response => {
        updateStateAllEntries([updatedEntry, ...otherEntriesToUpdate]);
        initializeEntry();
        // setState
      })
      .catch(err => console.log(err));
  };

  const addEntry = async () => {
    const otherEntriesToUpdate = updateOtherEntryHomographs();
    let newEntry = updateEntryHomographs();
    const obj = await getObjToSend(newEntry);
    axios
      .post(`${API_BASE}/entry/add`, obj)
      .then(response => {
        updateStateAllEntries([response.data, ...otherEntriesToUpdate]);
        initializeEntry();
      })
      .catch(err => console.log(err));
  };

  const revertToSaved = () => {
    setState({ entry: state.entryCopy });
  };

  const handleSaveNewClick = () => {
    addEntry();
  };

  const handleUpdateClick = () => {
    updateEntry();
  };

  const renumberHomographs = homographSet => {
    let otherHomographsToUpdate = [];
    let { items } = homographSet;
    // remove current item
    for (let i = 0; i < items.length; i++) {
      if (items[i].current) {
        items.splice(i, 1);
        break;
      }
    }
    // reassign numbers to reaming homographs
    for (let i = 0; i < items.length; i++) {
      items[i].homograph = items.length === 1 ? 0 : i + 1;
      otherHomographsToUpdate.push(items[i]);
    }
    return otherHomographsToUpdate;
  };

  const deleteOtherHomographs = () => {
    if (state.editHomographs.length === 0) return [];
    let editHomographsCopy = clone(state.editHomographs);

    let otherHomographsToUpdate = [];
    for (let homographSet of editHomographsCopy) {
      let results = renumberHomographs(homographSet);
      otherHomographsToUpdate.push(...results);
    }
    // console.log(otherHomographsToUpdate);
    const otherEntriesToUpdate = getEntryClones(otherHomographsToUpdate);
    if (otherEntriesToUpdate.length > 0) updateOtherEntryHomographs(otherEntriesToUpdate);
    return otherEntriesToUpdate;
  };

  const handleDeleteClick = () => {
    let entryId = state.entry._id;
    let response = window.confirm("Are you sure you want to delete this entry?");
    if (!response) return;
    let otherEntriesToUpdate = deleteOtherHomographs();

    // delete this entry from db
    axios
      .post(`${API_BASE}/entry/delete`, { id: entryId })
      .then(response => {
        // update state - remove this entry, and update other entries where homograph num changed
        updateStateAllEntries(otherEntriesToUpdate, entryId);
        initializeEntry();
      })
      .catch(err => console.log(err));
  };

  const handleCopyToNewEntryClick = () => {
    let entryClone = clone(state.entry);
    delete entryClone._id;
    initializeEntry();
    //  maybe resetting savedHomographs, editHomographs is unnecessary ?
    setState({ entry: entryClone, savedHomographs: [], editHomographs: [] });
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

  usePrompt("Are you sure you want to leave? The new entry will not be saved.", isDirty());

  // console.log(state.setup.etymologySettings.etymologyTags[0]);

  return (
    <main id="entry">
      {!state.setup || !state.entry ? (
        <div>Loading</div>
      ) : (
        <>
          <div id="sidebar">
            <EntriesList state={state} setState={setState} isDirty={isDirty} updateHomographs={updateHomographs} />
            <div id="preview">{state.entry && <Preview state={state} setState={setState} />}</div>
          </div>
          <div id="entryForm" onKeyDown={handleKeyDown}>
            <h1>
              {state.entry._id ? "Editing Entry: " : "New Entry: "}
              <span className="hw">{state.entry.headword.morphs[0].scriptForms[0].content}</span>
            </h1>
            <Headword state={state} setState={setState} addFunctions={addFunctions} moveRow={moveRow} updateHomographs={updateHomographs} />
            {state.entry &&
              state.entry.senseGroups.map((a, i) => (
                <SenseGroup state={state} setState={setState} key={i} thisIndex={i} addFunctions={addFunctions} moveRow={moveRow} />
              ))}
            {state.entry && state.setup.entrySettings.showEtymology && <Etymology state={state} setState={setState} />}
          </div>
          <div id="bottom-bar">
            <div>
              {state.setup.palettes?.items.map((a, i) => {
                let result = null;
                if (a.display) {
                  const isNotEmpty = a.content.some(b => {
                    const filteredArr = b.characters.filter(c => c !== "");
                    return filteredArr.length > 0;
                  });
                  if (isNotEmpty) {
                    result = <Palette state={state} thisIndex={i} key={i} />;
                  }
                }
                return result;
              })}
            </div>
            <div>
              {state.entry._id ? (
                <>
                  <button onClick={handleCopyToNewEntryClick}>Copy to New Entry</button>
                  <button onClick={handleNewBlankEntryClick}>New Entry</button>
                  <button onClick={revertToSaved}>Revert to Saved</button>
                  <button onClick={handleDeleteClick}>Delete</button>
                  <button onClick={handleUpdateClick}>Save Changes</button>
                </>
              ) : (
                <>
                  <button onClick={initializeEntry}>Clear All</button>
                  <button onClick={handleSaveNewClick}>Save</button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default Entry;
