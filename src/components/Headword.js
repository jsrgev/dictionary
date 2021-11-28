// import {useSetState} from 'react-use';
import Morph from "./Morph";
import Note from "./Note";
import AddPopup from "./AddPopup";
import { addPopupHandler } from '../utils';
import _ from 'lodash';
import {useState} from 'react';
// import _ from "lodash";

const Headword = props => {

    const {appState, setAppState, addFunctions, moveItem} = props;
    let {addMorph, addNote} =  addFunctions;
    const [headwordOpen, setHeadwordOpen] = useState(true);
    const [addPopupVisible, setAddPopupVisible] = useState(false);

    let stringPath = "headword"
    let pathFrag = stringPath + "";
    const path = _.get(appState, "entry." + pathFrag);

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
            <div className={`row${headwordOpen ? "" : " closed"}`}>
                <div className="row-controls">
                    <AddPopup popupItems={popupItems} visible={addPopupVisible} />
                    <i className="fas fa-plus" onClick={() => addPopupHandler(addPopupVisible, setAddPopupVisible)}></i>
                    <i></i>
                    <i className={`fas fa-chevron-${headwordOpen ? "up" : "down"}`} onClick={() => setHeadwordOpen(!headwordOpen)}></i>
                </div>
                <div className="row-content">
                    Headword
                </div>
                {appState.entry?.headword?.morphs.map((a,i) => (
                    <Morph appState={appState} setAppState={setAppState} thisIndex={i} key={i} stringPath={pathFragA} prevIndentLevel={0} labels={["Basic form", "Alternate"]}  addFunctions={addFunctions} moveItem={moveItem} />
                ))
                }
                {appState.entry?.headword?.morphs.notes?.map((a,i) => (
                    // path.notes?.map((a,i) => (
                    <Note appState={appState} setAppState={setAppState} thisIndex={i} key={i} stringPath={stringPath} prevIndentLevel={0} addFunctions={addFunctions} />
                ))
                }
            </div>
        </>
    )
};

export default Headword;