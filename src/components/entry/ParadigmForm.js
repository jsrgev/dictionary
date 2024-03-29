import { clone, getIndent, addPopupHandler, getGramFormAbbrs } from "../../utils.js";
import { morphDefault } from "../../defaults.js";
import Morph from "./Morph.js";
import AddPopup from "../AddPopup";
import { useState } from "react";
import _ from "lodash";

const ParadigmForm = props => {
  const { state, setState, prevIndent, stringPath, addFunctions, gramFormSet, moveRow, cleanUpIrregulars } = props;
  const { setScriptForms, addMorph } = addFunctions;

  let pathFrag = stringPath;
  const path = _.get(state, "entry." + pathFrag);

  const [addPopupVisible, setAddPopupVisible] = useState(false);
  const [sectionOpen, setSectionOpen] = useState(true);

  const changeExists = () => {
    let needCleanUp = true;
    let entryCopy = clone(state.entry);
    let entryCopyPath = _.get(entryCopy, pathFrag);
    let index = getIndex();
    let obj = {
      gramFormSet: gramFormSet,
      missing: true,
    };
    if (!entryCopyPath.irregulars) {
      entryCopyPath.irregulars = [obj];
    } else if (index < 0) {
      entryCopyPath.irregulars.push(obj);
    } else if (entryCopyPath.irregulars[index].missing) {
      if (entryCopyPath.irregulars[index].morphs) {
        delete entryCopyPath.irregulars[index].missing;
      } else if (entryCopyPath.irregulars.length > 1) {
        delete entryCopyPath.irregulars.splice(index, 1);
      } else {
        delete entryCopyPath.irregulars;
      }
      needCleanUp = false;
    } else {
      entryCopyPath.irregulars[index] = obj;
    }
    setState({ entry: entryCopy });
    if (needCleanUp) cleanUpIrregulars();
  };

  const changeRegular = () => {
    if (!gramFormExists()) {
      return;
    }
    let needCleanUp = false;
    let entryCopy = clone(state.entry);
    let entryCopyPath = _.get(entryCopy, pathFrag);
    let index = getIndex();
    if (index >= 0) {
      if (entryCopyPath.irregulars.length === 1) {
        delete entryCopyPath.irregulars;
      } else {
        entryCopyPath.irregulars.splice(index, 1);
      }
      needCleanUp = true;
    } else {
      let obj = {
        gramFormSet: gramFormSet,
        morphs: [clone(morphDefault)],
      };
      setScriptForms(obj.morphs[0]);
      // console.log(obj);
      if (entryCopyPath.irregulars) {
        entryCopyPath.irregulars.push(obj);
      } else {
        entryCopyPath.irregulars = [obj];
      }
    }
    setState({ entry: entryCopy });
    if (needCleanUp) cleanUpIrregulars();
  };

  const gramFormExists = () => {
    let index = getIndex();
    if (index < 0) {
      return true;
    } else {
      return !path.irregulars?.[index].missing ? true : false;
    }
  };

  const isIrregular = () => {
    let index = getIndex();
    if (index < 0) {
      return false;
    } else {
      return path.irregulars?.[index].morphs ? true : false;
    }
  };

  const getIndex = () => {
    let index = path.irregulars?.findIndex(a => {
      return a.gramFormSet.every(b => {
        return gramFormSet.some(c => c === b);
      });
    });
    return index ?? -1;
  };

  const popupItems = [];

  if (isIrregular()) {
    popupItems.push([
      "Alternate form",
      () => addMorph(path.irregulars[getIndex()].morphs.length - 1, pathFrag + `.irregulars[${getIndex()}].morphs`),
    ]);
  }

  // formGroups + classGroups
  let combinedGramFormGroups = state.setup.gramFormGroups.items.concat(state.setup.gramClassGroups.items);

  let stringPathA = pathFrag + `.irregulars[${getIndex()}].morphs`;

  return (
    <>
      <div className={`row${sectionOpen ? "" : " closed"}`}>
        <div className="row-controls">
          <AddPopup popupItems={popupItems} visible={addPopupVisible} />
          <i className={!isIrregular() ? "" : "fas fa-plus"} onClick={() => addPopupHandler(addPopupVisible, setAddPopupVisible)}></i>
          {/* <span></span> */}
          <span></span>
          <i
            className={!isIrregular() ? "" : `fas fa-chevron-${sectionOpen ? "up" : "down"}`}
            onClick={() => setSectionOpen(!sectionOpen)}
          ></i>
        </div>
        <div className="row-content paradigmForms" style={getIndent(prevIndent - 1)}>
          <div>{getGramFormAbbrs(gramFormSet, combinedGramFormGroups)}</div>
          <div onClick={changeExists}>{gramFormExists() ? "Exists" : "Missing"}</div>
          <div onClick={changeRegular}>{!gramFormExists() ? "" : isIrregular() ? "Irregular" : "Regular"}</div>
        </div>
        {isIrregular() &&
          path.irregulars[getIndex()].morphs.map((a, i) => (
            <Morph
              state={state}
              setState={setState}
              thisIndex={i}
              key={i}
              prevIndent={prevIndent}
              stringPath={stringPathA}
              labels={["Form", "Form"]}
              addFunctions={addFunctions}
              moveRow={moveRow}
            />
          ))}

        {/* {state.entry?.headword?.morphs.map((a,i) => (
                        <Morph state={state} setState={setState} thisIndex={i} key={i} stringPath={pathFragA} prevIndent={0} labels={["Basic form", "Alternate"]}  addFunctions={addFunctions} moveRow={moveRow} />
                    ))
                } */}
      </div>
    </>
  );
};

export default ParadigmForm;
