import { useEffect } from "react";

const AddPopup = props => {

    const {popupItems, visible, setAddPopupVisible} = props;

    // setTimeout(() => {
    //     document.addEventListener("click", ()  => {
    //         setAddPopupVisible(false);
    //     });
    
    // }, 1000
    // )

    // useEffect(() => {

       
        // setTimeout(() => {
        //     document.addEventListener("click", ()  => {
        //         // setAddPopupVisible(false);
        //         console.log('hi')
        //     });
        
        // }, 10000
        // ) 

    //     setTimeout(()=>{
    //          alert("Hello"); 
    // }, 3000);

    // }, [])

    return (
        <div autoFocus={true} className={`add-popup${visible ? "" : " hidden"}`}>
            {popupItems.map((a,i) => (
                <div key={i} onClick={a[1]}>{a[0]}</div>
            ))

            }
        </div>
    )

}

export default AddPopup;
