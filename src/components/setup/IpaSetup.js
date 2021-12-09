import AddPopup from '../AddPopup.js';
import { clone, addPopupHandler } from '../../utils.js';
import {useState} from 'react';
import _ from 'lodash';

const IpaSetup = props => {

    const {appState, setAppState, thisIndex, moveItem} = props;

    let pathFrag = "ipa.content";
    const path = _.get(appState, "setup." + pathFrag);

    let groupDefault = {
        group: "",
        characters: [],
        bgColor: "#9ac0ff",
        textColor: "#000000",
    }


    const [ipaOpen, setIpaOpen] = useState(true);
    const [addPopupVisible, setAddPopupVisible] = useState(false);

    const handleChange = (value, field) => {
        const setupCopy = clone(appState.setup);
        let setupCopyPath = _.get(setupCopy, pathFrag)
        setupCopyPath[thisIndex][field] = value;
        setAppState({setup: setupCopy});
    };

    const changeCharacters = value => {
        const setupCopy = clone(appState.setup);
        let setupCopyPath = _.get(setupCopy, pathFrag)
        setupCopyPath[thisIndex].characters = value.split(" ");
        setAppState({setup: setupCopy});
    };

    const addGroup = () => {
        let setupCopy = clone(appState.setup);
        let setupCopyPath = _.get(setupCopy, pathFrag);
        setupCopyPath.splice(thisIndex+1, 0, clone(groupDefault));
        setAppState({setup: setupCopy});
    };
    
    const deleteGroup = () => {
        let setupCopy = clone(appState.setup);
        let setupCopyPath = _.get(setupCopy, pathFrag)
            setupCopyPath.splice(thisIndex, 1);
        setAppState({setup: setupCopy});
    };

    
    const popupItems = [
        ["Group", () => addGroup()],
    ];

    const isFirst = thisIndex === 0;
    const isLast = thisIndex === path.length-1;
    
    return(
        <>
            <div className="row">
                <div className="row-controls">
                <AddPopup popupItems={popupItems} visible={addPopupVisible} />
                <i className="fas fa-plus" onClick={() => addPopupHandler(addPopupVisible, setAddPopupVisible)}></i>           
                <i className="fas fa-minus" onClick={deleteGroup}></i>
                { path[thisIndex].gramForms?.length>0 ?
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
                <div className="row-content ipa">
                    <label>Group</label>
                    <input type="text" value={path[thisIndex].group} onChange={e => handleChange(e.target.value, "group")} />

                    <label>Background color</label>
                    <input type="color" value={path[thisIndex].bgColor} onChange={e => handleChange(e.target.value, "bgColor")} />

                    <label>Text color</label>
                    <input type="color" value={path[thisIndex].textColor} onChange={e => handleChange(e.target.value, "textColor")} />

                    <label>Characters</label>
                    <input type="text" value={path[thisIndex].characters.join(" ")} onChange={e => changeCharacters(e.target.value)} />
               </div>
            </div>
        </>
    );
};

export default IpaSetup;