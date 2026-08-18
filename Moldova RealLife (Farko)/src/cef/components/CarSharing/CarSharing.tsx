import { LangString } from "../../modules/lang";
import React, { Component } from "react";

import "./style.less";

import closeIcon from "./assets/closeIcon.svg";

import carBackground from "./assets/carBackground.png";
import sparksBackground from "./assets/sparksBackground.png";
import tireTracksBackground from "./assets/tireTracksBackground.png";

import keyIcon from "./assets/key.svg";

import { CustomEvent } from "../../modules/custom.event";
import { CEF } from "../../modules/CEF";

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

interface rentVehicle {
  id: number;
  name: string;
  cost: number;
}

export class CarSharing extends Component<
  {},
  {
    vehicles: rentVehicle[];
    rentedVehicle: rentVehicle;
    confirmation: boolean;
    selectedCarId: number;
    containerRef: React.RefObject<HTMLDivElement>;
  }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      vehicles: [
        { id: 1, name: "Faggio v2", cost: 5000 },
        { id: 2, name: "Faggio v2", cost: 5000 },
      ],

      rentedVehicle: null,
      confirmation: false,
      selectedCarId: null,
      containerRef: React.createRef<HTMLDivElement>(),
    };

    CustomEvent.register(
      "carSharing:open",
      (
        availableCars: { id: number; name: string; cost: number }[],
        rentedCar: { id: number; name: string; cost: number }
      ) => {
        this.setState({
          rentedVehicle: rentedCar,
          vehicles: availableCars,
        });
      }
    );
  }

  componentDidMount = () => {
    this.adjustZoom();
    window.addEventListener("resize", this.adjustZoom);
  };

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

  startRent(id: number, confirmation?: boolean) {
    if (confirmation) {
      CustomEvent.triggerServer("carSharing:stopRent");
      this.setState({
        ...this.state,
        confirmation: false,
      });
    }
    if (this.state.rentedVehicle && !confirmation) {
      return this.setState({
        ...this.state,
        confirmation: true,
        selectedCarId: id,
      });
    }

    this.setState({
      ...this.state,
      confirmation: false,
      selectedCarId: id,
    });
    CustomEvent.triggerServer("carSharing:rent", id);
  }

  close(): void {
    CEF.gui.setGui(null);
  }

  render() {
    return (
      <div className="carsharing">
        <div className="carsharing__pictures">
          <img className="carsharing__pictures__bg" src={png["BG"]} alt="" />
        </div>
        <div className="carsharing__box" ref={this.state.containerRef}>
          <img
            className="carsharing__pictures__left"
            src={png["left"]}
            alt=""
          />
          <img
            className="carsharing__pictures__right"
            src={png["right"]}
            alt=""
          />
          <img
            className="carsharing__pictures__top"
            src={png["left-top"]}
            alt=""
          />
          <img
            className="carsharing__pictures__bottom"
            src={png["right-bottom"]}
            alt=""
          />
          <div className="carsharing__main">
            <div className="carsharing__header">
              <div className="carsharing__header-title">
                <h1>
                  car <span>sharing</span>
                </h1>
                <h2>Inchiriaza sau pune la dispozitie masina ta! Foloseste vehiculele altor jucatori sau lasa-ti propria masina sa aduca bani in timp ce altii o folosesc</h2>
              </div>
              <div className="carsharing__header-exit">
                <p>Exit</p>
                <div
                  className="carsharing__header-exit-img"
                  onClick={() => this.close()}
                >
                  <img src={svg["exit"]} alt="Exit" />
                </div>
              </div>
            </div>
            <div className="carsharing__content">
              {this.state.vehicles.map((el, key) => {
                return (
                  <div
                    className={`carsharing__car ${
                      this.state.rentedVehicle?.id === el.id ? "selected" : ""
                    }`}
                    key={key}
                  >
                    <img src={CEF.getVehicleURL(el.name)} alt="" />
                    <div className="carsharing__car-name">
                      <h1>{el.name}</h1>
                      <h2>$ {el.cost?.toLocaleString()}</h2>
                      <button
                        onClick={() =>
                          this.state.rentedVehicle?.id === el.id
                            ? CustomEvent.triggerServer(
                                "carSharing:stopRent",
                                this.state.rentedVehicle.id
                              )
                            : this.startRent(el.id)
                        }
                        className="carsharing__car-controls"
                      >
                        {this.state.rentedVehicle?.id === el.id
                          ? "Anuleaza închirierea"
                          : "Inchiriaza"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {this.state.confirmation && (
            <div className="carsharing__confirmation">
              <div className="carsharing__confirmation-title">
                <h1>Ai inchiriat deja o masina</h1>
                <div className="carsharing__confirmation-exit">
                  <p>Exit</p>
                  <div
                    onClick={() => this.setState({ confirmation: false })}
                    className="carsharing__confirmation-exit-img"
                  >
                    <img src={svg["exit"]} alt="Exit" />
                  </div>
                </div>
              </div>
              <div className="carsharing__confirmation-content">
                <h2>
                  Poti anula inchirierea si lua o alta masina
                  dar in acest caz, inchirierea masinii curente va fi finalizata!
                </h2>
                <button
                  className="carsharing__confirmation-content-btn"
                  onClick={() => this.startRent(this.state.selectedCarId, true)}
                >
                  Confirm
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}
