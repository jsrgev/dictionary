import PartOfSpeech from './PartOfSpeech';
import Phrase from './Phrase';
import Example from './Example';
import Definition from './Definition';
import {generateSense, clone, getTypeDef, setSecondary, generateSenseGroup} from '../utils.js';
import {useState} from 'react';

const SenseGroup = props => {
    const {appState, setAppState, senseGroupIndex} = props;
    const path = appState.entry.senseGroups;

    const [senseGroupShown, setSenseGroupShown] = useState(true);
    const [definitionShown, setDefinitionShown] = useState(true);
    const [phrasesShown, setPhrasesShown] = useState(true);
    const [examplesShown, setExamplesShown] = useState(true);
        
    const addSenseGroup = e => {
        e.preventDefault();
        let entryCopy = clone(appState.entry);
        // let lastPosCopy = clone(path[senseGroupIndex].partsOfSpeech.at(-1));
        // let newSense = generateSense(lastPosCopy.name);
        // if (lastPosCopy.type)  {
            // let type = getTypeDef(lastPosCopy.name, lastPosCopy.type);
            // newSense.partsOfSpeech = [setSecondary(lastPosCopy, type)];
        // }
        entryCopy.senseGroups.splice(senseGroupIndex+1, 0, generateSenseGroup());
        setAppState({entry: entryCopy});
    }
    
    const deleteSenseGroup = e => {
        e.preventDefault();
        let entryCopy = clone(appState.entry);
        if (appState.entry.senseGroups.length === 1) {
            entryCopy.senseGroups = [generateSenseGroup()];
        } else {
            entryCopy.senseGroups.splice(senseGroupIndex, 1);
        }
        setAppState({entry: entryCopy});
    }

    const  handleClick = e => {
        let hoverItems = document.querySelectorAll( ":hover" );
        let clickedItem = hoverItems[hoverItems.length-1];
        if (clickedItem.classList.contains("fa-plus") || clickedItem.classList.contains("fa-minus")) {
            return;
        }
        setSenseGroupShown(!senseGroupShown);
    }

    // console.log(path[senseGroupIndex].definitions)

    return (
        <>
            {/* <div className="bar-senseGroup" onClick={handleClick}> */}
                {/* <div>Sense {senseGroupIndex+1} <i className={senseGroupShown? "fas fa-chevron-up" : "fas fa-chevron-down"}></i></div> */}
            {/* </div> */}
            <div className="row">
                <div className="row-controls">
                    <i className="fas fa-plus" onClick={addSenseGroup}></i>
                    <i className="fas fa-minus" onClick={deleteSenseGroup}></i>
                </div>
                <div className="row-content">
                    Sense group{path.length>1 ? ` ${senseGroupIndex+1}` : ""}
                </div>
                <div className="row">
                    {/* <div className={`row senseGroup${senseGroupShown ? "" : " hidden"}`}> */}
                    <div className="row">
                        {path[senseGroupIndex].partsOfSpeech.map((a,i) => (
                        <PartOfSpeech appState={appState} setAppState={setAppState} senseGroupIndex={senseGroupIndex} posIndex={i} key={i} prevIndentLevel={0} />
                        ))}
                    </div>
                    {/* <div className={`row senseGroup${senseGroupShown ? "" : " hidden"}`}> */}
                    <div className="row">
                        {path[senseGroupIndex].definitions.map((a,i) => (
                        <Definition appState={appState} setAppState={setAppState} senseGroupIndex={senseGroupIndex} definitionIndex={i} key={i} prevIndentLevel={0} shown={definitionShown} />
                        ))}
                    </div>
                </div>
            </div>
         </>
    )
}

{/* <div className="bar">
                    <div className="bar-definition" onClick={()=>setDefinitionShown(!definitionShown)}>Definition <i className={definitionShown? "fas fa-chevron-up" : "fas fa-chevron-down"}></i></div>
                    <div className="bar-phrases" onClick={()=>setPhrasesShown(!phrasesShown)}>Phrases <i className={phrasesShown? "fas fa-chevron-up" : "fas fa-chevron-down"}></i></div>
                    <div className="bar-examples" onClick={()=>setExamplesShown(!examplesShown)}>Examples <i className={examplesShown? "fas fa-chevron-up" : "fas fa-chevron-down"}></i></div>
                </div> */}

                {/* <Definition appState={appState} setAppState={setAppState} senseGroupIndex={senseGroupIndex} shown={definitionShown} />
                <div className={`phrase${phrasesShown ? "" : " hidden"}`}>
                    {path.phrases.map((a,i) => (
                        <Phrase appState={appState} setAppState={setAppState} senseGroupIndex={senseGroupIndex} phraseIndex={i} key={i} />
                    ))}
                </div>
                <div className={`example${examplesShown ? "" : " hidden"}`}>
                    {path.examples.map((a,i) => (
                        <Example appState={appState} setAppState={setAppState} senseGroupIndex={senseGroupIndex} exampleIndex={i} key={i} shown={examplesShown} />
                    )) }
                </div> */}

export default SenseGroup;