import { clone, getIndent } from "../../utils.js";
import _ from "lodash";
import { getHomographDisplay } from "../../entryDisplayFuncs.js";

const Homographs = props => {
  const { state, setState, thisIndex, stringPath, prevIndent, currentScriptId, thisScriptFormId } = props;

  let pathFrag = stringPath + ".items";
  const path = _.get(state, "editHomographs" + pathFrag);
  const upPath = _.get(state, "editHomographs" + stringPath);

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

    // update homograph nums based on state.editHomogrphss
    let entryClone = clone(thisEntry);
    for (let morph of entryClone.headword.morphs) {
      for (let scriptForm of morph.scriptForms) {
        for (let homographSet of state.editHomographs) {
          let match = homographSet.items.find(item => item.id === scriptForm.id);
          if (match) scriptForm.homograph = match.homograph;
        }
      }
    }

    // const thisEntry = state.allEntries.find(a => a._id === path[thisIndex].entryId) ?? state.entry;
    let allDisplayItems = getHomographDisplay([entryClone], state.setup, currentScriptId, state.etymologyTags, upPath);

    return allDisplayItems.map(a => a.display);
  };

  const isCurrent = thisScriptFormId === path[thisIndex].id;

  return (
    <>
      <div className={`row${isCurrent ? " highlight" : ""}`} aria-current={isCurrent ? true : false}>
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
