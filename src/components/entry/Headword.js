// import {useSetState} from 'react-use';
import Morph from "./Morph";
import Note from "./Note";
import AddPopup from "../AddPopup";
import { addPopupHandler } from '../../utils';
import _ from 'lodash';
import {useState} from 'react';
// import _ from "lodash";

const Headword = props => {

    const {state, setState, addFunctions, moveRow} = props;
    let {addMorph, addNote} =  addFunctions;
    const [sectionOpen, setSectionOpen] = useState(true);
    const [addPopupVisible, setAddPopupVisible] = useState(false);

    let stringPath = "headword"
    let pathFrag = stringPath + "";
    const path = _.get(state, "entry." + pathFrag);

    let pathFragA = pathFrag+".morphs";

    const popupItems =[
        ["Alternate form", () => addMorph(path.morphs.length-1, pathFrag+".morphs")],
        ["Note", () => {
            let index = (path.notes) ? path.notes.length-1 : 0;
            addNote(index, pathFrag);
        }]
    ];

    
    // console.log(path);

    return (
        <>
            <div className={`row${sectionOpen ? "" : " closed"}`}>
                <div className="row-controls">
                    <AddPopup popupItems={popupItems} visible={addPopupVisible} />
                    <i className="fas fa-plus" onClick={() => addPopupHandler(addPopupVisible, setAddPopupVisible)}></i>
                    <i></i>
                    <i className={`fas fa-chevron-${sectionOpen ? "up" : "down"}`} onClick={() => setSectionOpen(!sectionOpen)}></i>
                </div>
                <div className="row-content">
                    <span>Headword</span>
                </div>
                {state.entry?.headword?.morphs.map((a,i) => (
                    <Morph state={state} setState={setState} thisIndex={i} key={i} stringPath={pathFragA} prevIndent={0} labels={["Basic form", "Alternate"]}  addFunctions={addFunctions} moveRow={moveRow} />
                ))
                }
                {state.entry?.headword?.morphs.notes?.map((a,i) => (
                    // path.notes?.map((a,i) => (
                    <Note state={state} setState={setState} thisIndex={i} key={i} stringPath={stringPath} prevIndent={0} addFunctions={addFunctions} moveRow={moveRow} />
                ))
                }
            </div>
        </>
    )
};

export default Headword;