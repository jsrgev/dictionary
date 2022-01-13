import './setup.css';
import PosSection from './Pos/PosSection';
import PaletteSection from './Palettes/PaletteSection';
import Palette from '../Palette';
import GramClassSection from './GramClasses/GramClassSection';
import GramFormSection from './GramForms/GramFormSection';
import EtymologySection from './Etymology/EtymologySection';
import {API_BASE, clone} from '../../utils.js';
import _ from 'lodash';
import axios from 'axios';
import LanguageDataSection from './LanguageData/LanguageDataSection';
import EntriesSection from './Entries/EntriesSection';

const Setup = props => {

    const {state, setState} = props;
    const prevIndent = -1;
    const tempSetup = state.tempSetup;


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


    const moveItem = (e, index, pathFrag, up) => {
        if (e.target.classList.contains("disabled")) return;
        let position = up ? index-1 : index+1;
        let tempSetupCopy = clone(state.tempSetup);
        let tempSetupCopyPath = _.get(tempSetupCopy, pathFrag);
        let thisItemCopy = clone(tempSetupCopyPath[index]);
        tempSetupCopyPath.splice(index, 1);
        tempSetupCopyPath.splice(position, 0, thisItemCopy);
        setState({tempSetup: tempSetupCopy});
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
    
    const updateSetup = () => {
        axios.post(`${API_BASE}/setup/update`, clone(state.tempSetup))
        .then(response => {
            let tempSetupClone = clone(state.tempSetup);
            tempSetupClone.dateModified = new Date();
            setState({tempSetup: tempSetupClone, setup:tempSetupClone});
            alert("Your changes have been saved.");
            // cleanUpEntries();
        })
        .catch(err => console.log(err));
    };

    const handleSaveButtonClick = () => {
        if (state.tempSetup.targetLanguageName === "" && state.tempSetup.sourceLanguageName === "") {
            alert("Please enter a Target Language name and a Source Language name.");
            return;
        }
        if (state.tempSetup.targetLanguageName === "") {
            alert("Please enter a Target Language name.");
            return;
        }
        if (state.tempSetup.sourceLanguageName === "") {
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
    
    // console.log(tempSetup);

    return (
        <main id="setup">
            { !state.setup ?
                <div>Loading</div> :
                <>
                <LanguageDataSection state={state} setState={setState} />

                <PosSection state={state} setState={setState} moveItem={moveItem} prevIndent={prevIndent} />

                {/* <div>
                    <h3>Parts of speech</h3>
                    <div className="row">
                        {tempSetup.partsOfSpeechDefs.map((a,i) => (
                            <PosSetup key={i} state={state} setState={setState} thisIndex={i} moveItem={moveItem} />
                        ))}
                    </div>
                </div> */}

                <GramClassSection state={state} setState={setState} moveItem={moveItem} prevIndent={prevIndent} />
            
                <GramFormSection state={state} setState={setState} moveItem={moveItem} prevIndent={prevIndent} />
                
                {/* <div id="gramFormSetup">
                    <h3>Grammatical Forms</h3>
                    <p>For example: Number: singular, plural, collective, singulative. Definitiveness: indefinite, definite. Case: accusative, genitive. Person: 1, 2, 3. Tense: past, future.</p>
                    <div className="row">
                        { tempSetup.gramFormGroups.map((a, i) => (
                            <GramFormGroup state={state} setState={setState} thisIndex={i} moveItem={moveItem} key={i} />
                        ))}
                    </div>
                </div> */}

                <EtymologySection state={state} setState={setState} moveItem={moveItem} />

                <EntriesSection state={state} setState={setState} moveItem={moveItem} />

                <PaletteSection state={state} setState={setState} moveItem={moveItem} />


                <div id="submit">
                    {/* <button id="submitInput" type="submit">Revert to previous saved</button> */}
                    {/* <button onClick={fix}>Fix</button> */}
                    <button onClick={handleRevertButtonClick}>Revert to previously saved</button>
                    <button onClick={handleSaveButtonClick}>Save</button>
                </div>
                { tempSetup.palettes.map((a, i) => {
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
                </>
            }
        </main>
    );
};

export default Setup;