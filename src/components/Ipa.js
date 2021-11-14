import {ipa} from '../languageSettings.js';
import React from 'react';
import {useState} from 'react';

const Ipa = () => {

    const [ipaShown, setIpaShown] = useState(false);
    const arr = Object.entries(ipa);

    const handleClick = e => {
        return;
        // console.log(document.activeElement);
        // console.log(e.target.textContent);

        let text = e.target.textContent;
        let inputNode = document.activeElement;
        // input.value += text;
        // input.simulate('change', { target: { value: 'Hello' } })

        let {value} = inputNode;

        let selectionStart = inputNode.selectionStart ?? value.length
        let selectionEnd = inputNode.selectionEnd ?? value.length;

        const nextValue = value.substring(0, selectionStart) + e.target.textContent + value.substring(selectionEnd);
        inputNode.value = nextValue;
        // console.log(nextValue);

        const eventAwesome = new CustomEvent('input', {
            bubbles: true,
            detail: { text: nextValue }
          });

        inputNode.dispatchEvent(new CustomEvent('input'));


    }

    return (
        <div id="ipa" className={`${ipaShown ? "" : "ipa-chars-hidden"}`}>
            <div id="show-ipa" onClick={() => setIpaShown(!ipaShown)}>IPA <i className={ipaShown? "fas fa-chevron-left" : "fas fa-chevron-right"}></i></div>
            <div id="ipa-chars">
            { arr.map((a,i) => (
                <React.Fragment key={i}>
                    {arr[i][1].map((b,j) => (
                        <span key={j} className={arr[i][0]} onClick={handleClick}>{b}</span>
                    ))}
                </React.Fragment>
                ))
            }
            </div>
        </div>
    )

};

export default Ipa;