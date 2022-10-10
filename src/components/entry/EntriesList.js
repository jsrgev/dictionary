import { sortEntries, sortByHomographNums } from "../../utils";
import React from "react";
import { useState, useEffect } from "react";

const EntriesList = props => {
  const { state, setState, isDirty } = props;

  const [filterTerm, changeFilterTerm] = useState("");
  const [topArrowShown, setTopArrowShown] = useState(false);
  const [bottomArrowShown, setBottomArrowShown] = useState(false);

  useEffect(() => {
    displayArrows();
  }, []);

  const getSortedEntries = () => {
    let { id: currentScriptId, letterOrder, diacriticOrder } = state.setup.scripts.items[0];
    const entrySet = [];
    for (let entry of state.allEntries) {
      entry.headword.morphs.forEach((morph, i) => {
        let scriptForm = morph.scriptForms.find(a => a.scriptRefId === currentScriptId);
        let obj = {
          id: entry._id,
          content: scriptForm.content,
          homograph: scriptForm.homograph,
          morph: i,
        };
        entrySet.push(obj);
      });
    }
    let sortedEntries = sortEntries(entrySet, letterOrder, diacriticOrder);
    return sortByHomographNums(sortedEntries);
  };

  const displayArrows = () => {
    const ul = document.getElementById("entries-list");
    if (!ul) {
      return;
    }
    const pixels = 4;
    const isContentBelow = ul.scrollHeight - ul.scrollTop > ul.clientHeight + pixels;
    const isContentAbove = ul.scrollHeight - ul.scrollTop < ul.scrollHeight - pixels;
    if (isContentBelow) {
      setBottomArrowShown(true);
    } else {
      setBottomArrowShown(false);
    }
    if (isContentAbove) {
      setTopArrowShown(true);
    } else {
      setTopArrowShown(false);
    }
  };

  window.onresize = displayArrows;

  const getWritingDirection = () => state.setup.scripts.items[0].writingDirection;

  const handleClick = id => {
    if (id === state.entry._id) {
      return;
    }
    if (isDirty()) {
      let response;
      if (state.entry._id) {
        response = window.confirm("Are you sure you want to open this entry? Changes to the current entry will not be saved.");
      } else {
        response = window.confirm("Are you sure you want to leave? The new entry will not be saved.");
      }
      if (!response) {
        return;
      }
    }
    let thisEntry = state.allEntries.find(a => a._id === id);
    setState({ entry: thisEntry, entryCopy: thisEntry, savedHomographs: [], editHomographs: [] });
    setTimeout(() => {
      displayArrows();
    }, 10);
  };
  const isActive = id => id === state.entry._id;

  const filteredEntries = getSortedEntries().filter(a => {
    // exclude unicode combining diacritics block
    const entry = a.content
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace("‑", "-")
      .toLowerCase();
    const term = filterTerm
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
    return entry.includes(term);
  });

  // const check = e => {
  // console.log("hi");
  // const hoverItems = document.querySelectorAll( ":hover" );
  // console.log(hoverItems);
  // const clickedItem = hoverItems[hoverItems.length-1];
  // if (clickedItem === undefined || !clickedItem.closest(".palette")) {
  // return;
  // };
  // };

  // const getHomographNum = number => {
  //     let homograph = number > 0 ? number : "";
  //     // console.log(homograph)
  //     return <sup>{homograph}</sup>;
  // }

  // console.log(filteredEntries);

  const getDisplayForm = entry => {
    if (entry.content === "") return "☐";
    // console.log(React);
    // let x =  <React.Fragment></React.Fragment>;
    let homographDisplay =
      entry.homograph === 0 ? (
        ""
      ) : (
        <React.Fragment>
          <sup>{entry.homograph}</sup>
        </React.Fragment>
      );
    let preliminary = (
      <React.Fragment>
        {entry.content}
        {homographDisplay}
      </React.Fragment>
    );

    return preliminary;
  };

  return (
    <div id="entries-list-section">
      <h2>Entries</h2>
      <input
        type="text"
        value={filterTerm}
        onChange={e => changeFilterTerm(e.target.value)}
        aria-label="Filter entries"
        placeholder="Filter entries..."
      />
      <div className={`top-arrow ${topArrowShown ? "top-arrow-visible" : ""}`}></div>
      <ul id="entries-list" onScroll={displayArrows} className={`for norm ${getWritingDirection()}`}>
        {filteredEntries.map((a, i) => (
          <li key={i} className={`${isActive(a.id) ? "active" : null}${a.morph > 0 ? " altForm" : ""}`} onClick={() => handleClick(a.id)}>
            {getDisplayForm(a)}
          </li>
        ))}
      </ul>
      <div className={`bottom-arrow ${bottomArrowShown ? "bottom-arrow-visible" : ""}`}></div>
    </div>
  );
};

export default EntriesList;
