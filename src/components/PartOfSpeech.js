import {capitalize, clone, getPosDef, generatePos, getTypes, getSecondaryFormValues, getBasicSecondary, setSecondary} from '../utils';
import {allPartsOfSpeech} from '../languageSettings.js';
import PosForm from './PosForm';
import {useState} from 'react';

const PartOfSpeech = (props) => {
    const {appState, setAppState, senseIndex, posIndex} = props;
    const path = appState.entry.senses[senseIndex].partsOfSpeech;

    const handlePOSClick = async e => {
        let value = e.target.getAttribute("value");
        if (value === path[posIndex].name) {
            return;
        }
        let entryCopy = clone(appState.entry);
        entryCopy.senses[senseIndex].partsOfSpeech[posIndex] = generatePos(value);
        setAppState({entry: entryCopy});
    };

    const handleTypeClick = e => {
        let value = e.target.getAttribute("value");
        if (value === path[posIndex].type) {
            return;
        }
        let entryCopy = clone(appState.entry);

        let posDef = getPosDef(path[posIndex].name);
        let type = posDef.types.find(a => a.name === value);
        
        let copyPath = entryCopy.senses[senseIndex].partsOfSpeech[posIndex];
        copyPath = setSecondary(copyPath, type);
        setAppState({entry:entryCopy});
    }

    const handleBarClick = e => {
        if (!e.target.classList.contains("no-secondary")) {
            setSecondaryShown(!secondaryShown);
        }
    }

    const [posShown, setPosShown] = useState(true);
    const [secondaryShown, setSecondaryShown] = useState(false);
    
    let areSecondaryForms = path[posIndex].typeForms.length > 0 ? true : false;

    return (
        <>
        <div className="bar">
            <div className="bar-pos" onClick={() => setPosShown(!posShown)}>Part of speech <i className={posShown? "fas fa-chevron-up" : "fas fa-chevron-down"}></i></div>
            <div className={`bar-secondary${areSecondaryForms ? "" : " no-secondary"}`} onClick={handleBarClick}>
                Secondary Forms {areSecondaryForms && <i className={secondaryShown? "fas fa-chevron-up" : "fas fa-chevron-down"}></i>}
                </div>
        </div>

        <fieldset className={`pos ${posShown ? "" : "hidden"}`}>
            <span>Part of speech</span>
            <ul className="parts-of-speech">
                {allPartsOfSpeech.map((a,i) => (
                    <li key={i} value={a.name} className={path[posIndex].name===a.name ? "selected" : ""} onClick={handlePOSClick}>{capitalize(a.name)}</li>
                ))}
            </ul>
            { path[posIndex].type &&
                <>
                <span>Type</span>
                <ul className="types-of-POS">
                    { getTypes(path[posIndex].name).map((a,i) => (
                    <li key={i} value={a.name} className={path[posIndex].type===a.name ? "selected" : ""} onClick={handleTypeClick}>{capitalize(a.name)}</li>
                    )) }
                </ul>
                </>
            }
        </fieldset>

        { path[posIndex].typeForms.length>0 &&
            <fieldset className={`secondary ${secondaryShown ? "" : "hidden"}`}>
                {path[posIndex].typeForms.map((a,i) => (
                    <PosForm key={i} abc={a} senseIndex={senseIndex} posIndex={posIndex} typeFormIndex={i} appState={appState} setAppState={setAppState} />
                ))}
            </fieldset>
        }
    </>
)
};

export default PartOfSpeech;