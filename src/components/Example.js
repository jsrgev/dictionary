import {clone, handleBlur} from '../utils.js';
import { exampleDefault } from "../defaults";

const Example = props => {
    const {appState, setAppState, senseGroupIndex, exampleIndex} = props;
    const path = appState.entry.senseGroups[senseGroupIndex].examples;

    const handleChange = (value, field) => {
        if (value !== undefined) {
            let entryCopy = clone(appState.entry);
            entryCopy.senseGroups[senseGroupIndex].examples[exampleIndex][field] = value;
            setAppState({entry:entryCopy});
        }
    };

    const deleteExample = e => {
        e.preventDefault();
        let entryCopy = clone(appState.entry);
        if (path.length === 1) {
            entryCopy.senseGroups[senseGroupIndex].examples = [clone(exampleDefault)];
        } else {
            entryCopy.senseGroups[senseGroupIndex].examples.splice(exampleIndex, 1);
        }
        setAppState({entry: entryCopy});
    }

    const addExample = e => {
        e.preventDefault();
        if (e.target.classList.contains("disabled")) {
            return;
        }
        let entryCopy = clone(appState.entry);
        entryCopy.senseGroups[senseGroupIndex].examples.splice(exampleIndex+1, 0, clone(exampleDefault));
        setAppState({entry: entryCopy});
    }

    return (
        <>
            <i className={`fas fa-plus${path[exampleIndex].targetLang.trim() === "" ? " disabled" : ""}`} onClick={addExample}></i>
            <i className={`fas fa-minus${path.length === 1 && path[exampleIndex].targetLang.trim() === "" ? " disabled" : ""}`} onClick={deleteExample}></i>           
            <div>Example</div>
            <input type="text"
            value={path[exampleIndex].targetLang}
            onChange={e => handleChange(e.target.value, "targetLang")}
            onBlur={e => handleChange(handleBlur(e), "targetLang")}
            />
            <div>Meaning</div>
            <input type="text"
            value={path[exampleIndex].meaning}
            onChange={e => handleChange(e.target.value, "meaning")}
            onBlur={e => handleChange(handleBlur(e), "meaning")}
            />
        </>
    )
}


export default Example;