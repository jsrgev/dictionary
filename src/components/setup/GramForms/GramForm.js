import AddPopup from '../../AddPopup';
import GramFormLimitations from './GramFormLimitations';
import { clone, addPopupHandler, getIndent } from '../../../utils.js';
import {gramFormDefault} from '../defaults.js';
import {useState} from 'react';
import _ from 'lodash';

const GramForm = props => {

    const {state, setState, thisIndex, moveRow, stringPath, addGramForm, prevIndent, setSectionClosed} = props;
    let pathFrag = stringPath + ".gramForms";
    const path = _.get(state, "tempSetup." + pathFrag);
    // console.log("tempSetup." + pathFrag);

    const [addPopupVisible, setAddPopupVisible] = useState(false);

    const handleChange = (value, field) => {
        const setupCopy = clone(state.tempSetup  );
        let setupCopyPath = _.get(setupCopy, pathFrag);
        setupCopyPath[thisIndex][field] = value;
        setState({tempSetup: setupCopy});
    };
    
    const deleteGroup = () => {
        let setupCopy = clone(state.tempSetup);
        let setupCopyPath = _.get(setupCopy, pathFrag);
        if (setupCopyPath.length === 1) {
            let newGramForm = clone(gramFormDefault);
            newGramForm.id = setupCopy.nextId.toString();
            setupCopy.nextId++;
            setupCopyPath.splice(0, 1, newGramForm);
        } else {
            setupCopyPath.splice(thisIndex, 1);
        }
        setState({tempSetup: setupCopy});
    };

    const addConstraint = (index) => {
        let setupCopy = clone(state.tempSetup);
        let setupCopyPath = _.get(setupCopy, pathFrag);
        // console.log(availableForLimitationGroups[0].gramClasses)
        // return;
        let gramClassesToExclude = availableForLimitationGroups[0].gramClasses.map(a => a.id);
        gramClassesToExclude.shift();
        let obj = {
            refId: availableForLimitationGroups[0].id,
            excludedGramClasses: gramClassesToExclude
        };
        if (setupCopyPath[thisIndex].constraints) {
            setupCopyPath[thisIndex].constraints.splice(index, 0, obj);
        } else {
            setupCopyPath[thisIndex].constraints = [obj];
        }
        setState({tempSetup: setupCopy});
    };    
    
    const availableForLimitationGroups = state.tempSetup.gramClassGroups.items.filter(a => {
        let alreadySelected = path[thisIndex].constraints?.some(b => b.refId === a.id);
        return !alreadySelected;
    });
    
    const popupItems = [
        ["Form", () => addGramForm(thisIndex, pathFrag)],
    ];

    if (availableForLimitationGroups.length > 0) {
        popupItems.push(["Constraint", () => {
            let index = (path[thisIndex].constraints) ? path[thisIndex].constraints.length : 0;
            addConstraint(index);
            }
        ]);
    };


    const isFirst = thisIndex === 0;
    const isLast = thisIndex === path.length-1;
    
    const stringPathA = pathFrag + `[${thisIndex}]`;

    // console.log(path[thisIndex]);

    return(
        <>
            <div className={`row${ path[thisIndex].sectionClosed ? " closed" : ""}`}>
                <div className="row-controls">
                    <AddPopup popupItems={popupItems} visible={addPopupVisible} />
                    <i className="fas fa-plus" onClick={() => addPopupHandler(addPopupVisible, setAddPopupVisible)}></i>           
                    <i className="fas fa-minus" onClick={deleteGroup}></i>
                    { path[thisIndex].constraints?.length>0 ?
                    <i className={`fas fa-chevron-${path[thisIndex].sectionClosed ? "down" : "up"}`} onClick={() => setSectionClosed(`${pathFrag}[${thisIndex}]`)}></i>
                    : <span></span>
                    }
                    <i
                        className={`fas fa-arrow-up${isFirst ? " disabled" : ""}`}
                        onClick={e => moveRow(e, thisIndex, pathFrag, true)}
                    ></i>
                    <i
                        className={`fas fa-arrow-down${isLast ? " disabled" : ""}`}
                        onClick={e => moveRow(e, thisIndex, pathFrag, false)}
                    ></i>
                </div>
                <div className="row-content double-input" style={getIndent(prevIndent)}>
                    {
                        <>
                            <label htmlFor={`${pathFrag}[${thisIndex}].name`}>Form</label>
                            <input id={`${pathFrag}[${thisIndex}].name`} type="text" value={path[thisIndex].name} onChange={e => handleChange(e.target.value, "name")} />
                            <label htmlFor={`${pathFrag}[${thisIndex}].abbr`}>Abbreviation</label>
                            <input id={`${pathFrag}[${thisIndex}].abbr`} type="text" value={path[thisIndex].abbr} onChange={e => handleChange(e.target.value, "abbr")} />
                        </>
                    }
                </div>
                {path[thisIndex].constraints?.map((a, i) => (
                    <GramFormLimitations state={state} setState={setState} moveRow={moveRow} thisIndex={i} key={i} stringPath={stringPathA} addConstraint={addConstraint} availableForLimitationGroups={availableForLimitationGroups} prevIndent={prevIndent+1} />
                ))

                }
            </div>
        </>
    );
};

export default GramForm;