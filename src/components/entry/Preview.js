import React from "react";
import {clone, getPosDef} from '../../utils.js';
import {gramFormAbbrs} from '../../languageSettings';

const Preview = (props) => {


    const {appState} = props;
    // const [previewShown, setPreviewShown] = useState(true);

    // const noteDisplay = note => {
    //     let display = "";
    //     if (note.trim() !== "") {
    //         display = ` (${note.trim()})`;
    //     }
    //     return display;
    // };

    const alphaSortSet = set => {
        let setClone = clone(set);
        return setClone.sort((a,b) => {
            return ( a.content < b.content ) ? -1 : ( a.content > b.content ) ? 1 : 0;
          }
        );
    };

    const filterOutBlanks = set => {
        return set.filter(a => a.content.trim() !== "");
    }

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

    const getAltDisplayForHeadword = () => {
        return altDisplayForHeadword.map((a,i) => {
            return <React.Fragment key={i}> or {a}</React.Fragment>
        })
    };

    const getMorphsDisplay = (arr, headword) => {
        let morphType = headword ? "hw" : "for";
            let newArr = arr.map((a, i) => {
            let morph = <span className={morphType}>{a.content}</span>;
            let pronunciations = getPronunciationsDisplay(a.pronunciations);
            let notes = a.notes ? getNotesDisplay(a.notes) : "";
            let alts = a.headword ? getAltDisplayForHeadword() : "";
            return <React.Fragment key={i}>
                    {morph}
                    {pronunciations}
                    {notes}
                    {alts}
                </React.Fragment>;
        });
        return newArr;
    };

    let allDisplay = [];
    let altDisplayForHeadword = [];
    let headwordOrder;

    const getPreview = () => {
        let morphs = [...appState.entry.headword.morphs];
        let filteredArr = filterOutBlanks(morphs);
        if (filteredArr.length === 0) return "";

        // mark first morph as headword so it will be treated so after sorting
        filteredArr[0].headword = true;

        let sortedMorphs = alphaSortSet(filteredArr);
        for (let i=0; i<sortedMorphs.length; i++) {
            sortedMorphs[i].order = i;
        }
        sortedMorphs.forEach((a,i) => {
            if (!a.headword) {
                let display = 
                    <p>
                        <span className="for">{a.content}</span> see <span className="for">{morphs[0].content}</span>
                    </p>;
                allDisplay[i] = (display);
                let fullDisplay = getMorphsDisplay([a]);
                altDisplayForHeadword.push(fullDisplay);
            }
        });

        headwordOrder = sortedMorphs.find(a => a.headword).order;

        let morphsDisplay = getMorphsDisplay([filteredArr[0]], true);
        let senseGroupDisplay = getSenseGroups();
        allDisplay[headwordOrder] = <p>{morphsDisplay}{senseGroupDisplay}</p>;
        return allDisplay;
    };


    const getGramClassAbbr = (posDef, gramClass) => {
        let gramClassDef = posDef.gramClasses.find(a => a.name === gramClass);
        return gramClassDef.unmarked ? "" : gramClassDef.abbr;
    };
    
    const getGramFormAbbr = gramFormName => {
        let arr = gramFormName.split(" ");
        let abbrs = arr.map(a => gramFormAbbrs[a] + ".");
        return abbrs.join(" ");
    };


    const getParadigmFormsDisplay = paradigmForms => {
        if (paradigmForms.length === 0) {
            return ""
        }
        let items = [];
        for (let item of paradigmForms) {
            let abbr =  getGramFormAbbr(item.gramForm);
            if (!item.exists) {
                items.push(<>no <em>{abbr}</em></>);
            } else if (!item.regular && item.morphs.length > 0)  {
                let filteredArr = filterOutBlanks(item.morphs);
                if (filteredArr.length > 0) {
                    let morphs = getMorphsDisplay(item.morphs);
                    console.log(morphs);
                    let morphsDisplay = morphs.map((a, i, arr) => {
                        let divider = ((arr.length > 1) && (i < arr.length-1) ) ? " or " : "";
                        return <React.Fragment key={i}>{a}{divider}</React.Fragment>
                    })
                    items.push(<><em>{abbr}</em> {morphsDisplay}</>);                        
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

    const getPosDisplay = (posDetails) => {
        let posDef = getPosDef(posDetails.name);
        let posAbbr = posDef.abbr;
        let posGramClassAbbrs = posDetails.gramClasses.map(gramClass => getGramClassAbbr(posDef, gramClass));
        let gramClassesString = posGramClassAbbrs.join(", ");
        if (gramClassesString.length>0) {
            gramClassesString = '-' + gramClassesString;
        }
        let string = `${posAbbr}${gramClassesString}.`;
        let paradigmFormsDisplay = getParadigmFormsDisplay(posDetails.paradigmForms);
        return <><em>{string}</em>{paradigmFormsDisplay}</>;
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

    const getSenseGroupDisplay = (senseGroup) => {
        let poses = senseGroup.partsOfSpeech.map((a, i, arr) => {
            let divider = i < arr.length-1 ? <> / </> : "";
            let posDisplay = getPosDisplay(a);
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

    const getSenseGroups = () => {

        let senseGroupsDisplay = appState.entry.senseGroups.map((a,i,arr) => {
            let divider = ((arr.length > 1) && (i < arr.length-1) ) ? "; " : "";
            let display = getSenseGroupDisplay(a);
            return <React.Fragment key={i}>{display}{divider}</React.Fragment>;
        })
        return senseGroupsDisplay;
    };

    let entryPreview = getPreview();

    return(
        <>
            <p>Preview</p>
            {entryPreview &&
            entryPreview.map((a, i) => (
                <React.Fragment key={i}>{a}</React.Fragment>
            ))}
        </>
    )
};

export default Preview;