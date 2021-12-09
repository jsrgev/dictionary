import './setup.css';
import PosSetup from './PosSetup';
import IpaSetup from './IpaSetup';
import IpaPalette from '../IpaPalette';
import GramClassGroup from './GramClassGroup';
import GramFormGroup from './GramFormGroup';
// import { useState }  from 'react';
import {API_BASE, clone} from '../../utils.js';
import _ from 'lodash';
import axios from 'axios';

const Setup = props => {

    const {appState, setAppState} = props;

    const setup = appState.setup;

    // const [posOpen, setPosOpen] = useState(true);

    const handleChange = (field, value) => {
        const setupCopy = clone(setup);
        setupCopy[field] = value;
        setAppState({setup: setupCopy});
    };

    const changeCheck = field => {
        const setupCopy = clone(setup);
        let value = _.get(setupCopy, `[${field}]`);
        _.set(setupCopy, `[${field}]`, !value);
        setAppState({setup: setupCopy});
    };

    const changeSeparator = (field, value) => {
        const setupCopy = clone(setup);
        setupCopy[field].groupSeparator = value;
        setAppState({setup: setupCopy});
    };


    const moveItem = (e, index, pathFrag, up) => {
        if (e.target.classList.contains("disabled")) return;
        let position = up ? index-1 : index+1;
        let setupCopy = clone(appState.setup);
        let setupCopyPath = _.get(setupCopy, pathFrag)
        let thisItemCopy = clone(setupCopyPath[index]);
        setupCopyPath.splice(index, 1);
        setupCopyPath.splice(position, 0, thisItemCopy);
        setAppState({setup: setupCopy});
    };

    const testSave = () => {
        axios.post(`${API_BASE}/saveSetup`, clone(appState.setup))
        .then(response => console.log(response))
        .catch(err => console.log(err));
    };

    const handleSaveButtonClick = () => {
        if (appState.setup.targetLanguageName === "" && appState.setup.sourceLanguageName === "") {
            alert("Please enter a Target Language name and a Source Language name.");
            return;
        }
        if (appState.setup.targetLanguageName === "") {
            alert("Please enter a Target Language name.");
            return;
        }
        if (appState.setup.sourceLanguageName === "") {
            alert("Please enter a Source Language name.");
            return;
        }
        testSave();
    };

    // console.log(setup)

    return (
        <main id="setup">
            <div>
                <h3 className="span2">Language Names</h3>
                <div className="row">
                    <div className="row">
                        <div className="row">
                            <div className="row-controls"></div>
                            <div className="row-content language-names">
                                <label>Target Language</label>
                                <input type="text" value={setup.targetLanguageName} onChange={e => handleChange("targetLanguageName", e.target.value)} />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="row">
                            <div className="row-controls"></div>
                            <div className="row-content language-names">
                                <label>Source Language</label>
                                <input type="text" value={setup.sourceLanguageName} onChange={e => handleChange("sourceLanguageName", e.target.value)} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <h3 className="span2">Parts of speech</h3>
                <div className="row">
                    {setup.partsOfSpeechDefs.map((a,i) => (
                        <PosSetup key={i} appState={appState} setAppState={setAppState} thisIndex={i} moveItem={moveItem} />
                    ))}
                </div>
            </div>
            <div id="gramClassSetup">
                <h3 className="span2">Classes</h3>
                <p>For example: masculine, feminine, intransitive, transitive, singular-plural, collective-singulative.</p>
                <div className="row">
                    { setup.gramClassGroups.map((a, i) => (
                        <GramClassGroup appState={appState} setAppState={setAppState} thisIndex={i} moveItem={moveItem} key={i} />
                    ))}
                </div>
            </div>
            <div id="gramFormSetup">
                <h3 className="span2">Forms</h3>
                <p>For example: Number: singular, plural, collective, singulative. Definitiveness: indefinite, definite. Case: accusative, genitive. Person: 1, 2, 3. Tense: past, future.</p>
                <div className="row">
                    { setup.gramFormGroups.map((a, i) => (
                        <GramFormGroup appState={appState} setAppState={setAppState} thisIndex={i} moveItem={moveItem} key={i} />
                    ))}
                </div>
            </div>
            <div>
            <h3>Phonetics</h3>
                <div className="row setting">
                <label>Include pronunciation</label>
                <input type="checkbox" checked={setup.showPronunciation ? true : false} onChange={e => changeCheck("showPronunciation")} />
                </div>
            </div>
            <div id="ipaSetup">
                <h3 className="span2">IPA</h3>
                <div className="row setting">
                    <label>Show IPA palette</label>
                    <input type="checkbox" checked={setup.ipa.showPalette ? true : false} onChange={e => changeCheck("ipa.showPalette")} />
                </div>
                { setup.ipa.showPalette &&
                <>
                    <div className="row setting">
                        <label>Group separator</label>
                        <ul>
                            <li className={setup.ipa.groupSeparator === "none" ? "selected" : ""} onClick={() => changeSeparator("ipa", "none")}>None</li>
                            <li className={setup.ipa.groupSeparator === "space" ? "selected" : ""} onClick={() => changeSeparator("ipa", "space")}>Space</li>
                            <li className={setup.ipa.groupSeparator === "line" ? "selected" : ""} onClick={() => changeSeparator("ipa", "line")}>Line</li>
                        </ul>
                    </div>
                    <div className="row">
                        {setup.ipa.content.map((a,i) => (
                            <IpaSetup key={i} appState={appState} setAppState={setAppState} thisIndex={i} moveItem={moveItem} />
                        ))}
                    </div>
                </>
                }
            </div>
            <div id="submit">
                {/* <button id="submitInput" type="submit">Revert to previous saved</button> */}
                <button onClick={handleSaveButtonClick}>Test save</button>
            </div>
            { setup.ipa.showPalette &&
                <IpaPalette appState={appState} />
            }
            </main>
    )
};

export default Setup;