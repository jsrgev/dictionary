import PartOfSpeech from './PartOfSpeech';
import Phrase from './Phrase';
// import Example from './Example';
import Definition from './Definition';
import AddPopup from '../AddPopup';
import {clone, generateSenseGroup, addPopupHandler} from '../../utils.js';
import {useState} from 'react';
import _ from 'lodash';

const SenseGroup = props => {
    const {appState, setAppState, thisIndex, addFunctions, moveItem} = props;
    const {addDefinition, addPhrase, addPos} = addFunctions;
    // const path = appState.entry.senseGroups;

    const stringPath = 'senseGroups';
    let pathFrag = stringPath;
    const path = _.get(appState, "entry." + pathFrag);


    const [addPopupVisible, setAddPopupVisible] = useState(false);
    const [senseGroupOpen, setSenseGroupOpen] = useState(true);

    const addSenseGroup = e => {
        let entryCopy = clone(appState.entry);
        entryCopy.senseGroups.splice(thisIndex+1, 0, generateSenseGroup(appState.setup.partsOfSpeechDefs[0].id));
        setAppState({entry: entryCopy});
    }
    
    const deleteSenseGroup = e => {
        let entryCopy = clone(appState.entry);
        if (appState.entry.senseGroups.length === 1) {
            entryCopy.senseGroups = [generateSenseGroup()];
        } else {
            entryCopy.senseGroups.splice(thisIndex, 1);
        }
        setAppState({entry: entryCopy});
    }
    
    const availablePoses = appState.setup.partsOfSpeechDefs.filter(a => {
        let alreadySelected = path[thisIndex].partsOfSpeech.some(b => b.refId === a.id);
        return !alreadySelected && a;
    })

    const popupItems = [
        ["Sense group", addSenseGroup],
        ["Definition", () => {
            let index = (path[thisIndex].definitions) ? path[thisIndex].definitions.length-1 : 0;
            addDefinition(index, pathFrag+`[${thisIndex}]`);
            }
        ],
        ["Phrase", () => {
            let index = (path[thisIndex].phrases) ? path[thisIndex].phrases.length-1 : 0;
            addPhrase(index, pathFrag+`[${thisIndex}]`);
            }
        ],
        ["Part of speech", () => addPos(path[thisIndex].partsOfSpeech.length-1, pathFrag+`[${thisIndex}].partsOfSpeech`, availablePoses)],
    ]

    const isFirst = thisIndex === 0;
    const isLast = thisIndex === path.length-1;

    // senseGroupAvailablePoses

    let stringPathA =  `senseGroups[${thisIndex}]`;

    return (
        <>
            <div className={`row${senseGroupOpen ? "" : " closed"}`}>
                <div className="row-controls">  
                    <AddPopup popupItems={popupItems} visible={addPopupVisible} />
                    <i className="fas fa-plus" onClick={() => addPopupHandler(addPopupVisible, setAddPopupVisible)}></i>
                    <i className="fas fa-minus" onClick={deleteSenseGroup}></i>
                    <i className={`fas fa-chevron-${senseGroupOpen ? "up" : "down"}`} onClick={() => setSenseGroupOpen(!senseGroupOpen)}></i>
                    <i
                    className={`fas fa-arrow-up${isFirst ? " disabled" : ""}`}
                    onClick={e => moveItem(e, thisIndex, pathFrag, true)}
                    ></i>
                    <i
                    className={`fas fa-arrow-down${isLast ? " disabled" : ""}`}
                    onClick={e => moveItem(e, thisIndex, pathFrag, false)}
                    ></i>
               </div>
                <div className="row-content">
                    Sense group{path.length>1 ? ` ${thisIndex+1}` : ""}
                </div>
                    {path[thisIndex].partsOfSpeech.map((a,i) => (
                    <PartOfSpeech appState={appState} setAppState={setAppState} thisIndex={i} key={i} prevIndentLevel={0} stringPath={stringPathA} addFunctions={addFunctions} availablePoses={availablePoses} moveItem={moveItem} />
                    ))}
                    {path[thisIndex].definitions &&
                    path[thisIndex].definitions.map((a,i) => (
                    <Definition appState={appState} setAppState={setAppState} thisIndex={i} key={i} prevIndentLevel={0} addFunctions={addFunctions} stringPath={stringPathA} moveItem={moveItem} />
                    ))}
                    {path[thisIndex].phrases &&
                    path[thisIndex].phrases.map((a,i) => (
                    <Phrase appState={appState} setAppState={setAppState} thisIndex={i} key={i} prevIndentLevel={0} addFunctions={addFunctions} stringPath={stringPathA} moveItem={moveItem} />
                    ))}
            </div>
         </>
    )
}

export default SenseGroup;