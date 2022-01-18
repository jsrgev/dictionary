import AddPopup from '../../AddPopup';
import PosSetup from './PosSetup';
import {useState} from 'react';
import {posDefault} from '../defaults.js';
import {clone, addPopupHandler} from '../../../utils.js';
import _ from 'lodash';

const PosSection = props => {

    const {state, setState, moveRow, prevIndent} = props;

    const pathFrag = "partsOfSpeechDefs";

    const [rowOpen, setRowOpen] = useState(true);
    const [addPopupVisible, setAddPopupVisible] = useState(false);

    const addPos = index => {
        let tempSetupCopy = clone(state.tempSetup);
        let tempSetupCopyPath = _.get(tempSetupCopy, pathFrag);
        let newPos = clone(posDefault);
        newPos.id = tempSetupCopy.nextId.toString();
        tempSetupCopy.nextId++;
        tempSetupCopyPath.splice(index+1, 0, newPos);
        setState({tempSetup: tempSetupCopy});
    };

    const popupItems = [
        ["Part of speech", () => addPos(state.tempSetup.partsOfSpeechDefs.length)],
    ];

    return(
        <div className={`row${rowOpen ? "" : " closed"}`}>
            <div className="row-controls">
                <AddPopup popupItems={popupItems} visible={addPopupVisible} />
                <i className="fas fa-plus" onClick={() => addPopupHandler(addPopupVisible, setAddPopupVisible)}></i>
                <i></i>
                <i className={`fas fa-chevron-${rowOpen ? "up" : "down"}`} onClick={() => setRowOpen(!rowOpen)}></i>
            </div>
            <div className="row-content">
                <span>Parts of Speech</span>
            </div>
            <div className="row">
                {state.tempSetup.partsOfSpeechDefs.map((a,i) => (
                    <PosSetup key={i} state={state} setState={setState} thisIndex={i} moveRow={moveRow} prevIndent={prevIndent+1} addPos={addPos} />
                ))}
            </div>
        </div>
    );
};

export default PosSection;