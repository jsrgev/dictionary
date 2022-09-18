import {clone, getIndent} from '../../../utils.js';
import _ from 'lodash';

const LanguageDataSection = props => {

    const {state, setState, setSectionClosed} = props;

    const pathFrag = "languageData";
    const path = _.get(state, "tempSetup." + pathFrag);

    const handleChange = (field, value) => {
        const tempSetupCopy = clone(state.tempSetup);
        let tempSetupCopyPath = _.get(tempSetupCopy, pathFrag);
        tempSetupCopyPath[field] = value;
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
                <span>Language Names</span>
            </div>
            <div className="row">
                <div className="row">
                    <div className="row">
                        <div className="row-controls"></div>
                        <div className="row-content language-names" style={getIndent(0)}>
                            <label htmlFor='target-language'>Target Language</label>
                            <input id='target-language' type="text" value={state.tempSetup.languageData.targetLanguageName} onChange={e => handleChange("targetLanguageName", e.target.value)} />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="row">
                        <div className="row-controls"></div>
                        <div className="row-content language-names" style={getIndent(0)}>
                            <label htmlFor='source-language'>Source Language</label>
                            <input id='target-language' type="text" value={state.tempSetup.languageData.sourceLanguageName} onChange={e => handleChange("sourceLanguageName", e.target.value)} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LanguageDataSection;