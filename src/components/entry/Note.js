import AddPopup from '../AddPopup';
// import {definitionDefault} from '../defaults.js'
import {clone, getIndent, handleInputBlur, addPopupHandler} from '../../utils.js';
import {useState} from 'react';
import _ from 'lodash';

const Note = props => {

    const {appState, setAppState, prevIndentLevel, thisIndex, stringPath, addFunctions} = props;
    const {addNote} = addFunctions;

    let pathFrag = stringPath + ".notes";
    const path = _.get(appState, "entry." + pathFrag);

    const [addPopupVisible, setAddPopupVisible] = useState(false);

    const handleChange = value => {
        if (value !== undefined) {
            let entryCopy = clone(appState.entry);
            let entryCopyPath = _.get(entryCopy, pathFrag);
            entryCopyPath[thisIndex].content = value;
            setAppState({entry:entryCopy});
        }
    };


    const deleteNote = e => {
        let entryCopy = clone(appState.entry);
        let entryCopyPath = _.get(entryCopy, pathFrag)
        if (path.length === 1) {
            let entryCopyUpPath = _.get(entryCopy, stringPath);
            delete entryCopyUpPath.notes;
        } else {
            entryCopyPath.splice(thisIndex, 1);
        }
        setAppState({entry: entryCopy});
    }; 

    const popupItems = [
        ["Note", () => {
            addNote(thisIndex, stringPath);
        }]
    ];

    // console.log(appState);

    return (
        <>
            <div className="row">
                <div className="row-controls">
                    <AddPopup popupItems={popupItems} visible={addPopupVisible} />
                    <i className="fas fa-plus"
                    onClick={() => addPopupHandler(addPopupVisible, setAddPopupVisible)}
                    ></i>
                    <i className="fas fa-minus" onClick={deleteNote}></i>           
                </div>
                <div className="row-content" style={getIndent(prevIndentLevel)}>
                    <div>Note</div>
                    <input type="text"
                    value={path[thisIndex].content}
                    onChange={e => handleChange(e.target.value)}
                    onBlur={e => handleChange(handleInputBlur(e))}
                    />
                </div>
            </div>
        </>
    )

};

export default Note;