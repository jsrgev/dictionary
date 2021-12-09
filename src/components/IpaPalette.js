import React from 'react';
import {useState} from 'react';

const IpaPalette = props => {

    const {appState} = props;
    const path = appState.setup.ipa;
    
    const [ipaShown, setIpaShown] = useState(false);

    return (
        <div id="ipa" className={`${ipaShown ? "" : "ipa-chars-hidden"}`}>
            <div id="show-ipa" onClick={() => setIpaShown(!ipaShown)}>IPA <i className={ipaShown? "fas fa-chevron-left" : "fas fa-chevron-right"}></i></div>
            <div id="ipa-chars">

            { path.content.map((a, i) => (
                <React.Fragment key={i}>
                    {(path.groupSeparator === "space" && i !== 0) &&<span></span>}
                    {a.characters.map((b, j) => {
                        if (b === "") return null;
                        const gridColumnValue = (path.groupSeparator === "line" && j === 0) ? 1 : "auto";
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