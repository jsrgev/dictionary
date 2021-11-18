import {definitionDefault} from '../defaults.js'
import {clone, getIndent, handleInputBlur} from '../utils.js';
import _ from 'lodash';

const Definition = props => {

    const {appState, setAppState, prevIndentLevel, thisIndex, addDefinition, stringPath} = props;
    // const path = appState.entry.senseGroups[senseGroupIndex].definitions;

    let pathFrag = stringPath + ".definitions";
    const path = _.get(appState, "entry." + pathFrag);

    const handleChange = (value, field) => {
        if (value !== undefined) {
            let entryCopy = clone(appState.entry);
            let entryCopyPath = _.get(entryCopy, pathFrag);
            // console.log(entryCopyPath)
            // return;
            entryCopyPath[thisIndex][field] = value;
            setAppState({entry:entryCopy});
        }
    };


    const deleteDefinition = e => {
        e.preventDefault();
        let entryCopy = clone(appState.entry);
        let entryCopyPath = _.get(entryCopy, pathFrag)
        if (path.length === 1) {
            entryCopyPath = [clone(definitionDefault)];
        } else {
            entryCopyPath.splice(thisIndex, 1);
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