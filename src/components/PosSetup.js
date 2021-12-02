import {clone} from '../utils.js';
import TypeSetup from './TypeSetup';
import AddPopup from './AddPopup.js';
import { addPopupHandler } from '../utils.js';
import {useState} from 'react';
import _ from 'lodash';

const PosSetup = props => {

    const {appState, setAppState, thisIndex, moveItem} = props;

    let pathFrag = "partsOfSpeechDefs";
    const path = _.get(appState, "setup." + pathFrag);

    // const path = appState.setup.partsOfSpeechDefs;

    const [posOpen, setPosOpen] = useState(true);
    const [addPopupVisible, setAddPopupVisible] = useState(false);

    const handleChange = (value, field) => {
        const setupCopy = clone(appState.setup);
        let setupCopyPath = _.get(setupCopy, pathFrag)
        setupCopyPath[thisIndex][field] = value;
        setAppState({setup: setupCopy});
    };

    const changeMultichoice = value => {
        let setupCopy = clone(appState.setup);
        let setupCopyPath = _.get(setupCopy, pathFrag)
        setupCopyPath[thisIndex].multiChoice = value;
        setAppState({setup: setupCopy});
    }

    const posDefault = {name: "", abbr: "", multiChoice: false, types: []};
    const typeDefault = {name: "", abbr: "", forms: []};

    const addPos = () => {
        let setupCopy = clone(appState.setup);
        let setupCopyPath = _.get(setupCopy, pathFrag)
        setupCopyPath.splice(thisIndex+1, 0, clone(posDefault));
        setAppState({setup: setupCopy});
    };


    const addType = index => {
        let setupCopy = clone(appState.setup);
        let setupCopyPath = _.get(setupCopy, pathFrag)
        setupCopyPath[thisIndex].types.splice(index+1, 0, clone(typeDefault));
        setAppState({setup: setupCopy});
    };

    // addMorph: (index, pathFrag) => {
    //     let entryCopy = clone(state.entry);
    //     let entryCopyPath = _.get(entryCopy, pathFrag);
    //     entryCopyPath.splice(index+1, 0, clone(morphDefault));
    //     setState({entry: entryCopy});
    // },

    const addForms = () => {
        
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
        ["Type", () => addType(path[thisIndex].types.length-1)],
    ];

    
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
                { path[thisIndex].types.length>0 ?
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
                <div className="row-content">
                    <label>Part of Speech</label>
                    <input type="text" value={path[thisIndex].name} onChange={e => handleChange(e.target.value, "name")} />
                    <label>Abbreviation</label>
                    <input type="text" value={path[thisIndex].abbr} onChange={e => handleChange(e.target.value, "abbr")} />
                    { path[thisIndex].types.length>1 &&
                        <>
                            <label>Types Allowed</label>
                            <ul className="types-of-POS">
                                <li className={path[thisIndex].multiChoice ? "" : "selected"} onClick={() => changeMultichoice(false)}>One</li>
                                <li className={path[thisIndex].multiChoice ? "selected" : ""} onClick={() => changeMultichoice(true)}>Multiple</li>
                            </ul>
                        </>
                    }
               </div>
               { path[thisIndex].types.length>0 &&
                path[thisIndex].types.map((a, i) => (
                    <TypeSetup appState={appState} setAppState={setAppState} key={i} thisIndex={i} stringPath={stringPathA} prevIndentLevel={-1} moveItem={moveItem} addType={addType} />
                ))
               }
            </div>
        </>
    )
};

export default PosSetup;