import { clone, capitalize, getIndent } from '../../utils.js';
import _ from 'lodash';

const Limitations = props => {

    const {appState, setAppState, stringPath} = props;

    let pathFrag = stringPath;
    const path = _.get(appState, "tempSetup." + pathFrag);
    let upPath = _.get(appState, "tempSetup." + stringPath);

    const handleClick = (e, gramClassId) => {
        let setupCopy = clone(appState.tempSetup);
        let setupCopyPath = _.get(setupCopy, stringPath);
        if (setupCopyPath.excluded) {
            let index = setupCopyPath.excluded.findIndex(a => a === gramClassId);
            if (index < 0) {
                setupCopyPath.excluded.push(gramClassId);
            } else if (setupCopyPath.excluded.length === 1) {
                delete setupCopyPath.excluded;
            } else {
                setupCopyPath.excluded.splice(index, 1);
            }
        } else {
            setupCopyPath.excluded = [gramClassId];
        }
        setAppState({tempSetup: setupCopy});
    }
    
    const isSelected = gramClassId =>  {
        let isExcluded = path.excluded?.some(a => a === gramClassId);
        return !isExcluded ?? true;
    };

    let gramClassGroup = appState.tempSetup.gramClassGroups.find(a => a.id === upPath.refId);

    return(
        <>
            <div className="row">
                <div className="row-controls"></div>
                <div className="row-content" style={getIndent(1)}>
                    <label>Only allow</label>
                    <ul>
                        {gramClassGroup.gramClasses.map((a, i) => (
                            <li key={i} value={a.id} 
                            className={ isSelected(a.id) ? "selected" : "" } 
                            onClick={e => handleClick(e, a.id)}
                            >
                            {capitalize(a.name)}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    )
};

export default Limitations;