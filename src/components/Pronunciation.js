import {clone, handleInputBlur, getIndent} from '../utils.js';
import {pronunciationDefault} from '../defaults.js';
import _ from "lodash";

const Pronunciation = (props) => {

    const {appState, setAppState, thisIndex, prevIndentLevel, stringPath} = props;
    // const path = appState.entry.primary[morphIndex].pronunciations;

    let pathFrag = stringPath + ".pronunciations";
    const path = _.get(appState, "entry." + pathFrag);
    // console.log(stringPath)
    // console.log(pathFrag)
    const handleChange = (value, field) => {
        if (value !== undefined) {
            let entryCopy = clone(appState.entry);
            let entryCopyPath = _.get(entryCopy, pathFrag)
            entryCopyPath[thisIndex].pronunciation = value;
            setAppState({entry:entryCopy});    
        }
    }

    const addPronunciation = e => {
        e.preventDefault();
        if (e.target.classList.contains("disabled")) {
            return;
        }
        let entryCopy = clone(appState.entry);
        let entryCopyPath = _.get(entryCopy, pathFrag)
        entryCopyPath.splice(thisIndex+1, 0, clone(pronunciationDefault));
        setAppState({entry: entryCopy});
    };

    const deletePronunciation = (e) => {
        e.preventDefault();
        let entryCopy = clone(appState.entry);
        let entryCopyPath = _.get(entryCopy, pathFrag)

        if (path.length === 1) {
            // entryCopyPath = [clone(pronunciationDefault)];
            // console.log(clone(pronunciationDefault)])
            // console.log(entryCopyPath)
            entryCopyPath.splice(0, 1, clone(pronunciationDefault));
        } else {
            entryCopyPath.splice(thisIndex, 1);
        }
        console.log(entryCopyPath)
        console.log(entryCopy)
        setAppState({entry: entryCopy});
    };

    console.log(path.length);
    console.log(path[thisIndex])

    return (
        <>
            <div className="row-controls">
                <i className="fas fa-plus" onClick={addPronunciation}></i>           
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