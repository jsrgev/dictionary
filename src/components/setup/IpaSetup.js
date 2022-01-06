import AddPopup from '../AddPopup.js';
import { clone, addPopupHandler } from '../../utils.js';
import {useState} from 'react';
import _ from 'lodash';

const IpaSetup = props => {

    const {appState, setAppState, thisIndex, moveItem} = props;

    const pathFrag = "ipa.content";
    const path = _.get(appState, "tempSetup." + pathFrag);

    const groupDefault = {
        group: "",
        characters: [],
        bgColor: "#9ac0ff",
        textColor: "#000000",
    };


    const [ipaOpen, setIpaOpen] = useState(true);
    const [addPopupVisible, setAddPopupVisible] = useState(false);

    const handleChange = (value, field) => {
        const setupCopy = clone(appState.tempSetup);
        let setupCopyPath = _.get(setupCopy, pathFrag);
        setupCopyPath[thisIndex][field] = value;
        setAppState({tempSetup: setupCopy});
    };

    const changeCharacters = value => {
        const setupCopy = clone(appState.tempSetup);
        let setupCopyPath = _.get(setupCopy, pathFrag);
        setupCopyPath[thisIndex].characters = value.split(" ");
        setAppState({tempSetup: setupCopy});
    };

    const addGroup = () => {
        let setupCopy = clone(appState.tempSetup);
        let setupCopyPath = _.get(setupCopy, pathFrag);
        setupCopyPath.splice(thisIndex+1, 0, clone(groupDefault));
        setAppState({tempSetup: setupCopy});
    };
    
    const deleteGroup = () => {
        let setupCopy = clone(appState.tempSetup);
        let setupCopyPath = _.get(setupCopy, pathFrag);
            setupCopyPath.splice(thisIndex, 1);
        setAppState({tempSetup: setupCopy});
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
                    <label htmlFor={`${pathFrag}[${thisIndex}].group`}>Group</label>
                    <input id={`${pathFrag}[${thisIndex}].group`} type="text" value={path[thisIndex].group} onChange={e => handleChange(e.target.value, "group")} />

                    <label htmlFor={`${pathFrag}[${thisIndex}].bg-color`}>Background color</label>
                    <input id={`${pathFrag}[${thisIndex}].bg-color`} type="color" value={path[thisIndex].bgColor} onChange={e => handleChange(e.target.value, "bgColor")} />

                    <label htmlFor={`${pathFrag}[${thisIndex}].text-color`}>Text color</label>
                    <input id={`${pathFrag}[${thisIndex}].text-color`} type="color" value={path[thisIndex].textColor} onChange={e => handleChange(e.target.value, "textColor")} />

                    <label htmlFor={`${pathFrag}[${thisIndex}].characters`}>Characters</label>
                    <input id={`${pathFrag}[${thisIndex}].characters`} type="text" value={path[thisIndex].characters.join(" ")} onChange={e => changeCharacters(e.target.value)} />
               </div>
            </div>
        </>
    );
};

export default IpaSetup;