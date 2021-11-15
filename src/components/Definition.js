import {clone, handleBlur} from '../utils.js';

const Definition = props => {

    const {appState, setAppState, senseIndex, shown} = props;
    const path = appState.entry.senses[senseIndex];

    const handleChange = (value, field) => {
        if (value !== undefined) {
            let entryCopy = clone(appState.entry);
            entryCopy.senses[senseIndex][field] = value;
            setAppState({entry:entryCopy});
        }
    };

    return (
        <>
            <fieldset className={`definition${shown? "" : " hidden"}`}>
                <div></div>
                <div></div>
                <div>Definition</div>
                <input type="text"
                value={path.definition}
                onChange={e => handleChange(e.target.value, "definition")}
                onBlur={e => handleChange(handleBlur(e), "definition")}
                />
                <div>Note</div>
                <input type="text"
                value={path.note}
                onChange={e => handleChange(e.target.value, "note")}
                onBlur={e => handleChange(handleBlur(e), "note")}
                />
            </fieldset>
        </>
    )

};

export default Definition;