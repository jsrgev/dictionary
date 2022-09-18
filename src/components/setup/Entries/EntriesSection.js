import {clone, getIndent} from '../../../utils.js';
import _ from 'lodash';

const EntriesSection = props => {

    const {state, setState, setSectionClosed} = props;

    const pathFrag = "entrySettings";
    const path = _.get(state, "tempSetup." + pathFrag);

    const changeCheck = field => {
        const tempSetupCopy = clone(state.tempSetup);
        let tempSetupCopyPath = _.get(tempSetupCopy, pathFrag);
        let value = tempSetupCopyPath[field];
        // let value = _.get(tempSetupCopy, `[${field}]`);
        _.set(tempSetupCopyPath, `[${field}]`, !value);
        setState({tempSetup: tempSetupCopy});
    };

    // console.log(state.tempSetup);

    return(
        <div className={`row${ path.sectionClosed ? " closed" : ""}`}>
            <div className="row-controls">
                {/* <AddPopup popupItems={popupItems} visible={addPopupVisible} /> */}
                {/* <i className="fas fa-plus" onClick={() => addPopupHandler(addPopupVisible, setAddPopupVisible)}></i> */}
                <span></span>
                <span></span>
                <i className={`fas fa-chevron-${path.sectionClosed ? "down" : "up"}`} onClick={() => setSectionClosed(pathFrag)}></i>
            </div>
            <div className="row-content">
                <span>Entries</span>
            </div>
            <div className="row">
                <div className="row">
                    <div className="row">
                        <div className="row-controls"></div>
                        <div className="row-content checkbox-label" style={getIndent(0)}>
                            <input id='include-pronunciation' type="checkbox" checked={state.tempSetup.entrySettings.showPronunciation ? true : false} onChange={e => changeCheck("showPronunciation")} />
                            <label htmlFor='include-pronunciation'>Include pronunciation</label>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="row">
                    <div className="row">
                        <div className="row-controls"></div>
                        <div className="row-content checkbox-label" style={getIndent(0)}>
                            <input id='include-etymology' type="checkbox" checked={state.tempSetup.entrySettings.showEtymology ? true : false} onChange={e => changeCheck("showEtymology")} />
                            <label htmlFor='include-etymology'>Include etymology</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    );
};

export default EntriesSection;