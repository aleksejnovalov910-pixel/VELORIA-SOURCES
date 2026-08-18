import { LangString } from "../../modules/lang";
import React, {Component} from "react";
import exit from "./assets/exit.svg";
import watermark from "./assets/watermark.png";
import "./assets/style.scss"
import {CEF} from "../../modules/CEF";
import Draggable from "react-draggable";


export class IdCardBlock extends Component<{ level: number, userid: number, house?: string, id: number, serial?: string, name?: string, male?: boolean, partner?: string, onClose: (e: number) => void, age: number }, { signatureUrl: string }> {

    constructor(props: any) {
        super(props);
        this.state = {
            signatureUrl: ''
        };
        window.addEventListener("keyup", this.eventListener.bind(this))
    }
    componentDidMount() {
        this.loadSignature();
    }

    componentWillUnmount() {
        window.removeEventListener("keyup", this.eventListener.bind(this))
    }
    async loadSignature() {
        try {
            const signature = await CEF.getSignatureURL(this.props.userid, 'idcard')
            console.log("getSignature", this.props.userid, signature)
            this.setState({ signatureUrl: signature })
        } catch (error) {
            console.error("Error loading signature:", error)
        }
    }
    getImage() {
        return CEF.getPassportImageURL(`${this.props.userid}_passport`)
    }
    plural = (n: number, str1: string, str2: string, str5: string) => {
        return `${n} ${(((n % 10) == 1) && ((n % 100) != 11)) ? (str1) : (((((n % 10) >= 2) && ((n % 10) <= 4)) && (((n % 100) < 10) || ((n % 100) >= 20))) ? (str2) : (str5))}`
    }

    eventListener(e: any) {
        if(e.key === "Escape") {
            this.props.onClose(this.props.id)
        }
    }

    render() {
        return (<>
            <Draggable key={`dr_${this.props.id}`} handle=".passport_main">
                <div key={`drb_${this.props.id}`} className="passport_main">
                    <div className="passport_box">
                         {/* <div className="passport_head">
                            <img src={exit} onClick={() => this.props.onClose(this.props.id)} />
                        </div> */}
                        <div className="passport_container">
                            <div className="passport_image">
                                <div className="passport_image_block">
                                    {this.getImage() ? <img className="passport_image_img" src={this.getImage()} /> : ""}
                                </div>
                            </div>
                            <div className="passport-data">
                                <div className="passport_title"><b>buletin</b> de identitate</div>
                                <div className="passport_number">
                                    <div className="passport_number_label">
                                        Numar
                                    </div>
                                    <div className="passport_number_spacer">
                                        |
                                    </div>
                                    <div className="passport_number_value">
                                        {this.props.id}
                                    </div>
                                </div>
                                {/* <div className="passport_number">
                                        Numar  
                                        <span>
                                            {this.props.id}
                                        </span>
                                </div> */}

                                <div className="passport_info">
                                    <div className="passport-info-row" style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start"}}>
                                        <div className="passport-info-row" style={{display: "flex", justifyContent: "flex-start", alignItems: "flex-start", gap: "5px"}}>
                                            <div className="passport-info-row-label" style={{width: "fit-content"}}>
                                                NUMELE
                                            </div>
                                            <div className="passport-info-row-spacer" style={{width: "fit-content"}}>
                                                |
                                            </div>
                                            <div className="passport-info-row-value" style={{width: "fit-content"}}>
                                                {(this.props.name).split(" ")[0]}
                                            </div>
                                        </div>
                                        <div className="passport-info-row" style={{display: "flex", justifyContent: "flex-start", alignItems: "flex-start", gap: "5px"}}>
                                            <div className="passport-info-row-label" style={{width: "fit-content"}}>
                                                PRENUMELE
                                            </div>
                                            <div className="passport-info-row-spacer" style={{width: "fit-content"}}>
                                                |
                                            </div>
                                            <div className="passport-info-row-value" style={{width: "fit-content"}}>
                                                {(this.props.name).split(" ")[1]}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="passport-info-row">
                                        <div className="passport-info-row-label">
                                            GENUL
                                        </div>
                                        <div className="passport-info-row-spacer">
                                            |
                                        </div>
                                        <div className="passport-info-row-value">
                                            {this.props.male ? "MASCULIN" : "FEMININ"}
                                        </div>
                                    </div>
                                    <div className="passport-info-row">
                                        <div className="passport-info-row-label">
                                            REȘEDINȚA 
                                        </div>
                                        <div className="passport-info-row-spacer">
                                            |
                                        </div>
                                        <div className="passport-info-row-value">
                                            {this.props.house ? this.props.house : "N/A"}

                                        </div>
                                    </div>
                                    <div className="passport-info-row">
                                    <div className="passport-info-row-label">
                                            SEMNĂTURĂ 
                                        </div>
                                        <div className="passport-info-row-spacer">
                                            |
                                        </div>
                                        <div className="passport-info-row-value">
                                            {this.state.signatureUrl && <img src={this.state.signatureUrl} />}
                                        </div>
                                    </div>
                                    {/* <div className="passport-info-row"> */}
                                        {/* <div className="passport-info-row-value"> */}
                                            {/* {this.props.house ? "Casa #" + this.props.house : "N/A"} */}
                                        {/* </div> */}
                                        {/* <div className="passport_sign"> {this.getSignature().length > 0 ? <img src={this.getSignature()} /> : ""}</div> */}
                                    {/* </div> */}
                                </div>
                            </div>
                            <div className="passport_watermark">
                                <img src={watermark} alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </Draggable>
        </>);
    }
}

