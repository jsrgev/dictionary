import AddPopup from './AddPopup.js';
import { clone, addPopupHandler, getIndent } from '../utils.js';
import {useState} from 'react';
import _ from 'lodash';

const IpaSetup = props => {

    const {appState, setAppState, thisIndex, stringPath, prevIndentLevel, moveItem, addForm} = props;

    let pathFrag = "ipa";
    const path = _.get(appState, "setup." + pathFrag);

    // let pathFrag = stringPath + ".ipa";
    // const path = _.get(appState, "setup." + pathFrag);

    console.log(stringPath)


    const [ipaOpen, setIpaOpen] = useState(true);
    const [addPopupVisible, setAddPopupVisible] = useState(false);

    const handleChange = (value, field) => {
        const setupCopy = clone(appState.setup);
        let setupCopyPath = _.get(setupCopy, pathFrag)
        setupCopyPath[thisIndex][field] = value;
        setAppState({setup: setupCopy});
    };

    // const posDefault = {name: "", abbr: ""};
    // const typeDefault = {name: "", abbr: ""};
    const formDefault = {name: "", abbr: ""};

    // addMorph: (index, pathFrag) => {
    //     let entryCopy = clone(state.entry);
    //     let entryCopyPath = _.get(entryCopy, pathFrag);
    //     entryCopyPath.splice(index+1, 0, clone(morphDefault));
    //     setState({entry: entryCopy});
    // },
    
    const deleteType = () => {
        let setupCopy = clone(appState.setup);
        let setupCopyPath = _.get(setupCopy, pathFrag)
            setupCopyPath.splice(thisIndex, 1);
        setAppState({setup: setupCopy});
    };

    const changeBasic = () => {
        const setupCopy = clone(appState.setup);
        let setupCopyPath = _.get(setupCopy, pathFrag)
        let newValue = setupCopyPath[thisIndex].basic ? false : true;
        for (let form of setupCopyPath) {
            form.basic = false;
        }
        setupCopyPath[thisIndex].basic = newValue;
        if (newValue === true && path[thisIndex].mayBeMissing === true) {
            setupCopyPath[thisIndex].mayBeMissing = false;
        }
        setAppState({setup: setupCopy});
    }

    const changeMayBeMissing = () => {
        const setupCopy = clone(appState.setup);
        let setupCopyPath = _.get(setupCopy, pathFrag)
        // let newValue = setupCopyPath[thisIndex].basic ? false : true;
        // for (let form of setupCopyPath) {
            // form.basic = false;
        // }
        setupCopyPath[thisIndex].mayBeMissing = !setupCopyPath[thisIndex].mayBeMissing;
        setAppState({setup: setupCopy});
    }
    
    const popupItems = [
        ["Form", () => addForm(thisIndex)],
    ];

    const isFirst = thisIndex === 0;
    const isLast = thisIndex === path.length-1;

    // console.log(path[thisIndex])
    
    return(
        <>
            <div className="row">
                <div className="row-controls">
                <AddPopup popupItems={popupItems} visible={addPopupVisible} />
                <i className="fas fa-plus" onClick={() => addPopupHandler(addPopupVisible, setAddPopupVisible)}></i>           
                <i className="fas fa-minus" onClick={deleteType}></i>
                { path[thisIndex].forms?.length>0 ?
                    <i className={`fas fa-chevron-${ipaOpen ? "up" : "down"}`} onClick={() => setIpaOpen(!ipaOpen)}></i>
                    : <i></i>
                }

                <i
                    className={`fas fa-arrow-up${isFirst ? " disabled" : ""}`}
                    onClick={e => moveItem(e, thisIndex, pathFrag, true)}
                ></i>
                <i
                    className={`fas fa-arrow-down${isLast ? " disabled" : ""}`}
                    onClick={e => moveItem(e, thisIndex, pathFrag, false)}
                ></i>

                </div>
                <div className="row-content" style={getIndent(prevIndentLevel)}>
                    <label>Group</label>
                    <input type="text" value={path[thisIndex].group} onChange={e => handleChange(e.target.value, "group")} />

                    <label>Color</label>
                    <input type="color" value={path[thisIndex].color} onChange={e => handleChange(e.target.value, "color")} />

                    <label>Characters</label>
                    <input type="text" value={path[thisIndex].characters} onChange={e => handleChange(e.target.value, "characters")} />

                    {/* <div onClick={changeBasic}>{path[thisIndex].basic ? "Citation form" : ""}</div> */}
                    {/* <div onClick={changeMayBeMissing}>{path[thisIndex].mayBeMissing ? "May be missing" : "May not be missing"}</div> */}
                    {/* { path[thisIndex].types?.length>0 &&
                        <>
                            <label>Types Allowed</label>
                            <ul className="types-of-POS">
                                <li>One</li>
                                <li>Multiple</li>
                            </ul>
                        </>
                    } */}
               </div>
            </div>
        </>
    )
};

export default IpaSetup;