import {useState} from 'react';
import { clone } from '../../utils';

const Etymology = props => {

    const {state, setState} = props;

    const [etymologyOpen, setEtymologyOpen] = useState(false);

    const handleChange = value => {
        if (value !== undefined) {
            let entryCopy = clone(state.entry);
            // let entryCopyPath = _.get(entryCopy, pathFrag)
            entryCopy.etymology = value;
            setState({entry:entryCopy});
        }
    }

    return (
        <>

            <div className={`row${etymologyOpen ? "" : " closed"}`}>
                <div className="row-controls">
                </div>
                <div className="row-content">
                    <label>Etymology</label>
                    <input value={state.entry.etymology} onChange={e => handleChange(e.target.value)} type="text" />
                </div>
            </div>
        </>
    )  
};
    
export default Etymology;