import './setup.css';
import PosSetup from './PosSetup';
import IpaSetup from './IpaSetup';
import IpaPalette from '../IpaPalette';
import GramClassGroup from './GramClassGroup';
import GramFormGroup from './GramFormGroup';
import {API_BASE, clone} from '../../utils.js';
import _ from 'lodash';
import axios from 'axios';

const Setup = props => {

    const {appState, setAppState} = props;

    const tempSetup = appState.tempSetup;

    const handleChange = (field, value) => {
        const tempSetupCopy = clone(tempSetup);
        tempSetupCopy[field] = value;
        setAppState({tempSetup: tempSetupCopy});
    };

    const changeCheck = field => {
        const tempSetupCopy = clone(tempSetup);
        let value = _.get(tempSetupCopy, `[${field}]`);
        _.set(tempSetupCopy, `[${field}]`, !value);
        setAppState({tempSetup: tempSetupCopy});
    };

    const changeSeparator = (field, value) => {
        const tempSetupCopy = clone(tempSetup);
        tempSetupCopy[field].groupSeparator = value;
        setAppState({tempSetup: tempSetupCopy});
    };


    const moveItem = (e, index, pathFrag, up) => {
        if (e.target.classList.contains("disabled")) return;
        let position = up ? index-1 : index+1;
        let tempSetupCopy = clone(appState.tempSetup);
        let tempSetupCopyPath = _.get(tempSetupCopy, pathFrag)
        let thisItemCopy = clone(tempSetupCopyPath[index]);
        tempSetupCopyPath.splice(index, 1);
        tempSetupCopyPath.splice(position, 0, thisItemCopy);
        setAppState({tempSetup: tempSetupCopy});
    };

    // const cleanUpEntries = () => {
    //     if (!appState.allEntries) {
    //         return;
    //     }
    //     let allEntriesCopy = clone(appState.allEntries);
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
        axios.post(`${API_BASE}/tempSetup/new`, clone(appState.tempSetup))
        .then(response => {
            setAppState({tempSetup: response.data, setup:response.data});
            // cleanUpEntries();
        })
        .catch(err => console.log(err));
    };
    
    const updateSetup = () => {
        axios.post(`${API_BASE}/tempSetup/update`, clone(appState.tempSetup))
        .then(response => {
            let tempSetupClone = clone(appState.tempSetup);
            tempSetupClone.dateModified = new Date();
            setAppState({tempSetup: tempSetupClone, setup:tempSetupClone});
            alert("Your changes have been saved.");
            // cleanUpEntries();
        })
        .catch(err => console.log(err));
    };

    const handleSaveButtonClick = () => {
        if (appState.tempSetup.targetLanguageName === "" && appState.tempSetup.sourceLanguageName === "") {
            alert("Please enter a Target Language name and a Source Language name.");
            return;
        }
        if (appState.tempSetup.targetLanguageName === "") {
            alert("Please enter a Target Language name.");
            return;
        }
        if (appState.tempSetup.sourceLanguageName === "") {
            alert("Please enter a Source Language name.");
            return;
        }
        if (appState.tempSetup._id) {
            updateSetup();
        } else {   
            saveNewSetup();
        }
    };

    const handleRevertButtonClick = () => {
        setAppState({tempSetup: appState.setup});
    };

    // console.log(tempSetup)

    return (
        <main id="setup">
            { !appState.setup ?
                <div>Loading</div> :
                <>
                <div>
                    <h3 className="span2">Language Names</h3>
                    <div className="row">
                        <div className="row">
                            <div className="row">
                                <div className="row-controls"></div>
                                <div className="row-content language-names">
                                    <label>Target Language</label>
                                    <input type="text" value={tempSetup.targetLanguageName} onChange={e => handleChange("targetLanguageName", e.target.value)} />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="row">
                                <div className="row-controls"></div>
                                <div className="row-content language-names">
                                    <label>Source Language</label>
                                    <input type="text" value={tempSetup.sourceLanguageName} onChange={e => handleChange("sourceLanguageName", e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="span2">Parts of speech</h3>
                    <div className="row">
                        {tempSetup.partsOfSpeechDefs.map((a,i) => (
                            <PosSetup key={i} appState={appState} setAppState={setAppState} thisIndex={i} moveItem={moveItem} />
                        ))}
                    </div>
                </div>
                <div id="gramClassSetup">
                    <h3 className="span2">Classes</h3>
                    <p>For example: masculine, feminine, intransitive, transitive, singular-plural, collective-singulative.</p>
                    <div className="row">
                        { tempSetup.gramClassGroups.map((a, i) => (
                            <GramClassGroup appState={appState} setAppState={setAppState} thisIndex={i} moveItem={moveItem} key={i} />
                        ))}
                    </div>
                </div>
                <div id="gramFormSetup">
                    <h3 className="span2">Forms</h3>
                    <p>For example: Number: singular, plural, collective, singulative. Definitiveness: indefinite, definite. Case: accusative, genitive. Person: 1, 2, 3. Tense: past, future.</p>
                    <div className="row">
                        { tempSetup.gramFormGroups.map((a, i) => (
                            <GramFormGroup appState={appState} setAppState={setAppState} thisIndex={i} moveItem={moveItem} key={i} />
                        ))}
                    </div>
                </div>
                <div>
                <h3>Phonetics</h3>
                    <div className="row setting">
                    <label>Include pronunciation</label>
                    <input type="checkbox" checked={tempSetup.showPronunciation ? true : false} onChange={e => changeCheck("showPronunciation")} />
                    </div>
                </div>
                <div id="ipaSetup">
                    <h3 className="span2">IPA</h3>
                    <div className="row setting">
                        <label>Show IPA palette</label>
                        <input type="checkbox" checked={tempSetup.ipa.showPalette ? true : false} onChange={e => changeCheck("ipa.showPalette")} />
                    </div>
                    { tempSetup.ipa.showPalette &&
                    <>
                        <div className="row setting">
                            <label>Group separator</label>
                            <ul>
                                <li className={tempSetup.ipa.groupSeparator === "none" ? "selected" : ""} onClick={() => changeSeparator("ipa", "none")}>None</li>
                                <li className={tempSetup.ipa.groupSeparator === "space" ? "selected" : ""} onClick={() => changeSeparator("ipa", "space")}>Space</li>
                                <li className={tempSetup.ipa.groupSeparator === "line" ? "selected" : ""} onClick={() => changeSeparator("ipa", "line")}>Line</li>
                            </ul>
                        </div>
                        <div className="row">
                            {tempSetup.ipa.content.map((a,i) => (
                                <IpaSetup key={i} appState={appState} setAppState={setAppState} thisIndex={i} moveItem={moveItem} />
                            ))}
                        </div>
                    </>
                    }
                </div>
                <div id="submit">
                    {/* <button id="submitInput" type="submit">Revert to previous saved</button> */}
                    <button onClick={handleRevertButtonClick}>Revert to previously saved</button>
                    <button onClick={handleSaveButtonClick}>Save</button>
                </div>
                { tempSetup.ipa.showPalette &&
                    <IpaPalette appState={appState} />
                }
                </>
            }
        </main>
    )
};

export default Setup;