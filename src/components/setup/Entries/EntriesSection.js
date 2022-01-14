import {useState} from 'react';
import {clone, getIndent} from '../../../utils.js';
import _ from 'lodash';

const EntriesSection = props => {

    const {state, setState} = props;

    // const pathFrag = "etymologyAbbrs";
    // const path = _.get(state, "state.tempSetup." + pathFrag);

    // const handleChange = (field, value) => {
    //     const tempSetupCopy = clone(state.tempSetup);
    //     tempSetupCopy[field] = value;
    //     setState({tempSetup: tempSetupCopy});
    // };

    const changeCheck = field => {
        const tempSetupCopy = clone(state.tempSetup);
        let value = _.get(tempSetupCopy, `[${field}]`);
        _.set(tempSetupCopy, `[${field}]`, !value);
        setState({tempSetup: tempSetupCopy});
    };


    const [rowOpen, setRowOpen] = useState(true);

    return(
        <div className={`row${rowOpen ? "" : " closed"}`}>
            <div className="row-controls">
                {/* <AddPopup popupItems={popupItems} visible={addPopupVisible} /> */}
                {/* <i className="fas fa-plus" onClick={() => addPopupHandler(addPopupVisible, setAddPopupVisible)}></i> */}
                <i></i>
                <i></i>
                <i className={`fas fa-chevron-${rowOpen ? "up" : "down"}`} onClick={() => setRowOpen(!rowOpen)}></i>
            </div>
            <div className="row-content">
                <span>Entries</span>
            </div>
            <div className="row" style={getIndent(0)}>
                <div className="row">
                    <div className="row">
                        <div className="row-controls"></div>
                        <div className="row-content language-names">
                            <label htmlFor='include-pronunciation'>Include pronunciation</label>
                            <input id='include-pronunciation' type="checkbox" checked={state.tempSetup.showPronunciation ? true : false} onChange={e => changeCheck("showPronunciation")} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="row" style={getIndent(0)}>
                <div className="row">
                    <div className="row">
                        <div className="row-controls"></div>
                        <div className="row-content language-names">
                            <label htmlFor='include-pronunciation'>Include alternate transcription</label>
                            <input id='include-pronunciation' type="checkbox" checked={state.tempSetup.showAltTranscription ? true : false} onChange={e => changeCheck("showAltTranscription")} />
                        </div>
                    </div>
                </div>
            </div>
        </div>


    );
};

export default EntriesSection;