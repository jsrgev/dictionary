import {capitalize, clone, getBasicForm, getIndent} from '../utils.js';
// import {allPartsOfSpeech, secondaryFormTypes} from '../languageSettings';
import Morph from './Morph.js';
import _ from 'lodash';

const ParadigmForm = (props) => {

    const {appState, setAppState, senseGroupIndex, thisIndex, prevIndentLevel, stringPath} = props;
    // const path = appState.entry.senseGroups[senseGroupIndex].partsOfSpeech[posIndex];

    let pathFrag = stringPath + ".typeForms";
    // pathFrag = `senseGroups[0].partsOfSpeech[${thisIndex}].typeForms`;
    const path = _.get(appState, "entry." + pathFrag);
    console.log(pathFrag);
    console.log(path)

    const changeExists = () => {
        if (isBasic && path[thisIndex].exists) {
            return;
        };  
        let entryCopy = clone(appState.entry);
        let entryCopyPath = _.get(entryCopy, pathFrag)
        let formExists = entryCopyPath[thisIndex].exists
        entryCopyPath[thisIndex].exists = !formExists;
        setAppState({entry: entryCopy});
    };

    const changeRegular = () => {
        if (isBasic && path[thisIndex].exists) {
            return;
        };
        let entryCopy = clone(appState.entry);
        let entryCopyPath = _.get(entryCopy, pathFrag)
        let isRegular = entryCopyPath[thisIndex].regular;
        entryCopyPath[thisIndex].regular = !isRegular;
        setAppState({entry: entryCopy});
    };

    let posPath =  _.get(appState, "entry." + stringPath);
    let isBasic = path[thisIndex].typeForm === getBasicForm(posPath);
    let exists = path[thisIndex].exists;
    let isRegular = path[thisIndex].regular;

    let stringPathA = pathFrag + `[${thisIndex}].forms`;

    

    return (
        <>
            <div className="row">
                <div className="row-controls"></div>
                <div className="row-content" style={getIndent(prevIndentLevel)}>
                    <div className={exists ? "" : "struck"} onClick={changeExists}>
                        {capitalize(path[thisIndex].typeForm)}
                    </div>
                    <div className={isBasic ? "disabled" : ""} onClick={changeRegular}>
                        {isBasic ? "Basic" : !exists ? "" : isRegular ? "Regular" : "Irregular"}
                    </div>
                </div>
                {(exists && !isRegular) &&
                    <div className="row irregular">
                   { path[thisIndex].forms.map((a,i) => (
                        <Morph appState={appState} setAppState={setAppState} senseGroupIndex={senseGroupIndex} thisIndex={thisIndex} thisIndex={i} key={i} prevIndentLevel={prevIndentLevel+1} stringPath={stringPathA} labels={["Form", "Form"]} />
                    ))}
                    </div>
                }
            </div>
        </>

        )
};

export default ParadigmForm;