import { LangString } from "../../modules/lang";
import React, {Component} from "react";
import "./style.less";
import ControlWithMouseHint from "./Components/ControlWithMouseHint";
import Hummer from "./Components/Hummer";

export class HammerJob extends Component<{onend:(status: boolean)=>void}, {control_with: string, title: string, descr: string}> {

    constructor(pros: any) {
        super(pros);
        this.state = {
                control_with: LangString("components.Jobs.index.de68b36a2268dc2ea905725cb8e5c9c1"),
            title: LangString("components.Jobs.index.f027871756929bd603d6acb4dc2a5c76"),
            descr: LangString("components.Jobs.index.647393b7af59ad49c01e3bdb0138663c")
        }
    }

    render(){
        return (<div className="root">
            {/* <div className="particles"></div> */}
            <div className="hints">
                <div className="mouse">
                    <ControlWithMouseHint name={this.state.control_with} />
                </div>
                <div className="title">
                    <div className="name">
                        <span>{this.state.title.substr(0, this.state.title.indexOf(" "))}</span>
                        <span>{this.state.title.substr(this.state.title.indexOf(" ") + 1)}</span>
                    </div>
                    <span className="description">{this.state.descr}</span>
                </div>
            </div>

            <div className="job">
                <Hummer ready={() => {
                    this.props.onend(true)
                }} />
            </div>
        </div>)
    }

}