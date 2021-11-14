import {clone} from '../utils.js';
import { phraseDefault } from "../defaults";

const Phrase = props => {
    const {appState, setAppState, senseIndex, phraseIndex} = props;
    const path = appState.entry.senses[senseIndex].phrases;

    const handleChange = (e, field) => {
        let entryCopy = clone(appState.entry);
        entryCopy.senses[senseIndex].phrases[phraseIndex][field] = e.target.value;
        setAppState({entry:entryCopy});
    };

    const deletePhrase = e => {
        e.preventDefault();
        let entryCopy = clone(appState.entry);
        if (path.length === 1) {
            entryCopy.senses[senseIndex].phrases = [clone(phraseDefault)];
        } else {
            entryCopy.senses[senseIndex].phrases.splice(phraseIndex, 1);
        }
        setAppState({entry: entryCopy});
    }

    const addPhrase = e => {
        e.preventDefault();
        if (e.target.classList.contains("disabled")) {
            return;
        }
        let entryCopy = clone(appState.entry);
        entryCopy.senses[senseIndex].phrases.splice(phraseIndex+1, 0, clone(phraseDefault));
        setAppState({entry: entryCopy});
    }

    return (
        <>
            <i className={`fas fa-plus${path[phraseIndex].targetLang.trim() === "" ? " disabled" : ""}`} onClick={addPhrase}></i>
            <i className={`fas fa-minus${path.length === 1 && path[phraseIndex].targetLang.trim() === "" ? " disabled" : ""}`} onClick={deletePhrase}></i>           
            <div>Phrase</div>
            <input type="text" value={path[phraseIndex].targetLang} onChange={e => handleChange(e, "targetLang")} />
            <div>Meaning</div>
            <input type="text" value={path[phraseIndex].meaning} onChange={e => handleChange(e, "meaning")} />
        </>
    )
}


export default Phrase;