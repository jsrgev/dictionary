import React from 'react';
import {useState} from 'react';

const Palette = props => {

    const {state, thisIndex} = props;
    // const path = state.setup.ipa;
    const path = state.tempSetup.palettes;
    
    const [paletteShown, setPaletteShown] = useState(false);

    return (
        <div className={`${paletteShown ? "palette" : "palette palette-hidden"}`}>
            <div className="show-palette" onClick={() => setPaletteShown(!paletteShown)}>{path[thisIndex].name} <i className={paletteShown? "fas fa-chevron-left" : "fas fa-chevron-right"}></i></div>
            <div className="palette-chars">

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

export default Palette;