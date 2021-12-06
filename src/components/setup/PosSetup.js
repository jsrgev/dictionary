// import GramClassSetup from './GramClassSetup';
import AddPopup from '../AddPopup.js';
import { clone, capitalize, getIndent, addPopupHandler } from '../../utils.js';
import {useState} from 'react';
import _ from 'lodash';

const PosSetup = props => {

    const {appState, setAppState, thisIndex, moveItem} = props;

    let pathFrag = "partsOfSpeechDefs";
    const path = _.get(appState, "setup." + pathFrag);

    const areClassGroupsSelected = (path[thisIndex].gramClassGroups.length > 0) ? true : false;

    const [posOpen, setPosOpen] = useState(areClassGroupsSelected);
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

    const handleClick = (gramClassName, field) => {
        let setupCopy = clone(appState.setup);
        let setupCopyPath = _.get(setupCopy, pathFrag);
        // console.log(setupCopyPath);
        // console.log(field);
        // return;
        let index = path[thisIndex][field].findIndex(a => a === gramClassName);
        if (index < 0) {
            setupCopyPath[thisIndex][field].push(gramClassName);
        } else {
            setupCopyPath[thisIndex][field].splice(index, 1);
        }
        setAppState({setup: setupCopy});
    }
    

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


    const addClassSet = index => {
        let setupCopy = clone(appState.setup);
        let setupCopyPath = _.get(setupCopy, pathFrag)
        setupCopyPath[thisIndex].gramClassGroups.splice(index+1, 0, clone(gramClassSetDefault));
        setAppState({setup: setupCopy});
    };
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
        ["Class set", () => addClassSet(path[thisIndex].gramClassGroups.length-1)],
    ];

    const isAvailable = (a) => {
        return true;
    };
    
    const isSelected = (gramClassName, field) =>  {
        console.log(field)
        console.log(path[thisIndex][field])
        return path[thisIndex][field].some(a => a === gramClassName);
    };



    // const stringPathA = pathFrag + `[${thisIndex}]`;

    const isFirst = thisIndex === 0;
    const isLast = thisIndex === path.length-1;

    // console.log(path[thisIndex]);

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
                <div className="row-content partsOfSpeechSetup">
                    <label>Part of Speech</label>
                    <input type="text" value={path[thisIndex].name} onChange={e => handleChange(e.target.value, "name")} />
                    <label>Abbreviation</label>
                    <input type="text" value={path[thisIndex].abbr} onChange={e => handleChange(e.target.value, "abbr")} />
                </div>
                {/* { path[thisIndex].gramClassGroups.length > 0 && */}
                    {/* path[thisIndex].gramClassGroups.map((a, i) => ( */}

                    {/* <> */}
                <div className="row">
                    <div className="row-controls"></div>
                    <div className="row-content pos-options" style={getIndent(0)}>
                        <div>Class options</div>
                        <ul>
                            {appState.setup.gramClassGroups.map((a, i) => (
                                <li key={i} value={a.name} className={ isSelected(a.name, "gramClassGroups") ? "selected" : isAvailable(a.name) ? ""  : "disabled" } onClick={() => handleClick(a.name, "gramClassGroups")}>{capitalize(a.name)}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="row">
                    <div className="row-controls"></div>
                    <div className="row-content pos-options" style={getIndent(0)}>
                        <div>Agreement forms</div>
                        <ul>
                            {appState.setup.gramClassGroups.map((a, i) => (
                                <li key={i} value={a.name} className={ isSelected(a.name, "agrGramFormGroups") ? "selected" : isAvailable(a.name) ? ""  : "disabled" } onClick={() => handleClick(a.name, "agrGramFormGroups")}>{capitalize(a.name)}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="row">
                    <div className="row-controls"></div>
                    <div className="row-content pos-options" style={getIndent(0)}>
                        <div>Intrinsic forms</div>
                        <ul>
                            {appState.setup.gramFormGroups.map((a, i) => (
                                <li key={i} value={a.name} 
                                   className={ isSelected(a.name, "intrGramFormGroups") ? "selected" : isAvailable(a.name) ? ""  : "disabled" }
                                // className={ isSelected(a.name) ? "selected" : isAvailable(a.name) ? ""  : "disabled" }
                                 onClick={() => handleClick(a.name, "intrGramFormGroups")}>{capitalize(a.name)}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                    {/* </> */}
                    {/* ))} */}
                    {/* { path[thisIndex].gramClasses.length>1 &&
                        <>
                            <label>Classes Allowed</label>
                            <ul>
                                <li className={path[thisIndex].multiChoice ? "" : "selected"} onClick={() => changeMultichoice(false)}>One</li>
                                <li className={path[thisIndex].multiChoice ? "selected" : ""} onClick={() => changeMultichoice(true)}>Multiple</li>
                            </ul>
                        </>
                    } */}
               {/* </div> */}
               {/* { path[thisIndex].gramClasses.length>0 &&
                path[thisIndex].gramClasses.map((a, i) => (
                    <GramClassSetup appState={appState} setAppState={setAppState} key={i} thisIndex={i} stringPath={stringPathA} prevIndentLevel={0} moveItem={moveItem} addGramClass={addGramClass} />
                ))
               } */}
            </div>
        </>
    )
};

export default PosSetup;