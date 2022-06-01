import './setup.css';
import PosSection from './Pos/PosSection';
import PaletteSection from './Palettes/PaletteSection';
// import Palette from '../Palette';
import GramClassSection from './GramClasses/GramClassSection';
import GramFormSection from './GramForms/GramFormSection';
import ScriptSection from './Scripts/ScriptSection';
import EtymologySection from './Etymology/EtymologySection';
import {API_BASE, clone} from '../../utils.js';
import _ from 'lodash';
import axios from 'axios';
import LanguageDataSection from './LanguageData/LanguageDataSection';
import EntriesSection from './Entries/EntriesSection';

const Setup = props => {

    const {state, setState} = props;
    const prevIndent = -1;
    const {setup, tempSetup} = state;


    // const fix = () => {
    //     const tempSetupCopy = clone(tempSetup);

    //     let ipa = tempSetup.ipa;
    //     // console.log(ipa);
    //     ipa.name = "IPA";
    //     ipa.color = "#3b345a";
    //     tempSetupCopy.palettes = [ipa];
    //     // return;
    //     //         let obj = [tempSetup.ipa];
    //     // ;
    //     //         _.set(tempSetupCopy, `[${palettes}]`, obj);
    //     setState({tempSetup: tempSetupCopy});
    //     delete tempSetupCopy.ipa;
    // };


    const moveRow = (e, index, pathFrag, up) => {
        if (e.target.classList.contains("disabled")) return;
        let position = up ? index-1 : index+1;
        let tempSetupCopy = clone(state.tempSetup);
        let tempSetupCopyPath = _.get(tempSetupCopy, pathFrag);
        let thisItemCopy = clone(tempSetupCopyPath[index]);
        tempSetupCopyPath.splice(index, 1);
        tempSetupCopyPath.splice(position, 0, thisItemCopy);
        setState({tempSetup: tempSetupCopy});
    };


    const setSectionClosed = path => {
        const setupCopy = clone(state.tempSetup);
        let setupCopyPath = _.get(setupCopy, path);
        let newValue = !setupCopyPath.sectionClosed;
        setupCopyPath.sectionClosed = newValue;
        setState({tempSetup: setupCopy});
        // const path = `${pathFrag}.${thisIndex}.sectionClosed`
        // updateSectionClosed(path, newValue);
    };

    // const cleanUpEntries = () => {
    //     if (!state.allEntries) {
    //         return;
    //     }
    //     let allEntriesCopy = clone(state.allEntries);
    //     console.log(allEntriesCopy);

    //     for (let entry of allEntriesCopy) {
    //         // console.log(entry.senseGroups);
    //         for (let senseGroup of entry.senseGroups) {
    //             console.log(senseGroup);
    //         } 
    //     }
    // };

    const saveNewSetup = () => {
        axios.post(`${API_BASE}/setup/new`, clone(state.tempSetup))
        .then(response => {
            setState({tempSetup: response.data, setup:response.data});
            // cleanUpEntries();
        })
        .catch(err => console.log(err));
    };

    // const handleFixButtonClick = () => {
    //     const tempSetupCopy = clone(state.tempSetup);
    //     console.log(tempSetupCopy.gramClassGroups);
    //     tempSetupCopy.gramClassGroups.items.forEach(a => {
    //         let obj = [];
    //         a.gramClasses.forEach(b => {
    //             // console.log(b);
    //             obj.push(b);
    //         })
    //         a.gramClasses = {items: obj}
    //         // console.log(a);

    //     })
    //     // let obj = tempSetupCopy.gramFormGroups;
    //     // let {etymologyAbbrs, etymologyTags} = tempSetupCopy;
    //     // let obj = tempSetupCopy.palettes;

    //     // let classes = 
    //     // console.log(obj);
    //     // tempSetupCopy.gramFormGroups = {items: obj};
    //     console.log(tempSetupCopy.gramClassGroups);
    //     setState({tempSetup: tempSetupCopy});

    //     return;
    // };    

    const deleteScriptForms = scriptId => {
        // const {allEntries} = state;
        let allEntriesCopy = clone(state.allEntries);

        for (let entry of allEntriesCopy) {
            for (let morph of entry.headword.morphs) {
                let index = morph.scriptForms.findIndex(a => a.refId === scriptId);
                morph.scriptForms.splice(index, 1);
                // console.log(x);
                // for (let scriptForm of morph.scriptForms) {
                //     console.log(scriptForm.refId, scriptId);
                //     if (scriptForm.refId === scriptId) {
                //         console.log(scriptForm);
                //     };
                // }
            }
        }
        for (let entry of allEntriesCopy) {
            for (let senseGroup of entry.senseGroups) {
                for (let partOfSpeech of senseGroup.partsOfSpeech) {
                    if (partOfSpeech.irregulars) {
                        for (let irregular of partOfSpeech.irregulars) {
                            if (irregular.morphs) {
                                for (let morph of irregular.morphs) {
                                    let index = morph.scriptForms.findIndex(a => a.refId === scriptId);
                                    morph.scriptForms.splice(index, 1);
                                    // for (let scriptForm of morph.scriptForms) {
                                    //     if (scriptForm.refId === scriptId) {

                                    //         console.log(scriptForm);
                                    //     };
                                    // }
                                }
                            }
                        }
                    }
                }
            }
        }
        setState({allEntries: allEntriesCopy});
    };

    const addNewScriptFields = () => {

        let newScriptIds = tempSetup.scripts.items.flatMap(a => {
            let isNew = !state.setup.scripts.items.some(b => b.id === a.id);
            return (isNew) ? a.id : [];
        })

        // return;

        let allEntriesCopy = clone(state.allEntries);

        for (let id of newScriptIds) {
            let obj = {
                refId: id,
                content: ""
            };

            for (let entry of allEntriesCopy) {
                
                for (let morph of entry.headword.morphs) {
                    morph.scriptForms.push(clone(obj));
                }

                for (let senseGroup of entry.senseGroups) {
                    for (let partOfSpeech of senseGroup.partsOfSpeech) {
                        if (partOfSpeech.irregulars) {
                            for (let irregular of partOfSpeech.irregulars) {
                                if (irregular.morphs) {
                                    for (let morph of irregular.morphs) {
                                        morph.scriptForms.push(clone(obj));
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        setState({allEntries: allEntriesCopy});
    };

    const updateSetup = () => {
        // console.log(tempSetup.scriptsToDelete);
        // let obj =  [
        //     {
        //         id: "1",
        //         name: "foreign word",
        //         displayOpen: "[foreign]",
        //         displayClose: "[/foreign]",
        //         // getCode: string => <span className="for">{string}</span>,
        //         getCode: string => string,
        //     },
        //     {
        //         id: "2",
        //         name: "stem",
        //         displayOpen: "[stem]",
        //         displayClose: "[/stem]",
        //         getCode: string => <span className="for">{string}</span>,
        //     },
        //     {
        //         id: "3",
        //         name: "prefix",
        //         displayOpen: "[prefix]",
        //         displayClose: "[/prefix]",
        //         getCode: string => <><span className="for">{string}</span>-</>,
        //     },
        //     {
        //         id: "4",
        //         name: "suffix",
        //         displayOpen: "[suffix]",
        //         displayClose: "[/suffix]",
        //         getCode: string => <>-<span className="for">{string}</span></>,
        //     },
        //     {
        //         id: "5",
        //         name: "infix",
        //         displayOpen: "[infix]",
        //         displayClose: "[/infix]",
        //         getCode: string => <>-<span className="for">{string}</span>-</>,
        //     },
        //     {
        //         id: "6",
        //         name: "gloss",
        //         displayOpen: "[gloss]",
        //         displayClose: "[/gloss]",
        //         getCode: string => <>‘{string}’</>,
        //     }
        // ]
        // tempSetup.etymologySettings.etymologyTags = obj;
        if (tempSetup.scriptsToDelete) {
            tempSetup.scriptsToDelete.forEach(scriptId => {
                // console.log("deleteScriptForms")
                deleteScriptForms(scriptId);
            })
            // console.log(tempSetup.scriptsToDelete);

        }
        addNewScriptFields();

        // return;
        axios.post(`${API_BASE}/setup/update`, clone(state.tempSetup))
        .then(response => {
            let tempSetupClone = clone(state.tempSetup);
            tempSetupClone.dateModified = new Date();
            // console.log(tempSetupClone.etymologySettings.etymologyTags[0])
            setState({tempSetup: tempSetupClone, setup:tempSetupClone});
            alert("Your changes have been saved.");
            // cleanUpEntries();
        })
        .catch(err => console.log(err));

        // axios.post(`${API_BASE}/entry/updateAll`, clone())
        // .then(response => {
        //     let tempSetupClone = clone(state.tempSetup);
        //     tempSetupClone.dateModified = new Date();
        //     setState({tempSetup: tempSetupClone, setup:tempSetupClone});
        //     alert("Your changes have been saved.");
        //     // cleanUpEntries();
        // })
        // .catch(err => console.log(err));
    };

    // const updateSectionClosed = (path, newValue) => {
    //     // console.log(path);
    //     // return;
    //     // let sectionsOpen = clone(state.setup.sectionsOpen);
    //     // let obj = {_id: state.tempSetup._id};
    //     // console.log(obj);
    //     // axios.post(`${API_BASE}/setup/updateSectionsOpen`, obj);
    //     let {_id} = state.tempSetup;
    //     axios.post(`${API_BASE}/setup/updateSectionClosed`, {_id, path, newValue})
    //     .then(response => {
    //         console.log(response.data);
    //         // let sectionsOpenClone = clone(state.sectionsOpen);
    //         // setState({tempSetup: tempSetupClone, setup:tempSetupClone});
    //         // alert("Your changes have been saved.");
    //         // cleanUpEntries();
    //     })
    //     .catch(err => console.log(err));
    // };

    const handleSaveButtonClick = () => {
        if (state.tempSetup.languageData.targetLanguageName === "" && state.tempSetup.languageData.sourceLanguageName === "") {
            alert("Please enter a Target Language name and a Source Language name.");
            return;
        }
        if (state.tempSetup.languageData.targetLanguageName === "") {
            alert("Please enter a Target Language name.");
            return;
        }
        if (state.tempSetup.languageData.sourceLanguageName === "") {
            alert("Please enter a Source Language name.");
            return;
        }
        if (state.tempSetup._id) {
            updateSetup();
        } else {   
            saveNewSetup();
        }
    };

    const handleRevertButtonClick = () => {
        setState({tempSetup: state.setup});
    };
    
    // console.log(tempSetup.etymologySettings.etymologyTags[0]);
    // console.log(setup.etymologySettings.etymologyTags[0]);

    return (
        <main id="setup">
            { !state.setup ?
                <div>Loading</div> :
                <>
                <LanguageDataSection state={state} setState={setState} setSectionClosed={setSectionClosed} />

                <PosSection state={state} setState={setState} moveRow={moveRow} prevIndent={prevIndent} setSectionClosed={setSectionClosed} />

                <GramClassSection state={state} setState={setState} moveRow={moveRow} prevIndent={prevIndent} setSectionClosed={setSectionClosed} />
            
                <GramFormSection state={state} setState={setState} moveRow={moveRow} prevIndent={prevIndent} setSectionClosed={setSectionClosed} />
                
                <ScriptSection state={state} setState={setState} moveRow={moveRow} setSectionClosed={setSectionClosed} />

                <EtymologySection state={state} setState={setState} moveRow={moveRow} setSectionClosed={setSectionClosed} />

                <EntriesSection state={state} setState={setState} moveRow={moveRow} setSectionClosed={setSectionClosed} />

                <PaletteSection state={state} setState={setState} moveRow={moveRow} setSectionClosed={setSectionClosed} />


                <div id="bottom-bar">
                    <div>
                        { tempSetup.palettes.items.map((a, i) => {
                            let result = null;
                            if (a.display) {
                                const isNotEmpty = a.content.some(b => {
                                    const filteredArr = b.characters.filter(c => c !== "");
                                    return filteredArr.length > 0
                                });
                                if (isNotEmpty) {
                                    // result = <Palette state={state} thisIndex={i} key={i} />;
                                }
                            }
                            return result;
                            })
                        }
                    </div>
                    <div>
                        <button onClick={handleRevertButtonClick}>Revert to Saved</button>
                        <button onClick={handleSaveButtonClick}>Save</button>
                        {/* <button onClick={handleFixButtonClick}>Fix</button> */}
                    </div>
                </div>

                </>
            }
        </main>
    );
};

export default Setup;