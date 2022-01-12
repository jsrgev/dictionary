import AddPopup from '../AddPopup.js';
import { clone, addPopupHandler, getIndent } from '../../utils.js';
import {groupDefault} from './defaults.js';
import {useState} from 'react';
import _ from 'lodash';

const PaletteGroupSetup = props => {

    const {state, setState, thisIndex, moveItem, stringPath, prevIndent} = props;

    const pathFrag = stringPath + ".content";
    const path = _.get(state, "tempSetup." + pathFrag);

    const [groupOpen, setGroupOpen] = useState(true);
    const [addPopupVisible, setAddPopupVisible] = useState(false);

    const handleChange = (value, field) => {
        const setupCopy = clone(state.tempSetup);
        let setupCopyPath = _.get(setupCopy, pathFrag);
        setupCopyPath[thisIndex][field] = value;
        setState({tempSetup: setupCopy});
    };

    const changeCharacters = value => {
        const setupCopy = clone(state.tempSetup);
        let setupCopyPath = _.get(setupCopy, pathFrag);
        setupCopyPath[thisIndex].characters = value.split(" ");
        setState({tempSetup: setupCopy});
    };

    const addGroup = () => {
        let setupCopy = clone(state.tempSetup);
        let setupCopyPath = _.get(setupCopy, pathFrag);
        setupCopyPath.splice(thisIndex+1, 0, clone(groupDefault));
        setState({tempSetup: setupCopy});
    };
    
    const deleteGroup = () => {
        let setupCopy = clone(state.tempSetup);
        let setupCopyPath = _.get(setupCopy, pathFrag);
        if (setupCopyPath.length === 1) {
            setupCopyPath.splice(0, 1, clone(groupDefault));
        } else {
            setupCopyPath.splice(thisIndex, 1);
        }
        setState({tempSetup: setupCopy});
    };
    
    const popupItems = [
        ["Group", () => addGroup()],
    ];

    const isFirst = thisIndex === 0;
    const isLast = thisIndex === path.length-1;
    
    const groupIsEmpty = () => path[thisIndex].characters.length === 0 && path[thisIndex].name === "";

    return(
        <>
            <div className={`row${groupOpen ? "" : " closed"}`}>
                <div className="row-controls">
                    <AddPopup popupItems={popupItems} visible={addPopupVisible} />
                    <i className="fas fa-plus" onClick={() => addPopupHandler(addPopupVisible, setAddPopupVisible)}></i>           
                    <i className={`fas fa-minus${path.length === 1 && groupIsEmpty() ? " disabled" : ""}`} onClick={deleteGroup}></i>
                    <i className={`fas fa-chevron-${groupOpen ? "up" : "down"}`} onClick={() => setGroupOpen(!groupOpen)}></i>
                    <i
                        className={`fas fa-arrow-up${isFirst ? " disabled" : ""}`}
                        onClick={e => moveItem(e, thisIndex, pathFrag, true)}
                    ></i>
                    <i
                        className={`fas fa-arrow-down${isLast ? " disabled" : ""}`}
                        onClick={e => moveItem(e, thisIndex, pathFrag, false)}
                    ></i>
                </div>
                <div className="row-content palette-group" style={getIndent(prevIndent)}>
                    <label htmlFor={`${pathFrag}[${thisIndex}].name`}>Group</label>
                    <input id={`${pathFrag}[${thisIndex}].name`} type="text" value={path[thisIndex].name} onChange={e => handleChange(e.target.value, "name")} />

                    <label htmlFor={`${pathFrag}[${thisIndex}].bg-color`}>Background color</label>
                    <input id={`${pathFrag}[${thisIndex}].bg-color`} type="color" value={path[thisIndex].bgColor} onChange={e => handleChange(e.target.value, "bgColor")} />

                    <label htmlFor={`${pathFrag}[${thisIndex}].text-color`}>Text color</label>
                    <input id={`${pathFrag}[${thisIndex}].text-color`} type="color" value={path[thisIndex].textColor} onChange={e => handleChange(e.target.value, "textColor")} />
                </div>
                <div className="row">
                    <div className="row-controls"></div>
                    <div className="row-content" style={getIndent(prevIndent+1)}>
                        <label htmlFor={`${pathFrag}[${thisIndex}].characters`}>Characters</label>
                        <input className="for norm" id={`${pathFrag}[${thisIndex}].characters`} type="text" value={path[thisIndex].characters.join(" ")} onChange={e => changeCharacters(e.target.value)} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default PaletteGroupSetup;