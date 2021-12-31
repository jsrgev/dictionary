import AddPopup from '../AddPopup.js';
import { clone, addPopupHandler } from '../../utils.js';
import { etymologyAbbrDefault } from '../../defaults';
import {useState} from 'react';
import _ from 'lodash';

const EtymologyAbbrs = props => {

    const {appState, setAppState, thisIndex, moveItem} = props;

    const pathFrag = "etymologyAbbrs";
    const path = _.get(appState, "tempSetup." + pathFrag);

    const [addPopupVisible, setAddPopupVisible] = useState(false);

    const handleChange = (value, field) => {
        const setupCopy = clone(appState.tempSetup);
        let setupCopyPath = _.get(setupCopy, pathFrag);
        setupCopyPath[thisIndex][field] = value;
        setAppState({tempSetup: setupCopy});
    }

    // const oneTime = () => {
    //     let setupCopy = clone(appState.tempSetup);
    //     let setupCopyPath = _.get(setupCopy, pathFrag);
    //     let newAbbr = {abbr: "ext", content: "extended form of"};
    //     newAbbr.id = setupCopy.nextId.toString();
    //     setupCopy.nextId++;
    //     setupCopyPath.splice(thisIndex+1, 0, newAbbr);
    //     setAppState({tempSetup: setupCopy});    
    // }

    const addAbbr = () => {
        let setupCopy = clone(appState.tempSetup);
        let setupCopyPath = _.get(setupCopy, pathFrag);

        let newAbbr = clone(etymologyAbbrDefault);
        newAbbr.id = setupCopy.nextId.toString();
        setupCopy.nextId++;
        setupCopyPath.splice(thisIndex+1, 0, newAbbr);
        setAppState({tempSetup: setupCopy});
    };

    const popupItems = [
        ["Abbrevation", addAbbr],
    ];

    const isFirst = thisIndex === 0;
    const isLast = thisIndex === path.length-1;

    // console.log(appState.tempSetup.etymologyAbbrs);

    return (
        <div className="row">
            <div className="row-controls">
            <AddPopup popupItems={popupItems} visible={addPopupVisible} />
                <i className="fas fa-plus" onClick={() => addPopupHandler(addPopupVisible, setAddPopupVisible)}></i>           
            {/* <button onClick={oneTime}>oneTime</button> */}
                {/* <i className="fas fa-minus" onClick={deletePos}></i>
                { path[thisIndex].gramClassGroups?.length>0 || path[thisIndex].gramFormGroups?.length>0 ?
                    <i className={`fas fa-chevron-${posOpen ? "up" : "down"}`} onClick={() => setPosOpen(!posOpen)}></i>
                    : <i></i>
                } */}
                <i
                    className={`fas fa-arrow-up${isFirst ? " disabled" : ""}`}
                    onClick={e => moveItem(e, thisIndex, pathFrag, true)}
                ></i>
                <i
                    className={`fas fa-arrow-down${isLast ? " disabled" : ""}`}
                    onClick={e => moveItem(e, thisIndex, pathFrag, false)}>
                </i>
            </div>
            <div className="row-content etymology-abbrs-setup">
                <label>Term</label>
                <input type="text" value={path[thisIndex].content} onChange={e => handleChange(e.target.value, "content")} />
                <label>Abbr</label>
                <input type="text" value={path[thisIndex].abbr} onChange={e => handleChange(e.target.value, "abbr")} />
            </div>

        </div>
    )
};

export default EtymologyAbbrs;