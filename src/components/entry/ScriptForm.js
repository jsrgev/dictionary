import AddPopup from '../AddPopup';
import Note from './Note';
import HomographGroup from './HomographGroup';
import {clone, handleInputBlur, getIndent, addPopupHandler} from '../../utils.js';
import {useState, useEffect} from 'react';
import _ from "lodash";

const ScriptForm = props => {

    const {state, setState, thisIndex, prevIndent, stringPath, addFunctions, moveRow} = props;
    const {addNote} = addFunctions;

    let pathFrag = stringPath + ".scriptForms";
    const path = _.get(state, "entry." + pathFrag);

    const [sectionOpen, setSectionOpen] = useState(true);
    const [addPopupVisible, setAddPopupVisible] = useState(false);
    const [thisEditHomographs, setThisEditHomographs] = useState(false);

    
    const thisScriptForm = path[thisIndex].content;
    
    const handleChange = value => {
        if (value !== undefined) {
            let entryCopy = clone(state.entry);
            let entryCopyPath = _.get(entryCopy, pathFrag);
            
            entryCopyPath[thisIndex].content = value;
            setState({entry:entryCopy});
        }
    };
    
    const generateNumberedHomographs = homographsFound => {
        let numberedHomographs = clone(homographsFound);
        let currentCount = numberedHomographs.items.reduce((prev, curr) => {
            return (prev.homograph > curr.homograph) ? prev.homograph : curr.homograph
        })
        numberedHomographs.items.forEach(a => {
            if (a.homograph < 1) {
                currentCount++;
                a.homograph = currentCount;
            }
            return a;
        })
        return numberedHomographs;
    };

    const updateHomographs = () => {
        let index = state.editHomographs.findIndex(a => a.id === path[thisIndex].id);
        
        // if there is something saved to state.editHomographs        
        if (index > -1) {
            // if no change return
            if (state.editHomographs[index].scriptForm === thisScriptForm)
            return;
        } else if (thisScriptForm === "") return;
                
        // get all homographs based on currently entered text

        let savedHomographsCopy = clone(state.savedHomographs);
        let editHomographsCopy = clone(state.editHomographs);

        let homographsFound;
        let numberedHomographs;

        const determineAction = () => {
            if (index > -1 && thisScriptForm === "") return "splice";                
            homographsFound = getHomographs();
            if (!homographsFound) {
                return (index > -1) ? "splice" : "return";
            }
            numberedHomographs = generateNumberedHomographs(homographsFound);
            return (index > -1) ? "replace" : "push";
        };
        
        let action = determineAction();

        if (action === "return") return;
        if (action === "splice") {
            savedHomographsCopy.splice(index, 1);
            editHomographsCopy.splice(index, 1);
        } else if (action === "replace") {
            savedHomographsCopy[index] = homographsFound;
            editHomographsCopy[index] = numberedHomographs;
        } else if (action === "push") {
            savedHomographsCopy.push(homographsFound);
            editHomographsCopy.push(numberedHomographs);
        }

        setState({savedHomographs: savedHomographsCopy, editHomographs: editHomographsCopy});
        setThisEditHomographs(state.editHomographs.find(a => a.id === path[thisIndex].id));    };


    useEffect( () => {
        updateHomographs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[state.entry]);
    
    
    useEffect( () => {
        setThisEditHomographs(state.editHomographs.find(a => a.id === path[thisIndex].id));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[updateHomographs]);

    const getScriptLabel = () => {
        const script = state.setup.scripts.items.find(a => a.id === path[thisIndex].scriptRefId);
        return (script.abbr?.length > 1) ? script.abbr : script.name;
    };


    const currentScriptId = state.setup.scripts.items.find(a => a.id === path[thisIndex].scriptRefId).id;
    
    const getHomographs = () => {
        const currentScriptForm = path[thisIndex];
        if (currentScriptForm.content === "") return [];
        let obj = {
            id: currentScriptForm.id,
            scriptForm: currentScriptForm.content,
            items: []
        };

        // for each homograph, need entry id, morph index, scriptForm index

        // add forms for all other saved entries
        for (let entry of state.allEntries) {
            if (entry._id !== state.entry._id) {
                let {morphs} = entry.headword;
                for (let i = 0; i < morphs.length; i++) {
                    let index = morphs[i].scriptForms.findIndex(a => a.scriptRefId === currentScriptId);
                    let scriptForm = morphs[i].scriptForms[index];
                    if (scriptForm.content === currentScriptForm.content) {
                        let item = {
                            id: scriptForm.id,
                            entryId: entry._id,
                            scriptForm: scriptForm.content,
                            homograph: scriptForm.homograph
                        }
                        obj.items.push(item);
                    }
                }
            }
        }

        if (obj.items.length === 0) return null;
        obj.items.sort((a,b) => a.homograph - b.homograph); // b - a for reverse sort

        // if homographs were found, add current form from current entry
        let currentMorphObject = {
            id: currentScriptForm.id,
            entryId: state.entry._id,
            scriptForm: currentScriptForm.content,
            homograph: currentScriptForm.homograph
        }

        obj.items.push(currentMorphObject);
        return obj;
    };


    const popupItems = [
        ["Note", () => {
            let index = (path[thisIndex].notes) ? path[thisIndex].notes.length-1 : 0;
            addNote(index, pathFrag+`[${thisIndex}]`);
        }]
    ];

    const showHomographGroup = thisEditHomographs?.scriptForm === path[thisIndex].content;

    let homographIndex = state.editHomographs.findIndex(a => a.id === path[thisIndex].id);
    // console.log(homographIndex);

    let stringPathA  = pathFrag + `[${thisIndex}]`;
    return (
        <>
            <div className={`row${sectionOpen ? "" : " closed"}`}>
                <div className="row-controls">
                    <AddPopup popupItems={popupItems} visible={addPopupVisible} />
                    <i className="fas fa-plus" onClick={() => addPopupHandler(addPopupVisible, setAddPopupVisible)}></i>           
                    <span></span>
                    {path[thisIndex].notes || showHomographGroup ?
                        <i className={`fas fa-chevron-${sectionOpen ? "up" : "down"}`} onClick={() => setSectionOpen(!sectionOpen)}></i>
                        :
                        <span></span>
                    }

                </div>
                <div className="row-content" style={getIndent(prevIndent)}>
                    <label htmlFor={`${pathFrag}[${thisIndex}]`}>{getScriptLabel()}</label>
                    <input type="text" id={`${pathFrag}[${thisIndex}]`}
                    className="for norm"
                    value={thisScriptForm}
                    onChange={e => handleChange(e.target.value)}
                    onBlur={e => handleChange(handleInputBlur(e))}
                    />
                </div>
                {(showHomographGroup) &&
                    <>
                        <HomographGroup state={state} setState={setState} key={homographIndex} thisIndex={homographIndex} prevIndent={prevIndent+2} addFunctions={addFunctions} currentScriptId={currentScriptId} />
                    </>
                }

                {path[thisIndex].notes?.map((a,i) => (
                    <Note state={state} setState={setState} key={i} thisIndex={i} prevIndent={prevIndent+1} stringPath={stringPathA} addFunctions={addFunctions} moveRow={moveRow} thisEditHomographs={thisEditHomographs} />
                ))}
                </div>
        </>
    );
};

export default ScriptForm;