import { LangString } from "../../modules/lang";
import React, { Component } from "react";
import { CustomEvent } from "../../modules/custom.event";
import "./style.less";
const png = Object.fromEntries(
  Object.entries(import.meta.glob("./assets/*.png", { eager: true })).map(
    ([key, value]) => {
      const name = key.match(/\/([^/]+)\.png$/)[1];
      return [name, value.default];
    }
  )
);
const svg = Object.fromEntries(
  Object.entries(import.meta.glob("./assets/svg/*.svg", { eager: true })).map(
    ([key, value]) => {
      const name = key.match(/\/([^/]+)\.svg$/)[1];
      return [name, value.default];
    }
  )
);
import { CEF } from "../../modules/CEF";
import { CustomEventHandler } from "../../../shared/custom.event";
import { PayBox } from "../PayBox/PayBox";
import check from "./../ClothShop/assets/check.svg";
import { FamilyReputationType } from "../../../shared/family";
import { systemUtil } from "../../../shared/system";
import coin from "../UserMenu/assets/svg/player-stop-white.svg";

export class CreateFamily extends Component<
  {},
  {
    show: boolean;
    /** Цена коины, вирты */
    price: [number, number];
    inputName: string;
    inputType: number;
    inputError: boolean;
    showPay: boolean;
    succ?: boolean;
  }
> {
  private ev: CustomEventHandler;
  _child: React.RefObject<PayBox>;
  constructor(props: any) {
    super(props);
    this.state = {
      show: true,
      price: [2999, 1500000],
      inputName: "",
      inputType: 0,
      inputError: false,
      showPay: false,
      succ: false,
    };
    this.ev = CustomEvent.register(
      "family:showcreate",
      (price: [number, number]) => {
        this.setState({
          price,
          show: true,
        });
      }
    );
    this._child = React.createRef<PayBox>();
  }
  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown);
  }
  componentWillUnmount() {
    if (this.ev) this.ev.destroy();
    document.removeEventListener("keydown", this.handleKeyDown);
  }
  handleKeyDown(e: any) {
    switch (e.keyCode) {
      case 27: {
        if (this.state.showPay && this.state.showPay === true)
          this.setState({ showPay: false });
        else {
          this.setState({ show: false });
          CEF.gui.setGui(null);
        }
        return;
      }
    }
  }
  create = () => {
    console.log(this);
    if (this.state.inputName.length < 1)
      return this.setState({ inputError: true });
    let result =
      this.state.inputType === 1
        ? { paytype: 150, pin: "" }
        : this._child.current.canPay(this.state.price[1]);
    if (!result) return;
    CustomEvent.callServer(
      "family:create",
      this.state.inputName,
      result.paytype,
      result.pin
    ).then((answer) => {
      if (answer) this.setState({ succ: true });
      else CEF.gui.setGui(null);
    });
  };
render() {
  if (!this.state.show) return <></>;
  return (
    <section className="family-create-wrapper">
      <div className="family-create-wrapper-box">
        {this.state.succ ? (
          <div className="family-create-wrapper__success">
            <h1>
              Familia <span>{this.state.inputName}</span> a fost creata
            </h1>
            <p style={{ marginBottom: "20px" }}>
              Familia poate fi administrata prin tablet
            </p>

            <div className="family-create-wrapper__success__elements">
              <div className="family-create-wrapper__success__element">
                <div className="family-create-wrapper__success__element__title">
                  <img src={svg["element-1"]} alt="" />
                  <h3>Invitare jucatori</h3>
                </div>
                <p>
                  {LangString(
                    "components.Family.index.57eb3cf8afb083c235afc7da03cf0eff"
                  )}
                </p>
              </div>
              <div className="family-create-wrapper__success__element">
                <div className="family-create-wrapper__success__element__title">
                  <img src={svg["element-2"]} alt="" />
                  <h3>Sarcini</h3>
                </div>
                <p>Completeaza sarcini speciale si concureaza cu alte familii.</p>
              </div>
              <div className="family-create-wrapper__success__element">
                <div className="family-create-wrapper__success__element__title">
                  <img src={svg["element-3"]} alt="" />
                  <h3>Proprietati</h3>
                </div>
                <p>
                  Poti sa cumperi un apartament pentru familia ta
                </p>
              </div>
              <div className="family-create-wrapper__success__element">
                <div className="family-create-wrapper__success__element__title">
                  <img src={svg["element-4"]} alt="" />
                  <h3>Imbunatatiri</h3>
                </div>
                <p>Cu ajutorul tabletei poti imbunatati familia ta</p>
              </div>
            </div>

            <button
              type="button"
              className="form-create-family__btn"
              style={{ marginTop: "20px" }}
              onClick={() => {
                this.setState({ show: false });
                CEF.gui.setGui(null);
              }}
            >
              OK
            </button>
          </div>
        ) : (
          <>
            {this.state.showPay && this.state.showPay === true ? (
              <>
                <div className="family_blur" />
                <div className="family_paybox">
                  <div className="family_paybox_box">
                    <PayBox ref={this._child} />
                    <div className="family_buy" onClick={this.create}>
                      <img src={check} />
                      {LangString(
                        "components.Family.index.62397f52737ec1a50e4b3c676d9b46eb"
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : null}
            <h2 className="family-create-wrapper__title">
              Creare <span className="thin">familie</span>
            </h2>
            <p className="family-create-wrapper__desc">
              Uneste-ti persoanele dragi intr-o familie comuna si
              descopera noi oportunitati
            </p>
            <div className="fc-wows">
              <div>
                <div className="fc-wows__img">
                  <img src={svg["img-1"]} alt="" />
                </div>
                <p>Parcare familiala</p>
              </div>
              <div>
                <div className="fc-wows__img">
                  <img src={svg["img-2"]} alt="" />
                </div>
                <p>Vile private</p>
              </div>
              <div>
                <div className="fc-wows__img">
                  <img src={svg["img-3"]} alt="" />
                </div>
                <p>Sarcini diferite</p>
              </div>
              <div>
                <div className="fc-wows__img">
                  <img src={svg["img-4"]} alt="" />
                </div>
                <p>Actiuni</p>
              </div>
            </div>
            <div className="form-create-family__name">
              <h1>Nume familie</h1>
              <input
                type="text"
                placeholder="Introdu numele familiei"
                value={this.state.inputName}
                onChange={(e) =>
                  this.setState({
                    ...this.state,
                    inputName: e.target.value,
                    inputError: false,
                  })
                }
                maxLength={50}
                style={{ borderColor: this.state.inputError ? "red" : "" }}
              />
              <h1>Metoda de plata</h1>
            </div>
            <div className="form-create-family">
              <div className="form-create-family__controls">
                <div
                  className={`form-create-family__controls__currency ${
                    this.state.inputType === 0 ? "selected" : ""
                  }`}
                  onClick={() => this.setState({ inputType: 0 })}
                >
                  <h1>$</h1>
                  <h2>$ {systemUtil.numberFormat(this.state.price[1])}</h2>
                </div>
                <div
                  className={`form-create-family__controls__currency donate ${
                    this.state.inputType === 1 ? "selected" : ""
                  }`}
                  onClick={() => this.setState({ inputType: 1 })}
                >
                  <h1>SC</h1>
                  <h2>
                    {systemUtil.numberFormat(this.state.price[0])}{" "}
                    <span>SC</span>
                  </h2>
                </div>
              </div>
              <button
                className="form-create-family__btn"
                onClick={() => {
                  if (this.state.inputName.length < 1)
                    return this.setState({ inputError: true });
                  return this.state.inputType === 1
                    ? this.create()
                    : this.setState({ showPay: true });
                }}
              >
                <p>
                  {LangString(
                    "components.Family.index.024d58abbdd47578459bf0a4d7a39971"
                  )}
                </p>
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
}