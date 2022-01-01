import React, {useState} from 'react';
import { clone } from '../../utils';

const Etymology = props => {

    const {state, setState} = props;

    const [etymologyOpen, setEtymologyOpen] = useState(false);

    const handleChange = value => {
        if (value !== undefined) {
            let entryCopy = clone(state.entry);
            // let entryCopyPath = _.get(entryCopy, pathFrag);
            entryCopy.etymology = value;
            setState({entry:entryCopy});
        }
    }

    const handleEtymologyInputBlur = e => {
        const hoverItems = document.querySelectorAll( ":hover" );
        const clickedItem = hoverItems[hoverItems.length-1];

        if (clickedItem === undefined || !(clickedItem.closest("#etymology-tags") || clickedItem.closest("#etymology-abbrs"))) {
            return;
        };

        e.target.focus();
        if (clickedItem.tagName !== "LI") {
            return;
        }
        const inputNode = e.target;
        const {value} = inputNode;
    
        const selectionStart = inputNode.selectionStart ?? value.length;
        const selectionEnd = inputNode.selectionEnd ?? value.length;
        const clickedItemValue = clickedItem.getAttribute("value");
        let positionsToSkip;
        let newValue;

        if (clickedItem.closest("#etymology-abbrs")) {
            positionsToSkip = clickedItemValue.length;
            newValue = value.substring(0, selectionStart) + clickedItemValue + value.substring(selectionEnd);
        }

        if (clickedItem.closest("#etymology-tags")) {
            const tagMatch = state.etymologyTags.find(a => a.id === clickedItemValue);
            // move cursor to position after opening tag
            positionsToSkip = tagMatch.displayOpen.length;
            const tags = tagMatch.displayOpen + tagMatch.displayClose;
            newValue = value.substring(0, selectionStart) + tags + value.substring(selectionEnd);
        }

        const newCursorPosition = selectionStart + positionsToSkip;
        setTimeout(() => {
            e.target.selectionStart = newCursorPosition;
            e.target.selectionEnd = newCursorPosition;
        }, 5);
        return newValue;
    };

    const symbols = [
        {
            content: ">",
            isSymbol: true

        },
        {
            content: "+",
            isSymbol: true
        }
    ];

    return (
        <>

            <div className={`row${etymologyOpen ? "" : " closed"}`}>
                <div className="row-controls">
                </div>
                <div className="row-content">
                    <label>Etymology</label>
                    <input value={state.entry.etymology} onChange={e => handleChange(e.target.value)} type="text" onBlur={e => handleChange(handleEtymologyInputBlur(e))} />
                </div>
            </div>
            <div className={`row${etymologyOpen ? "" : " closed"}`}>
                <div className="row-controls">
                </div>
                <div className="row-content">
                    <label>Insert abbr/sym</label>
                    <ul id="etymology-abbrs">
                        {state.setup.etymologyAbbrs.concat(symbols).map((a, i) => (
                            <li value={a.isSymbol ? a.content : a.abbr + "."} key={i}>{a.isSymbol ? a.content : a.abbr}</li>
                        ))}
                    </ul>
                    <label>Insert tags</label>
                    <ul id="etymology-tags">
                        {state.etymologyTags.map((a, i) => (
                            <React.Fragment key={i}>
                                <li value={a.id}>{a.name}</li>
                                {/* <li>{a.displayClose}</li> */}
                            </React.Fragment>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    )  
};
    
export default Etymology;