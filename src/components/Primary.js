// import {useSetState} from 'react-use';
import Morph from "./Morph";
import AddPopup from "./AddPopup";
import { addPopupHandler } from '../utils';
// import { morphDefault } from '../defaults';
import _ from 'lodash';
import {useState} from 'react';
// import _ from "lodash";

const Primary = props => {

    const {appState, setAppState, addFunctions} = props;
    let {addMorph} =  addFunctions;
    const [headwordOpen, setHeadwordOpen] = useState(true);
    const [addPopupVisible, setAddPopupVisible] = useState(false);

    let stringPath = "primary"
    let pathFrag = stringPath + "";
    const path = _.get(appState, "entry." + pathFrag);

    let pathFragA = pathFrag;

    const popupItems =[
        ["Alternate form", () => addMorph(path.length-1, pathFrag)]
    ]

    return (
        <>
            <div className={`row${headwordOpen ? "" : " closed"}`}>
                <div className="row-controls">
                    <AddPopup popupItems={popupItems} visible={addPopupVisible} />
                    <i className="fas fa-plus" onClick={() => addPopupHandler(addPopupVisible, setAddPopupVisible)}></i>
                    <i></i>
                    <i className={`fas fa-chevron-${headwordOpen ? "up" : "down"}`} onClick={() => setHeadwordOpen(!headwordOpen)}></i>
                </div>
                <div className="row-content">
                    Headword
                </div>
                {appState.entry &&
                appState.entry.primary.map((a,i) => (
                    <Morph appState={appState} setAppState={setAppState} thisIndex={i} key={i} stringPath={pathFragA} prevIndentLevel={0} labels={["Basic form", "Alternate"]}  addFunctions={addFunctions} />
                ))
                }
            </div>
        </>
    )
};

export default Primary;