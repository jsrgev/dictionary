import Pronunciation from './Pronunciation';
import {clone, getIndent, handleBlur} from '../utils.js';
import {orthForm} from '../defaults.js';
import _ from "lodash";

const Morph = props => {

    const {appState, setAppState, thisIndex, stringPath, prevIndentLevel, labels} = props;
    // const path = appState.entry.primary[thisIndex];
    
    let pathFrag = stringPath + "";
    const path = _.get(appState, "entry." + pathFrag);


    const handleChange = value => {
        if (value !== undefined) {
            let entryCopy = clone(appState.entry);
            let entryCopyPath = _.get(entryCopy, pathFrag)
            entryCopyPath[thisIndex].targetLang = value;
            setAppState({entry:entryCopy});
        }
    }

    const addMorph = e => {
        e.preventDefault();
        if (e.target.classList.contains("disabled")) {
            return;
        }
        let entryCopy = clone(appState.entry);
        let entryCopyPath = _.get(entryCopy, pathFrag)
        entryCopyPath.splice(thisIndex+1, 0, clone(orthForm));
        setAppState({entry: entryCopy});
    };

    const deleteMorph = e => {
        e.preventDefault();
        let entryCopy = clone(appState.entry);
        let entryCopyPath = _.get(entryCopy, pathFrag)
        if (appState.entry.primary.length === 1) {
            entryCopyPath.splice(0, 1, clone(orthForm));
        } else {
            entryCopyPath.splice(thisIndex, 1);
        }
        setAppState({entry: entryCopy});
    };    

    let stringPathA = `${stringPath}[${thisIndex}]`;

    return (
        <>
            <div className="row-controls">
            <i className={`fas fa-plus${path[thisIndex].targetLang.trim() === "" ? " disabled" : ""}`} onClick={addMorph}></i>
             <i className={`fas fa-minus${appState.entry.primary.length === 1 && path[thisIndex].targetLang.trim() === "" ? " disabled" : ""}`} onClick={deleteMorph}></i>           

            </div>
            <div className="row-content" style={getIndent(prevIndentLevel)}>
                <label forhtml={`targetLang-${thisIndex}`} >{thisIndex===0 ? labels[0] : labels[1]}</label>
                <input id={`targetLang-${thisIndex}`} type="text"
                value={path[thisIndex].targetLang}
                onChange={e => handleChange(e.target.value)}
                onBlur={e => handleChange(handleBlur(e))}
                />
            </div>
            <div className="row">
                {path[thisIndex].pronunciations.map((a,i) => (
                    <Pronunciation appState={appState} setAppState={setAppState} key={i} pronunciationIndex={i} prevIndentLevel={prevIndentLevel+1} stringPath={stringPathA}
                    />
                ))}
            </div>
        </>
    )
};

export default Morph;