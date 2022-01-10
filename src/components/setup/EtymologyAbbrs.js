import AddPopup from '../AddPopup.js';
import { clone, addPopupHandler } from '../../utils.js';
import { etymologyAbbrDefault } from '../../defaults';
import {useState} from 'react';
import _ from 'lodash';

const EtymologyAbbrs = props => {

    const {state, setState, thisIndex, moveItem} = props;

    const pathFrag = "etymologyAbbrs";
    const path = _.get(state, "tempSetup." + pathFrag);

    const [addPopupVisible, setAddPopupVisible] = useState(false);

    const handleChange = (value, field) => {
        const setupCopy = clone(state.tempSetup);
        let setupCopyPath = _.get(setupCopy, pathFrag);
        setupCopyPath[thisIndex][field] = value;
        setState({tempSetup: setupCopy});
    };

    const addAbbr = () => {
        let setupCopy = clone(state.tempSetup);
        let setupCopyPath = _.get(setupCopy, pathFrag);

        let newAbbr = clone(etymologyAbbrDefault);
        newAbbr.id = setupCopy.nextId.toString();
        setupCopy.nextId++;
        setupCopyPath.splice(thisIndex+1, 0, newAbbr);
        setState({tempSetup: setupCopy});
    };

    const deleteAbbr = () => {
        let setupCopy = clone(state.tempSetup);
        let setupCopyPath = _.get(setupCopy, pathFrag);
        if (setupCopyPath.length === 1) {
            let newAbbr = clone(etymologyAbbrDefault);
            newAbbr.id = setupCopy.nextId.toString();
            setupCopy.nextId++;
            setupCopyPath.splice(0, 1, newAbbr);
        } else {
            setupCopyPath.splice(thisIndex, 1);
        }
        setState({tempSetup: setupCopy});
    };


    const popupItems = [
        ["Abbrevation", addAbbr],
    ];

    const isFirst = thisIndex === 0;
    const isLast = thisIndex === path.length-1;

    // console.log(state.tempSetup.etymologyAbbrs);

    return (
        <div className="row">
            <div className="row-controls">
            <AddPopup popupItems={popupItems} visible={addPopupVisible} />
                <i className="fas fa-plus" onClick={() => addPopupHandler(addPopupVisible, setAddPopupVisible)}></i>           
                <i className="fas fa-minus" onClick={deleteAbbr}></i>
                <i></i>
                <i
                    className={`fas fa-arrow-up${isFirst ? " disabled" : ""}`}
                    onClick={e => moveItem(e, thisIndex, pathFrag, true)}
                ></i>
                <i
                    className={`fas fa-arrow-down${isLast ? " disabled" : ""}`}
                    onClick={e => moveItem(e, thisIndex, pathFrag, false)}>
                </i>
            </div>
            <div className="row-content double-input">
                <label htmlFor={`${pathFrag}[${thisIndex}].content`}>Term</label>
                <input id={`${pathFrag}[${thisIndex}].content`} type="text" value={path[thisIndex].content} onChange={e => handleChange(e.target.value, "content")} />
                <label htmlFor={`${pathFrag}[${thisIndex}].abbr`}>Abbr</label>
                <input id={`${pathFrag}[${thisIndex}].abbr`} type="text" value={path[thisIndex].abbr} onChange={e => handleChange(e.target.value, "abbr")} />
            </div>

        </div>
    );
};

export default EtymologyAbbrs;