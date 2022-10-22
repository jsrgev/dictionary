import Homograph from "./Homograph";
import { getIndent, sortByHomographNums } from "../../utils.js";
import { useState } from "react";
import _ from "lodash";

const HomographGroup = props => {
  const { state, setState, thisIndex, prevIndent, addFunctions, currentScriptId, thisScriptFormId, thisScriptId } = props;

  const pathFrag = `[${thisIndex}]`;
  const path = _.get(state, "editHomographs" + pathFrag);

  const homographEntries = sortByHomographNums(path.items);

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

        <div className="row-content" style={getIndent(prevIndent)}>
          <span>Homograph Order</span>
        </div>
        {homographEntries.map((a, i) => (
          <Homograph
            state={state}
            setState={setState}
            key={i}
            thisIndex={i}
            prevIndent={prevIndent + 1}
            stringPath={pathFrag}
            addFunctions={addFunctions}
            currentScriptId={currentScriptId}
            thisScriptFormId={thisScriptFormId}
            thisScriptId={thisScriptId}
          />
        ))}
      </div>
    </>
  );
};

export default HomographGroup;
