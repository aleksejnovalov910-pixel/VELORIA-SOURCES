import { LangString } from "../../modules/lang";
import React from "react";

export const IdCard = () => {
    const [maneBtn, setManeBtn] = React.useState( [{name:"test"},{name:"test"}] );
    let clilckKey = () => {
        console.log( "key");
        setManeBtn((maneBtn) => {
            maneBtn[0] = {name:"test"};
            return ( [...maneBtn ] );
        } );
    }
    return <>
        <h1>{LangString("components.NewIDCard.idcard.708ff8cf8ecfce7fd5f806e4efbfd06c")}</h1>    
        <div onClick={clilckKey}> {LangString("components.NewIDCard.idcard.c4b708caa4ed3cee135da2a659c5f64d")}</div>
    </>
}