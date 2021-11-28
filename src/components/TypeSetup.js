import AddPopup from './AddPopup.js';
import FormSetup from './FormSetup.js';
import { clone, addPopupHandler, getIndent } from '../utils.js';
import {useState} from 'react';
import _ from 'lodash';

const TypeSetup = props => {

    const {appState, setAppState, thisIndex, stringPath, prevIndentLevel, moveItem, addType} = props;

    let pathFrag = stringPath + ".types";
    const path = _.get(appState, "setup." + pathFrag);

    const [typeOpen, setTypeOpen] = useState(true);
    const [addPopupVisible, setAddPopupVisible] = useState(false);

    const handleChange = (value, field) => {
        const setupCopy = clone(appState.setup);
        let setupCopyPath = _.get(setupCopy, pathFrag)
        setupCopyPath[thisIndex][field] = value;
        setAppState({setup: setupCopy});
    };

    // const posDefault = {name: "", abbr: ""};
    // const typeDefault = {name: "", abbr: ""};
    const formDefault = {name: "", abbr: "", basic: false, mayBeMissing: true};

    // addMorph: (index, pathFrag) => {
    //     let entryCopy = clone(state.entry);
    //     let entryCopyPath = _.get(entryCopy, pathFrag);
    //     entryCopyPath.splice(index+1, 0, clone(morphDefault));
    //     setState({entry: entryCopy});
    // },

    const addForm = index => {
        const setupCopy = clone(appState.setup);
        let setupCopyPath = _.get(setupCopy, pathFrag);
        setupCopyPath[thisIndex].forms.splice(index+1, 0, clone(formDefault));
        setAppState({setup: setupCopy});
    };
    
    const deleteType = () => {
        let setupCopy = clone(appState.setup);
        let setupCopyPath = _.get(setupCopy, pathFrag)
            setupCopyPath.splice(thisIndex, 1);
        setAppState({setup: setupCopy});
    };

    const popupItems = [
        ["Type", () => addType(thisIndex)],
        ["Form", () => addForm(path[thisIndex].forms.length-1)],
    ];

    const isFirst = thisIndex === 0;
    const isLast = thisIndex === path.length-1;

    const stringPathA = pathFrag + `[${thisIndex}]`;
    
    return(
        <>
            <div className={`row${typeOpen ? "" : " closed"}`}>
                <div className="row-controls">
                <AddPopup popupItems={popupItems} visible={addPopupVisible} />
                <i className="fas fa-plus" onClick={() => addPopupHandler(addPopupVisible, setAddPopupVisible)}></i>           
                <i className="fas fa-minus" onClick={deleteType}></i>
                { path[thisIndex].forms.length>0 ?
                    <i className={`fas fa-chevron-${typeOpen ? "up" : "down"}`} onClick={() => setTypeOpen(!typeOpen)}></i>
                    : <i></i>
                }
                <i
                    className={`fas fa-arrow-up${isFirst ? " disabled" : ""}`}
                    onClick={e => moveItem(e, thisIndex, pathFrag, true)}
                ></i>
                <i
                    className={`fas fa-arrow-down${isLast ? " disabled" : ""}`}
                    onClick={e => moveItem(e, thisIndex, pathFrag, false)}
                ></i>
                </div>
                <div className="row-content" style={getIndent(prevIndentLevel)}>
                    <label>Type</label>
                    <input type="text" value={path[thisIndex].name} onChange={e => handleChange(e.target.value, "name")} />
                    <label>Abbreviation</label>
                    <input type="text" value={path[thisIndex].abbr} onChange={e => handleChange(e.target.value, "abbr")} />
               </div>
               { path[thisIndex].forms.length>0 &&
                path[thisIndex].forms.map((a, i) => (
                    <FormSetup appState={appState} setAppState={setAppState} key={i} thisIndex={i} stringPath={stringPathA} prevIndentLevel={prevIndentLevel+1} moveItem={moveItem} addForm={addForm} />
                ))

               }
            </div>
        </>
    )
};

export default TypeSetup;