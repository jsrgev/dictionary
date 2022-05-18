import {getIndent} from '../../utils';
// import {partsOfSpeechDefs} from '../../languageSettings.js';
import ParadigmForm from './ParadigmForm';
import {useState, useEffect} from 'react';
import _ from 'lodash';

const PartOfSpeech = (props) => {
    const { path, state, setState, thisIndex, prevIndent, stringPath, addFunctions, availablePoses, moveRow, setScriptForms} = props;
    const {addPos} = addFunctions;

    let pathFrag = stringPath + ".partsOfSpeech";
    // const path = _.get(state, "entry." + pathFrag);

    const areIrregulars = "irregulars" in path[thisIndex] ? true : false;
    // console.log(areIrregulars);

    const [sectionOpen, setSectionOpen] = useState(false);
    // console.log(path)

    useEffect(() => {
        // console.log("useEffect");
        if ("irregulars" in path[thisIndex]) {
                // console.log(areIrregulars);

            setSectionOpen(true)
        };
    },[])

    
    // useEffect(() => {
    //     console.log("load");
    // },[])


    // const [sectionOpen, setSectionOpen] = useState(false);


    // const cleanUpGramForms = () => {
    //     let irregulars = path[thisIndex].irregulars;
    //     if (!irregulars) {
    //         return;
    //     }
    //     let irregularsToDelete = [];
    //     irregulars.forEach((a, i) => {
    //         let gramFormSet = a.gramFormSet;
    //         let formShouldntExist = !allGramForms.some(b => {
    //             return gramFormSet.every(c => {
    //                 return b.some(d => d === c);
    //             })
    //         })
    //         if (formShouldntExist) irregularsToDelete.push(i);
    //     });
    //     if (irregularsToDelete.length > 0) {
    //         let entryCopy = clone(state.entry);
    //         let entryCopyPath = _.get(entryCopy, `${pathFrag}[${thisIndex}].irregulars`);
    //         irregularsToDelete.reverse().forEach(a => {
    //             entryCopyPath.splice(a, 1);
    //         });
    //         setState({entry: entryCopy});
    //     }
    // };
    

    // console.log(path[thisIndex]);
    // const gramClassGroups = path[thisIndex].gramClassGroups;

    // useEffect(() => {
    //     cleanUpGramForms();
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // },[gramClassGroups]);


    const getAllGramForms = () => {
        let posDef = state.setup.partsOfSpeechDefs.items.find(a => a.id === path[thisIndex].refId);
        let gramFormGroups = posDef.gramFormGroups;
        if (!gramFormGroups) {
            return [];
        }
        let groups = [];
        gramFormGroups.forEach(a => {
            // "gramForms" could be actual gramForms or gramClasses (forms to agree with classes)
            let gramFormGroupDef = state.setup.gramFormGroups.find(b => b.id === a.refId) || state.setup.gramClassGroups.items.find(b => b.id === a.refId);
            let arr = [];
            let gramForms = gramFormGroupDef.gramForms || gramFormGroupDef.gramClasses;
            gramForms.forEach(gramFormDef => {
                let applicable = true;  
                if (gramFormDef.constraints) {
                    gramFormDef.constraints.forEach(group => {
                        let allCurrentGramClasses = [];
                        // path[thisIndex].gramClassGroups.items.forEach(a => {
                            path[thisIndex].gramClassGroups.forEach(a => {
                                a.gramClasses.forEach(b => {
                                allCurrentGramClasses.push(b);
                            });
                        })
                        let match = group.excludedGramClasses.some(a => {
                            return allCurrentGramClasses.some(b => b === a);
                        });
                        if (match) {
                            applicable = false;
                        }
                    });
                }
                if (applicable) {
                    arr.push(gramFormDef.id);
                }
            })
            groups.push(arr);
        })
        // get all combinations - from https://stackoverflow.com/questions/12303989/cartesian-product-of-multiple-arrays-in-javascript
        const cartesian = (...a) => a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())));

        // cartesian doesn't work right for single array, e.g. just [sg., pl.]
        let allGramForms = groups.length === 1 ? _.chunk(...groups, 1) : cartesian(...groups);
        return (typeof(allGramForms[0]) === "string") ? [allGramForms] : allGramForms;
    };

    const allGramForms = getAllGramForms();
    const popupItems = [];

    if (availablePoses.length > 0) {
        popupItems.push(["Part of speech", () => addPos(thisIndex, pathFrag, availablePoses)]);
    }

    return (
       
                    <div className={`row${sectionOpen ? "" : " closed"}`}>
                        <div className="row-controls">
                            <i></i>
                            <i></i>
                            <i className={`fas fa-chevron-${sectionOpen ? "up" : "down"}`} onClick={() => setSectionOpen(!sectionOpen)}></i>
                        </div>
                        <div className="row-content" style={getIndent(prevIndent+1)}>
                            <div>Forms:</div>
                        </div>
                        {allGramForms.map((a, i) => (
                            <ParadigmForm key={i} thisIndex={i} gramFormSet={a} state={state} setState={setState} prevIndent={prevIndent+2} stringPath={stringPath} addFunctions={addFunctions} moveRow={moveRow} setScriptForms={setScriptForms} />
                        ))}
                    </div>
    )
};

export default PartOfSpeech;