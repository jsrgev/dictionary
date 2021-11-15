import PartOfSpeech from './PartOfSpeech';
import Phrase from './Phrase';
import Example from './Example';
import Definition from './Definition';
import {generateSense, clone, getTypeDef, setSecondary} from '../utils.js';
import {useState} from 'react';

const Sense = props => {
    const {appState, setAppState, senseIndex} = props;
    const path = appState.entry.senses[senseIndex];

    const [senseShown, setSenseShown] = useState(true);
    const [definitionShown, setDefinitionShown] = useState(true);
    const [phrasesShown, setPhrasesShown] = useState(false);
    const [examplesShown, setExamplesShown] = useState(false);
        
    const deleteSense = e => {
        e.preventDefault();
        let entryCopy = clone(appState.entry);
        if (appState.entry.senses.length === 1) {
            entryCopy.senses = [generateSense()];
        } else {
            entryCopy.senses.splice(senseIndex, 1);
        }
        setAppState({entry: entryCopy});
    }

    const addSense = e => {
        e.preventDefault();
        let entryCopy = clone(appState.entry);
        let lastPosCopy = clone(path.partsOfSpeech.at(-1));
        let newSense = generateSense(lastPosCopy.name);
        if (lastPosCopy.type)  {
            let type = getTypeDef(lastPosCopy.name, lastPosCopy.type);
            newSense.partsOfSpeech = [setSecondary(lastPosCopy, type)];
        }
        entryCopy.senses.splice(senseIndex+1, 0, newSense);
        setAppState({entry: entryCopy});
    }
    
    const  handleClick = e => {
        let hoverItems = document.querySelectorAll( ":hover" );
        let clickedItem = hoverItems[hoverItems.length-1];
        if (clickedItem.classList.contains("fa-plus") || clickedItem.classList.contains("fa-minus")) {
            return;
        }
        setSenseShown(!senseShown);
    }

    return (
        <>
            <div className="bar-sense" onClick={handleClick}>
                <i className="fas fa-plus" onClick={addSense}></i>
                <i className="fas fa-minus" onClick={deleteSense}></i>
                <div>Sense {senseIndex+1} <i className={senseShown? "fas fa-chevron-up" : "fas fa-chevron-down"}></i></div>
            </div>
            <div className={`sense${senseShown ? "" : " hidden"}`}>
                {path.partsOfSpeech.map((a,i) => (
                    <PartOfSpeech appState={appState} setAppState={setAppState} senseIndex={senseIndex} posIndex={i} key={i} />
                    ))
                }
                <div className="bar">
                    <div className="bar-definition" onClick={()=>setDefinitionShown(!definitionShown)}>Definition <i className={definitionShown? "fas fa-chevron-up" : "fas fa-chevron-down"}></i></div>
                    <div className="bar-phrases" onClick={()=>setPhrasesShown(!phrasesShown)}>Phrases <i className={phrasesShown? "fas fa-chevron-up" : "fas fa-chevron-down"}></i></div>
                    <div className="bar-examples" onClick={()=>setExamplesShown(!examplesShown)}>Examples <i className={examplesShown? "fas fa-chevron-up" : "fas fa-chevron-down"}></i></div>
                </div>

                <Definition appState={appState} setAppState={setAppState} senseIndex={senseIndex} shown={definitionShown} />
                <fieldset className={`phrase${phrasesShown ? "" : " hidden"}`}>
                    {path.phrases.map((a,i) => (
                        <Phrase appState={appState} setAppState={setAppState} senseIndex={senseIndex} phraseIndex={i} key={i} />
                    ))}
                </fieldset>
                <fieldset className={`example${examplesShown ? "" : " hidden"}`}>
                    {path.examples.map((a,i) => (
                        <Example appState={appState} setAppState={setAppState} senseIndex={senseIndex} exampleIndex={i} key={i} shown={examplesShown} />
                    )) }
                </fieldset>
            </div>
         </>
    )
}

export default Sense;