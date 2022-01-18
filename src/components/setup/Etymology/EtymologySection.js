import EtymologyAbbrs from './EtymologyAbbrs';
import AddPopup from "../../AddPopup";
import {useState} from 'react';
import {etymologyAbbrDefault} from '../defaults.js';
import {clone, addPopupHandler} from '../../../utils.js';
import _ from 'lodash';

const EtymologySection = props => {

    const {state, setState, moveRow} = props;

    const pathFrag = "etymologyAbbrs";
    // const path = _.get(state, "tempSetup." + pathFrag);

    const [rowOpen, setRowOpen] = useState(true);
    const [addPopupVisible, setAddPopupVisible] = useState(false);

    const addAbbr = index => {
        let setupCopy = clone(state.tempSetup);
        let setupCopyPath = _.get(setupCopy, pathFrag);

        let newAbbr = clone(etymologyAbbrDefault);
        newAbbr.id = setupCopy.nextId.toString();
        setupCopy.nextId++;
        setupCopyPath.splice(index+1, 0, newAbbr);
        setState({tempSetup: setupCopy});
    };


    const popupItems =[
        ["Abbreviation", () => addAbbr(state.tempSetup.etymologyAbbrs.length-1)],
    ];

    return(
        <div className={`row${rowOpen ? "" : " closed"}`}>
            <div className="row-controls">
                <AddPopup popupItems={popupItems} visible={addPopupVisible} />
                <i className="fas fa-plus" onClick={() => addPopupHandler(addPopupVisible, setAddPopupVisible)}></i>
                <i></i>
                <i className={`fas fa-chevron-${rowOpen ? "up" : "down"}`} onClick={() => setRowOpen(!rowOpen)}></i>
            </div>
            <div className="row-content">
                <span>Etymologies</span>
            </div>
            {state.tempSetup.etymologyAbbrs.map((a, i) => (
                <EtymologyAbbrs state={state} setState={setState} thisIndex={i} moveRow={moveRow} key={i} addAbbr={addAbbr} />
            ))}
        </div>
    );
};

export default EtymologySection;