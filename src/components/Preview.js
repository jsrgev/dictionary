import {orthForm} from '../defaults.js';
import {clone} from '../utils.js';
import {useState} from 'react';

const Preview = (props) => {

    const {appState} = props;
    const [previewShown, setPreviewShown] = useState(true);

    const alphaSortSet = set => {
        return set.sort((a,b) => {
            return ( a.targetLang < b.targetLang ) ? -1 : ( a.targetLang > b.targetLang ) ? 1 : 0;
          }
        );
    };

    const fillOutSet = array => {
        let set = [];
        array.forEach((morph,i) => {
            let filteredPronunciations = morph.pronunciations.filter(a => a.pronunciation.trim() !== "");
            let pronunciationArray = filteredPronunciations.map(a => {
                return `/${a.pronunciation.trim()}/` + ((a.note.trim() !== "") ? ` (${a.note.trim()})` : "");
            })
            let head = i===0 ? true : false;
            let targetLang = morph.targetLang;
            let pronunciationsDisplay = pronunciationArray.join(" or ");
            set.push({targetLang,pronunciationsDisplay, head});
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
                set[i].line = <>{altLines}<p><span className="for">{set[i].targetLang.trim()}</span> {set[i].pronunciationsDisplay} see <span className="for">{set[0].targetLang.trim()}</span></p></>;
            }
        }
        return altString;
    }

    const preview = () => {
        let filteredMorphs = appState.entry.primary.filter(a => a.targetLang.trim() !== "");
        if (filteredMorphs.length === 0) {
            filteredMorphs = [clone(orthForm)];
        }
        let set = fillOutSet(filteredMorphs);
        let altString = getAlts(set);
        set[0].line = <><p><span className="hw">{set[0].targetLang.trim()}</span> {set[0].pronunciationsDisplay}{altString}</p></>;

        let alphaSet = alphaSortSet(set);

        let finalString = "";
        alphaSet.forEach(a => {
            finalString = <>{finalString}{a.line}</>
        })
        return finalString;
    }

    return(
        <>
            {/* <div className="bar-preview" onClick={()=>setPreviewShown(!previewShown)}>Preview <i className={previewShown ? "fas fa-chevron-up" : "fas fa-chevron-down"}></i></div> */}
            <div className={`preview${previewShown ? "" : " hidden"}`}>
                {preview()}
            </div>
        </>
    )
    
};

export default Preview;