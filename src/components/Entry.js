import Headword from './Headword';
import SenseGroup from './SenseGroup';
import Etymology from './Etymology';
import Preview from './Preview';
import Ipa from './Ipa';
import {useEffect, useCallback} from 'react';
import {useSetState} from 'react-use';
import {clone, generateSenseGroup, generatePos} from '../utils.js';
import {entryDefault, morphDefault, definitionDefault, phraseDefault, exampleDefault, noteDefault} from '../defaults.js';
import _  from 'lodash';


const Entry = () => {

    const [state, setState] = useSetState({
        entry: undefined
    });

    const initializeEntry = useCallback(() => {
        let newEntry = clone(entryDefault);
        newEntry.senseGroups.push(generateSenseGroup());
        newEntry.etymology = "";
        setState({entry: newEntry});
    }, [setState])

    useEffect(() => {
        initializeEntry();
    },[initializeEntry])

    const handleKeyDown = e => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    }

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




    return (
        <main id="entry">
            <div id="wordlist">
            <p>Entries</p>
            </div>
            <div id="entryForm" onKeyDown={handleKeyDown}>
            <Headword appState={state} setAppState={setState} addFunctions={addFunctions} />
            {state.entry &&
                state.entry.senseGroups.map((a,i) => (
                    <SenseGroup appState={state} setAppState={setState} key={i} thisIndex={i} addFunctions={addFunctions} />
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
            <Ipa />
        </main>
    )
}

export default Entry;