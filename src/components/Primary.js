import {useSetState} from 'react-use';
import Morph from "./Morph";
import {useState} from 'react';

const Primary = props => {

    const {appState, setAppState} = props;
    const [primaryShown, setPrimaryShown] = useState(true);

    const pronunciationDefault =  {
            pronunciation: "",
            note: ""
    };

    const morphDefault = {
            targetLang: "",
            pronunciations: [{...pronunciationDefault}]
    };

    const [state, setState] = useSetState({
        morphs: [{...morphDefault}],
        pronunciationDefault: JSON.stringify(pronunciationDefault),
        morphDefault: JSON.stringify(morphDefault)
    });

    return (
        <>
            {/* <div className="bar-primary" onClick={()=>setPrimaryShown(!primaryShown)}>Basic Form <i className={primaryShown ? "fas fa-chevron-up" : "fas fa-chevron-down"}></i></div> */}
            <div className={`row primaryForm${primaryShown ? "" : " hidden"}`}>
            {appState.entry &&
            appState.entry.primary.map((a,i) => (
                <Morph appState={appState} setAppState={setAppState} morphIndex={i} state={state} setState={setState} key={i} />
            ))
            }
        </div>
        </>
    )
};

export default Primary;