import {clone} from '../utils.js';

const Definition = props => {

    const {appState, setAppState, senseIndex, shown} = props;
    const path = appState.entry.senses[senseIndex];

    const handleChange = (e, field) => {
        let entryCopy = clone(appState.entry);
        entryCopy.senses[senseIndex][field] = e.target.value;
        setAppState({entry:entryCopy});
    };

    return (
        <>
            <fieldset className={`definition${shown? "" : " hidden"}`}>
                <div></div>
                <div></div>
                <div>Definition</div>
                <input type="text" value={path.definition} onChange={e => handleChange(e, "definition")} />
                <div>Note</div>
                <input type="text" value={path.note} onChange={e => handleChange(e, "note")} />
            </fieldset>
        </>
    )

};

export default Definition;