import Pronunciation from './Pronunciation';
import {clone} from '../utils.js';
import {orthForm} from '../defaults.js';

const Morph = props => {

    const {appState, setAppState, morphIndex} = props;
    const path = appState.entry.primary[morphIndex];

    const handleChange = e => {
        let entryCopy = clone(appState.entry);
        entryCopy.primary[morphIndex].targetLang = e.target.value;
        setAppState({entry:entryCopy});
    }

    const addMorph = e => {
        e.preventDefault();
        if (e.target.classList.contains("disabled")) {
            return;
        }
        let entryCopy = clone(appState.entry);
        entryCopy.primary.splice(morphIndex+1, 0, clone(orthForm));
        setAppState({entry: entryCopy});
    };

    const deleteMorph = e => {
        e.preventDefault();
        let entryCopy = clone(appState.entry);
        if (appState.entry.primary.length === 1) {
            entryCopy.primary = [clone(orthForm)];
        } else {
            entryCopy.primary.splice(morphIndex, 1);
        }
        setAppState({entry: entryCopy});
    };    

    return (
        <>
            <i className={`fas fa-plus${path.targetLang.trim() === "" ? " disabled" : ""}`} onClick={addMorph}></i>           
            <i className="fas fa-minus" onClick={deleteMorph}></i>           
            <label forhtml={`targetLang-${morphIndex}`} >{morphIndex===0 ? "Headword" : "Alternate"}</label>
            <input id={`targetLang-${morphIndex}`} type="text"
            value={path.targetLang}
            onChange={handleChange}
            />
            <fieldset className="pronunciations">
                {path.pronunciations.map((a,i) => (
                    <Pronunciation appState={appState} setAppState={setAppState} key={i} pronunciationIndex={i} morphIndex={morphIndex}
                    />
                ))}
            </fieldset>
        </>
    )
};

export default Morph;