import {clone, getIndent} from '../../utils.js';
import _ from "lodash";
import {getHomographDisplay} from '../../entryDisplayFuncs.js';

const Homographs = props => {

    const {state, setState, thisIndex, stringPath, prevIndent, currentScriptId} = props;

    // let pathFrag = stringPath;
    
    let pathFrag = stringPath + ".items";
    const path = _.get(state, "editHomographs" + pathFrag);
    // const path = _.get(state, pathFrag);
    const upPath = _.get(state, "editHomographs" + stringPath);
    
    // console.log(pathFrag);
    
    const moveRow = (e, up) => {
        const index = thisIndex;
        if (e.target.classList.contains("disabled")) return;
        let position = up ? index-1 : index+1;
        let editHomographsCopy = clone(state.editHomographs);
        let editHomographsCopyPath = _.get(editHomographsCopy, pathFrag);
        let thisItemCopy = clone(editHomographsCopyPath[index]);
        editHomographsCopyPath.splice(index, 1);
        editHomographsCopyPath.splice(position, 0, thisItemCopy);
        for (let i=0; i < editHomographsCopyPath.length; i++) {
            editHomographsCopyPath[i].homograph = i+1;
        }
        setState({editHomographs: editHomographsCopy});
    };



    const isFirst = thisIndex === 0;
    const isLast = thisIndex === path.length-1;
            
    // let stringPathA = `${stringPath}[${thisIndex}]`;
            
    const getDisplay = () => {
        const thisEntry = state.allEntries.find(a => a._id === path[thisIndex].entryId) ?? state.entry;
        let allDisplayItems = getHomographDisplay([thisEntry], state.setup, currentScriptId, state.etymologyTags, upPath);

        return allDisplayItems.map(a => a.display);
    };

    return (
        <>
            <div className="row">
                <div className="row-controls">
                   <span></span>
                   <span></span>
                   <span></span>
                    <i
                    className={`fas fa-arrow-up${isFirst ? " disabled" : ""}`}
                    onClick={e => moveRow(e, true)}
                    ></i>
                    <i
                    className={`fas fa-arrow-down${isLast ? " disabled" : ""}`}
                    onClick={e => moveRow(e, false)}
                    ></i>
                </div>
                <div className="row-content single" style={getIndent(prevIndent)}>
                    {/* <label htmlFor={`${pathFrag}[${thisIndex}]`} >
                        {thisIndex===0 ? labels[0] : labels[1]}{getNumber()}{getScriptLabel()}
                        </label> */}
                        {/* <span>{thisIndex}</span> */}

                        <span>{getDisplay()}</span>

                </div>
            </div>
        </>
    )
};

export default Homographs;