import AddPopup from './AddPopup.js';
import {clone, handleInputBlur, getIndent} from '../utils.js';
import {pronunciationDefault} from '../defaults.js';
import {useState} from 'react';
import _ from "lodash";

const Pronunciation = (props) => {

    const {appState, setAppState, thisIndex, prevIndentLevel, stringPath, addPronunciation} = props;
    // const path = appState.entry.primary[morphIndex].pronunciations;

    // console.log(addPronunciation)

    let pathFrag = stringPath + ".pronunciations";
    const path = _.get(appState, "entry." + pathFrag);

    const [addPopupVisible, setAddPopupVisible] = useState(false);

    const handleChange = (value, field) => {
        if (value !== undefined) {
            let entryCopy = clone(appState.entry);
            let entryCopyPath = _.get(entryCopy, pathFrag)
            entryCopyPath[thisIndex].pronunciation = value;
            setAppState({entry:entryCopy});    
        }
    }

    const deletePronunciation = (e) => {
        let entryCopy = clone(appState.entry);
        let entryCopyPath = _.get(entryCopy, pathFrag)

        if (path.length === 1) {
            entryCopyPath.splice(0, 1, clone(pronunciationDefault));
        } else {
            entryCopyPath.splice(thisIndex, 1);
        }
        console.log(entryCopyPath)
        console.log(entryCopy)
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
        ["Pronunciation", e => addPronunciation(e, thisIndex)]
    ]

    // console.log(path.length);
    // console.log(path[thisIndex])

    return (
        <>
            <div className="row-controls">
                <AddPopup popupItems={popupItems} visible={addPopupVisible} setAddPopupVisible={setAddPopupVisible} />
                <i className="fas fa-plus" onClick={setAddPopupVisibleHandler}></i>           
                <i className={`fas fa-minus${path.length === 1 && path[thisIndex].pronunciation.trim() === "" ? " disabled" : ""}`} onClick={deletePronunciation}></i>           
            </div>
            <div className="row-content" style={getIndent(prevIndentLevel)}>
                <label>Pronunciation{path.length>1 && ` ${thisIndex+1}`}</label>
                <input type="text"
                value={path[thisIndex].pronunciation}
                onChange={e => handleChange(e.target.value, "pronunciation")}
                onBlur={e => handleChange(handleInputBlur(e), "pronunciation")}
                />
            </div>
            {/* <div></div> */}
            {/* <div></div> */}
            {/* <div className="row">
                <div className="row-controls"></div>
                <div className="row-content" style={getIndent(prevIndentLevel+1)} >
                    <label forhtml={`morph-${morphIndex}-pronunciation-${thisIndex}-note`}>Note</label>
                    <input id={`morph-${morphIndex}-pronunciation-${thisIndex}-note`} type="text"
                    value={path[thisIndex].note}
                    onChange={e => handleChange(e.target.value, "note")}
                    onBlur={e => handleChange(handleInputBlur(e), "note")}
                    />
                </div>
            </div> */}
        </>
    )
};

export default Pronunciation;