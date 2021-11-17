import {capitalize, clone, getBasicForm, getIndent} from '../utils.js';
import {allPartsOfSpeech, secondaryFormTypes} from '../languageSettings';
import SecondaryForm from './SecondaryForm.js';

const PosForm = (props) => {

    const {appState, setAppState, senseGroupIndex, posIndex, typeFormIndex, prevIndentLevel} = props;
    const path = appState.entry.senseGroups[senseGroupIndex].partsOfSpeech[posIndex];

    const changeExists = () => {
        if (isBasic && path.typeForms[typeFormIndex].exists) {
            return;
        };
        let entryCopy = clone(appState.entry);
        let existsCurrentValue = entryCopy.senseGroups[senseGroupIndex].partsOfSpeech[posIndex].typeForms[typeFormIndex].exists;
        entryCopy.senseGroups[senseGroupIndex].partsOfSpeech[posIndex].typeForms[typeFormIndex].exists = !existsCurrentValue;
        setAppState({entry: entryCopy});
    };

    const changeRegular = () => {
        if (isBasic && path.typeForms[typeFormIndex].exists) {
            return;
        };
        let entryCopy = clone(appState.entry);
        let isRegular = entryCopy.senseGroups[senseGroupIndex].partsOfSpeech[posIndex].typeForms[typeFormIndex].regular;
        entryCopy.senseGroups[senseGroupIndex].partsOfSpeech[posIndex].typeForms[typeFormIndex].regular = !isRegular;
        setAppState({entry: entryCopy});
    };

    let isBasic = path.typeForms[typeFormIndex].typeForm === getBasicForm(path);
    let exists = path.typeForms[typeFormIndex].exists;
    let isRegular = path.typeForms[typeFormIndex].regular;

    return (
        <>
            <div className="row">
                <div className="row-controls"></div>
                <div className="row-content" style={getIndent(prevIndentLevel)}>
                    <div className={exists ? "" : "struck"} onClick={changeExists}>
                        {capitalize(path.typeForms[typeFormIndex].typeForm)}
                    </div>
                    <div className={isBasic ? "disabled" : ""} onClick={changeRegular}>
                        {isBasic ? "Basic" : !exists ? "" : isRegular ? "Regular" : "Irregular"}
                    </div>
                </div>
                {(exists && !isRegular) &&
                    <div className="row irregular">
                   { path.typeForms[typeFormIndex].forms.map((a,i) => (
                        <SecondaryForm appState={appState} setAppState={setAppState} senseGroupIndex={senseGroupIndex} posIndex={posIndex} typeFormIndex={typeFormIndex} secondaryFormIndex={i} key={i} prevIndentLevel={prevIndentLevel+1} />
                    ))}
                    </div>
                }
            </div>
        </>

        )
};

export default PosForm;