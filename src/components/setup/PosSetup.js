import AddPopup from '../AddPopup.js';
import GramClassSelect from './GramClassSelect.js';
import GramFormSelect from './GramFormSelect.js';
import { clone, addPopupHandler, getIndent } from '../../utils.js';
import {posDefault} from './defaults.js';
import {useState} from 'react';
import _ from 'lodash';

const PosSetup = props => {

    const {state, setState, thisIndex, moveItem, prevIndent, addPos} = props;

    const pathFrag = "partsOfSpeechDefs";
    const path = _.get(state, "tempSetup." + pathFrag);

    const [posOpen, setPosOpen] = useState(true);
    const [addPopupVisible, setAddPopupVisible] = useState(false);

    const handleChange = (value, field) => {
        const setupCopy = clone(state.tempSetup);
        let setupCopyPath = _.get(setupCopy, pathFrag);
        setupCopyPath[thisIndex][field] = value;
        setState({tempSetup: setupCopy});
    };

    // const addPos = () => {
    //     let setupCopy = clone(state.tempSetup);
    //     let setupCopyPath = _.get(setupCopy, pathFrag);

    //     let newPos = clone(posDefault);
    //     newPos.id = setupCopy.nextId.toString();
    //     setupCopy.nextId++;
    //     setupCopyPath.splice(thisIndex+1, 0, newPos);
    //     setState({tempSetup: setupCopy});
    // };

    const addGramClassOption = index => {
        let setupCopy = clone(state.tempSetup);
        let setupCopyPath = _.get(setupCopy, pathFrag);
        let obj = {refId: availableGramClassGroups[0].id};
        if (setupCopyPath[thisIndex].gramClassGroups) {
            setupCopyPath[thisIndex].gramClassGroups.splice(index+1, 0, obj);
        } else {
            setupCopyPath[thisIndex].gramClassGroups = [obj];
        }
        setState({tempSetup: setupCopy});
    };

    const addGramFormGroup = index => {
        let setupCopy = clone(state.tempSetup);
        let setupCopyPath = _.get(setupCopy, pathFrag);
        let obj = {refId: availableGramClassAndFormGroups[0].id};
        if (setupCopyPath[thisIndex].gramFormGroups) {
            setupCopyPath[thisIndex].gramFormGroups.splice(index+1, 0, obj);
        } else {
            setupCopyPath[thisIndex].gramFormGroups = [obj];
        }
        setState({tempSetup: setupCopy});
    };

    const deletePos = () => {
        let setupCopy = clone(state.tempSetup);
        let setupCopyPath = _.get(setupCopy, pathFrag);
        if (path.length === 1) {
            let newPos = clone(posDefault);
            newPos.id = setupCopy.nextId.toString();
            setupCopy.nextId++;
            setupCopyPath.splice(0, 1, newPos);
        } else {
            setupCopyPath.splice(thisIndex, 1);
        }
        setState({tempSetup: setupCopy});
    };

    const availableGramClassGroups = state.tempSetup.gramClassGroups.filter(a => {
        let alreadySelected = path[thisIndex].gramClassGroups?.some(b => b.refId === a.id);
        return !alreadySelected;
    });

    const gramClassAndFormGroups = clone(state.tempSetup.gramClassGroups).concat(clone(state.tempSetup.gramFormGroups));

    const availableGramClassAndFormGroups = gramClassAndFormGroups.filter(a => {
        let alreadySelected = path[thisIndex].gramFormGroups?.some(b => b.refId === a.id);
        return !alreadySelected;
    });

    const popupItems = [
        ["Part of speech", () => addPos(thisIndex)],
    ];

    if (availableGramClassGroups.length > 0) {
        popupItems.push(["Class option", () => addGramClassOption(path[thisIndex].gramClassGroups?.length-1 ?? -1)]);
    }

    if (availableGramClassAndFormGroups.length > 0) {
        popupItems.push(["Form group", () => addGramFormGroup(path[thisIndex].gramFormGroups?.length-1)])
    }

    const stringPathA = pathFrag + `[${thisIndex}]`;

    const isFirst = thisIndex === 0;
    const isLast = thisIndex === path.length-1;

    return(
        <>
            <div className={`row${posOpen ? "" : " closed"}`}>
                <div className="row-controls">
                <AddPopup popupItems={popupItems} visible={addPopupVisible} />
                <i className="fas fa-plus" onClick={() => addPopupHandler(addPopupVisible, setAddPopupVisible)}></i>           
                <i className="fas fa-minus" onClick={deletePos}></i>
                { path[thisIndex].gramClassGroups?.length>0 || path[thisIndex].gramFormGroups?.length>0 ?
                    <i className={`fas fa-chevron-${posOpen ? "up" : "down"}`} onClick={() => setPosOpen(!posOpen)}></i>
                    : <i></i>
                }
                <i
                    className={`fas fa-arrow-up${isFirst ? " disabled" : ""}`}
                    onClick={e => moveItem(e, thisIndex, pathFrag, true)}
                ></i>
                <i
                    className={`fas fa-arrow-down${isLast ? " disabled" : ""}`}
                    onClick={e => moveItem(e, thisIndex, pathFrag, false)}>
                </i>
                </div>
                <div className="row-content double-input" style={getIndent(prevIndent)}>
                    <label htmlFor={`${pathFrag}[${thisIndex}].name`}>Part of Speech</label>
                    <input id={`${pathFrag}[${thisIndex}].name`} type="text" value={path[thisIndex].name} onChange={e => handleChange(e.target.value, "name")} />
                    <label htmlFor={`${pathFrag}[${thisIndex}].abbr`}>Abbreviation</label>
                    <input id={`${pathFrag}[${thisIndex}].abbr`} type="text" value={path[thisIndex].abbr} onChange={e => handleChange(e.target.value, "abbr")} />
                </div>
                { path[thisIndex].gramClassGroups?.map((a, i) => (
                    <GramClassSelect key={i} state={state} setState={setState} thisIndex={i} moveItem={moveItem} stringPath={stringPathA} addGramClassOption={addGramClassOption} availableGramClassGroups={availableGramClassGroups} prevIndent={prevIndent+1} />))
                }
                { path[thisIndex].gramFormGroups?.map((a, i) => (
                    <GramFormSelect key={i} state={state} setState={setState} thisIndex={i} moveItem={moveItem} stringPath={stringPathA} addGramFormOption={addGramFormGroup} gramClassAndFormGroups={gramClassAndFormGroups} availableGramClassAndFormGroups={availableGramClassAndFormGroups} prevIndent={prevIndent+1} />))
                }
            </div>
        </>
    );
};

export default PosSetup;