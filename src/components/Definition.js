import {definitionDefault} from '../defaults.js'
import {clone, getIndent, handleInputBlur} from '../utils.js';

const Definition = props => {

    const {appState, setAppState, senseGroupIndex, prevIndentLevel, thisIndex, addDefinition} = props;
    const path = appState.entry.senseGroups[senseGroupIndex].definitions;

    const handleChange = (value, field) => {
        if (value !== undefined) {
            let entryCopy = clone(appState.entry);
            entryCopy.senseGroups[senseGroupIndex].definitions[thisIndex][field] = value;
            setAppState({entry:entryCopy});
        }
    };


    const deleteDefinition = e => {
        e.preventDefault();
        let entryCopy = clone(appState.entry);
        if (path.length === 1) {
            entryCopy.senseGroups[senseGroupIndex].definitions = [clone(definitionDefault)];
        } else {
            entryCopy.senseGroups[senseGroupIndex].definitions.splice(thisIndex, 1);
        }
        setAppState({entry: entryCopy});
    }; 



    // console.log(thisIndex)

    return (
        <>
            <div className="row-controls">
                <i className={`fas fa-plus${path[thisIndex].definition.trim() === "" ? " disabled" : ""}`}
                onClick={e => addDefinition(e, thisIndex)}
                ></i>
                <i
                className={`fas fa-minus${path.length === 1 && path[thisIndex].definition.trim() === "" ? " disabled" : ""}`}
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
                value={path[thisIndex].definition}
                onChange={e => handleChange(e.target.value, "definition")}
                onBlur={e => handleChange(handleInputBlur(e), "definition")}
                />
                {/* <div>Note</div> */}
                {/* <input type="text"
                value={path.note}
                onChange={e => handleChange(e.target.value, "note")}
                onBlur={e => handleChange(handleInputBlur(e), "note")}
                /> */}
            </div>
        </>
    )

};

export default Definition;