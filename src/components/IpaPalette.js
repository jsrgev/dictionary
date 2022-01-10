import React from 'react';
import {useState} from 'react';

const IpaPalette = props => {

    const {state, thisIndex} = props;
    // const path = state.setup.ipa;
    const path = state.tempSetup.palettes;
    
    const [paletteShown, setPaletteShown] = useState(false);

    return (
        <div id="ipa" className={`${paletteShown ? "" : "ipa-chars-hidden"}`}>
            <div id="show-ipa" onClick={() => setPaletteShown(!paletteShown)}>IPA <i className={paletteShown? "fas fa-chevron-left" : "fas fa-chevron-right"}></i></div>
            <div id="ipa-chars">

            { path[thisIndex].content.map((a, i) => (
                <React.Fragment key={i}>
                    {(path[thisIndex].groupSeparator === "space" && i !== 0) &&<span></span>}
                    {a.characters.map((b, j) => {
                        if (b === "") return null;
                        const gridColumnValue = (path[thisIndex].groupSeparator === "line" && j === 0) ? 1 : "auto";
                        return <span key={j} style={{background: a.bgColor, color: a.textColor, gridColumn: gridColumnValue}}>{b}</span>
                    })}
                </React.Fragment>
                ))
            }
            </div>
        </div>
    );
};

export default IpaPalette;