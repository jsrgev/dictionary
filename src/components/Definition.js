import {definitionDefault} from '../defaults.js'
import {clone, getIndent, handleBlur} from '../utils.js';

const Definition = props => {

    const {appState, setAppState, senseIndex, prevIndentLevel, definitionIndex} = props;
    const path = appState.entry.senses[senseIndex].definitions;

    const handleChange = (value, field) => {
        if (value !== undefined) {
            let entryCopy = clone(appState.entry);
            entryCopy.senses[senseIndex].definitions[definitionIndex][field] = value;
            setAppState({entry:entryCopy});
        }
    };

    const addDefinition = e => {
        e.preventDefault();
        if (e.target.classList.contains("disabled")) {
            return;
        }
        let entryCopy = clone(appState.entry);
        entryCopy.senses[senseIndex].definitions.splice(definitionIndex+1, 0, clone(definitionDefault));
        setAppState({entry: entryCopy});
    };

    const deleteDefinition = e => {
        e.preventDefault();
        let entryCopy = clone(appState.entry);
        if (path.length === 1) {
            entryCopy.senses[senseIndex].definitions = [clone(definitionDefault)];
        } else {
            entryCopy.senses[senseIndex].definitions.splice(definitionIndex, 1);
        }
        setAppState({entry: entryCopy});
    }; 



    // console.log(definitionIndex)

    return (
        <>
            <div className="row-controls">
                <i className={`fas fa-plus${path[definitionIndex].definition.trim() === "" ? " disabled" : ""}`}
                onClick={addDefinition}
                ></i>
                <i
                className={`fas fa-minus${path.length === 1 && path[definitionIndex].definition.trim() === "" ? " disabled" : ""}`}
                onClick={deleteDefinition}
                ></i>           

            </div>
            <div className="row-content" style={getIndent(prevIndentLevel)}>
            {/* <div className={`${shown? "" : " hidden"}`}> */}
                {/* <div></div> */}
                {/* <div></div> */}
                {/* <div></div> */}
                <div>Definition</div>
                <input type="text"
                value={path[definitionIndex].definition}
                onChange={e => handleChange(e.target.value, "definition")}
                onBlur={e => handleChange(handleBlur(e), "definition")}
                />
                {/* <div>Note</div> */}
                {/* <input type="text"
                value={path.note}
                onChange={e => handleChange(e.target.value, "note")}
                onBlur={e => handleChange(handleBlur(e), "note")}
                /> */}
            </div>
        </>
    )

};

export default Definition;