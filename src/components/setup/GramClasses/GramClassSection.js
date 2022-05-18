import AddPopup from '../../AddPopup';
import GramClassGroup from './GramClassGroup';
import {useState} from 'react';
import {gramClassGroupDefault} from '../defaults.js';
import {clone, addPopupHandler} from '../../../utils.js';
import _ from 'lodash';

const GramClassSection = props => {

    const {state, setState, moveRow, prevIndent, setSectionClosed} = props;

    const pathFrag = "gramClassGroups.items";
    const path = _.get(state, "tempSetup.gramClassGroups");

    // const [sectionOpen, setSectionOpen] = useState(true);
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
        ["Group", () => addGroup(state.tempSetup.gramClassGroups.items.length)],
    ];

    // console.log(path);

    return(
        <div className={`row${ path.sectionClosed ? " closed" : ""}`}>
            <div className="row-controls">
                <AddPopup popupItems={popupItems} visible={addPopupVisible} />
                <i className="fas fa-plus" onClick={() => addPopupHandler(addPopupVisible, setAddPopupVisible)}></i>
                <i></i>
                <i className={`fas fa-chevron-${path.sectionClosed ? "down" : "up"}`} onClick={() => setSectionClosed("gramClassGroups")}></i>
            </div>
            <div className="row-content">
                <span>Grammatical Classes</span>
            </div>
            <div className="row">
                { state.tempSetup.gramClassGroups.items.map((a, i) => (
                    <GramClassGroup state={state} setState={setState} thisIndex={i} moveRow={moveRow} key={i} addGroup={addGroup} prevIndent={prevIndent+1} />
                ))}
            </div>
        </div>
    );
};

export default GramClassSection;
