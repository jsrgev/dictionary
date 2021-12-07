import { clone, capitalize, getIndent } from '../../utils.js';
import _ from 'lodash';

const Limitations = props => {

    const {appState, setAppState, stringPath} = props;

    let pathFrag = stringPath;
    const path = _.get(appState, "setup." + pathFrag);
    let upPath = _.get(appState, "setup." + stringPath);


    const handleClick = (e, gramClassName) => {
        let setupCopy = clone(appState.setup);
        let setupCopyPath = _.get(setupCopy, stringPath);
        let index = setupCopyPath.gramClasses.findIndex(a => a === gramClassName);
        if (index < 0) {
            setupCopyPath.gramClasses.push(gramClassName);
        } else {
            setupCopyPath.gramClasses.splice(index, 1);
        }
        setAppState({setup: setupCopy});
    }
    
    const isSelected = gramClassName =>  {
        return path.gramClasses.some(a => a === gramClassName);
    };

    let gramClassGroup = appState.setup.gramClassGroups.find(a => a.name === upPath.name);

    return(
        <>
            <div className="row">
                <div className="row-controls"></div>
                <div className="row-content" style={getIndent(1)}>
                    <label>Only allow</label>
                    <ul>
                        {gramClassGroup.gramClasses.map((a, i) => (
                            <li key={i} value={a.name} className={ isSelected(a.name) ? "selected" : "" } onClick={e => handleClick(e, a.name)}>{capitalize(a.name)}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    )
};

export default Limitations;