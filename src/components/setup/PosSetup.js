import AddPopup from '../AddPopup.js';
import GramClassSelect from './GramClassSelect.js';
import GramFormSelect from './GramFormSelect.js';
import { clone, capitalize, getIndent, addPopupHandler } from '../../utils.js';
import {posDefault} from './defaults.js';
import {useState} from 'react';
import _ from 'lodash';

const PosSetup = props => {

    const {appState, setAppState, thisIndex, moveItem} = props;

    let pathFrag = "partsOfSpeechDefs";
    const path = _.get(appState, "setup." + pathFrag);

    // const areClassGroupsSelected = (path[thisIndex].gramClassGroups.length > 0) ? true : false;

    const [posOpen, setPosOpen] = useState(true);
    const [addPopupVisible, setAddPopupVisible] = useState(false);

    const handleChange = (value, field) => {
        const setupCopy = clone(appState.setup);
        let setupCopyPath = _.get(setupCopy, pathFrag);
        setupCopyPath[thisIndex][field] = value;
        setAppState({setup: setupCopy});
    };

    const changeMultichoice = value => {
        let setupCopy = clone(appState.setup);
        let setupCopyPath = _.get(setupCopy, pathFrag);
        setupCopyPath[thisIndex].multiChoice = value;
        setAppState({setup: setupCopy});
    }

    // const handleClick = (gramClassName, field) => {
    //     let setupCopy = clone(appState.setup);
    //     let setupCopyPath = _.get(setupCopy, pathFrag);
    //     let index = path[thisIndex][field].findIndex(a => a === gramClassName);
    //     if (index < 0) {
    //         setupCopyPath[thisIndex][field].push(gramClassName);
    //     } else {
    //         setupCopyPath[thisIndex][field].splice(index, 1);
    //     }
    //     setAppState({setup: setupCopy});
    // };


    const addPos = () => {
        let setupCopy = clone(appState.setup);
        let setupCopyPath = _.get(setupCopy, pathFrag);

        let newPos = clone(posDefault);
        newPos.id = setupCopy.nextId.toString();
        setupCopy.nextId++;
        setupCopyPath.splice(thisIndex+1, 0, newPos);
        setAppState({setup: setupCopy});
    };

    const addGramClassOption = index => {
        let setupCopy = clone(appState.setup);
        let setupCopyPath = _.get(setupCopy, pathFrag);
        let obj = {refId: availableGramClassGroups[0].id};
        if (setupCopyPath[thisIndex].gramClassGroups) {
            setupCopyPath[thisIndex].gramClassGroups.splice(index+1, 0, obj);
        } else {
            setupCopyPath[thisIndex].gramClassGroups = [obj];
        }
        setAppState({setup: setupCopy});
    };

    const addGramFormGroup = index => {
        let setupCopy = clone(appState.setup);
        let setupCopyPath = _.get(setupCopy, pathFrag);
        let obj = {refId: availableGramClassAndFormGroups[0].id};
        if (setupCopyPath[thisIndex].gramFormGroups) {
            setupCopyPath[thisIndex].gramFormGroups.splice(index+1, 0, obj);
        } else {
            setupCopyPath[thisIndex].gramFormGroups = [obj];
        }
        setAppState({setup: setupCopy});
    };

    const deletePos = () => {
        let setupCopy = clone(appState.setup);
        let setupCopyPath = _.get(setupCopy, pathFrag);
        if (path.length === 1) {
            setupCopyPath.splice(0, 1, clone(posDefault));
        } else {
            setupCopyPath.splice(thisIndex, 1);
        }
        setAppState({setup: setupCopy});
    };

    const availableGramClassGroups = appState.setup.gramClassGroups.filter(a => {
        // console.log(path[thisIndex]);
        let alreadySelected = path[thisIndex].gramClassGroups?.some(b => b.refId === a.id);
        // console.log(alreadySelected);
        return !alreadySelected;
        // return !alreadySelected && a;
    })


    // console.log(path[thisIndex].gramClassGroups);
    const gramClassAndFormGroups = clone(appState.setup.gramClassGroups).concat(clone(appState.setup.gramFormGroups));
    // console.log(gramClassAndFormGroups);

    // console.log(gramClassAndFormGroups);

    const availableGramClassAndFormGroups = gramClassAndFormGroups.filter(a => {
        // console.log(path[thisIndex].gramFormGroups);
        let alreadySelected = path[thisIndex].gramFormGroups?.some(b => b.refId === a.id);
        return !alreadySelected;
        // return !alreadySelected && a;
    })
    // console.log(availableGramClassAndFormGroups);

    // console.log(path[thisIndex]);

    const popupItems = [
        ["Part of speech", addPos],
    ];

    if (availableGramClassGroups.length > 0) {
        popupItems.push(["Class option", () => addGramClassOption(path[thisIndex].gramClassGroups?.length-1 || -1)])
    };

    if (availableGramClassAndFormGroups.length > 0) {
        popupItems.push(["Form group", () => addGramFormGroup(path[thisIndex].gramFormGroups?.length-1)])
    };

    const stringPathA = pathFrag + `[${thisIndex}]`;

    const isFirst = thisIndex === 0;
    const isLast = thisIndex === path.length-1;

    // console.log(gramClassAndFormGroups);


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
                <div className="row-content partsOfSpeechSetup">
                    <label>Part of Speech</label>
                    <input type="text" value={path[thisIndex].name} onChange={e => handleChange(e.target.value, "name")} />
                    <label>Abbreviation</label>
                    <input type="text" value={path[thisIndex].abbr} onChange={e => handleChange(e.target.value, "abbr")} />
                </div>
                { path[thisIndex].gramClassGroups?.map((a, i) => (
                    <GramClassSelect key={i} appState={appState} setAppState={setAppState} thisIndex={i} moveItem={moveItem} stringPath={stringPathA} addGramClassOption={addGramClassOption} availableGramClassGroups={availableGramClassGroups} />))
                }
                { path[thisIndex].gramFormGroups?.map((a, i) => (
                    <GramFormSelect key={i} appState={appState} setAppState={setAppState} thisIndex={i} moveItem={moveItem} stringPath={stringPathA} addGramFormOption={addGramFormGroup} gramClassAndFormGroups={gramClassAndFormGroups} availableGramClassAndFormGroups={availableGramClassAndFormGroups} />))
                }
            </div>
        </>
    )
};

export default PosSetup;