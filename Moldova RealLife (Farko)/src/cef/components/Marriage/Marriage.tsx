import { LangString } from "../../modules/lang";
import React, { Component } from "react";

import { CEF } from "../../modules/CEF";

//@ts-ignore
import SignaturePad from "react-signature-pad";

import firstBackground from "./assets/firstBackground.png";
import secondBackground from "./assets/secondBackground.png";
import exitIcon from "./assets/exitIcon.svg";
import marriageBody2 from "./assets/marriageBody2.png";
import marriageBody1 from "./assets/marriageBody1.png";
import marriageBody3 from "./assets/marriageBody3.png";
import marriageBody4 from "./assets/marriageBody4.png";

import "./Marriage.less";
import "./ExitButton.less";
import { CustomEvent } from "../../modules/custom.event";
import { system } from "../../modules/system";
import { DivorceType, Person, WEEDING_PAY } from "../../../shared/wedding";

const png = Object.fromEntries(
  Object.entries(import.meta.glob("./assets/*.png", { eager: true })).map(
    ([key, value]) => {
      const name = key.match(/\/([^/]+)\.png$/)[1];
      return [name, value.default];
    }
  )
);

const svg = Object.fromEntries(
  Object.entries(import.meta.glob("./assets/*.svg", { eager: true })).map(
    ([key, value]) => {
      const name = key.match(/\/([^/]+)\.svg$/)[1];
      return [name, value.default];
    }
  )
);

type Window =
  | "AcceptFrame"
  | "InfoFrame"
  | "SignFrame"
  | "Welcome"
  | "Divorce"
  | "Select";

export class Marriage extends Component<
  {},
  {
    show: boolean;
    component: Window;
    firstPerson: [string, string, number];
    secondPerson: [string, string, number];
    partners: Person[];
    userIsMale: boolean;
    selectedId: number;
    containerRef: React.RefObject<HTMLDivElement>;
  }
> {
  constructor(props: any) {
    super(props);

    this.state = {
      show: CEF.test,
      userIsMale: false,
      component: "Select",
      selectedId: null,
      containerRef: React.createRef<HTMLDivElement>(),
      firstPerson: [
        LangString(
          "components.Marriage.Marriage.2287ca5fb519ee69f636cbd468b19733"
        ),
        LangString(
          "components.Marriage.Marriage.0484126e816b17172070adc845e2786b"
        ),
        0,
      ],
      secondPerson: [
        LangString(
          "components.Marriage.Marriage.0fabc21b84a45ff5f1eeb598934c4798"
        ),
        LangString(
          "components.Marriage.Marriage.81954abb24a3ede81c249d02aea3ed3f"
        ),
        0,
      ],
      partners: [
        {
          name: LangString(
            "components.Marriage.Marriage.bb6d43be97fad34e369c351ac241346b"
          ),
          staticID: 228,
        },

        {
          name: LangString(
            "components.Marriage.Marriage.55f2d5cde6fb5c8753aa501bf477d54d"
          ),
          staticID: 1337,
        },

        {
          name: LangString(
            "components.Marriage.Marriage.0c5add9f90da6a13c189246255b5bbfd"
          ),
          staticID: 7777,
        },
      ],
    };

    CustomEvent.register(
      "marriage:set",
      (
        window?: Window,
        partners?: Person[],
        firstPerson?: [string, string, number],
        secondPerson?: [string, string, number]
      ) => {
        if (window) {
          this.changeWindow(window);
        }

        if (partners) {
          this.setState({
            partners,
          });
        }

        if (firstPerson) {
          this.setState({
            firstPerson,
          });
        }

        if (secondPerson) {
          this.setState({
            secondPerson,
          });
        }
      }
    );
  }

  close() {
    CustomEvent.triggerServer("marriage::closeMenu");
  }

  acceptMarriageOffer() {
    CustomEvent.triggerServer("marriage::accept");
  }

  declineMarriageOffer() {
    CustomEvent.triggerServer("marriage::decline");
  }

  async dataUrlToFile(dataUrl: string, fileName: string): Promise<File> {
    const res: Response = await fetch(dataUrl);
    const blob: Blob = await res.blob();
    return new File([blob], fileName, { type: "image/png" });
  }

  confirmSign() {
    if ((this.refs.mySignature as any).isEmpty()) {
      return CEF.alert.setAlert(
        "error",
        LangString(
          "components.Marriage.Marriage.544676faa280f207f33204b1d5feca88"
        )
      );
    }

    const result = (this.refs.mySignature as any).toDataURL();
    if (result.length > 35000) {
      return CEF.alert.setAlert(
        "error",
        LangString(
          "components.Marriage.Marriage.12dd5ac01de7ca774c18b1faf4869ec6"
        )
      );
    }

    this.dataUrlToFile(result, "file.png").then((d) => {
      CEF.saveSignature(d, `marriagesign_${CEF.id}`).then((status) => {
        CustomEvent.triggerServer("marriage::confirmSign");
      });
    });
  }

  getSignatureUrl(id: number) {
    return CEF.getSignatureURL(`marriagesign_${id}`);
  }

  changeWindow(window: Window) {
    this.setState({
      component: window,
    });
  }

  divorce(divorceType: DivorceType) {
    CustomEvent.triggerServer("marriage::divorce", divorceType);
  }

  updatePartners(partners: Person[]) {
    this.setState({ ...this.state, partners });
  }

  componentDidMount() {
    this.adjustZoom();
    window.addEventListener("resize", this.adjustZoom);
    CEF.user.getIsMale().then((isMale) => {
      this.setState({
        userIsMale: isMale,
      });
    });

    if (this.state.component === "SignFrame") {
      (this.refs.mySignature as any).minWidth = 0.8; //*Math.max((window as any).devicePixelRatio || 1, 1);
      (this.refs.mySignature as any).maxWidth = 2; //*Math.max((window as any).devicePixelRatio || 1, 1);
      (this.refs.mySignature as any).onBegin = () => {
        (this.refs.mySignature as any).clear();
      };
    }
  }

  componentWillUnmount = () => {
    window.removeEventListener("resize", this.adjustZoom);
  };

  adjustZoom = () => {
    const container = this.state.containerRef.current;
    if (container) {
      const zoomCountOne = window.innerWidth / 1920;
      const zoomCountTwo = window.innerHeight / 1080;

      if (zoomCountOne < zoomCountTwo) {
        container.style.zoom = zoomCountOne.toString();
      } else {
        container.style.zoom = zoomCountTwo.toString();
      }
    }
  };

  marriageOffer = () => {
    if (!this.state.selectedId) return;
    CustomEvent.triggerServer("marriage::sendOffer", this.state.selectedId);
  };

  render() {
    return (
      <div className="marriage">
        {this.state.component === "Select" ||
        this.state.component === "Welcome" ? (
          <div className="marriage__bg">
          </div>
        ) : (
          <>
            <img
              className="marriage__left-background"
              src={firstBackground}
              alt="#"
            />
            <img
              className="marriage__right-background"
              src={secondBackground}
              alt="#"
            />
          </>
        )}
        {/* <div className="exit" onClick={() => this.close()}>
          <div className="exit-icon">
            <img src={exitIcon} alt="#" />
          </div>
          <div className="exit__title">
            {LangString(
              "components.Marriage.Marriage.23af8f3aba5e8dfc2d9303dc5b71dbb8"
            )}
          </div>
        </div> */}
        <div ref={this.state.containerRef}>
          <div className="marriage__exit">
            <p>Exit</p>
            <div className="marriage__exit-img" onClick={() => this.close()}>
              <img src={svg["exit"]} alt="Exit" />
            </div>
          </div>

          {this.state.component === "AcceptFrame" ? (
            <div className="marriage-body marriage-body__second">
              <img
                src={marriageBody2}
                className="marriage-body__background2"
                alt="#"
              />
              <div className="marriage-body-content">
                <h1>
                  {this.state.firstPerson[0]}
                  <br />
                  {this.state.firstPerson[1]}
                </h1>
                <span>
                  {LangString(
                    "components.Marriage.Marriage.4af0236a0703d4f1e4a194ef6353fc59"
                  )}
                </span>
                <div className="marriage-body-content__secondName">
                  {this.state.firstPerson[1]}
                </div>
                <div className="marriage-body-content-buttons">
                  <div
                    className="marriage-body-content-buttons__body marriage-body-content-buttons-green"
                    onClick={() => this.acceptMarriageOffer()}
                  >
                    {LangString(
                      "components.Marriage.Marriage.de3eb82bec839e237d676434e73fdf67"
                    )}
                  </div>
                  <div
                    className="marriage-body-content-buttons__body"
                    onClick={() => this.declineMarriageOffer()}
                  >
                    {LangString(
                      "components.Marriage.Marriage.0648134e6dbda87043335d53f3f87883"
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}

          {this.state.component === "InfoFrame" ? (
            <div className="marriage-body marriage-body__first">
              <img
                src={marriageBody1}
                className="marriage-body__background1"
                alt="#"
              />

              <div className="marriage-body-content">
                <span className="marriage-body-content__text">
                  {LangString(
                    "components.Marriage.Marriage.055d562f9a3693530bfe80e4da7b5270"
                  )}{" "}
                  <br />{" "}
                  {LangString(
                    "components.Marriage.Marriage.ebc29e6a6435177052c2a30942df19bb"
                  )}
                </span>
                <div className="marriage-body-content-names">
                  <span className="marriage-body-content-names__leftName">
                    {this.state.firstPerson[0]} <br />{" "}
                    {this.state.firstPerson[1]}
                  </span>
                  &
                  <span className="marriage-body-content-names__rightName">
                    {this.state.secondPerson[0]} <br />{" "}
                    {this.state.secondPerson[1]}
                  </span>
                </div>
                <div className="marriage-body-content-painting">
                  <img
                    src={this.getSignatureUrl(this.state.firstPerson[2])}
                    alt="#"
                  />
                  <div className="marriage-body-content-painting__title">
                    {LangString(
                      "components.Marriage.Marriage.159d3a4371d46cf00408611f9677f43c"
                    )}
                  </div>
                  <img
                    src={this.getSignatureUrl(this.state.secondPerson[2])}
                    alt="#"
                  />
                </div>
                <span className="marriage-body-content__text">
                  {LangString(
                    "components.Marriage.Marriage.c86ce05e747b1e0ab4b0919d39b81e1f"
                  )}
                </span>
              </div>
            </div>
          ) : (
            ""
          )}

          {this.state.component === "SignFrame" ? (
            <div className="marriage-body marriage-body__third">
              <img
                src={marriageBody2}
                className="marriage-body__background2"
                alt="#"
              />
              <div className="marriage-body-content">
                <h1>
                  {LangString(
                    "components.Marriage.Marriage.e6e59384a37a4b002a210ea264263e99"
                  )}
                </h1>
                <div className="marriage-body-content-signature">
                  <SignaturePad ref="mySignature" />
                </div>
                <div className="marriage-body-content-buttons">
                  <div
                    className="marriage-body-content-buttons__body marriage-body-content-buttons-green"
                    onClick={() => this.confirmSign()}
                  >
                    {LangString(
                      "components.Marriage.Marriage.3594401b9e0dc7edece60a2647d2c981"
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}

          {this.state.component === "Welcome" ? (
            <div className="marriage__select">
              <div className="marriage__select-top">
                <img src={png["flowers"]} alt="" />
                <div className="marriage__select-top-title center">
                  <h1>
                    {LangString(
                      "components.Marriage.Marriage.faf8849ee4f0b8e26528e6dd1e374b87"
                    )}{" "}
                    {LangString(
                      "components.Marriage.Marriage.9b9cbe5c32887c21b9ed21d9f3ca1ff7"
                    )}
                  </h1>
                </div>
                <h3>
                  {LangString(
                    "components.Marriage.Marriage.3691934dba1309aa12b462f3f6f967be"
                  )}
                </h3>
                <button
                  className="marriage__select__btn"
                  type="button"
                  onClick={() => this.changeWindow("Select")}
                >
                  {this.state.userIsMale
                    ? LangString(
                        "components.Marriage.Marriage.b1cf92559cb23525aeb90e4c8347c4aa"
                      )
                    : LangString(
                        "components.Marriage.Marriage.b1cf92559cb23525aeb90e4c8347c4aa"
                      )}
                </button>
              </div>
              <div className="marriage__select-images">
                <img
                  className="marriage__select-hearts"
                  src={png["hearts"]}
                  alt=""
                />
                <img
                  className="marriage__select-wedding"
                  src={png["wedding"]}
                  alt=""
                />
              </div>
            </div>
          ) : (
            ""
          )}

          {this.state.component === "Divorce" ? (
            <div className="marriage-body marriage-body__second">
              <img
                src={marriageBody2}
                className="marriage-body__background3"
                alt="#"
              />

              <div className="marriage-body-content">
                <h1>
                  {LangString(
                    "components.Marriage.Marriage.07ddfcf212ec443ff01ecd9ee33b6581"
                  )}
                  <br />
                  {LangString(
                    "components.Marriage.Marriage.2ef781c519306ffb11dc60d498d59451"
                  )}{" "}
                </h1>

                <div className="marriage-body-content-buttons marriage-body-content-divorce">
                  <div className="marriage-body-content-buttons">
                    <span>
                      {LangString(
                        "components.Marriage.Marriage.f4ababed015d7d1682561f094ce44fcb"
                      )}
                    </span>
                    <div
                      className="marriage-body-content-buttons__body"
                      onClick={() => this.divorce("consent")}
                    >
                      {LangString(
                        "components.Marriage.Marriage.960840e76d2d62f7a962407f976f5aa7"
                      )}
                    </div>
                  </div>
                  <div className="marriage-body-content-buttons">
                    <span>
                      {LangString(
                        "components.Marriage.Marriage.9083ffc4c3c7f2345f0ab76c88ce0eea"
                      )}{" "}
                      <span>{system.numberFormat(WEEDING_PAY)}</span>?
                    </span>
                    <div
                      className="marriage-body-content-buttons__body"
                      onClick={() => this.divorce("money")}
                    >
                      {LangString(
                        "components.Marriage.Marriage.6b2b1e5dbc942188498f6e0b6926e778"
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}

          {this.state.component === "Select" ? (
            <div className="marriage__select">
              <div className="marriage__select-top">
                <img src={png["flowers"]} alt="" />
                <div className="marriage__select-top-title">
          <h1>casatorie</h1>
          <h2>cu un partener</h2>
                </div>
                <h3>Alege un partener</h3>
                <div className="marriage__select-partners">
                  {this.state.partners.map((el, key) => {
                    return (
                      <div
                        key={key}
                        className={`marriage__select-partner ${
                          this.state.selectedId === el.staticID
                            ? "selected"
                            : ""
                        }`}
                        onClick={() => {
                          this.setState({
                            selectedId: el.staticID,
                          });
                        }}
                      >
                        <h1>{el.name}</h1>
                        <h2>#{el.staticID}</h2>
                      </div>
                    );
                  })}
                </div>
                <button type="button" onClick={this.marriageOffer}>
                  Casatoreste-te
                </button>
              </div>
              <div className="marriage__select-images">
                <img
                  className="marriage__select-hearts"
                  src={png["hearts"]}
                  alt=""
                />
                <img
                  className="marriage__select-wedding"
                  src={png["wedding"]}
                  alt=""
                />
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}
