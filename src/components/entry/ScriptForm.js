import AddPopup from '../AddPopup';
import Note from './Note';
import {clone, handleInputBlur, getIndent, addPopupHandler} from '../../utils.js';
import {useState} from 'react';
import _ from "lodash";

const ScriptForm = props => {

    const {state, setState, thisIndex, prevIndent, stringPath, addFunctions, moveRow} = props;
    const {addNote} = addFunctions;
    // const path = state.entry.headword[morphIndex].scriptForms;

    let pathFrag = stringPath + ".scriptForms";
    const path = _.get(state, "entry." + pathFrag);

    const [sectionOpen, setSectionOpen] = useState(true);
    const [addPopupVisible, setAddPopupVisible] = useState(false);

    const handleChange = value => {
        if (value !== undefined) {
            let entryCopy = clone(state.entry);
            let entryCopyPath = _.get(entryCopy, pathFrag);
            entryCopyPath[thisIndex].content = value;
            setState({entry:entryCopy});    
        }
    };

    const getScriptLabel = () => {
        const script = state.setup.scripts.items.find(a => a.id === path[thisIndex].refId);
        return (script.abbr?.length > 1) ? script.abbr : script.name;
    };



    const getAllHeadwords = () => {
        let currentScriptId = state.setup.scripts.items[0].id;
        let entrySet = [];
        for (let entry of state.allEntries) {
            for (let morph of entry.headword.morphs) {
                let string = morph.scriptForms.find(a => a.refId === currentScriptId).content;
                entrySet.push(string);
            }
        }
        return entrySet;
    };

    const isHomograph = morph => {
        if (!stringPath.startsWith("headword")) {
            return false;
        }
        const allHeadwords = getAllHeadwords().sort();
        let duplicates = allHeadwords.filter((a, i, arr) => a === arr[i+1]);
        // console.log(duplicates)
        return duplicates.some(a => a === morph);
    }
        
    const currentScript = state.setup.scripts.items[0];
    let currentMorph = path[thisIndex].content;
    console.log(currentMorph + " - " + isHomograph(currentMorph));
    // console.log(isHomograph(currentMorph));


    // console.log(path[thisIndex]);

    const popupItems = [
        ["Note", () => {
            let index = (path[thisIndex].notes) ? path[thisIndex].notes.length-1 : 0;
            addNote(index, pathFrag+`[${thisIndex}]`);
        }]
    ];

    let stringPathA  = pathFrag + `[${thisIndex}]`;
    return (
        <>
            <div className={`row${sectionOpen ? "" : " closed"}`}>
                <div className="row-controls">
                    <AddPopup popupItems={popupItems} visible={addPopupVisible} />
                    <i className="fas fa-plus" onClick={() => addPopupHandler(addPopupVisible, setAddPopupVisible)}></i>           
                    <i></i>
                    {path[thisIndex].notes ?
                        <i className={`fas fa-chevron-${sectionOpen ? "up" : "down"}`} onClick={() => setSectionOpen(!sectionOpen)}></i>
                        :
                        <i></i>
                    }

                </div>
                <div className="row-content" style={getIndent(prevIndent)}>
                    <label htmlFor={`${pathFrag}[${thisIndex}]`}>{getScriptLabel()}</label>
                    <input type="text" id={`${pathFrag}[${thisIndex}]`}
                    className="for norm"
                    value={path[thisIndex].content}
                    onChange={e => handleChange(e.target.value)}
                    onBlur={e => handleChange(handleInputBlur(e))}
                    />
                </div>
                {path[thisIndex].notes?.map((a,i) => (
                    <Note state={state} setState={setState} key={i} thisIndex={i} prevIndent={prevIndent+1} stringPath={stringPathA} addFunctions={addFunctions} moveRow={moveRow} />
                ))}
                </div>
        </>
    );
};

export default ScriptForm;