import { LangString } from "../../modules/lang";
import React, { Component } from "react";

import "./style.less";

import carBackground from "./assets/BG.png";
import carPictureTop from "./assets/left-top.png";
import carPictureBottom from "./assets/right-bottom.png";
import carPictureRight from "./assets/right.png";
import carPictureLeft from "./assets/left.png";

import exitIcon from "./assets/exit.svg";

import { CustomEvent } from "../../modules/custom.event";
import { CEF } from "../../modules/CEF";

interface rentVehicle {
  modelName: string;
  showName: string;
  price: number;
}

interface rented {
  active: boolean;
  name: string;
}

export class Rent extends Component<
  {},
  {
    vehicles: rentVehicle[];
    rentedVehicle: rented;
    id: number;
    confirmation: boolean;
    selectedCarModelName: string;
  }
> {
  containerRef: React.RefObject<HTMLDivElement>;
  constructor(props: any) {
    super(props);
    this.state = {
      id: 0,
      vehicles: [
        {
          modelName: "faggio",
          showName: "Faggio",
          price: 5000,
        },
        {
          modelName: "faggio3",
          showName: "Faggio v3",
          price: 6500,
        },
      ],

      rentedVehicle: {
        active: false,
        name: "",
      },
      confirmation: false,
      selectedCarModelName: "",
    };
    this.containerRef = React.createRef<HTMLDivElement>();
    CustomEvent.register("rentCar:denied", (carName: string) => {
      this.setState({
        rentedVehicle: {
          active: true,
          name: carName,
        },
      });
    });
    CustomEvent.register(
      "rentCar:open",
      (id: number, availableCars: { name: string; cost: number }[]) => {
        const cars: any[] = [];
        availableCars.map((car) => {
          cars.push({
            modelName: car.name,
            showName: car.name,
            price: car.cost,
          });
        });
        this.setState({
          vehicles: cars,
          id,
        });
      }
    );
  }

  changeRentedVehicle(toggle: boolean, showName: string = "") {
    this.setState({
      ...this.state,
      rentedVehicle: {
        active: toggle,
        name: showName,
      },
    });
  }

  startRent(modelName: string, confirmation?: boolean) {
    if (confirmation) {
      CustomEvent.triggerServer("rentCar:stopRent");
      this.setState({
        ...this.state,
        confirmation: false,
      });
    }
    if (this.state.rentedVehicle.name && !confirmation) {
      return this.setState({
        ...this.state,
        confirmation: true,
        selectedCarModelName: modelName,
      });
    }

    this.setState({
      ...this.state,
      confirmation: false,
      selectedCarModelName: modelName,
    });
    CustomEvent.triggerServer("rentCar:rent", this.state.id, modelName);
  }

  componentDidMount = () => {
    this.adjustZoom();
    window.addEventListener("resize", this.adjustZoom);
  };

  componentWillUnmount = () => {
    window.removeEventListener("resize", this.adjustZoom);
  };

  adjustZoom = () => {
    const container = this.containerRef.current;
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

  close(): void {
    CEF.gui.setGui(null);
  }

  render() {
    return (
      <div className="rentCar">
        <div className="pictures">
          <img className="pictures__bg" src={carBackground} alt="" />
          <img className="pictures__left" src={carPictureLeft} alt="" />
          <img className="pictures__right" src={carPictureRight} alt="" />
          <img className="pictures__top" src={carPictureTop} alt="" />
          <img className="pictures__bottom" src={carPictureBottom} alt="" />
        </div>
        <div className="rentCar__main" ref={this.containerRef}>
          <div className="rentCar__header">
            <div className="rentCar__header__title">
              <h1>
                Rent <span>car</span>
              </h1>
              <h2>Aici poti inchiria un vehicul sau chiar o bicicleta, perfect pentru nevoile tale!</h2>
            </div>
            <div className="rentCar__header__exit" onClick={() => this.close()}>
              <p>Exit</p>
              <div className="rentCar__header__exit-img">
                <img src={exitIcon} alt="Exit" />
              </div>
            </div>
          </div>
          <div className="rentCar__content">
            <div
              className={`rentCar__content__cars ${
                this.state.rentedVehicle.active ? "" : "rentCar__active"
              }`}
            >
              {this.state.vehicles.map((el, key) => (
                <div
                  key={key}
                  className={`rentCar__content__car ${
                    this.state.rentedVehicle.name === el.modelName
                      ? "Selectea-za"
                      : ""
                  }`}
                >
                  <img src={CEF.getVehicleURL(el.modelName)} alt="car" />

                  <div className="rentCar__content__car__name">
                    <h1>{el.showName}</h1>
                    <h2>$ {el.price.toLocaleString()}</h2>
                    <button
                      onClick={() =>
                        this.state.rentedVehicle.name === el.modelName
                          ? CustomEvent.triggerServer("rentCar:stopRent")
                          : this.startRent(el.modelName)
                      }
                      className="rentCar__content__car__controls"
                    >
                      {this.state.rentedVehicle.name === el.modelName
                        ? "Anuleaza inchirierea"
                        : "Inchiriaza"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {this.state.confirmation && (
          <div className="confirmation">
            <div className="confirmation__title">
              <h1>Ai inchiriat deja o masina</h1>
              <div
                className="rentCar__header__exit"
                onClick={() =>
                  this.setState({ ...this.state, confirmation: false })
                }
              >
                <p>Exit</p>
                <div className="rentCar__header__exit-img">
                  <img src={exitIcon} alt="Exit" />
                </div>
              </div>
            </div>
            <div className="confirmation__content">
              <h2>
              Poti anula inchirierea si lua o alta masina, 
              dar in acest caz, inchirierea masinii curente va fi finalizata!
              </h2>
              <button
                onClick={() =>
                  this.startRent(this.state.selectedCarModelName, true)
                }
                className="confirmation__button"
              >
                Confirm
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}
