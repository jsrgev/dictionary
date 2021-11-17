import {clone, getIndent, handleBlur} from '../utils.js';
import {orthForm} from '../defaults.js';
import Pronunciation from './Pronunciation';

const SecondaryForm = (props) => {

    const {appState, setAppState, senseGroupIndex, posIndex, typeFormIndex, secondaryFormIndex, prevIndentLevel} = props;
    const path = appState.entry.senseGroups[senseGroupIndex].partsOfSpeech[posIndex].typeForms[typeFormIndex].forms;

    const handleChange = (value) => {
        if (value !== undefined) {
            let entryCopy = clone(appState.entry);
            entryCopy.senseGroups[senseGroupIndex].partsOfSpeech[posIndex].typeForms[typeFormIndex].forms[secondaryFormIndex].targetLang = value;
            setAppState({entry:entryCopy});
        }
    }

    const addMorph = e => {
        e.preventDefault();
        if (e.target.classList.contains("disabled")) {
            return;
        }
        let entryCopy = clone(appState.entry);
        entryCopy.senseGroups[senseGroupIndex].partsOfSpeech[posIndex].typeForms[typeFormIndex].forms.splice(secondaryFormIndex+1, 0, clone(orthForm));
        setAppState({entry: entryCopy});
    };

    const deleteMorph = e => {
        e.preventDefault();
        let entryCopy = clone(appState.entry);
        if (path.length === 1) {
            entryCopy.senseGroups[senseGroupIndex].partsOfSpeech[posIndex].typeForms[typeFormIndex].forms = [clone(orthForm)];
        } else {
            entryCopy.senseGroups[senseGroupIndex].partsOfSpeech[posIndex].typeForms[typeFormIndex].forms.splice(secondaryFormIndex, 1);
        }
        setAppState({entry: entryCopy});
    };
    
    // const path = appState.entry.senseGroups[senseGroupIndex].partsOfSpeech[posIndex].typeForms[typeFormIndex].forms[secondaryFormIndex];

    let stringPath = `senseGroups[${senseGroupIndex}].partsOfSpeech[${posIndex}].typeForms[${typeFormIndex}].forms[${secondaryFormIndex}]`;

    return (
        <>
            <div className="row-controls">
                <i className={`fas fa-plus${path[secondaryFormIndex].targetLang.trim() === "" ? " disabled" : ""}`} onClick={addMorph}></i>
                <i className={`fas fa-minus${path.length === 1 && path[secondaryFormIndex].targetLang.trim() === "" ? " disabled" : ""}`} onClick={deleteMorph}></i>
            </div>
            <div className="row-content" style={getIndent(prevIndentLevel)}>
                <label>Form</label>
                <input value={path[secondaryFormIndex].targetLang} onChange={e => handleChange(e.target.value)} onBlur={e => handleChange(handleBlur(e), "note")} />
            </div>
            <div className="row">
                {path[secondaryFormIndex].pronunciations.map((a,i) => (
                    <Pronunciation appState={appState} setAppState={setAppState} senseGroupIndex={senseGroupIndex} posIndex={posIndex} typeFormIndex={typeFormIndex} secondaryFormIndex={secondaryFormIndex} pronunciationIndex={i} key={i} prevIndentLevel={prevIndentLevel+1} stringPath={stringPath} />
                ))}
            </div>
        </>
    )
};

export default SecondaryForm;