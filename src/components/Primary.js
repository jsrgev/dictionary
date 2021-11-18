import {useSetState} from 'react-use';
import Morph from "./Morph";
import { clone } from '../utils';
import {useState} from 'react';
import _ from "lodash";

const Primary = props => {

    const {appState, setAppState} = props;
    const [primaryShown, setPrimaryShown] = useState(true);

    let stringPath = "primary"
    let pathFrag = stringPath + "";
    const path = _.get(appState, "entry." + pathFrag);


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
                <Morph appState={appState} setAppState={setAppState} thisIndex={i} state={state} setState={setState} key={i} stringPath="primary" prevIndentLevel={-1} labels={["Headword", "Alternate"]} />
            ))
            }
        </div>
        </>
    )
};

export default Primary;