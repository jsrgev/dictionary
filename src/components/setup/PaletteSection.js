import PaletteSetup from './PaletteSetup';
import Palette from '../Palette';
import {useState} from 'react';
import {paletteDefault} from './defaults.js';
import {clone} from '../../utils.js';
import _ from 'lodash';

const PaletteSection = props => {

    const {state, setState, moveItem} = props;

    const [paletteSectionOpen, setPaletteSectionOpen] = useState(true);

    const addPalette = (index, pathFrag) => {
        let entryCopy = clone(state.entry);
        let entryCopyPath = _.get(entryCopy, pathFrag);
        entryCopyPath.splice(index+1, 0, clone(paletteDefault));
        setState({entry: entryCopy});
    };

    return(
        <div id="ipaSetup" className={`row${paletteSectionOpen ? "" : " closed"}`}>
            <div className="row-controls">
                {/* <AddPopup popupItems={popupItems} visible={addPopupVisible} /> */}
                {/* <i className="fas fa-plus" onClick={() => addPopupHandler(addPopupVisible, setAddPopupVisible)}></i> */}
                <i></i>
                <i></i>
                <i className={`fas fa-chevron-${paletteSectionOpen ? "up" : "down"}`} onClick={() => setPaletteSectionOpen(!paletteSectionOpen)}></i>
            </div>
            <div className="row-content">
                <span>Character Palettes</span>
            </div>
            { state.tempSetup.palettes?.map((a, i) => (
                <PaletteSetup state={state} setState={setState} moveItem={moveItem} stringPath="palettes" thisIndex={i} key={i} prevIndentLevel={0} />
            ))}
        </div>
    );
};

export default PaletteSection;