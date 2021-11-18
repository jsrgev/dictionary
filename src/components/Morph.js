import Pronunciation from './Pronunciation';
import AddPopup from './AddPopup';
import {clone, getIndent, handleInputBlur} from '../utils.js';
import {orthForm} from '../defaults.js';
import {useState} from 'react';
import _ from "lodash";

const Morph = props => {

    const {appState, setAppState, thisIndex, stringPath, prevIndentLevel, labels} = props;
    // const path = appState.entry.primary[thisIndex];
    
    let pathFrag = stringPath + "";
    const path = _.get(appState, "entry." + pathFrag);

    const [addPopupVisible, setAddPopupVisible] = useState(false);


    const handleChange = value => {
        if (value !== undefined) {
            let entryCopy = clone(appState.entry);
            let entryCopyPath = _.get(entryCopy, pathFrag)
            entryCopyPath[thisIndex].targetLang = value;
            setAppState({entry:entryCopy});
        }
    }

    const addMorph = (e, index) => {
        // index = index ?? appState.entry.senseGroups[senseGroupIndex].definitions.length-1;
        // e.preventDefault();
        if (e.target.classList.contains("disabled")) {
            return;
        }
        let entryCopy = clone(appState.entry);
        let entryCopyPath = _.get(entryCopy, pathFrag)
        entryCopyPath.splice(index+1, 0, clone(orthForm));
        setAppState({entry: entryCopy});
    };
    
    const deleteMorph = e => {
        e.preventDefault();
        let entryCopy = clone(appState.entry);
        let entryCopyPath = _.get(entryCopy, pathFrag)
        // console.log(appState.entry.primary.length)
        // return;
        if (entryCopyPath.length === 1) {
            entryCopyPath.splice(0, 1, clone(orthForm));
        } else {
            entryCopyPath.splice(thisIndex, 1);
        }
        setAppState({entry: entryCopy});
    };    

    const closePopup = () => {
        setAddPopupVisible(false)
        window.removeEventListener("click", closePopup);
    }

    const setAddPopupVisibleHandler = () => {
        setAddPopupVisible(!addPopupVisible);
        setTimeout(() => {
            window.addEventListener("click", closePopup);
        }, 100)
    }

    const popupItems = [
        ["Alternate form", addMorph],
    ]

    let stringPathA = `${stringPath}[${thisIndex}]`;

    return (
        <>
            <div className="row-controls">
                <AddPopup popupItems={popupItems} visible={addPopupVisible} setAddPopupVisible={setAddPopupVisible} />
                <i className="fas fa-plus"
                // onClick={e => addMorph(e, thisIndex)}
                onClick={setAddPopupVisibleHandler}
                ></i>
                <i className={`fas fa-minus${path.length === 1 && path[thisIndex].targetLang.trim() === "" ? " disabled" : ""}`} onClick={deleteMorph}></i>           
            </div>
            <div className="row-content" style={getIndent(prevIndentLevel)}>
                <label forhtml={`targetLang-${thisIndex}`} >{thisIndex===0 ? labels[0] : labels[1]}</label>
                <input id={`targetLang-${thisIndex}`} type="text"
                value={path[thisIndex].targetLang}
                onChange={e => handleChange(e.target.value)}
                onBlur={e => handleChange(handleInputBlur(e))}
                />
            </div>
            <div className="row">
                {path[thisIndex].pronunciations.map((a,i) => (
                    <Pronunciation appState={appState} setAppState={setAppState} key={i} thisIndex={i} prevIndentLevel={prevIndentLevel+1} stringPath={stringPathA}
                    />
                ))}
            </div>
        </>
    )
};

export default Morph;