import AddPopup from '../../AddPopup';
import { clone, capitalize, getIndent, addPopupHandler } from '../../../utils.js';
import {useState} from 'react';
import _ from 'lodash';

const GramFormSelect = props => {

    const {state, setState, thisIndex, moveRow, stringPath, addGramFormOption, gramClassAndFormGroups, availableGramClassAndFormGroups, prevIndent} = props;

    const pathFrag = stringPath + ".gramFormGroups";
    const path = _.get(state, "tempSetup." + pathFrag);

    // const [sectionOpen, setSectionOpen] = useState(true);
    const [addPopupVisible, setAddPopupVisible] = useState(false);

    const handleClick = async e => {
        let value = e.target.getAttribute("value");
        if (!isAvailable(value)) {
            return;
        }
        let setupCopy = clone(state.tempSetup);
        let setupCopyPath = _.get(setupCopy, pathFrag);

        let obj = {refId: value};
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

    if (availableGramClassAndFormGroups.length > 0) {
        popupItems.push(["Form group", () => addGramFormOption(thisIndex)]);
    }

    const isAvailable = gramFormGroupId => {
        return availableGramClassAndFormGroups.some(a => a.id === gramFormGroupId);
    };
    
    const isCurrentSelection = gramFormGroupId =>  {
        return path[thisIndex].refId === gramFormGroupId;
    }

    // const stringPathA = pathFrag + `[${thisIndex}]`;

    const isFirst = thisIndex === 0;
    const isLast = thisIndex === path.length-1;

    return(
        <>
            <div className="row">
            {/* <div className={`row${sectionOpen ? "" : " closed"}`}> */}
                <div className="row-controls">
                <AddPopup popupItems={popupItems} visible={addPopupVisible} />
                <i className="fas fa-plus" onClick={() => addPopupHandler(addPopupVisible, setAddPopupVisible)}></i>           
                <i className="fas fa-minus" onClick={deletePos}></i>
                {/* <i className={`fas fa-chevron-${sectionOpen ? "up" : "down"}`} onClick={() => setSectionOpen(!sectionOpen)}></i> */}
                <i></i>
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
                    <div>Form group</div>
                    <ul>
                        {gramClassAndFormGroups.map((a, i) => (
                            <li key={i} value={a.id} className={ isCurrentSelection(a.id) ? "selected" : isAvailable(a.id) ? ""  : "disabled" } onClick={e => handleClick(e)}>{capitalize(a.name)}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default GramFormSelect;