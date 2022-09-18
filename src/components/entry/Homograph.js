// import Pronunciation from './Pronunciation';
// import AddPopup from '../AddPopup';
// import ScriptForm from './ScriptForm';
// import Note from './Note';
import {getIndent} from '../../utils.js';
// import {clone, getIndent, handleInputBlur, addPopupHandler} from '../../utils.js';
// import {morphDefault, pronunciationDefault} from '../../defaults.js';
import {useState} from 'react';
import _ from "lodash";
import {getHomographDisplay} from '../../entryDisplayFuncs.js';

const Homographs = props => {

    const {state, thisIndex, stringPath, prevIndent, moveRow, currentScriptId, thisEditHomographs} = props;
    // console.log(isMainMorph);
    // console.log(a);
    
    // console.log(tempHomographs)
    // const {state, setState, thisIndex, stringPath, prevIndent, labels, addFunctions, moveRow, homograph, currentScriptId} = props;
    // const {setScriptForms, addMorph, addNote} = addFunctions;
    
    let pathFrag = stringPath + "";
    const path = _.get(state, "entry." + pathFrag);
    
    // const [addPopupVisible, setAddPopupVisible] = useState(false);
    const [sectionOpen, 
        // setSectionOpen
    ] = useState(true);
    
    // const handleChange = (field, value) => {
        //     if (value !== undefined) {
            //         let entryCopy = clone(state.entry);
            //         let entryCopyPath = _.get(entryCopy, pathFrag);
            //         entryCopyPath[thisIndex].scriptForms.find(a => a.refId === currentScript.id)[field] = value;
            //         setState({entry: entryCopy});
            //     }
            // }
            
            
            
    const isFirst = thisIndex === 0;
    const isLast = thisIndex === path.length-1;
            
            // let stringPathA = `${stringPath}[${thisIndex}]`;
            
            
    const getDisplay = () => {
        // console.log(thisEditHomographs)
        // console.log(thisEditHomographs);
        // const entryId = thisEditHomographs.id;
        // const entryId = thisEditHomographs[thisIndex].items.find(a => a.scriptForm === );
        
        // console.log(thisIndex)
        // console.log(thisEditHomographs);
        
        const thisEntry = state.allEntries.find(a => a._id === thisEditHomographs.items[thisIndex].entryId) ?? state.entry;
        // console.log(thisEntry);
        
        // return "";
        // // console.log(entryId);
        // // for current entry, need state.entry (it may not be saved yet)
        // // for others, get the saved entry from state.allEntries
        // // const thisEntry = (entryId === state.entry._id) ?
        // // state.entry :
        // // state.allEntries.find(a => a._id === entryId);
        
        // // console.log(thisEntry);
        // // let currentScript = ;
        let allDisplayItems = getHomographDisplay([thisEntry], state.setup, currentScriptId, state.etymologyTags, thisEditHomographs);

        let finalEntries = allDisplayItems.map(a => a.display);
        return finalEntries;
    }

    // console.log(homograph.entryRefId);
    // console.log(getEntry(homograph.entryRefId));
    // let thisEntry = getEntry(homograph.entryRefId);
    // console.log(thisEntry.senseGroups[0].definitions[0].content)

    return (
        <>
            <div className={`row${sectionOpen ? "" : " closed"}`}>
                <div className="row-controls">
                   <i></i>
                   <i></i>
                   <i></i>
                    {/* <i className={`fas fa-minus${path.length === 1 && path[thisIndex].scriptForms[0].content.trim() === "" ? " disabled" : ""}`} onClick={deleteMorph}></i>
                    <i className={`fas fa-chevron-${sectionOpen ? "up" : "down"}`} onClick={() => setSectionOpen(!sectionOpen)}></i> */}
                    <i
                    className={`fas fa-arrow-up${isFirst ? " disabled" : ""}`}
                    onClick={e => moveRow(e, thisIndex, pathFrag, true)}
                    ></i>
                    <i
                    className={`fas fa-arrow-down${isLast ? " disabled" : ""}`}
                    onClick={e => moveRow(e, thisIndex, pathFrag, false)}
                    ></i>
                </div>
                <div className="row-content single" style={getIndent(prevIndent)}>
                    {/* <label htmlFor={`${pathFrag}[${thisIndex}]`} >
                        {thisIndex===0 ? labels[0] : labels[1]}{getNumber()}{getScriptLabel()}
                        </label> */}
                        {/* <span>{thisIndex}</span> */}

                        <span>{getDisplay()}</span>

                        {/* <span>{getEntry(homograph.entryRefId}</span> */}
                    {/* <input id={`${pathFrag}[${thisIndex}]`} type="text"
                    className="for norm"
                    value={path[thisIndex].scriptForms.find(a => a.refId === currentScript.id).content}
                    onChange={e => handleChange("content", e.target.value)}
                    onBlur={e => handleChange(handleInputBlur(e))}
                    /> */}
                </div>

                {/* <div className="row"> */}
                    {/* { state.setup.scripts &&
                    path[thisIndex].scriptForms?.map((a,i) => (
                        (a.refId !== currentScript.id) &&
                        <ScriptForm state={state} setState={setState} key={i} thisIndex={i} prevIndent={prevIndent+1} stringPath={stringPathA} addFunctions={addFunctions} moveRow={moveRow}
                        />
                    ))} */}
                    {/* { state.setup.entrySettings.showPronunciation &&
                    path[thisIndex].pronunciations.map((a,i) => (
                        <Pronunciation state={state} setState={setState} key={i} thisIndex={i} prevIndent={prevIndent+1} stringPath={stringPathA} addPronunciation={addPronunciation} addFunctions={addFunctions} moveRow={moveRow}
                        />
                    ))} */}
                    {/* {state.entry &&
                    path[thisIndex].notes?.map((a,i) => (
                        <Note state={state} setState={setState} thisIndex={i} key={i} stringPath={stringPathA} prevIndent={prevIndent+1} addFunctions={addFunctions} moveRow={moveRow} />
                    ))
                    } */}
                {/* </div> */}
            </div>
        </>
    )
};

export default Homographs;