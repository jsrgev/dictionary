import AddPopup from './AddPopup';
// import {definitionDefault} from '../defaults.js'
import {clone, getIndent, handleInputBlur, addPopupHandler} from '../utils.js';
// import {useState} from 'react';
import _ from 'lodash';

const Note = props => {

    const {appState, setAppState, prevIndentLevel, thisIndex, addFunctions, stringPath} = props;
    // const {addDefinition} = addFunctions;
    // const path = appState.entry.senseGroups[senseGroupIndex].definitions;

    let pathFrag = stringPath + ".notes";
    const path = _.get(appState, "entry." + pathFrag);
    const upPath = _.get(appState, "entry." + stringPath);

    // const [addPopupVisible, setAddPopupVisible] = useState(false);

    const handleChange = (value, field) => {
        if (value !== undefined) {
            let entryCopy = clone(appState.entry);
            let entryCopyPath = _.get(entryCopy, pathFrag);
            entryCopyPath[thisIndex][field] = value;
            setAppState({entry:entryCopy});
        }
    };


    const deleteNote = e => {
        let entryCopy = clone(appState.entry);
        let entryCopyPath = _.get(entryCopy, pathFrag)
        // console.log(path)
        // return;
        if (path.length === 1) {
            console.log("a")
            let entryCopyUpPath = _.get(entryCopy, stringPath);
            delete entryCopyUpPath.notes;
        } else {
            console.log("b")
            entryCopyPath.splice(thisIndex, 1);
        }
        setAppState({entry: entryCopy});
    }; 

    const popupItems = [
        // ["Definition", () => addDefinition(thisIndex, stringPath)]
    ];


    // console.log(path);

    return (
        <>
            <div className="row-controls">
                {/* <AddPopup popupItems={popupItems} visible={addPopupVisible} /> */}
                {/* <i className="fas fa-plus"
                onClick={() => addPopupHandler(addPopupVisible, setAddPopupVisible)}
                ></i> */}
                <i></i>
                <i className="fas fa-minus" onClick={deleteNote}></i>           
            </div>
            <div className="row-content" style={getIndent(prevIndentLevel)}>
                <div>Note</div>
                <input type="text"
                value={path[thisIndex].content}
                onChange={e => handleChange(e.target.value, "content")}
                onBlur={e => handleChange(handleInputBlur(e), "content")}
                />
            </div>
        </>
    )

};

export default Note;