import {clone} from '../utils.js';
import {pronunciationDefault} from '../defaults.js';

const SecondaryPronunciation = (props) => {

    const {appState, setAppState, senseIndex, posIndex, typeFormIndex, secondaryFormIndex, pronunciationIndex} = props;
    const path = appState.entry.senses[senseIndex].partsOfSpeech[posIndex].typeForms[typeFormIndex].forms[secondaryFormIndex].pronunciations;


    const handleChange = (e, field) => {
        let entryCopy = clone(appState.entry);
        entryCopy.senses[senseIndex].partsOfSpeech[posIndex].typeForms[typeFormIndex].forms[secondaryFormIndex].pronunciations[pronunciationIndex][field] = e.target.value;
        setAppState({entry:entryCopy});
    }

    const addPronunciation = e => {
        e.preventDefault();
        if (e.target.classList.contains("disabled")) {
            return;
        }
    //     let entryCopy = clone(appState.entry);
    //     entryCopy.primary[morphIndex].pronunciations.splice(pronunciationIndex+1, 0, clone(pronunciationDefault));
    //     setAppState({entry: entryCopy});
    };

    const deletePronunciation = (e) => {
        e.preventDefault();
    //     let entryCopy = clone(appState.entry);
    //     if (path.length === 1) {
    //         entryCopy.primary[morphIndex].pronunciations = [clone(pronunciationDefault)];
    //         return;
    //     } else {
    //         entryCopy.primary[morphIndex].pronunciations.splice(pronunciationIndex, 1);
    //     }
    //     setAppState({entry: entryCopy});
    };

    // let disabled = (path[pronunciationIndex].pronunciation.trim() === "") ? true : false;


    
    // <i className="fas fa-plus" onClick={addSense}></i>
    // <i className="fas fa-minus" onClick={deleteSense}></i>
// console.log(path[pronunciationIndex].pronunciation.trim());

    return (
        <>
            <i className={`fas fa-plus${path[pronunciationIndex].pronunciation.trim() === "" ? " disabled" : ""}`} onClick={e => addPronunciation(e, "pronunciation")}></i>           
            <i className="fas fa-minus" onClick={deletePronunciation}></i>           
            {/* <label forhtml={`morph-${morphIndex}-pronunciation-${pronunciationIndex}`} >Pronunciation{path.length>1 && ` ${pronunciationIndex+1}`}</label> */}
            <label>Pronunciation</label>
            <input type="text"
            value={path[pronunciationIndex].pronunciation}
            onChange={e => handleChange(e,"pronunciation")}
            />
            {/* <input type="text" value={path[pronunciationIndex].pronunciation} onChange={handleChange} /> */}
            <div></div>
            <div></div>
            <label>Note</label>
            {/* <label forhtml={`morph-${morphIndex}-pronunciation-${pronunciationIndex}-note`}>Note</label> */}
            <input type="text"
            value={path[pronunciationIndex].note}
            onChange={e => handleChange(e,"note")}
            />
        </>
    )
};

export default SecondaryPronunciation;