import {capitalize, clone, getIndent, addPopupHandler} from '../../utils.js';
import { morphDefault } from '../../defaults.js';
import Morph from './Morph.js';
import AddPopup from '../AddPopup';
import {useState} from 'react';
import _ from 'lodash';
import { gramFormDefault } from '../../defaults.js';

const ParadigmForm = (props) => {

    const {appState, setAppState, prevIndentLevel, stringPath, addFunctions, gramFormSet} = props;
    const {addMorph} = addFunctions;

    let pathFrag = stringPath;
    const path = _.get(appState, "entry." + pathFrag);

    const [addPopupVisible, setAddPopupVisible] = useState(false);
    const [formOpen, setFormOpen] = useState(true);

    // const changeBasic = () => {
    //     let entryCopy = clone(appState.entry);
    //     let entryCopyPath = _.get(entryCopy, pathFrag);
    //     for (let form of entryCopyPath) {
    //         form.basic = false;
    //     }
    //     let formExists = entryCopyPath[thisIndex].exists;
    //     entryCopyPath[thisIndex].basic = true;
    //     if (!formExists) {
    //         entryCopyPath[thisIndex].exists = true;
    //     }
    //     setAppState({entry: entryCopy});
    //     // console.log(path[thisIndex].basic)
    // };

    // const changeExists = () => {
    //     if (path[thisIndex].basic) {
    //         return;
    //     };  
    //     let entryCopy = clone(appState.entry);
    //     let entryCopyPath = _.get(entryCopy, pathFrag);
    //     let formExists = entryCopyPath[thisIndex].exists;
    //     entryCopyPath[thisIndex].exists = !formExists;
    //     setAppState({entry: entryCopy});
    // };

    const changeRegular = () => {
        let entryCopy = clone(appState.entry);
        let entryCopyPath = _.get(entryCopy, pathFrag);
        let index = getIndex();
        if (index >= 0) {
            entryCopyPath.irregulars.splice(index, 1);
        } else {
            let obj = {
                gramFormSet: gramFormSet,
                morphs: [clone(morphDefault)]
            }
            if (entryCopyPath.irregulars) {
                entryCopyPath.irregulars.push(obj);
            } else {
                entryCopyPath.irregulars = [obj];
            }
        }
        setAppState({entry: entryCopy});
    };

    console.log(path);

    // let posPath =  _.get(appState, "entry." + stringPath);
    // let isBasic = path[thisIndex].gramForm === getBasicForm(posPath);
    // let exists = path[thisIndex].exists;
    // let isRegular = path[thisIndex].regular;
    let exists = true;
    let isRegular = true;

    const getGramFormNames = () => {
        let gramFormNames = gramFormSet.reduce((acc, a) => {
            let gramForm = appState.setup.gramFormGroups.reduce((acc2, b) => {
                let result = b.gramForms.find(c => c.id === a);
                return result ? (acc2 += `${result.abbr}.`) : acc2;
            }, ""); 
            return acc += ` ${gramForm}`;
        }, "");
        return gramFormNames;
    };

    const getIndex = () => {
        let index = path.irregulars?.findIndex(a => {
            return a.gramFormSet.every(b => {
               return gramFormSet.some(c => c === b);
            })
        })
        return index ?? -1;
    };

    const gramFormExists = () => {
        return true;
    };

    const popupItems = [
        ["Alternate form", () => addMorph(path.length-1, pathFrag+`[${getIndex()}].morphs`)],
    ];

    let stringPathA = pathFrag + `[${getIndex()}].morphs`;

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
                    <div className={exists ? "" : "missing-form"} 
                    // onClick={changeExists}
                    >
                        {capitalize(getGramFormNames())}
                    </div>
                    <div>
                        {gramFormExists() ? "Exists" : "Missing"}
                    </div>
                    {/* <div onClick={changeBasic}> */}
                        {/* {path[thisIndex].basic ? "Citation form" : ""} */}
                    {/* </div> */}
                    <div onClick={changeRegular}>
                        {getIndex() < 0 ? "Regular" : "Irregular"}
                    </div>
                </div>
                {(exists && getIndex >= 0) &&
                   path[getIndex()].morphs.map((a,i) => (
                        <Morph appState={appState} setAppState={setAppState} thisIndex={i} key={i} prevIndentLevel={prevIndentLevel+1} stringPath={stringPathA} labels={["Form", "Form"]} addFunctions={addFunctions} />
                    ))
                }
            </div>
        </>

        );
};

export default ParadigmForm;