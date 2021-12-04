import {capitalize, clone, getIndent, addPopupHandler} from '../../utils.js';
import Morph from './Morph.js';
import AddPopup from '../AddPopup';
import {useState} from 'react';
import _ from 'lodash';

const ParadigmForm = (props) => {

    const {appState, setAppState, thisIndex, prevIndentLevel, stringPath, addFunctions} = props;
    const {addMorph} = addFunctions;

    let pathFrag = stringPath + ".paradigmForms";
    const path = _.get(appState, "entry." + pathFrag);

    const [addPopupVisible, setAddPopupVisible] = useState(false);
    const [formOpen, setFormOpen] = useState(true);

    const changeBasic = () => {
        let entryCopy = clone(appState.entry);
        let entryCopyPath = _.get(entryCopy, pathFrag);
        for (let form of entryCopyPath) {
            form.basic = false;
        }
        let formExists = entryCopyPath[thisIndex].exists;
        entryCopyPath[thisIndex].basic = true;
        if (!formExists) {
            entryCopyPath[thisIndex].exists = true;
        }
        setAppState({entry: entryCopy});
        console.log(path[thisIndex].basic)
    };

    const changeExists = () => {
        if (path[thisIndex].basic) {
            return;
        };  
        let entryCopy = clone(appState.entry);
        let entryCopyPath = _.get(entryCopy, pathFrag);
        let formExists = entryCopyPath[thisIndex].exists;
        entryCopyPath[thisIndex].exists = !formExists;
        setAppState({entry: entryCopy});
    };

    const changeRegular = () => {
        if (path[thisIndex].basic) {
            return;
        };
        let entryCopy = clone(appState.entry);
        let entryCopyPath = _.get(entryCopy, pathFrag);
        let isRegular = entryCopyPath[thisIndex].regular;
        entryCopyPath[thisIndex].regular = !isRegular;
        setAppState({entry: entryCopy});
    };

    // let posPath =  _.get(appState, "entry." + stringPath);
    // let isBasic = path[thisIndex].gramForm === getBasicForm(posPath);
    let exists = path[thisIndex].exists;
    let isRegular = path[thisIndex].regular;

    console.log()

    const popupItems = [
        ["Alternate form", () => addMorph(path.length-1, pathFrag+`[${thisIndex}].morphs`)],
    ];

    let stringPathA = pathFrag + `[${thisIndex}].morphs`;

    return (
        <>
            <div className={`row${formOpen ? "" : " closed"}`}>
                <div className="row-controls">
                <AddPopup popupItems={popupItems} visible={addPopupVisible} />
                <i className={isRegular ? "" : "fas fa-plus"} onClick={() => addPopupHandler(addPopupVisible, setAddPopupVisible)}></i>
                <i></i>
                <i className={isRegular ? "" : `fas fa-chevron-${formOpen ? "up" : "down"}`} onClick={() => setFormOpen(!formOpen)}></i>
                </div>
                <div className="row-content paradigmForms" style={getIndent(prevIndentLevel)}>
                    <div className={exists ? "" : "missing-form"} onClick={changeExists}>
                        {capitalize(path[thisIndex].gramForm)}
                    </div>
                    <div onClick={changeBasic}>
                        {path[thisIndex].basic ? "Citation form" : ""}
                    </div>
                    <div onClick={changeRegular}>
                        {path[thisIndex].basic ? "" : !exists ? "" : isRegular ? "Regular" : "Irregular"}
                    </div>
                </div>
                {(exists && !isRegular) &&
                   path[thisIndex].morphs.map((a,i) => (
                        <Morph appState={appState} setAppState={setAppState} thisIndex={i} key={i} prevIndentLevel={prevIndentLevel+1} stringPath={stringPathA} labels={["Form", "Form"]} addFunctions={addFunctions} />
                    ))
                }
            </div>
        </>

        )
};

export default ParadigmForm;