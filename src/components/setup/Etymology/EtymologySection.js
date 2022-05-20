import EtymologyAbbrs from './EtymologyAbbrs';
import AddPopup from "../../AddPopup";
import {useState} from 'react';
import {etymologyAbbrDefault} from '../defaults.js';
import {clone, addPopupHandler} from '../../../utils.js';
import _ from 'lodash';

const EtymologySection = props => {

    const {state, setState, moveRow, setSectionClosed} = props;

    const pathFrag = "etymologySettings";
    const path = _.get(state, "tempSetup." + pathFrag);

    const [addPopupVisible, setAddPopupVisible] = useState(false);

    const addAbbr = index => {
        let setupCopy = clone(state.tempSetup);
        let setupCopyPath = _.get(setupCopy, pathFrag+".etymologyAbbrs");
        let newAbbr = clone(etymologyAbbrDefault);
        newAbbr.id = setupCopy.nextId.toString();
        // console.log(newAbbr);
        setupCopy.nextId++;
        setupCopyPath.splice(index+1, 0, newAbbr);
        console.log(setupCopyPath);
        // return;
        setState({tempSetup: setupCopy});
    };


    const popupItems =[
        ["Abbreviation", () => addAbbr(state.tempSetup.etymologySettings?.etymologyAbbrs.length-1)],
    ];

    // console.log(state.tempSetup.etymologySettings.etymologyAbbrs);

    return(
        <div className={`row${ path.sectionClosed ? " closed" : ""}`}>
            <div className="row-controls">
                <AddPopup popupItems={popupItems} visible={addPopupVisible} />
                <i className="fas fa-plus" onClick={() => addPopupHandler(addPopupVisible, setAddPopupVisible)}></i>
                <i></i>
                <i className={`fas fa-chevron-${path.sectionClosed ? "down" : "up"}`} onClick={() => setSectionClosed(pathFrag)}></i>
            </div>
            <div className="row-content">
                <span>Etymologies</span>
            </div>
            {state.tempSetup.etymologySettings?.etymologyAbbrs?.map((a, i) => (
                <EtymologyAbbrs state={state} setState={setState} thisIndex={i} moveRow={moveRow} key={i} addAbbr={addAbbr} />
            ))}
        </div>
    );
};

export default EtymologySection;