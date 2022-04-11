import AddPopup from '../../AddPopup';
import { clone, capitalize, getIndent, addPopupHandler } from '../../../utils.js';
import {useState} from 'react';
import _ from 'lodash';
import Limitations from './Limitations.js';

const GramClassSelect = props => {

    const {state, setState, thisIndex, moveRow, stringPath, addGramClassOption, availableGramClassGroups, prevIndent} = props;

    let pathFrag = stringPath + ".gramClassGroups";
    const path = _.get(state, "tempSetup." + pathFrag);

    const [sectionOpen, setSectionOpen] = useState(true);
    const [addPopupVisible, setAddPopupVisible] = useState(false);

    const handleClick = async (e) => {
        let gramClassId = e.target.getAttribute("value");
        if (!isAvailable(gramClassId)) {
            return;
        }
        let setupCopy = clone(state.tempSetup);
        let setupCopyPath = _.get(setupCopy, pathFrag);
        let obj = {refId: gramClassId};
        _.set(setupCopy, `[${pathFrag[thisIndex]}]`, obj);
        setupCopyPath[thisIndex] = obj;

        setState({tempSetup: setupCopy});
    };
    
    const deletePos = () => {
        let setupCopy = clone(state.tempSetup);
        let setupCopyPath = _.get(setupCopy, pathFrag);
        setupCopyPath.splice(thisIndex, 1);
        setState({tempSetup: setupCopy});
    };

    const popupItems = [];

    if (availableGramClassGroups.length > 0) {
        popupItems.push(["Class option", () => addGramClassOption(thisIndex)]);
    };

    const isAvailable = gramClassGroupId => {
        return availableGramClassGroups.some(a => a.id === gramClassGroupId);
    };
    

    const isCurrentSelection = gramClassGroupId =>  {
        return path[thisIndex].refId === gramClassGroupId;
    };

    const stringPathA = pathFrag + `[${thisIndex}]`;

    const isFirst = thisIndex === 0;
    const isLast = thisIndex === path.length-1;

    return(
        <>
            <div className={`row${sectionOpen ? "" : " closed"}`}>
                <div className="row-controls">
                <AddPopup popupItems={popupItems} visible={addPopupVisible} />
                <i className={`fas fa-plus${popupItems.length === 0 ? " disabled" : ""}`} onClick={popupItems.length === 0 ? undefined : () => addPopupHandler(addPopupVisible, setAddPopupVisible)}></i>           
                <i className="fas fa-minus" onClick={deletePos}></i>
                <i className={`fas fa-chevron-${sectionOpen ? "up" : "down"}`} onClick={() => setSectionOpen(!sectionOpen)}></i>
                <i
                    className={`fas fa-arrow-up${isFirst ? " disabled" : ""}`}
                    onClick={e => moveRow(e, thisIndex, pathFrag, true)}
                ></i>
                <i
                    className={`fas fa-arrow-down${isLast ? " disabled" : ""}`}
                    onClick={e => moveRow(e, thisIndex, pathFrag, false)}>
                </i>
                </div>
                <div className="row-content pos-options" style={getIndent(prevIndent)}>
                    <div>Class group</div>
                    <ul>
                        {state.tempSetup.gramClassGroups.map((a, i) => (
                            <li key={i} value={a.id} className={ isCurrentSelection(a.id) ? "selected" : isAvailable(a.id) ? ""  : "disabled" } onClick={e => handleClick(e)}>{capitalize(a.name)}</li>
                        ))}
                    </ul>
                </div>
                <Limitations state={state} setState={setState} stringPath={stringPathA} prevIndent={prevIndent+1} />
            </div>
        </>
    );
};

export default GramClassSelect;