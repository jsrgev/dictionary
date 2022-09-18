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

    const {state, setState, fetchEntries} = props;
    const prevIndent = -1;
    const {setup, tempSetup} = state;


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
    };

    const saveNewSetup = () => {
        axios.post(`${API_BASE}/setup/new`, clone(state.tempSetup))
        .then(response => {
            setState({tempSetup: response.data, setup:response.data});
        })
        .catch(err => console.log(err));
    };

    // const handleFixButtonClick = () => {
    // };    

    const didGramClassesOrFormsChange = () => {
        let sections = ["partsOfSpeechDefs", "gramClassGroups", "gramFormGroups"];
        for (let section of sections) {
            if (JSON.stringify(state.setup[section]) !== JSON.stringify(state.tempSetup[section])) {
                return true;
            }
        }
        return false;
    }

    const updateSetup = async () => {
        // console.log("updateSetup");
        let obj = clone(state.tempSetup);

        obj.fixGramClassesAndForms = didGramClassesOrFormsChange();
        // console.log(obj.fixGramClassesAndForms)
        obj.scriptsToAdd = tempSetup.scripts.items.flatMap(a => {
            if (state.allEntries.length < 1) return [];
            let isNew = !setup.scripts.items.some(b => b.id === a.id);
            return (isNew) ? a.id : [];
        });
        obj.scriptsToDelete = state.changes.scriptsToDelete;
        // console.log(obj.scriptsToDelete)

        axios.post(`${API_BASE}/setup/update`, obj)
        .then(res => {
            // console.log("first then");
            let tempSetupClone = clone(state.tempSetup);
            tempSetupClone.dateModified = new Date();
            let changesClone = clone(state.changes);
            changesClone.areEntriesUpdated = res.data.areEntriesUpdated;
            changesClone.scriptsToDelete = [];
            setState({tempSetup: tempSetupClone, setup:tempSetupClone, changes:changesClone});
            alert("Your changes have been saved.");
            return res.data.areEntriesUpdated;
        })
        .then(areEntriesUpdated => {
            // console.log(areEntriesUpdated);
            if (areEntriesUpdated) fetchEntries();
            // console.log("fetchEntries");
        })
        .catch(err => console.log(err));

    };

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
        setState({tempSetup: setup});
    };
    
    return (
        <main id="setup">
            { !setup ?
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