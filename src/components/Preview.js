import {allPartsOfSpeech} from "../languageSettings";
// import {morphDefault} from '../defaults.js';
import {getPosDef} from '../utils.js';
// import {useState} from 'react';

const Preview = (props) => {

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

    const gePronunciationsDisplay = arr => {
        let filteredArr = filterOutBlanks(arr);
        let newArr = filteredArr.map(a => {
            let pronunciation = `/${a.content}/`;
            let notes = a.notes ? getNotesDisplay(a.notes) : "";
            return pronunciation + notes;
        });
        let string = newArr.join(" or ");
        return string;
    };

    let abc = appState.entry.headword.morphs[0].pronunciations;
    // console.log(abc);

    console.log(gePronunciationsDisplay(abc));

    const getHeadword = () => {
        let filteredMorphs = filterOutBlanks(appState.entry.headword.morphs);
        if (filteredMorphs.length === 0) {
            return "";
            // filteredMorphs = [clone(morphDefault)];
        }
        let set = fillOutSet(filteredMorphs);
        let altString = getAlts(set);
        set[0].line = <><span className="hw">{set[0].targetLang.trim()}</span> {set[0].pronunciationsDisplay}{altString}</>;
        console.log(set);
        let alphaSet = alphaSortSet(set);
        // console.log(alphaSet)
        let finalString = "";
        alphaSet.forEach(a => {
            finalString = <>{finalString}<p>{a.line}</p></>
        })
        // console.dir(finalString)
        return finalString;
    };

    // const getPosAbbr = (posName) => {
    //     return getPosDef(posName).abbr;
    // };

    const getTypeAbbr = (posDef, type) => {
        // console.log(posDef);
        // console.log(type)
        let typeDef = posDef.types.find(a => a.name === type);
        // console.log(typeDef);
        // return  "";
        return typeDef.unmarked ? "" : typeDef.abbr;
    };
    
    const getPosDisplay = (posDetails) => {
        let posDef = getPosDef(posDetails.name);
        let posAbbr = posDef.abbr;
        // console.log(posDetails.types)
        // let posTypes = posDetails.types.map(a => a.name);
        // console.log(posTypes);
        let posTypeAbbrs = posDetails.types.map(type => getTypeAbbr(posDef, type));
        let typesString = posTypeAbbrs.join(", ");
        if (typesString.length>0) {
            typesString = '-' + typesString;
        }
        let string = `${posAbbr}${typesString}.`;
        return string;
    }

    const getDefinitions = definitionsArray => {

        return "";
    }

    const getSenseGroupDisplay = (senseGroup) => {
        let poses = senseGroup.partsOfSpeech.map(a => {
            let posDisplay = getPosDisplay(a);
            return posDisplay;
        });
        // let jointPosDisplay = poses.join(" / ");
        let obj = {
            jointPosDisplay: poses.join(" / "),
        };
        // if (senseGroup.definitions) {
        //     obj.definitions = getDefinitions(senseGroup.definitions);
        // }
        // if (senseGroup.phrases) {
        //     obj.phrases = getPhrases(senseGroup.phrases);
        // }

        console.log(obj);
        return obj;

    };

    const getSenseGroups = () => {
        let senseGroupsArray = appState.entry.senseGroups.map(a => getSenseGroupDisplay(a));
        // console.log(senseGroupsArray);
        // appState.entry.senseGroups.forEach(a => {
        //     let definitions
        // })
        return "";
    }


    // const getPreview = () => {
    //     let display = {getHeadword() + getSenseGroups();
    //     return display;
    // };
    
    return(
        <>
            <p>Preview</p>
            {getHeadword()}
            {/* {getSenseGroups()} */}
        </>
    )
    
};

export default Preview;