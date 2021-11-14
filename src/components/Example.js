import {clone} from '../utils.js';
import { exampleDefault } from "../defaults";

const Example = props => {
    const {appState, setAppState, senseIndex, exampleIndex} = props;
    const path = appState.entry.senses[senseIndex].examples;

    const handleChange = (e, field) => {
        let entryCopy = clone(appState.entry);
        entryCopy.senses[senseIndex].examples[exampleIndex][field] = e.target.value;
        setAppState({entry:entryCopy});
    };

    const deleteExample = e => {
        e.preventDefault();
        let entryCopy = clone(appState.entry);
        if (path.length === 1) {
            entryCopy.senses[senseIndex].examples = [clone(exampleDefault)];
        } else {
            entryCopy.senses[senseIndex].examples.splice(exampleIndex, 1);
        }
        setAppState({entry: entryCopy});
    }

    const addExample = e => {
        e.preventDefault();
        if (e.target.classList.contains("disabled")) {
            return;
        }
        let entryCopy = clone(appState.entry);
        entryCopy.senses[senseIndex].examples.splice(exampleIndex+1, 0, clone(exampleDefault));
        setAppState({entry: entryCopy});
    }

    return (
        <>
            <i className={`fas fa-plus${path[exampleIndex].targetLang.trim() === "" ? " disabled" : ""}`} onClick={addExample}></i>
            <i className={`fas fa-minus${path.length === 1 && path[exampleIndex].targetLang.trim() === "" ? " disabled" : ""}`} onClick={deleteExample}></i>           
            <div>Example</div>
            <input type="text" value={path[exampleIndex].targetLang} onChange={e => handleChange(e, "targetLang")} />
            <div>Meaning</div>
            <input type="text" value={path[exampleIndex].meaning} onChange={e => handleChange(e, "meaning")} />
        </>
    )
}


export default Example;