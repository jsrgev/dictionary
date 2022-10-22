import AddPopup from "../AddPopup";
import Note from "./Note";
import HomographGroup from "./HomographGroup";
import { clone, handleInputBlur, getIndent, addPopupHandler } from "../../utils.js";
import { useState, useEffect } from "react";
import _ from "lodash";

const ScriptForm = props => {
  const { state, setState, thisIndex, prevIndent, stringPath, addFunctions, moveRow, updateHomographs } = props;
  const { addNote } = addFunctions;

  let pathFrag = stringPath + ".scriptForms";
  const path = _.get(state, "entry." + pathFrag);

  const [sectionOpen, setSectionOpen] = useState(true);
  const [addPopupVisible, setAddPopupVisible] = useState(false);
  const [thisEditHomographs, setThisEditHomographs] = useState(false);

  const thisScriptForm = path[thisIndex].content;

  const handleChange = value => {
    if (value !== undefined) {
      let entryCopy = clone(state.entry);
      let entryCopyPath = _.get(entryCopy, pathFrag);
      entryCopyPath[thisIndex].content = value;
      setState({ entry: entryCopy });
      // updateHomographs(path[thisIndex].id, path[thisIndex].content);
    }
  };

  // const updateEntryHomograph = (scriptFormId, newNumber) => {
  //     let {morphs} = state.entry.headword;
  //     for (let i=0; i < morphs.length; i++) {
  //         let {scriptForms} = morphs[i];
  //         for (let j=0; j < scriptForms.length; j++) {
  //             if (scriptForms[j].id === scriptFormId) {
  //                 let entryClone = clone(state.entry);
  //                 entryClone.headword.morphs[i].scriptForms[j].homograph = newNumber;
  //                 setState({entry: entryClone});
  //                 break;
  //             }
  //         }
  //     }
  // };

  // what if two identical scriptForms on new entry, different morph forms
  // have to get homograph#s from state.editHomographs?

  useEffect(() => {
    // console.log("useEffect");
    // updateHomographs(path[thisIndex].id, path[thisIndex].content, path[thisIndex].scriptRefId);
    updateHomographs(path[thisIndex]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path[thisIndex].content, path[thisIndex].id]);

  // console.log(state.editHomographs);

  // useEffect( () => {
  //     setThisEditHomographs(state.editHomographs.find(a => a.id === path[thisIndex].id));
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  // },[updateHomographs]);

  useEffect(() => {
    setThisEditHomographs(state.editHomographs.find(a => a.id === path[thisIndex].id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.editHomographs]);

  // console.log(thisEditHomographs)

  const getScriptLabel = () => {
    const script = state.setup.scripts.items.find(a => a.id === path[thisIndex].scriptRefId);
    return script.abbr?.length > 1 ? script.abbr : script.name;
  };

  // const currentScriptId = state.setup.scripts.items.find(a => a.id === path[thisIndex].scriptRefId).id;

  const popupItems = [
    [
      "Note",
      () => {
        let index = path[thisIndex].notes ? path[thisIndex].notes.length - 1 : 0;
        addNote(index, pathFrag + `[${thisIndex}]`);
      },
    ],
  ];

  const homographIndex = state.editHomographs.findIndex(a => a.id === path[thisIndex].id);
  // console.log(path[thisIndex].content, path[thisIndex].id, homographIndex);
  // console.log(state.editHomographs[homographIndex]?.items);
  const showHomographGroup =
    thisEditHomographs?.scriptForm === path[thisIndex].content &&
    homographIndex > -1 &&
    state.editHomographs[homographIndex].items.length > 0;
  // console.log(state.editHomographs)
  // console.log(thisEditHomographs)
  // console.log(path[thisIndex])

  let stringPathA = pathFrag + `[${thisIndex}]`;

  return (
    <>
      <div className={`row${sectionOpen ? "" : " closed"}`}>
        <div className="row-controls">
          <AddPopup popupItems={popupItems} visible={addPopupVisible} />
          <i className="fas fa-plus" onClick={() => addPopupHandler(addPopupVisible, setAddPopupVisible)}></i>
          <span></span>
          {path[thisIndex].notes || showHomographGroup ? (
            <i className={`fas fa-chevron-${sectionOpen ? "up" : "down"}`} onClick={() => setSectionOpen(!sectionOpen)}></i>
          ) : (
            <span></span>
          )}
        </div>
        <div className="row-content" style={getIndent(prevIndent)}>
          <label htmlFor={`${pathFrag}[${thisIndex}]`}>{getScriptLabel()}</label>
          <input
            type="text"
            id={`${pathFrag}[${thisIndex}]`}
            className="for norm"
            value={thisScriptForm}
            onChange={e => handleChange(e.target.value)}
            onBlur={e => handleChange(handleInputBlur(e))}
          />
        </div>
        {showHomographGroup && (
          <>
            <HomographGroup
              state={state}
              setState={setState}
              key={homographIndex}
              thisIndex={homographIndex}
              prevIndent={prevIndent + 1}
              addFunctions={addFunctions}
              thisScriptFormId={path[thisIndex].id}
              thisScriptId={path[thisIndex].scriptRefId}
            />
          </>
        )}

        {path[thisIndex].notes?.map((a, i) => (
          <Note
            state={state}
            setState={setState}
            key={i}
            thisIndex={i}
            prevIndent={prevIndent + 1}
            stringPath={stringPathA}
            addFunctions={addFunctions}
            moveRow={moveRow}
            thisEditHomographs={thisEditHomographs}
          />
        ))}
      </div>
    </>
  );
};

export default ScriptForm;
