import '../setup.css';
import PosSetup from './PosSetup';
// import { useSetState } from "react-use";
import { useState }  from 'react';
import {clone} from '../utils.js';
import _ from 'lodash';

const Setup = props => {

    const {appState, setAppState} = props;

    const setup = appState.setup;

    const [posOpen, setPosOpen] = useState(true);

    const handleChange = value => {
        const setupCopy = clone(setup);
        setupCopy.languageName = value;
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

    return (
        <main id="setup">
            <div>
                <h3 className="span2">Language</h3>
                <div className="row">
                    <div className={`row${posOpen ? "" : " closed"}`}>
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
            <div id="partsOfSpeechDefs">
                <h3 className="span2">Parts of speech</h3>
                <div className="row">
                    {setup.partsOfSpeechDefs.map((a,i) => (
                        <PosSetup key={i} appState={appState} setAppState={setAppState} thisIndex={i} moveItem={moveItem} />
                    ))}
                </div>
            </div>
            </main>
    )
};

export default Setup;