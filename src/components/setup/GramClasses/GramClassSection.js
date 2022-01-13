import AddPopup from '../../AddPopup';
import GramClassGroup from './GramClassGroup';
import {useState} from 'react';
import {gramClassGroupDefault} from '../defaults.js';
import {clone, addPopupHandler} from '../../../utils.js';
import _ from 'lodash';

const GramClassSection = props => {

    const {state, setState, moveItem, prevIndent} = props;

    const pathFrag = "gramClassGroups";

    const [rowOpen, setRowOpen] = useState(true);
    const [addPopupVisible, setAddPopupVisible] = useState(false);

    const addGroup = index => {
        const setupCopy = clone(state.tempSetup);
        let setupCopyPath = _.get(setupCopy, pathFrag);

        let newGramClassGroup = clone(gramClassGroupDefault);
        newGramClassGroup.id = setupCopy.nextId.toString();
        setupCopy.nextId++;

        setupCopyPath.splice(index+1, 0, newGramClassGroup);
        setState({tempSetup: setupCopy});
    };

    const popupItems = [
        ["Group", () => addGroup(state.tempSetup.gramClassGroups.length)],
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
                <span>Grammatical Classes</span>
            </div>
            <div className="row">
                { state.tempSetup.gramClassGroups.map((a, i) => (
                    <GramClassGroup state={state} setState={setState} thisIndex={i} moveItem={moveItem} key={i} addGroup={addGroup} prevIndent={prevIndent+1} />
                ))}
            </div>
        </div>
    );
};

export default GramClassSection;
