import {useState} from 'react';
import {clone, getIndent} from '../../../utils.js';

const LanguageDataSection = props => {

    const {state, setState} = props;

    // const pathFrag = "etymologyAbbrs";
    // const path = _.get(state, "tempSetup." + pathFrag);

    const handleChange = (field, value) => {
        const tempSetupCopy = clone(state.tempSetup);
        tempSetupCopy[field] = value;
        setState({tempSetup: tempSetupCopy});
    };

    const [sectionOpen, setSectionOpen] = useState(true);

    return(
        <div className={`row${sectionOpen ? "" : " closed"}`}>
            <div className="row-controls">
                {/* <AddPopup popupItems={popupItems} visible={addPopupVisible} /> */}
                {/* <i className="fas fa-plus" onClick={() => addPopupHandler(addPopupVisible, setAddPopupVisible)}></i> */}
                <i></i>
                <i></i>
                <i className={`fas fa-chevron-${sectionOpen ? "up" : "down"}`} onClick={() => setSectionOpen(!sectionOpen)}></i>
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
                            <input id='target-language' type="text" value={state.tempSetup.targetLanguageName} onChange={e => handleChange("targetLanguageName", e.target.value)} />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="row">
                        <div className="row-controls"></div>
                        <div className="row-content language-names" style={getIndent(0)}>
                            <label htmlFor='source-language'>Source Language</label>
                            <input id='target-language' type="text" value={state.tempSetup.sourceLanguageName} onChange={e => handleChange("sourceLanguageName", e.target.value)} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LanguageDataSection;