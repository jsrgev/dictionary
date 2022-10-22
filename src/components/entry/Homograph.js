import { clone, getIndent, updateHomographNums } from "../../utils.js";
import { getEntriesDisplay } from "../../entryDisplayFuncs.js";
import _ from "lodash";

const Homographs = props => {
  const { state, setState, thisIndex, stringPath, prevIndent, thisScriptId } = props;

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
    setState({ editHomographs: editHomographsCopy });
  };

  // console.log(path);

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
      // state.setup.scripts.items[0].id,
      thisScriptId,
      state.etymologyTags,
      path[thisIndex].scriptForm
    );

    return allDisplayItems.map(a => a.display);
  };

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
