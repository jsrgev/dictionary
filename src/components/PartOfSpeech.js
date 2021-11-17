import {capitalize, clone, generatePos, getAllTypes, setSecondary, getTypeDef, getPosDef, getIndent} from '../utils';
import {allPartsOfSpeech} from '../languageSettings.js';
import PosForm from './PosForm';
import {useState} from 'react';

const PartOfSpeech = (props) => {
    const {appState, setAppState, senseIndex, posIndex, prevIndentLevel} = props;
    const path = appState.entry.senses[senseIndex].partsOfSpeech;


    const addPos = e => {
        e.preventDefault();
        if (e.target.classList.contains("disabled")) {
            return;
        }
        let entryCopy = clone(appState.entry);
        entryCopy.senses[senseIndex].partsOfSpeech.splice(posIndex+1, 0, generatePos());
        setAppState({entry: entryCopy});
    };

    const deletePos = (e) => {
        e.preventDefault();
        let entryCopy = clone(appState.entry);
        if (path.length === 1) {
            entryCopy.senses[senseIndex].partsOfSpeech = [generatePos()];
        } else {
            entryCopy.senses[senseIndex].partsOfSpeech.splice(posIndex, 1);
        }
        setAppState({entry: entryCopy});
    };

    const handlePOSClick = async e => {
        let value = e.target.getAttribute("value");
        // console.log(value);
        // console.log(isAlreadySelected(value));
        if (value === path[posIndex].name || isAlreadySelected(value)) {
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
        let type = getTypeDef(path[posIndex].name, value);
        let posDef = getPosDef(path[posIndex].name);
        if (posDef.multiChoice) {

        }
        setSecondary(entryCopy.senses[senseIndex].partsOfSpeech[posIndex], type);
        setAppState({entry:entryCopy});
    }

    const handleBarClick = e => {
        if (!e.target.classList.contains("no-secondary")) {
            setSecondaryShown(!secondaryShown);
        }
    }

    const [posShown, setPosShown] = useState(true);
    const [secondaryShown, setSecondaryShown] = useState(true);
    
    let areSecondaryForms = path[posIndex].typeForms.length > 0 ? true : false;

    const isAlreadySelected = posName => {
        // console.log(path[posIndex].name===posName)
        return path.some(a => a.name === posName && path[posIndex].name !== posName) ;
    }

    return (
        <>
            {/* <div className="bar">
                <div className="bar-pos" onClick={() => setPosShown(!posShown)}>Part of speech <i className={posShown? "fas fa-chevron-up" : "fas fa-chevron-down"}></i></div>
                <div className={`bar-secondary${areSecondaryForms ? "" : " no-secondary"}`} onClick={handleBarClick}>
                    Secondary Forms {areSecondaryForms && <i className={secondaryShown? "fas fa-chevron-up" : "fas fa-chevron-down"}></i>}
                    </div>
            </div> */}

            {/* <fieldset className={`pos ${posShown ? "" : "hidden"}`}> */}
                <div className="row-controls">
                    <i className={`fas fa-plus${path[posIndex].name === "" ? " disabled" : ""}`} onClick={addPos}></i>           
                    <i className={`fas fa-minus${path.length === 1 && path[posIndex].name === "" ? " disabled" : ""}`} onClick={deletePos}></i>           

                </div>
                <div className="row-content" style={getIndent(prevIndentLevel)}>
                    <span>Part of speech</span>
                    <ul className="parts-of-speech">
                        {allPartsOfSpeech.map((a,i) => (
                            <li key={i} value={a.name} className={(path[posIndex].name===a.name ? "selected" : "") + (isAlreadySelected(a.name) ? "disabled" : "")} onClick={handlePOSClick}>{capitalize(a.name)}</li>
                        ))}
                    </ul>
                </div>
                { path[posIndex].types.length>0 &&
                    <div className="row">
                        <div className="row-controls"></div>
                        <div className="row-content" style={getIndent(prevIndentLevel+1)}>
                            <span>Type</span>
                            <ul className="types-of-POS">
                                { getAllTypes(path[posIndex].name).map((a,i) => (
                                <li key={i} value={a.name} className={path[posIndex].types.find((b => b===a.name)) ? "selected" : ""} onClick={handleTypeClick}>{capitalize(a.name)}</li>
                                )) }
                            </ul>
                        </div>

                        { path[posIndex].typeForms.length>0 &&
                            <div className={`row ${secondaryShown ? "" : "hidden"}`}>
                                <div className="row-controls"></div>
                                <div className="row-content" style={getIndent(prevIndentLevel+1)}>
                                    <div>Forms</div>
                                    <div></div>
                                </div>
                                {/* <div className="secondaryForms"> */}
                                {path[posIndex].typeForms.map((a,i) => (
                                        <PosForm key={i} abc={a} senseIndex={senseIndex} posIndex={posIndex} typeFormIndex={i} appState={appState} setAppState={setAppState} prevIndentLevel={prevIndentLevel+2} />
                                    ))}
                                {/* </div> */}
                            </div>
                        }


                    </div>
                }
            {/* </fieldset> */}

    </>
    )
};

export default PartOfSpeech;