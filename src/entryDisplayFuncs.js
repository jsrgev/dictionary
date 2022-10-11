import React from "react";
import { clone, getPosDef, getGramFormAbbrs, sortEntries } from "./utils.js";

const filterOutBlanks = set => {
  if (set[0]?.scriptForms) {
    return set.filter(a => a.scriptForms[0].content.trim() !== "");
  } else {
    return set.filter(a => a.content.trim() !== "");
  }
};

const getNotesDisplay = arr => {
  let filteredArr = filterOutBlanks(arr);
  let newArr = filteredArr.map(a => `(${a.content})`);
  let string = newArr.join(" ");
  return ` ${string}`;
};

const getPronunciationsDisplay = arr => {
  let filteredArr = filterOutBlanks(arr);
  if (filteredArr.length === 0) return "";
  let newArr = filteredArr.map((a, i, arr) => {
    let divider = arr.length > 1 && i < arr.length - 1 ? " or " : "";
    let pronunciation = <span className="phonetic">/{a.content}/</span>;
    let notes = a.notes ? getNotesDisplay(a.notes) : "";
    return (
      <React.Fragment key={i}>
        {pronunciation}
        {notes}
        {divider}
      </React.Fragment>
    );
  });
  return <> {newArr}</>;
};

const getAltDisplayForHeadword = altDisplayForHeadword => {
  return altDisplayForHeadword.map((a, i) => {
    return <React.Fragment key={i}> or {a}</React.Fragment>;
  });
};

const getHomographNum = scriptForm => {
  if (scriptForm.homograph === 0) return "";
  return (
    <React.Fragment>
      <sup>{scriptForm.homograph}</sup>
    </React.Fragment>
  );
};

const getMorphsDisplay = (arr, isHeadword, altDisplayForHeadword, showPronunciation, currentScriptId, otherScriptIds) => {
  // console.log(altDisplayForHeadword);
  let morphType = isHeadword ? "hw" : "for";

  let newArr = arr.map((a, i) => {
    let mainWord = a.scriptForms.find(a => a.scriptRefId === currentScriptId);
    if (mainWord.content === "") mainWord.content = "☐";
    let morph = (
      <React.Fragment>
        <span className={morphType}>{mainWord.content}</span>
        {/* 
        // TTHIS ONEEEEE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //  */}
        {getHomographNum(mainWord)}
      </React.Fragment>
    );
    let others = a.scriptForms.filter(a => otherScriptIds.find(b => b === a.refId));
    let otherMorphs = others.map((a, i, arr) => {
      let divider = arr[i].content !== "" ? " " : "";
      return (
        <React.Fragment key={i}>
          {divider}
          <span className="for">{a.content}</span>
          {getHomographNum(a)}
        </React.Fragment>
      );
    });
    let pronunciations = showPronunciation ? getPronunciationsDisplay(a.pronunciations) : "";
    let notes = a.notes ? getNotesDisplay(a.notes) : "";
    // console.log(a.isHeadword)
    let alts = isHeadword ? getAltDisplayForHeadword(altDisplayForHeadword) : "";
    if (a.isHeadword) {
      console.log(getAltDisplayForHeadword(altDisplayForHeadword));

      console.log(alts);
    }
    return (
      <React.Fragment key={i}>
        {morph}
        {otherMorphs}
        {pronunciations}
        {notes}
        {alts}
      </React.Fragment>
    );
  });
  return newArr;
};

const getOtherScriptIds = (id, scripts) => {
  let otherScripts = scripts.filter(a => a.id !== id && a.display);
  return otherScripts.map(a => a.id);
};

const getAltDisplayItems = (item, currentScriptId, otherScriptIds, key, mainCurrentScript, mainOtherScriptsDisplay) => {
  // console.log(item);
  let altMainScriptForm = item.scriptForms.find(a => a.scriptRefId === currentScriptId).content || "☐";
  let altOtherScripts = item.scriptForms.filter(a => otherScriptIds.find(b => b === a.refId));
  let altOtherScriptsDisplay = altOtherScripts.map((a, i, arr) => {
    return (
      <React.Fragment key={i}>
        {" "}
        <span className="for">{a.content}</span>
        {getHomographNum(a)}
      </React.Fragment>
    );
  });
  let mainScriptForm = item.scriptForms.find(a => a.scriptRefId === currentScriptId);
  let sortTerm = item.scriptForms.find(a => a.scriptRefId === currentScriptId).content;
  if (sortTerm === "") sortTerm = "☐";
  let obj = {
    sortTerm,
    display: (
      <React.Fragment key={key}>
        <span key={key} className="for">
          {altMainScriptForm}
        </span>
        {getHomographNum(mainScriptForm)}
        {altOtherScriptsDisplay} see <span className="for">{mainCurrentScript.content}</span>
        {getHomographNum(mainCurrentScript)}
        {mainOtherScriptsDisplay}
      </React.Fragment>
    ),
  };
  return obj;
};

export const getHomographDisplay = (entries, setup, currentScriptId, etymologyTags) => {
  let allDisplayItems = [];
  let key = 0;
  let otherScriptIds = getOtherScriptIds(currentScriptId, setup.scripts.items);
  entries.forEach(entry => {
    let morphs = clone(entry.headword.morphs);
    if (morphs.length === 0) return "";

    let mainOtherScripts = morphs[0].scriptForms.filter(a => otherScriptIds.find(b => b === a.refId));
    let mainOtherScriptsDisplay = mainOtherScripts.map((a, i) => {
      return (
        <React.Fragment key={i}>
          {" "}
          <span className="for">{a.content}</span>
          {getHomographNum(a)}
        </React.Fragment>
      );
    });

    let altDisplayForHeadword = [];

    let isMain;
    let homographMorph;
    console.log(morphs);
    for (let i = 0; i < morphs.length; i++) {
      console.log(morphs[i].scriptForms[0]);
      // let currentScriptForm = morphs[i].scriptForms.find(a => a.scriptRefId === currentScriptId);
      // console.log(currentScriptForm.content, thisEditHomographs.scriptForm);
      // if (currentScriptForm.content === thisEditHomographs.scriptForm) {
      isMain = i === 0;
      // console.log(isMain);
      homographMorph = morphs[i];
      // break;
      // }
    }
    let mainCurrentScriptForm = !isMain ? morphs[0].scriptForms.find(a => a.scriptRefId === currentScriptId) : null;

    if (!isMain) {
      let obj = getAltDisplayItems(homographMorph, currentScriptId, otherScriptIds, key, mainCurrentScriptForm, mainOtherScriptsDisplay);
      allDisplayItems.push(obj);
      return allDisplayItems;
    }

    for (let i = 1; i < morphs.length; i++) {
      let item = morphs[i];
      console.log(item);
      let fullDisplay = getMorphsDisplay([item], null, null, null, currentScriptId, otherScriptIds);
      altDisplayForHeadword.push(fullDisplay);

      key++;
    }

    let morphsDisplay = getMorphsDisplay(
      [morphs[0]],
      true,
      altDisplayForHeadword,
      setup.entrySettings.showPronunciation,
      currentScriptId,
      otherScriptIds
    );
    let senseGroupDisplay = getSenseGroups(entry.senseGroups, setup);
    let etymologyDisplay = setup.entrySettings.showEtymology ? getEtymologyDisplay(entry.etymology, etymologyTags) : "";
    let sortTerm = morphs[0].scriptForms.find(a => a.scriptRefId === currentScriptId).content || "☐";
    let obj = {
      sortTerm,
      display: (
        <React.Fragment key={key}>
          {morphsDisplay}
          {senseGroupDisplay}
          {etymologyDisplay}
        </React.Fragment>
      ),
    };
    allDisplayItems.push(obj);
    key++;
  });
  // sortEntries(allDisplayItems, setup.scripts.items[0].letterOrder, setup.scripts.items[0].diacriticOrder);
  return allDisplayItems;
};

export const getEntriesDisplay = (entries, setup, currentScriptId, etymologyTags, homographScriptForm) => {
  let allDisplayItems = [];
  let key = 0;
  let otherScriptIds = getOtherScriptIds(currentScriptId, setup.scripts.items);

  entries.forEach(entry => {
    let morphs = clone(entry.headword.morphs);
    if (morphs.length === 0) return "";

    let mainCurrentScriptForm = morphs[0].scriptForms.find(a => a.scriptRefId === currentScriptId) || "☐";

    let mainOtherScripts = morphs[0].scriptForms.filter(a => otherScriptIds.find(b => b === a.refId));
    let mainOtherScriptsDisplay = mainOtherScripts.map((a, i, arr) => {
      return (
        <React.Fragment key={i}>
          {" "}
          <span className="for">{a.content}</span>
          {getHomographNum(a)}
        </React.Fragment>
      );
    });

    let altDisplayForHeadword = [];

    // get displays for alternate forms of headword. (starts at i=1 to skip initial entry which is the main one)
    for (let i = 1; i < morphs.length; i++) {
      let item = morphs[i];
      console.log(mainCurrentScriptForm.content, homographScriptForm);
      console.log(morphs[0].scriptForms);
      console.log(item.scriptForms);

      // console.log(scriptFormId);

      // if (!onlyMain) {

      // gets "b see a" forms to insert into main entry display
      if (mainCurrentScriptForm.content !== homographScriptForm) {
        let obj = getAltDisplayItems(item, currentScriptId, otherScriptIds, key, mainCurrentScriptForm, mainOtherScriptsDisplay);
        allDisplayItems.push(obj);
      }

      // gets "a or b" for display on separate line

      let fullDisplay = getMorphsDisplay([item], false, null, null, currentScriptId, otherScriptIds);
      altDisplayForHeadword.push(fullDisplay);

      key++;
    }
    // console.log(altDisplayForHeadword)

    // gets display for primary form of headword
    let currentScriptForm = morphs[0].scriptForms.find(a => a.scriptRefId === currentScriptId);
    // console.log(currentScriptForm, homographScriptForm);
    if (homographScriptForm === undefined || homographScriptForm === currentScriptForm.content) {
      let morphsDisplay = getMorphsDisplay(
        [morphs[0]],
        true,
        altDisplayForHeadword,
        setup.entrySettings.showPronunciation,
        currentScriptId,
        otherScriptIds
      );
      let senseGroupDisplay = getSenseGroups(entry.senseGroups, setup);
      let etymologyDisplay = setup.entrySettings.showEtymology ? getEtymologyDisplay(entry.etymology, etymologyTags) : "";
      // let sortTerm = .content || "☐";
      let obj = {
        sortTerm: currentScriptForm.content || "☐",
        homograph: currentScriptForm.homograph,
        display: (
          <React.Fragment key={key}>
            {morphsDisplay}
            {senseGroupDisplay}
            {etymologyDisplay}
          </React.Fragment>
        ),
      };
      allDisplayItems.push(obj);
    }

    key++;
  });
  sortEntries(allDisplayItems, setup.scripts.items[0].letterOrder, setup.scripts.items[0].diacriticOrder);
  return allDisplayItems;
};

const getIrregularsDisplay = (irregulars, setup) => {
  let items = [];
  let currentScriptId = setup.scripts.items[0].id;
  let otherScriptIds = getOtherScriptIds(currentScriptId, setup.scripts.items);
  for (let item of irregulars) {
    let abbrs = getGramFormAbbrs(item.gramFormSet, setup.gramFormGroups.items);
    if (item.missing) {
      items.push(
        <>
          no <span className="pos-abbr">{abbrs}</span>
        </>
      );
    } else {
      let filteredArr = filterOutBlanks(item.morphs);
      if (filteredArr.length > 0) {
        let morphs = getMorphsDisplay(item.morphs, false, null, setup.entrySettings.showPronunciation, currentScriptId, otherScriptIds);
        let morphsDisplay = morphs.map((a, i, arr) => {
          let divider = arr.length > 1 && i < arr.length - 1 ? " or " : "";
          return (
            <React.Fragment key={i}>
              {a}
              {divider}
            </React.Fragment>
          );
        });
        items.push(
          <>
            <span className="pos-abbr">{abbrs}</span> {morphsDisplay}
          </>
        );
      }
    }
  }
  if (items.length === 0) return "";
  let display = items.map((a, i, arr) => {
    let divider = arr.length > 1 && i < arr.length - 1 ? "; " : "";
    return (
      <React.Fragment key={i}>
        {a}
        {divider}
      </React.Fragment>
    );
  });
  return <> ({display})</>;
};

const getEtymologyDisplay = (etymology, etymologyTags) => {
  if (etymology === "") return "";
  etymology = etymology.trim();
  let arr = etymology.split(/(\[.+?\])/g);
  let filteredArr = arr.filter(a => a !== "");
  let arrClone = clone(filteredArr);
  let arr2 = [];
  for (let i = 0; i < arrClone.length; i++) {
    let tags = etymologyTags.find(a => a.displayOpen === arrClone[i]);
    let code = <>{arrClone[i]}</>;
    if (tags) {
      let tags2 = etymologyTags.find(a => a.displayClose === arrClone[i + 1]);
      if (tags2) {
        code = "";
        i++;
      } else {
        tags2 = etymologyTags.find(a => a.displayClose === arrClone[i + 2]);
        if (tags2) {
          code = tags.getCode(arrClone[i + 1]);
          i += 2;
        }
      }
    }
    arr2.push(code);
  }
  let display = arr2.reduce((prev, curr) => {
    return (
      <>
        {prev}
        {curr}
      </>
    );
  }, <></>);
  return <span className="etymology"> [{display}]</span>;
};

const getPosDisplay = (posDetails, setup) => {
  let posDef = getPosDef(posDetails.refId, setup.partsOfSpeechDefs.items);
  let posAbbr = posDef.abbr;
  let posGramClassAbbrs = posDetails.gramClassGroups?.map(gramClassGroup => {
    let gramClassGroupDef = setup.gramClassGroups.items.find(a => a.id === gramClassGroup.refId);
    let arr = gramClassGroup.gramClasses.map(c => {
      return gramClassGroupDef.gramClasses.find(b => b.id === c).abbr;
    });
    return arr.join(", ");
  });
  let filteredPosGramClassAbbrs = posGramClassAbbrs?.filter(a => a !== "") ?? [];
  let posGramClassAbbrsString = filteredPosGramClassAbbrs.join(", ");
  let divider = posGramClassAbbrsString === "" ? "" : "-";
  let gramClassesString = posGramClassAbbrs ? `${divider}${posGramClassAbbrsString}` : "";
  let posString = posAbbr + gramClassesString + ".";
  let irregularsDisplay = posDetails.irregulars ? getIrregularsDisplay(posDetails.irregulars, setup) : "";
  return (
    <>
      <span className="pos-abbr">{posString}</span>
      {irregularsDisplay}
    </>
  );
};

const getDefinitions = (arr, example) => {
  let filteredArr = filterOutBlanks(arr);
  if (filteredArr.length === 0) return "";
  let newArr = filteredArr.map((a, i, arr) => {
    let divider = arr.length > 1 && i < arr.length - 1 ? (example ? " / " : "; ") : "";
    let num = arr.length === 1 || example ? "" : `${i + 1}. `;
    let notes = a.notes ? getNotesDisplay(a.notes) : "";
    let examplesDisplay = a.examples ? getExamples(a.examples) : "";
    let wrapper = example ? ["‘", "’"] : ["", ""];
    let def = (
      <React.Fragment key={i}>
        {num}
        {wrapper[0]}
        {a.content}
        {wrapper[1]}
        {notes}
        {examplesDisplay}
        {divider}
      </React.Fragment>
    );
    return def;
  });
  return <> {newArr}</>;
};

const getPhrases = arr => {
  let filteredArr = filterOutBlanks(arr);
  if (filteredArr.length === 0) return "";
  let newArr = filteredArr.map((a, i, arr) => {
    let divider = arr.length > 1 && i < arr.length - 1 ? "; " : "";
    let notes = a.notes ? getNotesDisplay(a.notes) : "";
    let definitionsDisplay = getDefinitions(a.definitions);
    let phrase = (
      <React.Fragment key={i}>
        <span className="hw">{a.content}</span>
        {definitionsDisplay}
        {notes}
        {divider}
      </React.Fragment>
    );
    return phrase;
  });
  return <> {newArr}</>;
};

const getExamples = arr => {
  let filteredArr = filterOutBlanks(arr);
  if (filteredArr.length === 0) return "";
  let newArr = filteredArr.map((a, i, arr) => {
    let divider = arr.length > 1 && i < arr.length - 1 ? "; " : "";
    let notes = a.notes ? getNotesDisplay(a.notes) : "";
    let definitionsDisplay = getDefinitions(a.definitions, true);
    let phrase = (
      <React.Fragment key={i}>
        <span className="for">{a.content}</span>
        {definitionsDisplay}
        {notes}
        {divider}
      </React.Fragment>
    );
    return phrase;
  });
  return <>: {newArr}</>;
};

const getSenseGroupDisplay = (senseGroup, setup) => {
  let poses = senseGroup.partsOfSpeech.map((a, i, arr) => {
    let divider = i < arr.length - 1 ? <> / </> : "";
    let posDisplay = getPosDisplay(a, setup);
    return (
      <React.Fragment key={i}>
        {posDisplay}
        {divider}
      </React.Fragment>
    );
  });
  let { definitions, phrases } = senseGroup;
  let filteredDefinitions = definitions ? filterOutBlanks(definitions) : "";
  let filteredPhrases = phrases ? filterOutBlanks(phrases) : "";

  let definitionsDisplay = filteredDefinitions ? getDefinitions(filteredDefinitions) : "";
  let phrasesDisplay = filteredPhrases ? getPhrases(filteredPhrases) : "";
  let divider = definitionsDisplay !== "" && phrasesDisplay !== "" ? "; " : "";
  return (
    <>
      {" "}
      {poses}
      {definitionsDisplay}
      {divider}
      {phrasesDisplay}
    </>
  );
};

const getSenseGroups = (senseGroups, setup) => {
  let senseGroupsDisplay = senseGroups.map((a, i, arr) => {
    let divider = arr.length > 1 && i < arr.length - 1 ? "; " : "";
    let display = getSenseGroupDisplay(a, setup);
    return (
      <React.Fragment key={i}>
        {display}
        {divider}
      </React.Fragment>
    );
  });
  return senseGroupsDisplay;
};
