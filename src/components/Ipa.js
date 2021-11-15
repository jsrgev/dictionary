import {ipa} from '../languageSettings.js';
import React from 'react';
import {useState} from 'react';

const Ipa = () => {

    const [ipaShown, setIpaShown] = useState(false);
    const arr = Object.entries(ipa);

    return (
        <div id="ipa" className={`${ipaShown ? "" : "ipa-chars-hidden"}`}>
            <div id="show-ipa" onClick={() => setIpaShown(!ipaShown)}>IPA <i className={ipaShown? "fas fa-chevron-left" : "fas fa-chevron-right"}></i></div>
            <div id="ipa-chars">
            { arr.map((a,i) => (
                <React.Fragment key={i}>
                    {arr[i][1].map((b,j) => (
                        <span key={j} className={arr[i][0]}>{b}</span>
                    ))}
                </React.Fragment>
                ))
            }
            </div>
        </div>
    )

};

export default Ipa;