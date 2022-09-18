import {getIndent} from '../../utils.js';
import _ from "lodash";
import {getHomographDisplay} from '../../entryDisplayFuncs.js';

const Homographs = props => {

    const {state, thisIndex, stringPath, prevIndent, moveRow, currentScriptId} = props;
    
    let pathFrag = stringPath + ".items";
    const path = _.get(state, pathFrag);
    const upPath = _.get(state, stringPath);
    
    // const handleChange = (field, value) => {
        //     if (value !== undefined) {
            //         let entryCopy = clone(state.entry);
            //         let entryCopyPath = _.get(entryCopy, pathFrag);
            //         entryCopyPath[thisIndex].scriptForms.find(a => a.refId === currentScript.id)[field] = value;
            //         setState({entry: entryCopy});
            //     }
            // }
        

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
                    onClick={e => moveRow(e, thisIndex, pathFrag, true)}
                    ></i>
                    <i
                    className={`fas fa-arrow-down${isLast ? " disabled" : ""}`}
                    onClick={e => moveRow(e, thisIndex, pathFrag, false)}
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