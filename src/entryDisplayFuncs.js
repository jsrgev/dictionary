import React from "react";
import {clone, getPosDef, getGramFormAbbrs} from './utils.js';


export const sortEntries = entries => {
    const collator = new Intl.Collator();          
    return entries.sort((a, b) => {

        return collator.compare(a.sortTerm, b.sortTerm);

        // return ( a.sortTerm < b.sortTerm ) ? -1 : ( a.sortTerm > b.sortTerm ) ? 1 : 0;
      }
    );
};

const filterOutBlanks = set => {
    return set.filter(a => a.content.trim() !== "");
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
        let divider = ((arr.length > 1) && (i < arr.length-1) ) ? " or " : "";
        let pronunciation = <span className="phonetic">/{a.content}/</span>;
        let notes = a.notes ? getNotesDisplay(a.notes) : "";
        return <React.Fragment key={i}>{pronunciation}{notes}{divider}</React.Fragment>;
    });
    return <> {newArr}</>;
};

const getAltDisplayForHeadword = (altDisplayForHeadword) => {
    return altDisplayForHeadword.map((a,i) => {
        return <React.Fragment key={i}> or {a}</React.Fragment>
    })
};

const getMorphsDisplay = (arr, isHeadword, altDisplayForHeadword) => {
    let morphType = isHeadword ? "hw" : "for";
        let newArr = arr.map((a, i) => {
        let morph = <span className={morphType}>{a.content}</span>;
        let pronunciations = getPronunciationsDisplay(a.pronunciations);
        let notes = a.notes ? getNotesDisplay(a.notes) : "";
        let alts = a.isHeadword ? getAltDisplayForHeadword(altDisplayForHeadword) : "";
        return <React.Fragment key={i}>
                {morph}
                {pronunciations}
                {notes}
                {alts}
            </React.Fragment>;
    });
    return newArr;
};


export const getEntriesDisplay = (entries, setup) => {
    let allDisplayItems = [];
    let key = 0;
    entries.forEach(entry => {
        let altDisplayForHeadword = [];
        let morphs = clone(entry.headword.morphs);
        let filteredArr = filterOutBlanks(morphs);
        if (filteredArr.length === 0) return "";
        for (let i=1; i<filteredArr.length; i++) {
            let item = filteredArr[i];
            let obj = {
                sortTerm: item.content,
                display:
                    <p key={key}>
                        <span className="for">{item.content}</span> see <span className="for">{filteredArr[0].content}</span>
                    </p>
            };
            allDisplayItems.push(obj);
            let fullDisplay = getMorphsDisplay([item]);
            altDisplayForHeadword.push(fullDisplay);
            key++;
        };

        let morphsDisplay = getMorphsDisplay([filteredArr[0]], true, altDisplayForHeadword);
        let senseGroupDisplay = getSenseGroups(entry.senseGroups, setup);
        let obj = {
            sortTerm: filteredArr[0].content,
            display: <p key={key}>{morphsDisplay}{senseGroupDisplay}</p>
        }
        allDisplayItems.push(obj);
        key++;
    })
    sortEntries(allDisplayItems);
    return allDisplayItems;

    // let finalEntries = splitEnries(allDisplayItems);
    let finalEntries = allDisplayItems.map(a => a.display);
};

const getIrregularsDisplay = (irregulars, setup) => {
    let items = [];
    for (let item of irregulars) {
        let abbrs = getGramFormAbbrs(item.gramFormSet, setup.gramFormGroups);
        if (item.missing) {
            items.push(<>no <span className="pos-abbr">{abbrs}</span></>);
        } else {
            let filteredArr = filterOutBlanks(item.morphs);
            if (filteredArr.length > 0) {
                let morphs = getMorphsDisplay(item.morphs);
                let morphsDisplay = morphs.map((a, i, arr) => {
                    let divider = ((arr.length > 1) && (i < arr.length-1) ) ? " or " : "";
                    return <React.Fragment key={i}>{a}{divider}</React.Fragment>
                })
                items.push(<><span className="pos-abbr">{abbrs}</span> {morphsDisplay}</>);                        
            }
        }
    }
    if (items.length === 0) return "";
    let display = items.map((a, i, arr) => {
        let divider = ((arr.length > 1) && (i < arr.length-1) ) ? "; " : "";
        return <React.Fragment key={i}>{a}{divider}</React.Fragment>
    })
    return <> ({display})</>
};

const getPosDisplay = (posDetails, setup) => {
    let posDef = getPosDef(posDetails.refId, setup.partsOfSpeechDefs);
    let posAbbr = posDef.abbr;
    let posGramClassAbbrs = posDetails.gramClassGroups?.map(gramClassGroup => {
        let gramClassGroupDef = setup.gramClassGroups.find(a => a.id === gramClassGroup.refId);
        let arr = gramClassGroup.gramClasses.map(c => {
            return gramClassGroupDef.gramClasses.find(b => b.id === c).abbr;
        })
        return arr.join(", ");
    });
    let filteredPosGramClassAbbrs = posGramClassAbbrs?.filter(a => a !== "") ?? [];
    let posGramClassAbbrsString = filteredPosGramClassAbbrs.join(", ");
    let divider = (posGramClassAbbrsString === "") ? "" : "-";
    let gramClassesString = posGramClassAbbrs ? `${divider}${posGramClassAbbrsString}` : "";
    let posString = posAbbr + gramClassesString + ".";
    let irregularsDisplay = posDetails.irregulars ? getIrregularsDisplay(posDetails.irregulars, setup) : "";
    return <><span className="pos-abbr">{posString}</span>{irregularsDisplay}</>;
};

const getDefinitions = (arr, example) => {
    let filteredArr = filterOutBlanks(arr);
    if (filteredArr.length === 0) return "";
    let newArr = filteredArr.map((a, i, arr) => {
        let divider = ((arr.length > 1) && (i < arr.length-1) ) ?
            (example ? " / " : "; ") : "";
        let num = (arr.length === 1 || example) ? "" : `${i+1}. `;
        let notes = a.notes ? getNotesDisplay(a.notes) : "";
        let examplesDisplay = a.examples ? getExamples(a.examples) : "";
        let wrapper = example ? ["‘","’"] : ["",""];
        let def =
            <React.Fragment key={i}>
                {num}
                {wrapper[0]}{a.content}{wrapper[1]}
                {notes}
                {examplesDisplay}
                {divider}
            </React.Fragment>;
        return def;
    });
    return <> {newArr}</>;
};

const getPhrases = arr => {
    let filteredArr = filterOutBlanks(arr);
    if (filteredArr.length === 0) return "";
    let newArr = filteredArr.map((a, i, arr) => {
        let divider = ((arr.length > 1) && (i < arr.length-1) ) ? "; " : "";
        let notes = a.notes ? getNotesDisplay(a.notes) : "";
        let definitionsDisplay = getDefinitions(a.definitions);
        let phrase =
            <React.Fragment key={i}>
                <span className="hw">{a.content}</span>
                {definitionsDisplay}
                {notes}
                {divider}
            </React.Fragment>;
        return phrase;
    });
    return <> {newArr}</>;
};

const getExamples = arr => {
    let filteredArr = filterOutBlanks(arr);
    if (filteredArr.length === 0) return "";
    let newArr = filteredArr.map((a, i, arr) => {
        let divider = ((arr.length > 1) && (i < arr.length-1) ) ? "; " : "";
        let notes = a.notes ? getNotesDisplay(a.notes) : "";
        let definitionsDisplay = getDefinitions(a.definitions, true);
        let phrase =
            <React.Fragment key={i}>
                <span className="for">{a.content}</span>
                {definitionsDisplay}
                {notes}
                {divider}
            </React.Fragment>;
        return phrase;
    });
    return <>: {newArr}</>;
};

const getSenseGroupDisplay = (senseGroup, setup) => {
    let poses = senseGroup.partsOfSpeech.map((a, i, arr) => {
        let divider = i < arr.length-1 ? <> / </> : "";
        let posDisplay = getPosDisplay(a, setup);
        return <React.Fragment key={i}>{posDisplay}{divider}</React.Fragment>;
    });
    let {definitions, phrases} = senseGroup;
    let filteredDefinitions = definitions ? filterOutBlanks(definitions) : "";
    let filteredPhrases = phrases ? filterOutBlanks(phrases) : "";

    let definitionsDisplay = filteredDefinitions ? getDefinitions(filteredDefinitions): "";
    let phrasesDisplay = filteredPhrases ? getPhrases(filteredPhrases) : "";
    let divider = (definitionsDisplay !== "" && phrasesDisplay !== "") ? "; " : "";
    return <> {poses}{definitionsDisplay}{divider}{phrasesDisplay}</>;
};

const getSenseGroups = (senseGroups, setup) => {
    let senseGroupsDisplay = senseGroups.map((a,i,arr) => {
        let divider = ((arr.length > 1) && (i < arr.length-1) ) ? "; " : "";
        let display = getSenseGroupDisplay(a, setup);
        return <React.Fragment key={i}>{display}{divider}</React.Fragment>;
    })
    return senseGroupsDisplay;
};