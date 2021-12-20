import { clone, capitalize, getIndent } from '../../utils.js';
import _ from 'lodash';

const Limitations = props => {

    const {appState, setAppState, stringPath} = props;

    let pathFrag = stringPath;
    const path = _.get(appState, "setup." + pathFrag);
    let upPath = _.get(appState, "setup." + stringPath);

    const handleClick = (e, gramClassId) => {
        let setupCopy = clone(appState.setup);
        let setupCopyPath = _.get(setupCopy, stringPath);
        if (setupCopyPath.excluded) {
            let index = setupCopyPath.excluded.findIndex(a => a === gramClassId);
            // console.log(index);
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
        setAppState({setup: setupCopy});
    }
    
    const isSelected = gramClassId =>  {
        let isExcluded = path.excluded?.some(a => a === gramClassId);
        // console.log(isExcluded)
        // let seasd = excluded || "234";
        // console.log(seasd)
        return !isExcluded ?? true;
        // return path.gramClasses.some(a => a === gramClassName);
    };

    // const check = gramClassId =>  {
        // console.log(path);
        // console.log(gramClassId);
        // return "asdfsdf";
        // return path.gramClasses.some(a => a === gramClassName);
    // };

    let gramClassGroup = appState.setup.gramClassGroups.find(a => a.id === upPath.refId);
    // console.log(path)

    // console.log(isSelected('10'));

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
                            // className={ check(a.id)} 
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