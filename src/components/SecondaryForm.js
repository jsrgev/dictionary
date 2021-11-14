import {clone} from '../utils.js';
import {orthForm} from '../defaults.js';
import SecondaryPronunciation from './SecondaryPronunciation';

const SecondaryForm = (props) => {

    const {appState, setAppState, senseIndex, posIndex, typeFormIndex, secondaryFormIndex} = props;
    const path = appState.entry.senses[senseIndex].partsOfSpeech[posIndex].typeForms[typeFormIndex].forms;

    const handleChange = (e) => {
        let entryCopy = clone(appState.entry);
        entryCopy.senses[senseIndex].partsOfSpeech[posIndex].typeForms[typeFormIndex].forms[secondaryFormIndex].targetLang = e.target.value;
        setAppState({entry:entryCopy});
    }

    const addMorph = e => {
        e.preventDefault();
        if (e.target.classList.contains("disabled")) {
            return;
        }
        let entryCopy = clone(appState.entry);
        entryCopy.senses[senseIndex].partsOfSpeech[posIndex].typeForms[typeFormIndex].forms.splice(secondaryFormIndex+1, 0, clone(orthForm));
        setAppState({entry: entryCopy});
    };

    const deleteMorph = e => {
        e.preventDefault();
        let entryCopy = clone(appState.entry);
        if (path.length === 1) {
            entryCopy.senses[senseIndex].partsOfSpeech[posIndex].typeForms[typeFormIndex].forms = [clone(orthForm)];
        } else {
            entryCopy.senses[senseIndex].partsOfSpeech[posIndex].typeForms[typeFormIndex].forms.splice(secondaryFormIndex, 1);
        }
        setAppState({entry: entryCopy});
    };    

    return (
        <>
            <i className={`fas fa-plus${path[secondaryFormIndex].targetLang.trim() === "" ? " disabled" : ""}`} onClick={addMorph}></i>           
            <i className="fas fa-minus" onClick={deleteMorph}></i>           
            <label>Form</label>
            <input value={path[secondaryFormIndex].targetLang} onChange={handleChange} />
            <fieldset className="pronunciations">
                {path[secondaryFormIndex].pronunciations.map((a,i) => (
                    <SecondaryPronunciation appState={appState} setAppState={setAppState} senseIndex={senseIndex} posIndex={posIndex} typeFormIndex={typeFormIndex} secondaryFormIndex={secondaryFormIndex} pronunciationIndex={i} key={i} />
                ))
            }
            </fieldset>
        </>
    )
};

export default SecondaryForm;