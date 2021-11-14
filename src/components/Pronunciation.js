import {clone} from '../utils.js';
import {pronunciationDefault} from '../defaults.js';

const Pronunciation = (props) => {

    const {appState, setAppState, pronunciationIndex, morphIndex} = props;
    const path = appState.entry.primary[morphIndex].pronunciations;

    const handleChange = (e,field) => {
        console.log(document.activeElement);
        let entryCopy = clone(appState.entry);
        entryCopy.primary[morphIndex].pronunciations[pronunciationIndex][field] = e.target.value;
        setAppState({entry:entryCopy});
    }

    const addPronunciation = e => {
        e.preventDefault();
        if (e.target.classList.contains("disabled")) {
            return;
        }
        let entryCopy = clone(appState.entry);
        entryCopy.primary[morphIndex].pronunciations.splice(pronunciationIndex+1, 0, clone(pronunciationDefault));
        setAppState({entry: entryCopy});
    };

    const deletePronunciation = (e) => {
        e.preventDefault();
        let entryCopy = clone(appState.entry);
        if (path.length === 1) {
            entryCopy.primary[morphIndex].pronunciations = [clone(pronunciationDefault)];
        } else {
            entryCopy.primary[morphIndex].pronunciations.splice(pronunciationIndex, 1);
        }
        setAppState({entry: entryCopy});
    };


    return (
        <>
            <i className={`fas fa-plus${path[pronunciationIndex].pronunciation.trim() === "" ? " disabled" : ""}`} onClick={addPronunciation}></i>           
            <i className={`fas fa-minus${path.length === 1 && path[pronunciationIndex].pronunciation.trim() === "" ? " disabled" : ""}`} onClick={deletePronunciation}></i>           
            <label forhtml={`morph-${morphIndex}-pronunciation-${pronunciationIndex}`} >Pronunciation{path.length>1 && ` ${pronunciationIndex+1}`}</label>
            <input id={`morph-${morphIndex}-pronunciation-${pronunciationIndex}`} type="text"
            value={path[pronunciationIndex].pronunciation}
            onChange={e => handleChange(e,"pronunciation")}
            />
            <div></div>
            <div></div>
            <label forhtml={`morph-${morphIndex}-pronunciation-${pronunciationIndex}-note`}>Note</label>
            <input id={`morph-${morphIndex}-pronunciation-${pronunciationIndex}-note`} type="text"
            value={path[pronunciationIndex].note}
            onChange={e => handleChange(e,"note")}
            />
        </>
    )
};

export default Pronunciation;