import {capitalize} from '../utils.js';
import {clone, getPosDef, getPosObj, getTypes, getSecondaryFormValues, getBasicSecondary} from '../utils';
import {allPartsOfSpeech} from '../languageSettings.js';
import PosForm from './PosForm';
import {useState} from 'react';
// import SecondaryPronunciation from './SecondaryPronunciation.js';

const PartOfSpeech = (props) => {
    let {appState, setAppState, senseIndex, posIndex} = props;

    // console.log(appState.entry.senses[senseIndex].partsOfSpeech)
    const path = appState.entry.senses[senseIndex].partsOfSpeech;

    const handlePOSClick = async e => {
        let value = e.target.getAttribute("value");
        if (value === path[posIndex].name) {
            return;
        }
        let entryCopy = clone(appState.entry);
        entryCopy.senses[senseIndex].partsOfSpeech[posIndex] = getPosObj(value);
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
        
        const copyPath = entryCopy.senses[senseIndex].partsOfSpeech[posIndex];
        copyPath.type = type.name;
        copyPath.typeForms = [];

        if (type.secondaryFormType) {
            copyPath.typeForms = getSecondaryFormValues(type.secondaryFormType);
            copyPath.basic = getBasicSecondary(type.secondaryFormType);
        }
        setAppState({entry:entryCopy});
    }

    const [posShown, setPosShown] = useState(true);
    const [secondaryShown, setSecondaryShown] = useState(false);
    
    return (
        <>
        <div className="bar">
            <div className="bar-pos" onClick={() => setPosShown(!posShown)}>Part of speech <i className={posShown? "fas fa-chevron-up" : "fas fa-chevron-down"}></i></div>
            <div className="bar-secondary" onClick={() => setSecondaryShown(!secondaryShown)}>Secondary Forms <i className={secondaryShown? "fas fa-chevron-up" : "fas fa-chevron-down"}></i></div>
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
                {/* <div></div> */}
                {/* <div className="table-header">Exists</div> */}
                {/* <div className="table-header">Formation</div> */}
                {/* <div></div> */}
                {/* <div></div> */}
                {/* <SecondaryPronunciation appState={appState}> */}

                {/* </SecondaryPronunciation> */}
                {/* <div className="table-header">Form</div> */}
                {/* <div className="table-header">Pronunciation</div> */}
                {/* <div className="table-header">Notes</div> */}
                {path[posIndex].typeForms.map((a,i) => (
                    <PosForm key={i} abc={a} senseIndex={senseIndex} posIndex={posIndex} typeFormIndex={i} appState={appState} setAppState={setAppState} />
                ))}
            </fieldset>
        }
    </>
)
};

export default PartOfSpeech;