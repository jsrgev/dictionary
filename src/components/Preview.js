import React from "react";
import {allPartsOfSpeech} from "../languageSettings";
// import {morphDefault} from '../defaults.js';
import {getPosDef} from '../utils.js';
// import {useState} from 'react';

const Preview = (props) => {

    let lineSplit = false;

    const {appState} = props;
    // const [previewShown, setPreviewShown] = useState(true);

    const noteDisplay = note => {
        let display = "";
        if (note.trim() !== "") {
            display = ` (${note.trim()})`;
        }
        return display;
    };

    const alphaSortSet = set => {
        return set.sort((a,b) => {
            return ( a.content < b.content ) ? -1 : ( a.content > b.content ) ? 1 : 0;
          }
        );
    };

    const filterOutBlanks = set => {
        // console.log(set);
        return set.filter(a => a.content.trim() !== "");
    }

    let mainEntry = {};

    const fillOutSet = array => {
        let set = [];
        array.forEach((morph,i) => {
            let filteredPronunciations = filterOutBlanks(morph.pronunciations);
            let pronunciationArray = filteredPronunciations.map(a => {
                let note = a.note ? noteDisplay(a.note) : "";
                return `/${a.content.trim()}/` + note;
            })  
            let head = i===0 ? true : false;
            let targetLang = morph.content;
            let pronunciationsDisplay = pronunciationArray.join(" or ");
            set.push({targetLang, pronunciationsDisplay, head});
        })
        return set;
    };

    const getAlts = set => {
        let altString = "";
        let altLines = "";
        if (set.length > 1) {
            for (let i=1; i<set.length; i++) {
                let string = <>{altString} or <span className="for">{set[i].targetLang.trim()}</span> {set[i].pronunciationsDisplay}</>;
                altString = string;
                set[i].line = <>{altLines}<span className="for">{set[i].targetLang.trim()}</span> {set[i].pronunciationsDisplay} see <span className="for">{set[0].targetLang.trim()}</span></>;
            }
        }
        return altString;
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
        let newArr = filteredArr.map(a => {
            let pronunciation = `/${a.content}/`;
            let notes = a.notes ? getNotesDisplay(a.notes) : "";
            return pronunciation + notes;
        });
        let string = newArr.join(" or ");
        return ` ${string}`;
    };

    const getMorphsDisplay = (arr, type) => {
        let morphClass = type === "headword" ? "hw" : "for";
        let filteredArr = filterOutBlanks(arr);
        if (filteredArr.length === 0) return "";
            // console.log(filteredArr);
        // return "";
        // let newArr = "";
        // filteredArr.forEach(a => {
        //     let morph = <span className={morphClass}>{a.content}</span>;
        //     let pronunciations = getPronunciationsDisplay(a.pronunciations);
        //     let notes = a.notes ? getNotesDisplay(a.notes) : "";
        //     newArr += <>{morph}{pronunciations}{notes}</>;
        // });
        let newArr = filteredArr.map((a, i) => {
            let divider = i<filteredArr.length-1 ? <> or </> : "";
            let morph = <span className={morphClass}>{a.content}</span>;
            let pronunciations = getPronunciationsDisplay(a.pronunciations);
            let notes = a.notes ? getNotesDisplay(a.notes) : "";
            return <React.Fragment key={i}>{morph}{pronunciations}{notes}{divider}</React.Fragment>;
        });
        return newArr;

    }


    const getHeadword = () => {
        let primary = getMorphsDisplay(appState.entry.headword.morphs);
        return primary;
        // let filteredMorphs = filterOutBlanks(appState.entry.headword.morphs);
        // if (filteredMorphs.length === 0) {
            // return "";
            // filteredMorphs = [clone(morphDefault)];
        // }
        // let set = fillOutSet(filteredMorphs);
        // let altString = getAlts(set);
        // set[0].line = <><span className="hw">{set[0].targetLang.trim()}</span> {set[0].pronunciationsDisplay}{altString}</>;
        // let alphaSet = alphaSortSet(set);
        // let finalString = "";
        // alphaSet.forEach(a => {
        //     finalString = <>{finalString}<p>{a.line}</p></>
        // })
        // return finalString;
    };


    const getTypeAbbr = (posDef, type) => {
        let typeDef = posDef.types.find(a => a.name === type);
        return typeDef.unmarked ? "" : typeDef.abbr;
    };
    
    const getPosDisplay = (posDetails) => {
        let posDef = getPosDef(posDetails.name);
        let posAbbr = posDef.abbr;
        let posTypeAbbrs = posDetails.types.map(type => getTypeAbbr(posDef, type));
        let typesString = posTypeAbbrs.join(", ");
        if (typesString.length>0) {
            typesString = '-' + typesString;
        }
        let string = `${posAbbr}${typesString}.`;
        return string;
    }

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
            // let examplesDisplay = a.examples ? getExamples(a.examples) : "";
            let phrase =
                <React.Fragment key={i}>
                    <span className="hw">{a.content}</span>
                    {definitionsDisplay}
                    {notes}
                    {/* {examplesDisplay} */}
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

    // let abc = appState.entry.senseGroups[0].definitions[0]?.examples;
    // console.log(abc);

    // console.log(getExamples(abc));


    const getSenseGroupDisplay = (senseGroup) => {
        let poses = senseGroup.partsOfSpeech.map((a, i, arr) => {
            let divider = i < arr.length-1 ? <> / </> : "";
            let posDisplay = getPosDisplay(a);
            return <React.Fragment key={i}><em>{posDisplay}</em>{divider}</React.Fragment>;
        });
        let {definitions, phrases} = senseGroup;
        let filteredDefinitions = definitions ? filterOutBlanks(definitions) : "";
        let filteredPhrases = phrases ? filterOutBlanks(phrases) : "";

        let definitionsDisplay = filteredDefinitions ? getDefinitions(filteredDefinitions): "";
        let phrasesDisplay = filteredPhrases ? getPhrases(filteredPhrases) : "";
        let divider = (definitionsDisplay !== "" && phrasesDisplay !== "") ? "; " : "";
        return <> {poses}{definitionsDisplay}{divider}{phrasesDisplay}</>;
    };

    const getSenseGroups = () => {

        let senseGroupsDisplay = appState.entry.senseGroups.map((a,i,arr) => {
            let divider = ((arr.length > 1) && (i < arr.length-1) ) ? "; " : "";
            let display = getSenseGroupDisplay(a);
            return <React.Fragment key={i}>{display}{divider}</React.Fragment>;
        })
        return senseGroupsDisplay;

    }



    return(
        <>
            <p>Preview</p>
            {getHeadword()}
            {getSenseGroups()}
            {/* {getExamples(abc)} */}
        </>
    )
    
};

export default Preview;