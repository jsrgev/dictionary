import Headword from './Headword';
import SenseGroup from './SenseGroup';
import Etymology from './Etymology';
import Preview from './Preview';
import IpaPalette from '../IpaPalette';
import {clone, generatePos} from '../../utils.js';
import {morphDefault, definitionDefault, phraseDefault, exampleDefault, noteDefault} from '../../defaults.js';
import _  from 'lodash';


const Entry = props => {


    const {state, setState} = props;

    const handleKeyDown = e => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    };

    const addFunctions = {
        addMorph: (index, pathFrag) => {
            let entryCopy = clone(state.entry);
            let entryCopyPath = _.get(entryCopy, pathFrag);
            entryCopyPath.splice(index+1, 0, clone(morphDefault));
            setState({entry: entryCopy});
        },
        addDefinition: (index, pathFrag) => {
            let entryCopy = clone(state.entry);
            let entryCopyPath = _.get(entryCopy, pathFrag)
            if (entryCopyPath.definitions) {
                entryCopyPath.definitions.splice(index+1, 0, clone(definitionDefault));
            } else {
                entryCopyPath.definitions = [clone(definitionDefault)];
            }
            setState({entry: entryCopy});
        },
        addPhrase: (index, pathFrag) => {
            let entryCopy = clone(state.entry);
            let entryCopyPath = _.get(entryCopy, pathFrag)
            if (entryCopyPath.phrases) {
                entryCopyPath.phrases.splice(index+1, 0, clone(phraseDefault));
            } else {
                entryCopyPath.phrases = [clone(phraseDefault)];
            }
            setState({entry: entryCopy});
        },
        addExample: (index, pathFrag) => {
            let entryCopy = clone(state.entry);
            let entryCopyPath = _.get(entryCopy, pathFrag)
            if (entryCopyPath.examples) {
                entryCopyPath.examples.splice(index+1, 0, clone(exampleDefault));
            } else {
                entryCopyPath.examples = [clone(exampleDefault)];
            }
            setState({entry: entryCopy});
        },
        addNote: (index, pathFrag) => {
            let entryCopy = clone(state.entry);
            let entryCopyPath = _.get(entryCopy, pathFrag)
            if (entryCopyPath.notes) {
                entryCopyPath.notes.splice(index+1, 0, clone(noteDefault));
            } else {
                entryCopyPath.notes = [clone(noteDefault)];
            }
            setState({entry: entryCopy});
        },
        addPos: (index, pathFrag, availablePoses) => {
            let entryCopy = clone(state.entry);
            let entryCopyPath = _.get(entryCopy, pathFrag)
            entryCopyPath.splice(index+1, 0, generatePos(availablePoses[0].name));
            setState({entry: entryCopy});
        },
    };

    const moveItem = (e, index, pathFrag, up) => {
        if (e.target.classList.contains("disabled")) return;
        let position = up ? index-1 : index+1;
        let entryCopy = clone(state.entry);
        let entryCopyPath = _.get(entryCopy, pathFrag)
        let thisItemCopy = clone(entryCopyPath[index]);
        entryCopyPath.splice(index, 1);
        entryCopyPath.splice(position, 0, thisItemCopy);
        setState({entry: entryCopy});
    };


    return (
        <main id="entry">
            <div id="wordlist">
            <p>Entries</p>
            </div>
            <div id="entryForm" onKeyDown={handleKeyDown}>
            <Headword appState={state} setAppState={setState} addFunctions={addFunctions} moveItem={moveItem} />
            {state.entry &&
                state.entry.senseGroups.map((a,i) => (
                    <SenseGroup appState={state} setAppState={setState} key={i} thisIndex={i} addFunctions={addFunctions} moveItem={moveItem} />
                ))
            }
            <Etymology />
            <div id="submit">
                <button id="submitInput" type="submit">Revert to previous saved</button>
                <button id="submitInput" type="submit">Save entry</button>
            </div>
            </div>
            <div id="preview">
            {state.entry &&
                <Preview appState={state} setAppState={setState} />
            }
            </div>
            { state.setup.showIpaPalette &&
                <IpaPalette appState={state} />
            }
        </main>
    )
};

export default Entry;