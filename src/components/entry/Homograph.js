import { clone, getIndent, updateHomographNums } from "../../utils.js";
import { getEntriesDisplay } from "../../entryDisplayFuncs.js";
import _ from "lodash";
import { getHomographDisplay } from "../../entryDisplayFuncs.js";

const Homographs = props => {
  const { state, setState, thisIndex, stringPath, prevIndent, currentScriptId, thisScriptFormId } = props;

  let pathFrag = stringPath + ".items";
  const path = _.get(state, "editHomographs" + pathFrag);

  const moveRow = (e, up) => {
    const index = thisIndex;
    if (e.target.classList.contains("disabled")) return;
    let position = up ? index - 1 : index + 1;
    let editHomographsCopy = clone(state.editHomographs);
    let editHomographsCopyPath = _.get(editHomographsCopy, pathFrag);
    let thisItemCopy = clone(editHomographsCopyPath[index]);
    editHomographsCopyPath.splice(index, 1);
    editHomographsCopyPath.splice(position, 0, thisItemCopy);

    for (let i = 0; i < editHomographsCopyPath.length; i++) {
      editHomographsCopyPath[i].homograph = i + 1;
    }
    // console.log(editHomographsCopy);
    setState({ editHomographs: editHomographsCopy });
  };

  // console.log(upPath);

  const isFirst = thisIndex === 0;
  const isLast = thisIndex === path.length - 1;

  const getDisplay = () => {
    let thisEntry = state.allEntries.find(a => a._id === path[thisIndex].entryId);
    if (!thisEntry || thisEntry._id === state.entry._id) {
      thisEntry = state.entry;
    }

    let updatedEntry = updateHomographNums(thisEntry, state.editHomographs);

    let allDisplayItems = getEntriesDisplay(
      [updatedEntry],
      state.setup,
      state.setup.scripts.items[0].id,
      state.etymologyTags,
      path[thisIndex].scriptForm
    );

    // let allDisplayItems = getHomographDisplay([updatedEntry], state.setup, currentScriptId, state.etymologyTags);

    return allDisplayItems.map(a => a.display);
  };

  // const isCurrent = thisScriptFormId === path[thisIndex].id;

  // console.log(path[thisIndex]);

  return (
    <>
      <div className={`row${path[thisIndex].current ? " highlight" : ""}`} aria-current={path[thisIndex].current ? true : false}>
        <div className="row-controls">
          <span></span>
          <span></span>
          <span></span>
          <i className={`fas fa-arrow-up${isFirst ? " disabled" : ""}`} onClick={e => moveRow(e, true)}></i>
          <i className={`fas fa-arrow-down${isLast ? " disabled" : ""}`} onClick={e => moveRow(e, false)}></i>
        </div>
        <div className="row-content single" style={getIndent(prevIndent)}>
          <span>{getDisplay()}</span>
        </div>
      </div>
    </>
  );
};

export default Homographs;
