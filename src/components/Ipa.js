import {ipa} from '../languageSettings.js';
import React from 'react';
import {useState} from 'react';

const Ipa = props => {

    const {appState} = props;

    const ipa = appState.setup.ipa;

    const [ipaShown, setIpaShown] = useState(false);
    // const arr = Object.entries(ipa);

    console.log(appState.setup.ipa);

    return (
        <div id="ipa" className={`${ipaShown ? "" : "ipa-chars-hidden"}`}>
            <div id="show-ipa" onClick={() => setIpaShown(!ipaShown)}>IPA <i className={ipaShown? "fas fa-chevron-left" : "fas fa-chevron-right"}></i></div>
            <div id="ipa-chars">

        

            { ipa.map((a, i) => (
                <React.Fragment key={i}>
                    {a.characters.map((b,j) => (
                        <span key={j} style={{background: a.color}}>{b}</span>
                    ))}
                </React.Fragment>
                ))
            }

            {/* { arr.map((a,i) => (
                <React.Fragment key={i}>
                    {arr[i][1].map((b,j) => (
                        <span key={j} className={arr[i][0]}>{b}</span>
                    ))}
                </React.Fragment>
                ))
            } */}
            </div>
        </div>
    )

};

export default Ipa;