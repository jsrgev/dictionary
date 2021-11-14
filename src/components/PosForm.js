// import {useEffect, useState} from 'react';
// import {useSetState} from 'react-use';
import {capitalize, clone} from '../utils.js'
import SecondaryForm from './SecondaryForm.js';
// import Pronunciation from './Pronunciation';

const PosForm = (props) => {

    const {appState, setAppState, senseIndex, posIndex, typeFormIndex} = props;

    const path = appState.entry.senses[senseIndex].partsOfSpeech[posIndex];

    // const changeBasic = e => {
    //     if (path.typeForms[typeFormIndex].basic) {
    //         return;
    //     };
    //     let entryCopy = clone(appState.entry);
    //     entryCopy.senses[senseIndex].partsOfSpeech[posIndex].basic = path.typeForms[typeFormIndex].typeForm;
    //     setAppState({entry: entryCopy});
    //     if (!exists) {
    //         changeExists();
    //     }
    //     if (!isRegular) {
    //         changeRegular();
    //     }
    // };

    const changeExists = () => {
        if (isBasic && path.typeForms[typeFormIndex].exists) {
            return;
        };
        let entryCopy = clone(appState.entry);
        let existsCurrentValue = entryCopy.senses[senseIndex].partsOfSpeech[posIndex].typeForms[typeFormIndex].exists;
        // console.log(exists)
        entryCopy.senses[senseIndex].partsOfSpeech[posIndex].typeForms[typeFormIndex].exists = !existsCurrentValue;
        setAppState({entry: entryCopy});
    };

    const changeRegular = () => {
        if (isBasic && path.typeForms[typeFormIndex].exists) {
            return;
        };
        let entryCopy = clone(appState.entry);
        let isRegular = entryCopy.senses[senseIndex].partsOfSpeech[posIndex].typeForms[typeFormIndex].regular;
        entryCopy.senses[senseIndex].partsOfSpeech[posIndex].typeForms[typeFormIndex].regular = !isRegular;
        setAppState({entry: entryCopy});
        // console.log(!isBasic && !path.typeForms[typeFormIndex].regular);
    };

    let isBasic = path.typeForms[typeFormIndex].typeForm === path.basic;
    let exists = path.typeForms[typeFormIndex].exists;
    let isRegular = path.typeForms[typeFormIndex].regular;

    // console.log(path)

    return (
        <>
            <div className={exists ? "" : "struck"} onClick={changeExists}>
                {capitalize(path.typeForms[typeFormIndex].typeForm)}
            </div>
            {/* <div className={isBasic ? "selected" : ""} onClick={changeBasic}>
                {isBasic ? "Primary" : "Secondary"}
            </div> */}
            {/* <div className={isBasic ? "disabled" : ""} onClick={changeExists}>
                {exists ? "Exists" : "Doesn't exist"}
            </div> */}
            <div className={isBasic ? "disabled" : ""} onClick={changeRegular}>
                {isBasic ? "Basic" : !exists ? "" : isRegular ? "Regular" : "Irregular"}
            </div>
            <fieldset className="irregular">
                {(exists && !isRegular) &&
                    path.typeForms[typeFormIndex].forms.map((a,i) => (
                        <SecondaryForm appState={appState} setAppState={setAppState} senseIndex={senseIndex} posIndex={posIndex} typeFormIndex={typeFormIndex} secondaryFormIndex={i} key={i} />
                    ))
                }

                    {/* path.typeForms[typeFormIndex].pronunciations.map((a,i) => (
                    <SecondaryPronunciation appState={appState} setAppState={setAppState} senseIndex={senseIndex} posIndex={posIndex} typeFormIndex={typeFormIndex} pronunciationIndex={i} />

                    )) */}

            </fieldset>
            {/* <div>
                {(exists && !isRegular) ? <input /> : ""}
            </div>
            <div>
                {(exists && !isRegular) ? <input /> : ""}
            </div>
            <div>
                {(exists && !isRegular) ? <input /> : ""}
            </div> */}
            {/* <div className={!path.typeForms[typeFormIndex].regular ? "selected" : ""}>Irregular <input /></div> */}
            {/* <label>Alternate form</label>
            <input id={`altForm-${typeFormIndex}`} type="text" 
        value={state.altForms[typeFormIndex].melfem}
        onChange={e => handleChange(e,"melfem")}
        />
        <fieldset id="pronunciations">
            {state.altForms[typeFormIndex].pronunciations.map((a,i) => (
                <Pronunciation state={state} setState={setState} key={i} typeFormIndex={i}
                // addPronunciation={addPronunciation}
                // deletePronunciation={deletePronunciation}
                />
            ))}
        </fieldset> */}
</>

        )
};

export default PosForm;