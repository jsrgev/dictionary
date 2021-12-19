import { clone, capitalize, getIndent } from '../../utils.js';
import _ from 'lodash';

const GramFormLimitations = props => {

    const {appState, setAppState, stringPath, thisIndex} = props;

    // // let pathFrag = stringPath;
    // // const path = _.get(appState, "setup." + pathFrag);
    // const path = _.get(appState + stringPath);
    // // let upPath = _.get(appState, "setup." + stringPath);

    let pathFrag = stringPath + ".excludedGramClassGroups";
    const path = _.get(appState, "setup." + pathFrag);


    const handleClick = (e, gramFormName) => {
        let setupCopy = clone(appState.setup);
        let setupCopyPath = _.get(setupCopy, stringPath);
        let index = setupCopyPath.gramForms.findIndex(a => a === gramFormName);
        if (index < 0) {
            setupCopyPath.gramForms.push(gramFormName);
        } else {
            setupCopyPath.gramForms.splice(index, 1);
        }
        setAppState({setup: setupCopy});
    }
    
    const isSelected = gramFormId =>  {
        console.log(gramFormId);
        console.log(path);
        // console.log(path.refId === gramFormId);
        return path[thisIndex].refId === gramFormId;
        return false;
    };

    // let gramFormGroup = appState.setup.gramFormGroups.find(a => a.name === upPath.name);

    return(
        <>
            <div className="row">
                <div className="row-controls"></div>
                <div className="row-content" style={getIndent(1)}>
                    <label>Only allow</label>
                    <ul>
                        {appState.setup.gramClassGroups.map((a, i) => (
                            <li key={i} value={a.name} className={ isSelected(a.id) ? "selected" : "" } onClick={e => handleClick(e, a.name)}>{capitalize(a.name)}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    )
};

export default GramFormLimitations;