import './setup.css';
import PosSetup from './PosSetup';
import IpaSetup from './IpaSetup';
import IpaPalette from '../IpaPalette';
// import { useState }  from 'react';
import {clone} from '../../utils.js';
import _ from 'lodash';
import GramFormSetup from './GramFormSetup';

const Setup = props => {

    const {appState, setAppState} = props;

    const setup = appState.setup;

    // const [posOpen, setPosOpen] = useState(true);

    const handleChange = value => {
        const setupCopy = clone(setup);
        setupCopy.languageName = value;
        setAppState({setup: setupCopy});
    };

    const changeCheck = field => {
        let value = setup[field];
        const setupCopy = clone(setup);
        setupCopy[field] = !value;
        setAppState({setup: setupCopy});
    }

    const changeSeparator = value => {
        const setupCopy = clone(setup);
        setupCopy.groupSeparator = value;
        setAppState({setup: setupCopy});
    }


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

// console.log(setup)

    return (
        <main id="setup">
            <div>
                <h3 className="span2">Language</h3>
                <div className="row">
                    <div className="row">
                        <div className="row-controls">
                            {/* <AddPopup popupItems={popupItems} visible={addPopupVisible} /> */}
                            {/* <i className="fas fa-plus" onClick={() => addPopupHandler(addPopupVisible, setAddPopupVisible)}></i> */}
                            {/* <i></i> */}
                            {/* <i className={`fas fa-chevron-${headwordOpen ? "up" : "down"}`} onClick={() => setHeadwordOpen(!headwordOpen)}></i> */}
                        </div>
                        <div className="row-content">
                            <label>Language Name</label>
                            <input type="text" value={setup.languageName} onChange={e => handleChange(e.target.value)} />
                        </div>
                    </div>
                </div>
            </div>
            <div id="partsOfSpeechSetup">
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
                </div>
            </div>
            <div id="gramFormSetup">
                <h3 className="span2">Forms</h3>
                <p>For example: Number: singular, plural, collective, singulative. Definitiveness: indefinite, definite. Case: accusative, genitive. Person: 1, 2, 3. Tense: past, future.</p>
                <div className="row">
                    { setup.gramForms.map((a, i) => (
                    <GramFormSetup appState={appState} setAppState={setAppState} thisIndex={i} moveItem={moveItem} key={i} />
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
                    <input type="checkbox" checked={setup.showIpaPalette ? true : false} onChange={e => changeCheck("showIpaPalette")} />
                </div>
                { setup.showIpaPalette &&
                <>
                    <div className="row setting">
                        <label>Group separator</label>
                        <ul>
                            <li className={setup.groupSeparator === "none" ? "selected" : ""} onClick={() => changeSeparator("none")}>None</li>
                            <li className={setup.groupSeparator === "space" ? "selected" : ""} onClick={() => changeSeparator("space")}>Space</li>
                            <li className={setup.groupSeparator === "line" ? "selected" : ""} onClick={() => changeSeparator("line")}>Line</li>
                        </ul>
                    </div>
                    <div className="row">
                        {setup.ipa.map((a,i) => (
                            <IpaSetup key={i} appState={appState} setAppState={setAppState} thisIndex={i} moveItem={moveItem} />
                        ))}
                    </div>
                </>
                }
            </div>
            { setup.showIpaPalette &&
                <IpaPalette appState={appState} />
            }
            </main>
    )
};

export default Setup;