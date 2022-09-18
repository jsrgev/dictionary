import AddPopup from '../AddPopup';
// import {definitionDefault} from '../defaults.js'
import {clone, getIndent, handleInputBlur, addPopupHandler} from '../../utils.js';
import {useState} from 'react';
import _ from 'lodash';

const Note = props => {

    const {state, setState, prevIndent, thisIndex, stringPath, addFunctions, moveRow} = props;
    const {addNote} = addFunctions;

    let pathFrag = stringPath + ".notes";
    const path = _.get(state, "entry." + pathFrag);

    const [addPopupVisible, setAddPopupVisible] = useState(false);

    const handleChange = value => {
        if (value !== undefined) {
            let entryCopy = clone(state.entry);
            let entryCopyPath = _.get(entryCopy, pathFrag);
            entryCopyPath[thisIndex].content = value;
            setState({entry:entryCopy});
        }
    };


    const deleteNote = e => {
        let entryCopy = clone(state.entry);
        let entryCopyPath = _.get(entryCopy, pathFrag);
        if (path.length === 1) {
            let entryCopyUpPath = _.get(entryCopy, stringPath);
            delete entryCopyUpPath.notes;
        } else {
            entryCopyPath.splice(thisIndex, 1);
        }
        setState({entry: entryCopy});
    }; 

    const popupItems = [
        ["Note", () => {
            addNote(thisIndex, stringPath);
        }]
    ];

    const isFirst = thisIndex === 0;
    const isLast = thisIndex === path.length-1;

    return (
        <>
            <div className="row">
                <div className="row-controls">
                    <AddPopup popupItems={popupItems} visible={addPopupVisible} />
                    <i className="fas fa-plus"
                    onClick={() => addPopupHandler(addPopupVisible, setAddPopupVisible)}
                    ></i>
                    <i className="fas fa-minus" onClick={deleteNote}></i>
                    <span></span>
                    <i
                    className={`fas fa-arrow-up${isFirst ? " disabled" : ""}`}
                    onClick={e => moveRow(e, thisIndex, pathFrag, true)}
                    ></i>
                    <i
                    className={`fas fa-arrow-down${isLast ? " disabled" : ""}`}
                    onClick={e => moveRow(e, thisIndex, pathFrag, false)}
                    ></i>
                </div>
                <div className="row-content" style={getIndent(prevIndent)}>
                    <label htmlFor={`${pathFrag}[${thisIndex}]`}>Note {path.length>1 && ` ${thisIndex+1}`}</label>
                    <input type="text" id={`${pathFrag}[${thisIndex}]`}
                    value={path[thisIndex].content}
                    onChange={e => handleChange(e.target.value)}
                    onBlur={e => handleChange(handleInputBlur(e))}
                    />
                </div>
            </div>
        </>
    );
};

export default Note;