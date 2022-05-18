import React from "react";
// import Etymology from "./components/entry/Etymology.js";
import {clone, getPosDef, getGramFormAbbrs, sortEntries} from './utils.js';


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

const getMorphsDisplay = (arr, isHeadword, altDisplayForHeadword, showPronunciation, currentScriptId) => {
    let morphType = isHeadword ? "hw" : "for";
    // console.log(arr)
    let newArr = arr.map((a, i) => {
        let mainWord = a.scriptForms.find(a => a.refId === currentScriptId).content;
        let morph = <span className={morphType}>{mainWord}</span>;
        let others = a.scriptForms.filter(a => a.refId !== currentScriptId);
        let otherMorphs = others.map((a, i, arr) => {
            // let divider = ((arr.length > 1) && (i < arr.length-1) ) ? " / " : "";
            return <React.Fragment key={i}> <span className="for">{a.content}</span></React.Fragment>
        });
        let pronunciations = showPronunciation ? getPronunciationsDisplay(a.pronunciations) : "";
        let notes = a.notes ? getNotesDisplay(a.notes) : "";
        let alts = a.isHeadword ? getAltDisplayForHeadword(altDisplayForHeadword) : "";
        return <React.Fragment key={i}>
                {morph}
                {otherMorphs}
                {pronunciations}
                {notes}
                {alts}
            </React.Fragment>;
    });
    return newArr;
};


export const getEntriesDisplay = (entries, setup, etymologyTags) => {
    let allDisplayItems = [];
    let key = 0;
    let currentScriptId = setup.scripts.items[0].id;
    entries.forEach(entry => {
        let altDisplayForHeadword = [];
        let morphs = clone(entry.headword.morphs);
        let filteredArr = filterOutBlanks(morphs);
        if (filteredArr.length === 0) return "";
        let mainCurrentScript = filteredArr[0].scriptForms.find(a => a.refId === currentScriptId).content;
        let mainOtherScripts = filteredArr[0].scriptForms.filter(a => a.refId !== currentScriptId);
        let mainOtherScriptsDisplay = mainOtherScripts.map((a, i, arr) => {
            // let divider = ((arr.length > 1) && (i < arr.length-1) ) ? " / " : "";
            return <React.Fragment key={i}> <span className="for">{a.content}</span></React.Fragment>
        });
        for (let i=1; i<filteredArr.length; i++) {
            let item = filteredArr[i];
            let altMainScript = item.scriptForms.find(a => a.refId === currentScriptId).content;
            let altOtherScripts = item.scriptForms.filter(a => a.refId !== currentScriptId);
            let altOtherScriptsDisplay = altOtherScripts.map((a, i, arr) => {
                return <React.Fragment key={i}> <span className="for">{a.content}</span></React.Fragment>
            });
            let obj = {
                sortTerm: item.scriptForms.find(a => a.refId === currentScriptId).content,
                display:
                    <React.Fragment key={key}>
                        <span key={key} className="for">{altMainScript}</span>{altOtherScriptsDisplay} see <span className="for">{mainCurrentScript}</span>{mainOtherScriptsDisplay}
                    </React.Fragment>
            };
            allDisplayItems.push(obj);
            let fullDisplay = getMorphsDisplay([item], null, null, null, currentScriptId);
            altDisplayForHeadword.push(fullDisplay);
            key++;
        };

        let morphsDisplay = getMorphsDisplay([filteredArr[0]], true, altDisplayForHeadword, setup.entrySettings.showPronunciation, currentScriptId);
        let senseGroupDisplay = getSenseGroups(entry.senseGroups, setup);
        let etymologyDisplay = setup.entrySettings.showEtymology ? getEtymologyDisplay(entry.etymology, etymologyTags) : "";
        let obj = {
            sortTerm: filteredArr[0].scriptForms.find(a => a.refId === currentScriptId).content,
            display: <React.Fragment key={key}>{morphsDisplay}{senseGroupDisplay}{etymologyDisplay}</React.Fragment>
        }
        allDisplayItems.push(obj);
        key++;
    })
    sortEntries(allDisplayItems, setup.scripts.items[0].letterOrder, setup.scripts.items[0].diacriticOrder);
    return allDisplayItems;
};

const getIrregularsDisplay = (irregulars, setup) => {
    let items = [];
    let currentScriptId = setup.scripts.items[0].id;
    for (let item of irregulars) {
        let abbrs = getGramFormAbbrs(item.gramFormSet, setup.gramFormGroups);
        if (item.missing) {
            items.push(<>no <span className="pos-abbr">{abbrs}</span></>);
        } else {
            let filteredArr = filterOutBlanks(item.morphs);
            if (filteredArr.length > 0) {
                let morphs = getMorphsDisplay(item.morphs, false, null, setup.entrySettings.showPronunciation, currentScriptId);
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
            let tags2 = etymologyTags.find(a => a.displayClose === arrClone[i+1]);
            if (tags2) {
                code = "";
                i++;
            } else {
                tags2 = etymologyTags.find(a => a.displayClose === arrClone[i+2]);
                if (tags2) {
                    code = tags.getCode(arrClone[i+1]);
                    i += 2;
                }
            }
        }
        arr2.push(code);

    }
    let display = arr2.reduce((prev, curr) => {
        return <>{prev}{curr}</>
    }, <></>);
    return <span className="etymology"> [{display}]</span>;
};

const getPosDisplay = (posDetails, setup) => {
    let posDef = getPosDef(posDetails.refId, setup.partsOfSpeechDefs.items);
    let posAbbr = posDef.abbr;
    let posGramClassAbbrs = posDetails.gramClassGroups?.items?.map(gramClassGroup => {
        let gramClassGroupDef = setup.gramClassGroups.items.find(a => a.id === gramClassGroup.refId);
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