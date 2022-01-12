import AddPopup from '../AddPopup.js';
import PosSetup from './PosSetup';
import {useState} from 'react';
import {posDefault} from './defaults.js';
import {clone, addPopupHandler} from '../../utils.js';
import _ from 'lodash';

const PosSection = props => {

    const {state, setState, moveItem, prevIndent} = props;

    const pathFrag = "partsOfSpeechDefs";
    const path = _.get(state, "tempSetup." + pathFrag);

    const [rowOpen, setRowOpen] = useState(true);
    const [addPopupVisible, setAddPopupVisible] = useState(false);

    const addPos = index => {
        let setupCopy = clone(state.tempSetup);
        let setupCopyPath = _.get(setupCopy, pathFrag);

        let newPos = clone(posDefault);
        newPos.id = setupCopy.nextId.toString();
        setupCopy.nextId++;
        setupCopyPath.splice(index+1, 0, newPos);
        setState({tempSetup: setupCopy});
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
                    <PosSetup key={i} state={state} setState={setState} thisIndex={i} moveItem={moveItem} prevIndent={prevIndent+1} addPos={addPos} />
                    ))}
            </div>
        </div>


    );
};

export default PosSection;