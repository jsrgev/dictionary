import './setup.css';
import {useState} from 'react';
import PosSetup from './PosSetup';
import PaletteSetup from './PaletteSetup';
import IpaPalette from '../IpaPalette';
import GramClassGroup from './GramClassGroup';
import GramFormGroup from './GramFormGroup';
import EtymologyAbbrs from'./EtymologyAbbrs';
import {API_BASE, clone} from '../../utils.js';
import _ from 'lodash';
import axios from 'axios';

const Setup = props => {

    const {state, setState} = props;

    const tempSetup = state.tempSetup;

    const [paletteSectionOpen, setPaletteSectionOpen] = useState(true);

    

    const handleChange = (field, value) => {
        const tempSetupCopy = clone(tempSetup);
        tempSetupCopy[field] = value;
        setState({tempSetup: tempSetupCopy});
    };

    const changeCheck = field => {
        const tempSetupCopy = clone(tempSetup);
        let value = _.get(tempSetupCopy, `[${field}]`);
        _.set(tempSetupCopy, `[${field}]`, !value);
        setState({tempSetup: tempSetupCopy});
    };

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

    // const saveNew = (newEntry) => {
    //     let allEntriesCopy = clone(state.allEntries);
    //     allEntriesCopy.push(newEntry);
    //     console.log(allEntriesCopy);
    //     setState({allEntries: allEntriesCopy});
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
                <div>
                    <h3 className="span2">Language Names</h3>
                    <div className="row">
                        <div className="row">
                            <div className="row">
                                <div className="row-controls"></div>
                                <div className="row-content language-names">
                                    <label htmlFor='target-language'>Target Language</label>
                                    <input id='target-language' type="text" value={tempSetup.targetLanguageName} onChange={e => handleChange("targetLanguageName", e.target.value)} />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="row">
                                <div className="row-controls"></div>
                                <div className="row-content language-names">
                                    <label htmlFor='source-language'>Source Language</label>
                                    <input id='target-language' type="text" value={tempSetup.sourceLanguageName} onChange={e => handleChange("sourceLanguageName", e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="span2">Parts of speech</h3>
                    <div className="row">
                        {tempSetup.partsOfSpeechDefs.map((a,i) => (
                            <PosSetup key={i} state={state} setState={setState} thisIndex={i} moveItem={moveItem} />
                        ))}
                    </div>
                </div>
                <div id="gramClassSetup">
                    <h3 className="span2">Grammatical Classes</h3>
                    <p>For example: masculine, feminine, intransitive, transitive, singular-plural, collective-singulative.</p>
                    <div className="row">
                        { tempSetup.gramClassGroups.map((a, i) => (
                            <GramClassGroup state={state} setState={setState} thisIndex={i} moveItem={moveItem} key={i} />
                        ))}
                    </div>
                </div>
                <div id="gramFormSetup">
                    <h3 className="span2">Grammatical Forms</h3>
                    <p>For example: Number: singular, plural, collective, singulative. Definitiveness: indefinite, definite. Case: accusative, genitive. Person: 1, 2, 3. Tense: past, future.</p>
                    <div className="row">
                        { tempSetup.gramFormGroups.map((a, i) => (
                            <GramFormGroup state={state} setState={setState} thisIndex={i} moveItem={moveItem} key={i} />
                        ))}
                    </div>
                </div>
                <div>
                <h3 className="span2">Etymology Abbreviations</h3>
                    <div className="row">
                    {tempSetup.etymologyAbbrs.map((a, i) => (
                        <EtymologyAbbrs state={state} setState={setState} thisIndex={i} moveItem={moveItem} key={i} />
                    ))}
                    </div>
                </div>
                <div>
                    <h3>Phonetics</h3>
                    <div className="row setting">
                    <label htmlFor='include-pronunciation'>Include pronunciation</label>
                    <input id='include-pronunciation' type="checkbox" checked={tempSetup.showPronunciation ? true : false} onChange={e => changeCheck("showPronunciation")} />
                    </div>
                </div>

                {/* <div id="ipaSetup"> */}
 
                <div id="ipaSetup" className={`row${paletteSectionOpen ? "" : " closed"}`}>
                    <div className="row-controls">
                        {/* <AddPopup popupItems={popupItems} visible={addPopupVisible} /> */}
                        {/* <i className="fas fa-plus" onClick={() => addPopupHandler(addPopupVisible, setAddPopupVisible)}></i> */}
                        <i></i>
                        <i></i>
                        <i className={`fas fa-chevron-${paletteSectionOpen ? "up" : "down"}`} onClick={() => setPaletteSectionOpen(!paletteSectionOpen)}></i>
                    </div>
                    <div className="row-content">
                        <span>Character Palettes</span>
                    </div>

                    { tempSetup.palettes?.map((a, i) => (
                        <PaletteSetup state={state} setState={setState} moveItem={moveItem} stringPath="palettes" thisIndex={i} key={i}/>
                    ))}
                </div>
                {/* </div> */}


                <div id="submit">
                    {/* <button id="submitInput" type="submit">Revert to previous saved</button> */}
                    {/* <button onClick={fix}>Fix</button> */}
                    <button onClick={handleRevertButtonClick}>Revert to previously saved</button>
                    <button onClick={handleSaveButtonClick}>Save</button>
                </div>
                { tempSetup.palettes.map((a, i) => {
                    return (a.display) ?
                        <IpaPalette state={state} thisIndex={i} key={i} />
                        : null;
                    }
                )}
                </>
            }
        </main>
    );
};

export default Setup;