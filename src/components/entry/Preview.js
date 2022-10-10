import React from "react";
import { clone } from "../../utils.js";
import { getEntriesDisplay } from "../../entryDisplayFuncs.js";

const Preview = props => {
  const { state } = props;

  const getDisplay = () => {
    // console.log(state.editHomographs);

    // update homograph nums based on state.editHomogrphss
    let entryClone = clone(state.entry);
    for (let morph of entryClone.headword.morphs) {
      for (let scriptForm of morph.scriptForms) {
        for (let homographSet of state.editHomographs) {
          let match = homographSet.items.find(item => item.id === scriptForm.id);
          if (match) scriptForm.homograph = match.homograph;
        }
      }
    }
    let currentScriptId = state.setup.scripts.items[0].id;
    let allDisplayItems = getEntriesDisplay([entryClone], state.setup, currentScriptId, state.etymologyTags);
    let finalEntries = allDisplayItems.map(a => a.display);
    return finalEntries;
  };

  return (
    <>
      <h2>Preview</h2>
      {state.entry && getDisplay().map((a, i) => <p key={i}>{a}</p>)}
    </>
  );
};

export default Preview;
