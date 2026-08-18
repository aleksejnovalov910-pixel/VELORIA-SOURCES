import React, { Component } from "react";
import "./style.less";
import "../../style/style.css";
const svg = Object.fromEntries(
  Object.entries(import.meta.glob("../../img/*.svg", { eager: true })).map(
    ([key, value]) => {
      const name = key.match(/\/([^/]+)\.svg$/)[1];
      return [name, value.default];
    }
  )
);
import { CEF } from "../../../../modules/CEF";
import { CustomEvent } from "../../../../modules/custom.event";
import { systemUtil } from "../../../../../shared/system";

export class Tickets extends Component<
  {},
  {
    userMessages: string[];
    inputMessage?: string;
  }
> {
  inputRef: React.RefObject<any> = React.createRef();
  constructor(props: any) {
    super(props);

    this.state = {
      userMessages: [],
    };
  }

  sendMessage() {
    if (this.state.inputMessage === "")
      return CEF.alert.setAlert("error", "Introdu textul intrebarii");
    CustomEvent.triggerServer(
      "ticket:create",
      systemUtil.filterInput(this.state.inputMessage)
    );

    this.setState({ inputMessage: "" });
    this.inputRef.current.value = "";
    console.log("triggered");
  }

  render() {
    // return <div className="umenu-complaints">
    //     <div className="umenu-title">Complaints</div>
    //     <div className="umenu-subtitle">Lorem ipsum dolor sit amet</div>
    //     <div className="umenu-reports">
    //         <div className="umenu-title">Your Reports</div>
    //         <div className="umenu-item">
    //             <div className="umenu-title">Report #1 <span>Nick_Gross [152]</span></div>
    //             <div className="umenu-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit,
    //                 sed do eiusmod tempor incididunt ut labore et dolore</div>
    //             <div className="umenu-time">
    //                 <img src={svg['clock']} alt="" />
    //                 <div className="umenu-text">22.02.25 16:59</div>
    //             </div>
    //         </div>
    //     </div>
    //     <div className="umenu-chat">
    //         <div className="umenu-input">
    //             <input type="text" ref={this.inputRef}
    //                 onChange={(el) => {
    //                     this.setState({ inputMessage: el.currentTarget.value })
    //                 }}
    //                 onKeyPress={(el) => {
    //                     if (el.key !== "Enter") return
    //                     this.sendMessage()
    //                 }}
    //                 placeholder="Describe the essence of your question or complaint..." />
    //             <div className="umenu-icon" onClick={() => {
    //                 this.sendMessage()
    //             }}>
    //                 <img src={svg['send']} alt="" />
    //             </div>
    //         </div>
    //         <div className="umenu-messages">
    //             <div className="umenu-msg umenu-admin">
    //                 <div className="umenu-title umenu-admin-title">System</div>
    //                 <div className="umenu-time">23.01.2025 16:58</div>
    //                 <div className="umenu-text">The complaint/question must be as correct and detailed as possible.
    //                 </div>
    //                 {this.state.userMessages.map((el, key) => {
    //                     return <div className="umenu-msg">
    //                         <div className="umenu-title">You</div>
    //                         <div className="umenu-time">23.01.2025 16:58</div>
    //                         <div className="umenu-text">{this.state.userMessages[key]}</div>
    //                     </div>
    //                 })
    //                 }
    //             </div>
    //         </div>
    //     </div>
    // </div>
    return (
      <div className="mainmenu__tickets">
        <div className="mainmenu__tickets__message showMessage">
          <div className="mainmenu__tickets__message__header">
            <div className="mainmenu__tickets__message__title">System</div>
            {/* <div className="mainmenu__tickets__message__time">
              23.01.2025 16:58
            </div> */}
          </div>
          <div className="mainmenu__tickets__message__text">
            Te rugam sa oferi cat mai multe detalii despre problema sau cererea ta.
            Echipa noastra va analiza ticketul tau in cel mai scurt timp posibil.
            Comportamentul abuziv sau limbajul ofensator poate duce la respingerea ticketului
          </div>
        </div>
        <div className="mainmenu__tickets__input">
          <input
            ref={this.inputRef}
            onChange={(el) => {
              this.setState({ inputMessage: el.currentTarget.value });
            }}
            onKeyPress={(el) => {
              if (el.key !== "Enter") return;
              this.sendMessage();
            }}
            type="text"
            placeholder="Introdu textul..."
          />
          <div
            className="mainmenu__tickets__input__icon"
            onClick={() => {
              this.sendMessage();
            }}
          >
            <img src={svg["send"]} alt="" />
          </div>
        </div>
      </div>
    );
  }
}

// render() {
//     // return <div className="umenu-complaints">
//     //     <div className="umenu-title">Complaints</div>
//     //     <div className="umenu-subtitle">Lorem ipsum dolor sit amet</div>
//     //     <div className="umenu-reports">
//     //         <div className="umenu-title">Your Reports</div>
//     //         <div className="umenu-item">
//     //             <div className="umenu-title">Report #1 <span>Nick_Gross [152]</span></div>
//     //             <div className="umenu-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit,
//     //                 sed do eiusmod tempor incididunt ut labore et dolore</div>
//     //             <div className="umenu-time">
//     //                 <img src={svg['clock']} alt="" />
//     //                 <div className="umenu-text">22.02.25 16:59</div>
//     //             </div>
//     //         </div>
//     //     </div>
//     //     <div className="umenu-chat">
//     //         <div className="umenu-input">
//     //             <input type="text" ref={this.inputRef}
//     //                 onChange={(el) => {
//     //                     this.setState({ inputMessage: el.currentTarget.value })
//     //                 }}
//     //                 onKeyPress={(el) => {
//     //                     if (el.key !== "Enter") return
//     //                     this.sendMessage()
//     //                 }}
//     //                 placeholder="Describe the essence of your question or complaint..." />
//     //             <div className="umenu-icon" onClick={() => {
//     //                 this.sendMessage()
//     //             }}>
//     //                 <img src={svg['send']} alt="" />
//     //             </div>
//     //         </div>
//     //         <div className="umenu-messages">
//     //             <div className="umenu-msg umenu-admin">
//     //                 <div className="umenu-title umenu-admin-title">System</div>
//     //                 <div className="umenu-time">23.01.2025 16:58</div>
//     //                 <div className="umenu-text">The complaint/question must be as correct and detailed as possible.
//     //                 </div>
//     //                 {this.state.userMessages.map((el, key) => {
//     //                     return <div className="umenu-msg">
//     //                         <div className="umenu-title">You</div>
//     //                         <div className="umenu-time">23.01.2025 16:58</div>
//     //                         <div className="umenu-text">{this.state.userMessages[key]}</div>
//     //                     </div>
//     //                 })
//     //                 }
//     //             </div>
//     //         </div>
//     //     </div>
//     // </div>
//     return (
//       <div className="umenu-areport">
//         <div className="umenu-message">
//           <div className="umenu-title">System</div>
//           <div className="umenu-time">23.01.2025 16:58</div>
//           <div className="umenu-text">
//             The complaint/question must be as correct and detailed as possible.
//           </div>
//         </div>
//         <div className="umenu-input">
//           <input type="text" placeholder="123" />
//           <div className="umenu-icon">
//             <img src={svg["send"]} alt="" />
//           </div>
//         </div>
//       </div>
//     );
//   }
