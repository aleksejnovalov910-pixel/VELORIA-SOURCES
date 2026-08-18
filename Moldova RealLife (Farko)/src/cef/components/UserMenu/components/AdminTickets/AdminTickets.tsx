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
import {
  TicketCreatorType,
  TicketDescription,
  TicketFullData,
} from "../../../../../shared/ticket";
import { CustomEventHandler } from "../../../../../shared/custom.event";
import { systemUtil } from "../../../../../shared/system";
import { LangString } from "../../../../../client/modules/lang";

export class AdminTickets extends Component<
  {},
  {
    inputMessage?: string;
    descriptions: Array<TicketDescription>;
    openedTicket: TicketFullData;
  }
> {
  ev1: CustomEventHandler;
  ev2: CustomEventHandler;
  ev3: CustomEventHandler;
  ev4: CustomEventHandler;

  constructor(props: any) {
    super(props);

    this.state = {
      descriptions: CEF.test
        ? new Array<TicketDescription>(
            {
              adminName: "Admin Adminov",
              message: "mesage",
              createTime: 12345679,
              creatorName: "Test Testov",
              creatorId: 123,
              creatorType: TicketCreatorType.RegularPlayer,
              id: 12,
            },
            {
              message: "Message",
              createTime: 123456129,
              creatorName: "Media Media",
              creatorId: 125,
              creatorType: TicketCreatorType.Media,
              id: 13,
            },
            {
              message: "Message 2",
              createTime: 12345612,
              creatorName: "Leader Leader",
              creatorId: 126,
              creatorType: TicketCreatorType.Leader,
              id: 14,
            }
          )
        : [],
      openedTicket: CEF.test
        ? {
            description: {
              message: "Message",
              createTime: 123456129,
              creatorName: "Media Media",
              creatorId: 125,
              creatorType: TicketCreatorType.Media,
              id: 13,
            },
            answers: ["Привет", "Ответ на вопрос"],
          }
        : null,
    };

    this.ev1 = CustomEvent.register(
      "ticket:updateDescr",
      (newData: TicketDescription) => {
        this.setState({
          descriptions: this.state.descriptions.map((el) =>
            el.id === newData.id ? { ...el, adminName: newData.adminName } : el
          ),
        });
      }
    );
    this.ev2 = CustomEvent.register("ticket:close", (ticketId: number) => {
      const oldData = this.state.descriptions;
      oldData.splice(
        oldData.findIndex((d) => d.id === ticketId),
        1
      );
      this.setState({
        descriptions: oldData,
      });
    });

    this.ev3 = CustomEvent.register("ticket:selectFirstFree", () => {
      const lastTicket = this.state.descriptions.find((d) => !d.adminName);
      if (lastTicket) this.selectTicket(lastTicket.id);
    });

    this.ev4 = CustomEvent.register(
      "ticket:insert",
      (dataToInsert: Array<TicketDescription>) => {
        setTimeout(() => {
          this.setState({
            descriptions: this.state.descriptions.concat(dataToInsert),
          });
        }, 100);
      }
    );
  }

  public componentDidMount() {
    CustomEvent.triggerServer("ticket:open");
  }

  inputRef: React.RefObject<any> = React.createRef();

  sendMessage() {
    if (this.state.inputMessage === "")
      return CEF.alert.setAlert("error", "Introduce textul");
    if (this.state.openedTicket.description.adminName != CEF.user.name) {
      return CEF.alert.setAlert("error", "La tichet s-a raspuns deja");
    }
    CustomEvent.triggerServer(
      "ticket:addMessage",
      this.state.openedTicket.description.id,
      systemUtil.filterInput(this.state.inputMessage)
    );

    const answers = this.state.openedTicket.answers;
    answers.push(this.state.inputMessage);

    this.setState({
      inputMessage: "",
      openedTicket: { ...this.state.openedTicket, answers },
    });

    this.inputRef.current.value = "";
  }

  async selectTicket(ticketId: number) {
    const fullTicketData: TicketFullData = await CustomEvent.callServer(
      "ticket:select",
      ticketId
    );
    CEF.playSound("cliekc"); // sunet la selectarea unui articol
  
    this.setState({
      openedTicket: fullTicketData,
    });
  }

  closeTicket(): void {
    CustomEvent.triggerServer(
      "ticket:close",
      this.state.openedTicket.description.id
    );
    CEF.playSound("f9clickk"); // sunet la selectarea unui articol
    this.setState({
      openedTicket: null,
    });
  }

  tp(): void {
    CustomEvent.triggerServer(
      "ticket:tp",
      this.state.openedTicket.description.id
    );
  }

  tpm(): void {
    CustomEvent.triggerServer(
      "ticket:tpm",
      this.state.openedTicket.description.id
    );
  }

  freeze(): void {
    CustomEvent.triggerServer(
      "ticket:freeze",
      this.state.openedTicket.description.id
    );
  }

  heal(): void {
    CustomEvent.triggerServer(
      "ticket:heal",
      this.state.openedTicket.description.id
    );
  }

  public componentWillUnmount() {
    this.ev1?.destroy();
    this.ev2?.destroy();
    this.ev3?.destroy();
    this.ev4?.destroy();
    CustomEvent.triggerServer("ticket:closeMenu");
  }

  render() {
    return (
      <div className="umenu-aticket">
        <div className="umenu-left">
          <div className="umenu-title">
            TICKET <span>LIST</span>
          </div>
          <div className="umenu-subtitle">
            
          </div>
          <div className="umenu-reports">
            {this.state.descriptions?.map((el, index) => {
              return (
                <div
                  className={`mainadminticket__item ${
                    el.id === this.state.openedTicket?.description.id
                      ? "selected"
                      : ""
                  }`}
                  key={el.id}
                  onClick={() => this.selectTicket(el.id)}
                >
                  <div className="mainadminticket__item__title">
                    Ticket #{el.id}{" "}
                    <span>{`${el.creatorName} (${el.creatorId})`}</span>
                  </div>
                  <div className="mainadminticket__item__text">
                    {el.message}
                  </div>
                  <div className="mainadminticket__item__time">
                    <img src={svg["clock"]} alt="" />
                    <div style={{ whiteSpace: "nowrap" }}>
                      {systemUtil.timeStampString(el.createTime)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {this.state.openedTicket ? (
          <>
            {/* <div className="umenu-center">
          <div className="umenu-messages"> */}
            <div className="mainadminticket__center">
              <div className="mainadminticket__messages">
                {/* <div
                  className={
                    "adminTickets-block-center-leftMessage showMessage"
                  }
                >
                  <div className="adminTickets-block-center__name">
                    {this.state.openedTicket.description.creatorName}
                  </div>
                  <div className="adminTickets-block-center__message">
                    {this.state.openedTicket.description.message}
                  </div>
                </div> */}

                <div className="mainadminticket__ms showMessage">
                  <div className="mainadminticket__ms__title">
                    {this.state.openedTicket.description.creatorName}
                  </div>
                  <div className="mainadminticket__ms__text">
                    {this.state.openedTicket.description.message}
                  </div>
                </div>

                {this.state.openedTicket.answers?.map((message, key) => {
                  return (
                    <div
                      className="mainadminticket__ms mainadminticket__ms__admin showMessage"
                      key={key}
                    >
                      <div className="mainadminticket__ms__title">
                        {this.state.openedTicket.description.adminName ??
                          LangString(
                            "components.UserMenu.components.AdminTickets.AdminTickets.4a0ab3bd1e5ebe965899f17e5f078190"
                          )}
                      </div>
                      <div className="mainadminticket__ms__text">{message}</div>
                    </div>
                  );
                })}

                {/* <div className="umenu-msg umenu-aticket-admin showMessage">
                  <div className="umenu-title umenu-aticket-admin-title">
                    {this.state.openedTicket.description.creatorName}
                  </div>
                  <div className="umenu-text">
                    {this.state.openedTicket.description.message}
                  </div>
                </div>

                {this.state.openedTicket.answers?.map((message, key) => {
                  return (
                    <div className="umenu-msg showMessage" key={key}>
                      <div className="umenu-title">
                        {this.state.openedTicket.description.adminName ??
                          LangString(
                            "components.UserMenu.components.AdminTickets.AdminTickets.4a0ab3bd1e5ebe965899f17e5f078190"
                          )}
                      </div>
                      <div className="umenu-text">{message}</div>
                    </div>
                  );
                })} */}

                {/* <div className="umenu-msg umenu-aticket-admin">
                  <div className="umenu-title umenu-aticket-admin-title">
                    You
                  </div>
                  <div className="umenu-text">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore
                  </div>
                </div> */}
              </div>
              {/* <div className="umenu-input">
                <input type="text" placeholder="Input" />
                <div className="umenu-icon">
                  <img src={svg["send"]} alt="" />
                </div>
              </div> */}
              <div className="mainadminticket__input">
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
                  placeholder="Enter the text..."
                />
                <div
                  className="mainadminticket__input__icon"
                  onClick={() => {
                    this.sendMessage();
                  }}
                >
                  <img src={svg["send"]} alt="" />
                </div>
              </div>
            </div>
            <div className="umenu-right">
              <div className="umenu-btns">
                <button onClick={() => this.tp()}>
                  {LangString(
                    "components.UserMenu.components.AdminTickets.AdminTickets.aafbed22e530f9dd36dadd12141d2845"
                  )}
                </button>
                <button onClick={() => this.tpm()}>
                  {LangString(
                    "components.UserMenu.components.AdminTickets.AdminTickets.e2493c2aa230424d0ef53dabff5778f7"
                  )}
                </button>
                <button onClick={() => this.freeze()}>
                  {LangString(
                    "components.UserMenu.components.AdminTickets.AdminTickets.c80ebb2261913f46376b4694a2063bec"
                  )}
                </button>
                <button onClick={() => this.heal()}>
                  {LangString(
                    "components.UserMenu.components.AdminTickets.AdminTickets.2d40cf38a6348c8315128b9caee2088e"
                  )}
                </button>
                <button onClick={() => this.closeTicket()}>
                  {LangString(
                    "components.UserMenu.components.AdminTickets.AdminTickets.e7e34080f141ccf2a8816167e093a1ca"
                  )}
                </button>
              </div>
              <div className="umenu-line"></div>
              <div className="umenu-info">
                <div className="umenu-title">Informatie</div>
                <div className="umenu-content">
                  {this.state.openedTicket?.userInfo?.map((el, key) => {
                    return (
                      <div className="umenu-coitem" key={key}>
                        <div className="umenu-title">{el[0]}:</div>
                        <div className="umenu-name">{el[1]}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="mainadminticket__empty">nu sunt tickete</div>
        )}
      </div>
    );
  }
}

// import React, { Component } from 'react';
// import './style.less';
// import '../../style/style.css'
// const svg = Object.fromEntries(
//     Object.entries(import.meta.glob("../../img/*.svg", { eager: true })).map(
//         ([key, value]) => {
//             const name = key.match(/\/([^/]+)\.svg$/)[1];
//             return [name, value.default];
//         },
//     ),
// );
// import { CEF } from '../../../../modules/CEF'
// import { CustomEvent } from '../../../../modules/custom.event'
// import { TicketCreatorType, TicketDescription, TicketFullData } from '../../../../../shared/ticket'
// import { CustomEventHandler } from '../../../../../shared/custom.event'
// import { systemUtil } from '../../../../../shared/system'

// export class AdminTickets extends Component<{}, {
//     inputMessage?: string
//     descriptions: Array<TicketDescription>
//     openedTicket: TicketFullData
// }> {
//     ev1: CustomEventHandler
//     ev2: CustomEventHandler
//     ev3: CustomEventHandler
//     ev4: CustomEventHandler

//     constructor(props: any) {
//         super(props);

//         this.state = {
//             descriptions: CEF.test ? new Array<TicketDescription>({
//                 adminName: 'Admin Adminov',
//                 message: 'Adsadaksdaksada',
//                 createTime: 12345679,
//                 creatorName: 'Test Testov',
//                 creatorId: 123,
//                 creatorType: TicketCreatorType.RegularPlayer,
//                 id: 12
//             },
//                 {
//                     message: 'Message',
//                     createTime: 123456129,
//                     creatorName: 'Media Media',
//                     creatorId: 125,
//                     creatorType: TicketCreatorType.Media,
//                     id: 13
//                 },
//                 {
//                     message: 'Message 2',
//                     createTime: 12345612,
//                     creatorName: 'Leader Leader',
//                     creatorId: 126,
//                     creatorType: TicketCreatorType.Leader,
//                     id: 14
//                 },
//             ) : [],
//             openedTicket: CEF.test ? {
//                 description: {
//                     message: 'Message',
//                     createTime: 123456129,
//                     creatorName: 'Media Media',
//                     creatorId: 125,
//                     creatorType: TicketCreatorType.Media,
//                     id: 13
//                 },
//                 answers: ['Привет', 'Ответ на вопрос']
//             } : null
//         }

//         this.ev1 = CustomEvent.register('ticket:updateDescr', (newData: TicketDescription) => {
//             this.setState({
//                 descriptions: this.state.descriptions.map(el => el.id === newData.id ? { ...el, adminName: newData.adminName } : el)
//             })
//         })
//         this.ev2 = CustomEvent.register('ticket:close', (ticketId: number) => {
//             const oldData = this.state.descriptions
//             oldData.splice(oldData.findIndex(d => d.id === ticketId), 1)
//             this.setState({
//                 descriptions: oldData
//             })
//         })

//         this.ev3 = CustomEvent.register('ticket:selectFirstFree', () => {
//             const lastTicket = this.state.descriptions.find(d => !d.adminName)
//             if (lastTicket)
//                 this.selectTicket(lastTicket.id)
//         })

//         this.ev4 = CustomEvent.register('ticket:insert', (dataToInsert: Array<TicketDescription>) => {
//             setTimeout(() => {
//                 this.setState({
//                     descriptions: this.state.descriptions.concat(dataToInsert)
//                 })
//             }, 100)
//         })
//     }

//     public componentDidMount() {
//         CustomEvent.triggerServer('ticket:open')
//     }

//     inputRef: React.RefObject<any> = React.createRef()

//     sendMessage() {
//         if (this.state.inputMessage === "") return CEF.alert.setAlert(
//             "error",
//             "Введите текст"
//         )
//         if (this.state.openedTicket.description.adminName != CEF.user.name) {
//             return CEF.alert.setAlert(
//                 "error",
//                 "На тикет уже отвечают"
//             )
//         }
//         CustomEvent.triggerServer('ticket:addMessage', this.state.openedTicket.description.id, systemUtil.filterInput(this.state.inputMessage))

//         const answers = this.state.openedTicket.answers
//         answers.push(this.state.inputMessage)

//         this.setState({
//             inputMessage: "",
//             openedTicket: { ...this.state.openedTicket, answers }
//         })

//         this.inputRef.current.value = ""
//     }

//     async selectTicket(ticketId: number) {
//         const fullTicketData: TicketFullData = await CustomEvent.callServer('ticket:select', ticketId)

//         this.setState({
//             openedTicket: fullTicketData
//         })
//     }

//     closeTicket(): void {
//         CustomEvent.triggerServer('ticket:close', this.state.openedTicket.description.id)
//         this.setState({
//             openedTicket: null
//         })
//     }

//     tp(): void {
//         CustomEvent.triggerServer('ticket:tp', this.state.openedTicket.description.id)
//     }

//     tpm(): void {
//         CustomEvent.triggerServer('ticket:tpm', this.state.openedTicket.description.id)
//     }

//     freeze(): void {
//         CustomEvent.triggerServer('ticket:freeze', this.state.openedTicket.description.id)
//     }

//     heal(): void {
//         CustomEvent.triggerServer('ticket:heal', this.state.openedTicket.description.id)
//     }

//     public componentWillUnmount() {
//         this.ev1?.destroy()
//         this.ev2?.destroy()
//         this.ev3?.destroy()
//         this.ev4?.destroy()
//         CustomEvent.triggerServer('ticket:closeMenu')
//     }

//     render() {
//         return <div className="umenu-aticket">
//             <div className="umenu-left">
//                 <div className="umenu-title">REPORT <span>LIST</span></div>
//                 <div className="umenu-subtitle">Lorem ipsum dolor sit amet,
//                     consectetur adipiscing elit</div>
//                 <div className="umenu-reports">
//                     {Array(50)
//                         .fill(0)
//                         .map((_, index) => (
//                             <div className="umenu-report" key={index}>
//                                 <div className="umenu-title">
//                                     Report #{index + 1} <span>Nick_Gross [152]</span>
//                                 </div>
//                                 <div className="umenu-text">
//                                     Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
//                                 </div>
//                                 <div className="umenu-time">
//                                     <img src={svg["clock"]} alt="" />
//                                     <div className="umenu-text">22.02.25 16:59</div>
//                                 </div>
//                             </div>
//                         ))}

//                 </div>
//             </div>
//             <div className="umenu-center">
//                 <div className="umenu-messages">
//                     <div className="umenu-msg umenu-aticket-admin">
//                         <div className="umenu-title umenu-aticket-admin-title">You</div>
//                         <div className="umenu-time">23.01.2025 16:58</div>
//                         <div className="umenu-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore</div>
//                     </div>
//                     <div className="umenu-msg ">
//                         <div className="umenu-title">Admin</div>
//                         <div className="umenu-time">23.01.2025 16:58</div>
//                         <div className="umenu-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore</div>
//                     </div>
//                     <div className="umenu-msg umenu-aticket-admin">
//                         <div className="umenu-title umenu-aticket-admin-title">You</div>
//                         <div className="umenu-time">23.01.2025 16:58</div>
//                         <div className="umenu-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore</div>
//                     </div>
//                     <div className="umenu-msg umenu-aticket-admin">
//                         <div className="umenu-title umenu-aticket-admin-title">You</div>
//                         <div className="umenu-time">23.01.2025 16:58</div>
//                         <div className="umenu-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore</div>
//                     </div>
//                     <div className="umenu-msg ">
//                         <div className="umenu-title">Admin</div>
//                         <div className="umenu-time">23.01.2025 16:58</div>
//                         <div className="umenu-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore</div>
//                     </div>
//                     <div className="umenu-msg ">
//                         <div className="umenu-title">Admin</div>
//                         <div className="umenu-time">23.01.2025 16:58</div>
//                         <div className="umenu-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore</div>
//                     </div>
//                     <div className="umenu-msg ">
//                         <div className="umenu-title">Admin</div>
//                         <div className="umenu-time">23.01.2025 16:58</div>
//                         <div className="umenu-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore</div>
//                     </div>
//                     <div className="umenu-msg ">
//                         <div className="umenu-title">Admin</div>
//                         <div className="umenu-time">23.01.2025 16:58</div>
//                         <div className="umenu-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore</div>
//                     </div>

//                 </div>
//                 <div className="umenu-input">
//                     <input type="text" placeholder='Input' />
//                     <div className="umenu-icon">
//                         <img src={svg["send"]} alt="" />
//                     </div>
//                 </div>
//             </div>
//             <div className="umenu-right">
//                 <div className="umenu-btns">
//                     <button>TP</button>
//                     <button>TP</button>
//                     <button>TP</button>
//                     <button>TP</button>
//                     <button>TP</button>
//                 </div>
//                 <div className="umenu-line"></div>
//                 <div className="umenu-info">
//                     <div className="umenu-title">Information</div>
//                     <div className="umenu-content">
//                         {Array(50)
//                             .fill(0)
//                             .map((_, index) => (
//                                 <div className="umenu-coitem" key={index}>
//                                     <div className="umenu-title">Name</div>
//                                     <div className="umenu-name">Nick Gross</div>
//                                 </div>
//                             ))}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     }
// }
