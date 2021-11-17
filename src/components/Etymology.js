import {useState} from 'react';

const Etymology = () => {

    const [etymologyShown, setEtymologyShown] = useState(false);


    return (
        <>
            {/* <div className="bar-etymology" onClick={()=>setEtymologyShown(!etymologyShown)}>Etymology <i className={etymologyShown ? "fas fa-chevron-up" : "fas fa-chevron-down"}></i></div> */}
            <fieldset className={`etymology${etymologyShown ? "" : " hidden"}`}>
                <p>Etymology</p>
                <input id="etymologyInput" type="text" />
            </fieldset>
        </>
    )
    
};
    
export default Etymology;