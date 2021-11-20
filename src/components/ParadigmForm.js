import {capitalize, clone, getBasicForm, getIndent, addPopupHandler} from '../utils.js';
// import {allPartsOfSpeech, secondaryFormTypes} from '../languageSettings';
import Morph from './Morph.js';
import AddPopup from './AddPopup';
import {useState} from 'react';
import _ from 'lodash';

const ParadigmForm = (props) => {

    const {appState, setAppState, thisIndex, prevIndentLevel, stringPath, addFunctions} = props;
    const {addMorph} = addFunctions;
    // const path = appState.entry.senseGroups[senseGroupIndex].partsOfSpeech[posIndex];

    let pathFrag = stringPath + ".typeForms";
    const path = _.get(appState, "entry." + pathFrag);

    const [addPopupVisible, setAddPopupVisible] = useState(false);
    const [formOpen, setFormOpen] = useState(true);

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

    const popupItems = [
        ["Alternate form", () => addMorph(path.length-1, pathFrag+`[${thisIndex}].forms`)],
    ];

    let stringPathA = pathFrag + `[${thisIndex}].forms`;

    return (
        <>
            <div className={`row${formOpen ? "" : " closed"}`}>
                <div className="row-controls">
                <AddPopup popupItems={popupItems} visible={addPopupVisible} />
                <i className={isRegular ? "" : "fas fa-plus"} onClick={() => addPopupHandler(addPopupVisible, setAddPopupVisible)}></i>
                <i></i>
                <i className={isRegular ? "" : `fas fa-chevron-${formOpen ? "up" : "down"}`} onClick={() => setFormOpen(!formOpen)}></i>
                </div>
                <div className="row-content" style={getIndent(prevIndentLevel)}>
                    <div className={exists ? "" : "struck"} onClick={changeExists}>
                        {capitalize(path[thisIndex].typeForm)}
                    </div>
                    <div className={isBasic ? "disabled" : ""} onClick={changeRegular}>
                        {isBasic ? "Basic" : !exists ? "" : isRegular ? "Regular" : "Irregular"}
                    </div>
                </div>
                {(exists && !isRegular) &&
                   path[thisIndex].forms.map((a,i) => (
                        <Morph appState={appState} setAppState={setAppState} thisIndex={i} key={i} prevIndentLevel={prevIndentLevel+1} stringPath={stringPathA} labels={["Form", "Form"]} addFunctions={addFunctions} />
                    ))
                }
            </div>
        </>

        )
};

export default ParadigmForm;