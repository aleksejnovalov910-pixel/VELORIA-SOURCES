import { LangString } from "../../modules/lang";
// input не смог потестить
import React, { Component } from "react";

import "./style.less";
import exitIcon from "./assets/images/exitIcon.svg";
import exitSvg from "./assets/exit.svg";
import backIcon from "./assets/images/backIcon.svg";

import background from "./assets/images/registration/background.png";
import leftImage from "./assets/images/registration/leftImage.png";
import pointIcon from "./assets/images/registration/pointIcon.svg";

import flyingNumbers from "./assets/images/first/flyingNumbers.png";
import leftButton from "./assets/images/first/left.png";
import rightButton from "./assets/images/first/right.png";

import car from "./assets/images/order/car.png";
import table from "./assets/images/order/table.png";
import coin from "./assets/images/order/coin.svg";
import { CustomEvent } from "../../modules/custom.event";
import { CEF } from "../../modules/CEF";
import { systemUtil } from "../../../shared/system";

const png = Object.fromEntries(
  Object.entries(import.meta.glob("./assets/*.png", { eager: true })).map(
    ([key, value]) => {
      const name = key.match(/\/([^/]+)\.png$/)[1];
      return [name, value.default];
    }
  )
);

export class NumberPlate extends Component<
  {},
  {
    frame: number;
    activeType: number;
    numberPlate: string;
    containerRef: React.RefObject<HTMLDivElement>;
  }
> {
  constructor(props: any) {
    super(props);

    this.state = {
      frame: 0,
      activeType: 0,
      numberPlate: "",
      containerRef: React.createRef<HTMLDivElement>(),
    };
    this.formatNumberInput = this.formatNumberInput.bind(this);
  }

  componentDidMount = () => {
    this.adjustZoom();
    window.addEventListener("resize", this.adjustZoom);
  };

  componentWillUnmount = () => {
    window.removeEventListener("resize", this.adjustZoom);
  };

  formatNumberInput(e: any): void {
    let value = e.target.value;
    this.setState({
      ...this.state,
      numberPlate: systemUtil.filterInput(value),
    });
  }

  changeFrame(frame: number): void {
    this.setState({ frame });
  }

  changeActiveType(activeType: number): void {
    this.setState({ activeType });
  }

  exit(): void {
    CEF.gui.setGui(null);
  }

  back(): void {
    if (this.state.activeType !== 0) this.changeActiveType(0);
    this.changeFrame(0);
  }

  buyNumber(isDonate: boolean): void {
    if (isDonate) {
      if (this.state.numberPlate.length > 8)
        return CEF.alert.setAlert(
          "error",
          LangString(
            "components.NumberPlate.NumberPlate.0aa6f83ebb06f4c9d2e97779514b4b02"
          )
        );
      if (!/^[a-zA-Z0-9 ]{1,8}$/.test(this.state.numberPlate))
        return CEF.alert.setAlert(
          "error",
          LangString(
            "components.NumberPlate.NumberPlate.c983e800d944f9a6e0447c68bbe20eaf"
          )
        );
      CustomEvent.triggerServer(
        "vehiclenumber:buyDonate",
        this.state.numberPlate
      );
    } else {
      if (this.state.activeType === 0) return; // не выбрал тип номера
      CustomEvent.triggerServer("vehiclenumber:buy", this.state.activeType - 1);
    }
  }

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

  render() {
    return (
      <div className="numberplate">
        <div className="numberplate__bg">

        </div>
        <div className="numberplate__box" ref={this.state.containerRef}>
          {this.state.frame !== 1 && (
            <div className="numberplate__exit">
              <p>Exit</p>
              <div
                className="numberplate__exit-img"
                onClick={() =>
                  this.state.frame === 0 ? this.exit() : this.back()
                }
              >
                <img src={exitSvg} alt="Exit" />
              </div>
            </div>
          )}
          {this.state.frame === 0 && (
            <div className="numberplate__chose">
              <div
                className="numberplate__chose__item standard"
                onClick={() => this.changeFrame(1)}
              >
                <img
                  src={png["standard-bg"]}
                  alt=""
                  className="numberplate__chose__item__bg"
                />
                <h1>STANDARD</h1>
                {/* <h2>{this.state.numberPlate}</h2> */}
                <img src={png["standard"]} alt="" />
              </div>

              <div
                className="numberplate__chose__item personal"
                onClick={() => this.changeFrame(2)}
              >
                <img
                  src={png["personal-bg"]}
                  alt=""
                  className="numberplate__chose__item__bg"
                />
                <h1>PERSONAL</h1>
                {/* <h2>{this.state.numberPlate}</h2> */}
                <img src={png["personal"]} alt="" />
              </div>
            </div>
          )}
          {this.state.frame === 1 && (
            <div className="numberplate__reg">
              <div className="numberplate__reg__top">
                <h1>
                  <span>Inregistrare</span> Vehicul
                </h1>
                <div className="numberplate__reg__top-exit">
                  <p>Exit</p>
                  <div
                    className="numberplate__reg__top-exit-img"
                    onClick={() => this.back()}
                  >
                    <img src={exitSvg} alt="Exit" />
                  </div>
                </div>
              </div>

              <h3>Selectati o varianta</h3>
              <div className="numberplate__reg__content">
                <div
                  className={`numberplate__reg__item ${
                    this.state.activeType === 1 ? "selected" : ""
                  }`}
                  onClick={() => this.changeActiveType(1)}
                >
                  <h1>
                    {LangString(
                      "components.NumberPlate.NumberPlate.345d55b3d096aecc35832b8e97db5cca"
                    )}{" "}
                  </h1>
                  <h2>$ 5 000</h2>
                </div>
                <div
                  className={`numberplate__reg__item ${
                    this.state.activeType === 2 ? "selected" : ""
                  }`}
                  onClick={() => this.changeActiveType(2)}
                >
                  <h1>
                    {LangString(
                      "components.NumberPlate.NumberPlate.a32b9b01dd5bc8cf6cc2601db14d699b"
                    )}{" "}
                  </h1>
                  <h2>$ 10 000</h2>
                </div>
                <div
                  className={`numberplate__reg__item ${
                    this.state.activeType === 3 ? "selected" : ""
                  }`}
                  onClick={() => this.changeActiveType(3)}
                >
                  <h1>
                    {LangString(
                      "components.NumberPlate.NumberPlate.3bfc2cb926ca4bb931b37bbb58cd2186"
                    )}{" "}
                  </h1>
                  <h2>$ 15 000</h2>
                </div>
              </div>

              <p>
             - Pentru a inregistra un vehicul, aveti nevoie de un card bancar!

              </p>

              <button type="button" onClick={() => this.buyNumber(false)}>
                Cumpara
              </button>
            </div>
          )}
          {this.state.frame === 2 && (
            <div className="numberplate__reg personal">
              <h1>Car number</h1>
              <p>
             Aici va puteti personaliza numarul vehiculului dupa bunul plac
              </p>
              <div className="numberplate__reg__number">
                <input
                  maxLength={8}
                  placeholder="GR6660SS"
                  value={this.state.numberPlate}
                  onChange={this.formatNumberInput}
                />
                <img src={png["table"]} alt="" />
              </div>

              <div className="numberplate__reg__item">
                <h1>Pret total</h1>
                <h2>
                  {" "}
                  <span>45</span> Coins
                </h2>
              </div>

              <button type="button" onClick={() => this.buyNumber(true)}>
                Cumpara
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
}
