// import GramClassSetup from './GramClassSetup';
import AddPopup from '../AddPopup.js';
import { clone, capitalize, getIndent, addPopupHandler } from '../../utils.js';
import {useState} from 'react';
import _ from 'lodash';

const PosSetup = props => {

    const {appState, setAppState, thisIndex, moveItem, stringPath, addGramClassOption, availableClassGroups} = props;

    let pathFrag = stringPath + ".gramClassGroups";
    const path = _.get(appState, "setup." + pathFrag);
    // console.log(path);

    const areClassGroupsSelected = (path.length > 0) ? true : false;

    const [posOpen, setPosOpen] = useState(areClassGroupsSelected);
    const [addPopupVisible, setAddPopupVisible] = useState(false);

    const handleChange = (value, field) => {
        const setupCopy = clone(appState.setup);
        let setupCopyPath = _.get(setupCopy, pathFrag);
        setupCopyPath[thisIndex][field] = value;
        setAppState({setup: setupCopy});
    };

    const handleClick = async (e, i) => {
        let value = e.target.getAttribute("value");
        if (!isAvailable(value)) {
            return;
        }
        let setupCopy = clone(appState.setup);
        let setupCopyPath = _.get(setupCopy, pathFrag);
        setupCopyPath[thisIndex] = clone(appState.setup.gramClassGroups[i]);
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
    // }
    

    const posDefault = {name: "", abbr: "", multiChoice: false, gramClassGroups: [], agrGramFormGroups: [], intGramFormGroups: [] };
    const gramClassDefault = {name: "", abbr: "", gramForms: []};

    const gramClassSetDefault = {
        name: "",
        gramClassGroups: [
            {
                name: "",
                abbr: "",
            }
        ],
        agrGramFormGroups: [],
        intrGramFormGroups: []
    };

    const addPos = () => {
        let setupCopy = clone(appState.setup);
        let setupCopyPath = _.get(setupCopy, pathFrag)
        setupCopyPath.splice(thisIndex+1, 0, clone(posDefault));
        setAppState({setup: setupCopy});
    };


    // const addClassOptionnn = index => {
    //     let setupCopy = clone(appState.setup);
    //     let setupCopyPath = _.get(setupCopy, pathFrag)
    //     setupCopyPath[thisIndex].gramClassGroups.splice(index+1, 0, clone(gramClassSetDefault));
    //     setAppState({setup: setupCopy});
    // };
        // console.log(path[thisIndex].gramClassGroups);

    const addGramClass = index => {
        let setupCopy = clone(appState.setup);
        let setupCopyPath = _.get(setupCopy, pathFrag)
        setupCopyPath[thisIndex].gramClasses.splice(index+1, 0, clone(gramClassDefault));
        setAppState({setup: setupCopy});
    };
    
    const deletePos = () => {
        let setupCopy = clone(appState.setup);
        let setupCopyPath = _.get(setupCopy, pathFrag)
        if (path.length === 1) {
            setupCopyPath.splice(0, 1, clone(posDefault));
        } else {
            setupCopyPath.splice(thisIndex, 1);
        }
        setAppState({setup: setupCopy});
    };

    const popupItems = [
        ["Part of speech", addPos],
        // ["Class set", () => addClassSet(path[thisIndex].gramClassGroups.length-1)],
    ];

    console.log(path[thisIndex]);

    if (availableClassGroups.length > 0) {
        popupItems.push(["Class option", () => addGramClassOption(thisIndex)]);
    };

    const isAvailable = gramClassGroup => {
        // console.log(gramClassGroup);
        // console.log(availableClassGroups)
        return availableClassGroups.some(a => a.name === gramClassGroup);
    };
    

    const isCurrentSelection = gramClassGroup =>  {
        // console.log(gramClassGroup);
        // console.log(path[thisIndex]);
        return path[thisIndex].name === gramClassGroup;
    }



    // const stringPathA = pathFrag + `[${thisIndex}]`;

    const isFirst = thisIndex === 0;
    const isLast = thisIndex === path.length-1;

    // console.log(path);

    const gramClassAndFormGroups = clone(appState.setup.gramClassGroups).concat(clone(appState.setup.gramFormGroups));
    // console.log(gramClassAndFormGroups);


    return(
        <>
            <div className={`row${posOpen ? "" : " closed"}`}>
                <div className="row-controls">
                <AddPopup popupItems={popupItems} visible={addPopupVisible} />
                <i className="fas fa-plus" onClick={() => addPopupHandler(addPopupVisible, setAddPopupVisible)}></i>           
                <i className="fas fa-minus" onClick={deletePos}></i>
                { appState.setup.gramClassGroups.length>0 ?
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
                <div className="row-content pos-options" style={getIndent(0)}>
                    <div>Class options</div>
                    <ul>
                        {appState.setup.gramClassGroups.map((a, i) => (
                            <li key={i} value={a.name} className={ isCurrentSelection(a.name) ? "selected" : isAvailable(a.name) ? ""  : "disabled" } onClick={e => handleClick(e, i)}>{capitalize(a.name)}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    )
};

export default PosSetup;