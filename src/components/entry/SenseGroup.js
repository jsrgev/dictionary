import PartOfSpeech from "./PartOfSpeech";
import Phrase from "./Phrase";
// import Example from './Example';
import Definition from "./Definition";
import AddPopup from "../AddPopup";
import { clone, generateSenseGroup, addPopupHandler } from "../../utils.js";
import { useState } from "react";
import _ from "lodash";

const SenseGroup = props => {
  const { state, setState, thisIndex, addFunctions, moveRow, setScriptForms } = props;
  const { addDefinition, addPhrase, addPos } = addFunctions;
  // const path = state.entry.senseGroups;

  const stringPath = "senseGroups";
  let pathFrag = stringPath;
  const path = _.get(state, "entry." + pathFrag);

  const [addPopupVisible, setAddPopupVisible] = useState(false);
  const [sectionOpen, setSectionOpen] = useState(true);

  const addSenseGroup = e => {
    let entryCopy = clone(state.entry);
    entryCopy.senseGroups.splice(
      thisIndex + 1,
      0,
      generateSenseGroup(state.setup.partsOfSpeechDefs.items[0].id, state.setup.partsOfSpeechDefs.items, state.setup.gramClassGroups.items)
    );
    setState({ entry: entryCopy });
  };

  const deleteSenseGroup = e => {
    let entryCopy = clone(state.entry);
    if (state.entry.senseGroups.length === 1) {
      entryCopy.senseGroups = [
        generateSenseGroup(
          state.setup.partsOfSpeechDefs.items[0].id,
          state.setup.partsOfSpeechDefs.items,
          state.setup.gramClassGroups.items
        ),
      ];
    } else {
      entryCopy.senseGroups.splice(thisIndex, 1);
    }
    setState({ entry: entryCopy });
  };

  const availablePoses = state.setup.partsOfSpeechDefs.items.filter(a => {
    let alreadySelected = path[thisIndex].partsOfSpeech.some(b => b.refId === a.id);
    return !alreadySelected && a;
  });

  const popupItems = [
    ["Sense group", addSenseGroup],
    [
      "Definition",
      () => {
        let index = path[thisIndex].definitions ? path[thisIndex].definitions.length - 1 : 0;
        addDefinition(index, pathFrag + `[${thisIndex}]`);
      },
    ],
    [
      "Phrase",
      () => {
        let index = path[thisIndex].phrases ? path[thisIndex].phrases.length - 1 : 0;
        addPhrase(index, pathFrag + `[${thisIndex}]`);
      },
    ],
    ["Part of speech", () => addPos(path[thisIndex].partsOfSpeech.length - 1, pathFrag + `[${thisIndex}].partsOfSpeech`, availablePoses)],
  ];

  const isFirst = thisIndex === 0;
  const isLast = thisIndex === path.length - 1;

  // senseGroupAvailablePoses

  let stringPathA = `senseGroups[${thisIndex}]`;

  return (
    <>
      <div className={`row${sectionOpen ? "" : " closed"}`}>
        <div className="row-controls">
          <AddPopup popupItems={popupItems} visible={addPopupVisible} />
          <i className="fas fa-plus" onClick={() => addPopupHandler(addPopupVisible, setAddPopupVisible)}></i>
          <i className="fas fa-minus" onClick={deleteSenseGroup}></i>
          <i className={`fas fa-chevron-${sectionOpen ? "up" : "down"}`} onClick={() => setSectionOpen(!sectionOpen)}></i>
          <i className={`fas fa-arrow-up${isFirst ? " disabled" : ""}`} onClick={e => moveRow(e, thisIndex, pathFrag, true)}></i>
          <i className={`fas fa-arrow-down${isLast ? " disabled" : ""}`} onClick={e => moveRow(e, thisIndex, pathFrag, false)}></i>
        </div>
        <div className="row-content">
          <span>Sense group{path.length > 1 ? ` ${thisIndex + 1}` : ""}</span>
        </div>
        {path[thisIndex].partsOfSpeech.map((a, i) => (
          <PartOfSpeech
            state={state}
            setState={setState}
            thisIndex={i}
            key={i}
            prevIndent={0}
            stringPath={stringPathA}
            addFunctions={addFunctions}
            availablePoses={availablePoses}
            moveRow={moveRow}
            setScriptForms={setScriptForms}
          />
        ))}
        {path[thisIndex].definitions &&
          path[thisIndex].definitions.map((a, i) => (
            <Definition
              state={state}
              setState={setState}
              thisIndex={i}
              key={i}
              prevIndent={0}
              addFunctions={addFunctions}
              stringPath={stringPathA}
              moveRow={moveRow}
            />
          ))}
        {path[thisIndex].phrases &&
          path[thisIndex].phrases.map((a, i) => (
            <Phrase
              state={state}
              setState={setState}
              thisIndex={i}
              key={i}
              prevIndent={0}
              addFunctions={addFunctions}
              stringPath={stringPathA}
              moveRow={moveRow}
            />
          ))}
      </div>
    </>
  );
};

export default SenseGroup;
