import AddPopup from '../../AddPopup';
import GramFormGroup from './GramFormGroup';
import {useState} from 'react';
import {gramFormGroupDefault} from '../defaults.js';
import {clone, addPopupHandler} from '../../../utils.js';
import _ from 'lodash';

const GramFormSection = props => {

    const {state, setState, moveRow, prevIndent, setSectionClosed} = props;

    const pathFrag = "gramFormGroups.items";
    const path = _.get(state, "tempSetup.gramFormGroups");

    // const [sectionOpen, setSectionOpen] = useState(true);
    const [addPopupVisible, setAddPopupVisible] = useState(false);

    const addGroup = index => {
        let setupCopy = clone(state.tempSetup);
        let setupCopyPath = _.get(setupCopy, pathFrag);
        let newGramFormGroup = clone(gramFormGroupDefault);
        newGramFormGroup.id = setupCopy.nextId.toString();
        setupCopy.nextId++;
        setupCopyPath.splice(index+1, 0, newGramFormGroup);
        setState({tempSetup: setupCopy});
    };

    const popupItems = [
        ["Group", () => addGroup(state.tempSetup.gramClassGroups.items.length)],
    ];

    return(
        <div className={`row${ path.sectionClosed ? " closed" : ""}`}>
            <div className="row-controls">
                <AddPopup popupItems={popupItems} visible={addPopupVisible} />
                <i className="fas fa-plus" onClick={() => addPopupHandler(addPopupVisible, setAddPopupVisible)}></i>
                <i></i>
                <i className={`fas fa-chevron-${path.sectionClosed ? "down" : "up"}`} onClick={() => setSectionClosed("gramFormGroups")}></i>
            </div>
            <div className="row-content">
                <span>Grammatical Forms</span>
            </div>
            <div className="row">
                { state.tempSetup.gramFormGroups.items.map((a, i) => (
                    <GramFormGroup state={state} setState={setState} thisIndex={i} moveRow={moveRow} key={i} addGroup={addGroup} prevIndent={prevIndent+1} />
                ))}
            </div>
        </div>
    );
};

export default GramFormSection;
