import AddPopup from '../../AddPopup';
import ScriptSetup from './ScriptSetup';
import {useState} from 'react';
import {clone, addPopupHandler} from '../../../utils.js';
import {scriptDefault} from '../defaults.js';
// import _ from 'lodash';

const ScriptSection = props => {

    const {state, setState, moveRow} = props;

    // const pathFrag = "scripts";
    // const path = _.get(state, "state.tempSetup." + pathFrag);

    const [addPopupVisible, setAddPopupVisible] = useState(false);
    const [sectionOpen, setSectionOpen] = useState(true);

    const addScript = index => {
        let tempSetupCopy = clone(state.tempSetup);
        let newScript = clone(scriptDefault);
        newScript.id = tempSetupCopy.nextId.toString();
        tempSetupCopy.nextId++;
        tempSetupCopy.scripts.splice(index+1, 0, newScript);
        setState({tempSetup: tempSetupCopy});
    };

    const popupItems = [
        ["Script", () => addScript(state.tempSetup.scripts.length)],
    ];


    return(
        <div className={`row${sectionOpen ? "" : " closed"}`}>
            <div className="row-controls">
                <AddPopup popupItems={popupItems} visible={addPopupVisible} />
                <i className="fas fa-plus" onClick={() => addPopupHandler(addPopupVisible, setAddPopupVisible)}></i>
                <i></i>
                <i className={`fas fa-chevron-${sectionOpen ? "up" : "down"}`} onClick={() => setSectionOpen(!sectionOpen)}></i>
            </div>
            <div className="row-content">
                <span>Scripts</span>
            </div>
            { state.tempSetup.scripts.map((a, i) => (
                <ScriptSetup state={state} setState={setState} thisIndex={i} moveRow={moveRow} key={i} addScript={addScript} />
            ))
            }
        </div>
    );
};

export default ScriptSection;