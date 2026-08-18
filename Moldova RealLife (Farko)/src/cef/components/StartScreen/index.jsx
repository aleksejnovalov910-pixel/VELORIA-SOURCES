import React, { Component } from "react";
import { CEF } from "../../modules/CEF";
import { START_DIALOG } from "../../../shared/rules";
import { CustomEvent } from "../../modules/custom.event";
import "./style.scss";
import bgleft from "./img/BG-left.png";
const png = Object.fromEntries(
  Object.entries(import.meta.glob("./*.png", { eager: true })).map(
    ([key, value]) => {
      const name = key.match(/\/([^/]+)\.png$/)[1];
      return [name, value.default];
    }
  )
);

const svg = Object.fromEntries(
  Object.entries(import.meta.glob("./*.svg", { eager: true })).map(
    ([key, value]) => {
      const name = key.match(/\/([^/]+)\.svg$/)[1];
      return [name, value.default];
    }
  )
);

export class GreetingScreenClass extends Component {
  componentDidMount() {
    CEF.playSound("okLogin");
  }

  componentWillUnmount() {
    CEF.playSound("hudinfo");
  }

  handleButtonClick = () => {
    CEF.playSound("aeroport"); // ← Aici redam sunetul când apasa Let's go!
    CustomEvent.triggerServer("greeting:ok");
    CEF.gui.setGui(null);
  };
  render() {
    return (
      <div className="container-box">
        <div className="box">
          <div className="information-box">
          {/* <div className="picture"> */}
          <div className="picture" style={{ backgroundImage: `url(${bgleft})`, backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "top", minWidth: "400px", height: "500px" }}>

          {/*<img src={png["logo-2"]} alt="logo" />*/}
          </div>
            <div className="content">
              <div className="top">
                <h1>Welcome to <span>Moldova RealLife</span></h1>
                <p>{START_DIALOG}</p>
              </div>
              <button className="button" onClick={this.handleButtonClick}>
                <p>Let's go!</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}