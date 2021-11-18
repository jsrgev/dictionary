import {clone, getIndent, handleInputBlur} from '../utils.js';
import {pronunciationDefault} from '../defaults.js';

const SecondaryPronunciation = (props) => {

    const {appState, setAppState, senseGroupIndex, posIndex, typeFormIndex, secondaryFormIndex, pronunciationIndex, prevIndentLevel} = props;
    const path = appState.entry.senseGroups[senseGroupIndex].partsOfSpeech[posIndex].typeForms[typeFormIndex].forms[secondaryFormIndex].pronunciations;

    const handleChange = (value, field) => {
        if (value !== undefined) {
            let entryCopy = clone(appState.entry);
            entryCopy.senseGroups[senseGroupIndex].partsOfSpeech[posIndex].typeForms[typeFormIndex].forms[secondaryFormIndex].pronunciations[pronunciationIndex][field] = value;
            setAppState({entry:entryCopy});
        }
    }

    const addPronunciation = e => {
        e.preventDefault();
        if (e.target.classList.contains("disabled")) {
            return;
        }
        let entryCopy = clone(appState.entry);
        entryCopy.senseGroups[senseGroupIndex].partsOfSpeech[posIndex].typeForms[typeFormIndex].forms[secondaryFormIndex].pronunciations.splice(pronunciationIndex+1, 0, clone(pronunciationDefault));
        setAppState({entry: entryCopy});
    };

    const deletePronunciation = (e) => {
        e.preventDefault();
        let entryCopy = clone(appState.entry);
        if (path.length === 1) {
            entryCopy.senseGroups[senseGroupIndex].partsOfSpeech[posIndex].typeForms[typeFormIndex].forms[secondaryFormIndex].pronunciations = [clone(pronunciationDefault)];
        } else {
            entryCopy.senseGroups[senseGroupIndex].partsOfSpeech[posIndex].typeForms[typeFormIndex].forms[secondaryFormIndex].pronunciations.splice(pronunciationIndex, 1);
        }
        setAppState({entry: entryCopy});
    };

    return (
        <>
            <div className="row-controls">
                <i className={`fas fa-plus${path[pronunciationIndex].pronunciation.trim() === "" ? " disabled" : ""}`} onClick={e => addPronunciation(e, "pronunciation")}></i>
                <i className={`fas fa-minus${path.length === 1 && path[pronunciationIndex].pronunciation.trim() === "" ? " disabled" : ""}`} onClick={deletePronunciation}></i>           
            </div>

            {/* <label forhtml={`morph-${morphIndex}-pronunciation-${pronunciationIndex}`} >Pronunciation{path.length>1 && ` ${pronunciationIndex+1}`}</label> */}
            <div className="row-content" style={getIndent(prevIndentLevel)}>
                <label>Pronunciation</label>
                <input type="text"
                value={path[pronunciationIndex].pronunciation}
                onChange={e => handleChange(e.target.value, "pronunciation")}
                onBlur={e => handleChange(handleInputBlur(e), "pronunciation")}
                />
            </div>
            {/* <div></div> */}
            {/* <div></div> */}
            {/* <div className="row">
                <div className="row-controls"></div>
                <div className="row-content" style={getIndent(prevIndentLevel+1)} >
                <label>Note</label>
                    <input type="text"
                    value={path[pronunciationIndex].note}
                    onChange={e => handleChange(e.target.value, "note")}
                    onBlur={e => handleChange(handleInputBlur(e), "note")}
                    />
                </div>
            </div> */}


            {/* <>
            <div className="row-controls">
                <i className={`fas fa-plus${path[pronunciationIndex].pronunciation.trim() === "" ? " disabled" : ""}`} onClick={addPronunciation}></i>           
                <i className={`fas fa-minus${path.length === 1 && path[pronunciationIndex].pronunciation.trim() === "" ? " disabled" : ""}`} onClick={deletePronunciation}></i>           
            </div>
            <div className="row-content" style={getIndent(prevIndentLevel)}>
                <label forhtml={`morph-${morphIndex}-pronunciation-${pronunciationIndex}`} >Pronunciation{path.length>1 && ` ${pronunciationIndex+1}`}</label>
                <input id={`morph-${morphIndex}-pronunciation-${pronunciationIndex}`} type="text"
                value={path[pronunciationIndex].pronunciation}
                onChange={e => handleChange(e.target.value, "pronunciation")}
                onBlur={e => handleChange(handleInputBlur(e), "pronunciation")}
                />
            </div>
            <div></div>
            <div></div>
            <div className="row">
                <div className="row-controls"></div>
                <div className="row-content" style={getIndent(prevIndentLevel+1)} >
                    <label forhtml={`morph-${morphIndex}-pronunciation-${pronunciationIndex}-note`}>Note</label>
                    <input id={`morph-${morphIndex}-pronunciation-${pronunciationIndex}-note`} type="text"
                    value={path[pronunciationIndex].note}
                    onChange={e => handleChange(e.target.value, "note")}
                    onBlur={e => handleChange(handleInputBlur(e), "note")}
                    />
                </div>
            </div>
        </> */}





        </>
    )
};

export default SecondaryPronunciation;