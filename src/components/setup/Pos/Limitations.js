import { clone, capitalize, getIndent } from '../../../utils.js';
import _ from 'lodash';

const Limitations = props => {

    const {state, setState, stringPath, prevIndent} = props;

    const pathFrag = stringPath;
    const path = _.get(state, "tempSetup." + pathFrag);
    const upPath = _.get(state, "tempSetup." + stringPath);

    const handleClick = (e, gramClassId) => {
        let setupCopy = clone(state.tempSetup);
        let setupCopyPath = _.get(setupCopy, stringPath);
        // console.log(setupCopyPath);
        if (setupCopyPath.excluded) {
            let index = setupCopyPath.excluded.findIndex(a => a === gramClassId);
            let max = gramClassGroup.gramClasses.length;
            if (setupCopyPath.excluded.length === max-1) {
                console.log(index)
                // return;
            }
            // if it's not already found in excluded, add it
            if (index < 0) {
                // at least one class has to be allowed. if the number of exclusions is one short of total class number, ignore the click
                if (setupCopyPath.excluded.length === max-1) {
                    return;
                }
                setupCopyPath.excluded.push(gramClassId);
            // if excluded is going to be empty, delete it
            } else if (setupCopyPath.excluded.length === 1) {
                delete setupCopyPath.excluded;
            } else {
                setupCopyPath.excluded.splice(index, 1);
            }
        } else {
            setupCopyPath.excluded = [gramClassId];
        }
        setState({tempSetup: setupCopy});
    };
    
    const isSelected = gramClassId =>  {
        let isExcluded = path.excluded?.some(a => a === gramClassId);
        return !isExcluded ?? true;
    };

    const gramClassGroup = state.tempSetup.gramClassGroups.items.find(a => a.id === upPath.refId);

    return(
        <>
            <div className="row">
                <div className="row-controls"></div>
                <div className="row-content" style={getIndent(prevIndent)}>
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
    );
};

export default Limitations;