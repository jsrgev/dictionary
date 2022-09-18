import Homograph from './Homograph';
import {getIndent} from '../../utils.js';
import {useState} from 'react';
import _ from "lodash";

const HomographGroup = props => {

    const {state, setState, thisIndex, prevIndent, addFunctions, currentScriptId} = props;

    let pathFrag = `[${thisIndex}]`;
    const path = _.get(state, "editHomographs" + pathFrag);

    // console.log(path);

    const [sectionOpen, setSectionOpen] = useState(true);
    
    return (
        <>
            <div className={`row${sectionOpen ? "" : " closed"}`}>
            <div className="row-controls">
                <span></span>
                <span></span>
                <i className={`fas fa-chevron-${sectionOpen ? "up" : "down"}`} onClick={() => setSectionOpen(!sectionOpen)}></i>
                <span></span>
            </div>

            <div className="row-content" style={getIndent(prevIndent + 1)}>
                <span>Homograph Order</span>
            </div>
            {path.items.map((a,i) => (
                <Homograph state={state} setState={setState} key={i} thisIndex={i} prevIndent={prevIndent+2} stringPath={pathFrag} addFunctions={addFunctions} currentScriptId={currentScriptId} />
                ))
            }   
            </div>
        </>
    );
};

export default HomographGroup;