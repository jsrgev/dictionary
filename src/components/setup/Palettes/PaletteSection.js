import AddPopup from '../../AddPopup';
import PaletteSetup from './PaletteSetup';
import {useState} from 'react';
import {paletteDefault} from '../defaults.js';
import {clone, addPopupHandler} from '../../../utils.js';
import _ from 'lodash';

const PaletteSection = props => {

    const {state, setState, moveRow, setSectionClosed} = props;

    const pathFrag = "palettes";
    const path = _.get(state, "tempSetup." + pathFrag);

    // const [sectionOpen, setSectionOpen] = useState(true);
    const [addPopupVisible, setAddPopupVisible] = useState(false);

    const addPalette = index => {
        let tempSetupCopy = clone(state.tempSetup);
        tempSetupCopy.palettes.items.splice(index+1, 0, clone(paletteDefault));
        setState({tempSetup: tempSetupCopy});
    };

    const popupItems =[
        ["Palette", () => addPalette(state.tempSetup.palettes.items.length-1)],
    ];

    // console.log(state.tempSetup.palettes)

    return(
        <div className={`row${ path.sectionClosed ? " closed" : ""}`}>
            <div className="row-controls">
                <AddPopup popupItems={popupItems} visible={addPopupVisible} />
                <i className="fas fa-plus" onClick={() => addPopupHandler(addPopupVisible, setAddPopupVisible)}></i>
                <i></i>
                <i className={`fas fa-chevron-${path.sectionClosed ? "down" : "up"}`} onClick={() => setSectionClosed(pathFrag)}></i>
            </div>
            <div className="row-content">
                <span>Character Palettes</span>
            </div>
            { state.tempSetup.palettes?.items.map((a, i) => (
                <PaletteSetup state={state} setState={setState} moveRow={moveRow} stringPath="palettes" thisIndex={i} key={i} prevIndent={0} addPalette={addPalette} />
            ))}
        </div>
    );
};

export default PaletteSection;