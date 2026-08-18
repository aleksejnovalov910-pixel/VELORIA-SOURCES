import React, { Component, useState } from "react";
import Intro from "./Intro";
import Selector from "./Selector";
import Outro from "./Outro";
import Questions from "./Questions";
import { list } from "./list";
import type { LicenceType } from "./../../../shared/licence"
import "./style/style.scss"
import { CEF } from "../../modules/CEF";
import { CustomEvent } from "../../modules/custom.event";
import type { CustomEventHandler } from "../../../shared/custom.event";
import exitIcon from "./img/exit.svg";
interface DrivingSchoolState {
  page: number;
  question: number;
  miss: number;
  selectedLicense: string;
  playerLicenses: [LicenceType, number, string][];
  categories: { name: string; id: string; literal: string }[];
  licenseName: string;
}

/** Максимально допустимое количество ошибок */
export const maxMiss = 5;

const TYPE_TO_NAME = {
  car: "Categoria A",
  moto: "Categoria B",
  truck: "Categoria C",
  boat: "Categoria Barca",
  air: "Categoria Pilot",
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export class DrivingSchool extends Component<any, DrivingSchoolState> {
  ev: CustomEventHandler;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  constructor(props: any) {
    super(props);

    this.state = {
      page: 4,
      question: 1,
      miss: 0,
      selectedLicense: "",
      playerLicenses: [["car", 1, ""]],
      categories: [{ name: "Permis Moto", id: "moto", literal: 'Categoria A' }, { name: "Permis Vehicul", id: "car", literal: 'Categoria B' }, {
        name: "Permis Camion", id: "truck", literal: 'Categoria C'
      }, { name: "Permis Barca", id: "boat", literal: 'Categoria N' }, { name: "Permis Pilot", id: "air", literal: 'Categoria P' }],
      licenseName: '',
    };

    this.ev = CustomEvent.register("drivingschool", (playerLicenses: [LicenceType, number, string][], pageID: number = 1, licName: string = "car") => {
      console.log(playerLicenses, pageID, licName);
      this.setState({ page: pageID, playerLicenses: playerLicenses, licenseName: TYPE_TO_NAME[licName as keyof typeof TYPE_TO_NAME] });
    })
  }

  go() {
    this.setState({ page: 2 });
  }

  selectLecenseType = (type: string) => {
    if (["car", "moto", "truck", "boat", "air"].includes(type)) {
      CustomEvent.callServer("client:autoschool:selectCategory", type).then((res) => {
        if (res == true) {
          this.setState({ page: 1, selectedLicense: type, licenseName: type });
        }
      });
    }
    else {
      CEF.gui.setGui(null);
      // Начать практику
    }
  }
  // biome-ignore lint/complexity/noBannedTypes: <explanation>
  confirm(ans: number, callback: Function) {
    if (ans) {
      this.setState((prev: DrivingSchoolState) => {
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        const state: any = {
          question: prev.question + 1,
          newQuestion: true,
        };
        if (ans !== list[this.state.licenseName as keyof typeof list][this.state.question - 1].correct) {
          state.miss = prev.miss + 1;
        }
        if (state.question > list[this.state.licenseName as keyof typeof list].length) {
          return { miss: prev.miss, page: 3 };
        }
        return { ...state };
      });
      callback();
    }
  }

  componentWillMount = () =>
    document.addEventListener("keydown", this.close);

  componentWillUnmount() {
    document.removeEventListener("keydown", this.close);
    if (this.ev) this.ev.destroy();
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  close = (e: any) => {
    if (this.state.page > 1)
      return;
    if (e.keyCode === 27) {
      CustomEvent.triggerServer("client:autoschool:theory", false);
      CEF.gui.setGui(null);
    }
  }

  closeUi = () => {
    CustomEvent.triggerServer("client:autoschool:theory", false);
    CEF.gui.setGui(null);
  }
  render() {
    if (this.state.page === 0) return <></>;
    return (
      <div className="driving-school-container-box">
        
        <div className="driving-school-exit" onClick={() => this.closeUi()}>
          <p>Exit</p>
          <div className="exit-img" onClick={() => this.closeUi()}>
            <img src={exitIcon} alt="Exit" />
          </div>
        </div>

        <div className="driving-school-box">
          <div className="driving-school-content-box">
            <img className="element-bg" src="./img/element-bg.png" alt="" />
            <div className="driving-school-top">
              <div className="driving-school-title">
                <div className="driving-school-title-img">
                  <h1>
                    Scoala de<span>Soferi</span>
                  </h1>
                </div>
                <p>
                  {/* Aici poti sustine examenele si obtine licente pentru categoriile de mai jos. */}
                </p>
              </div>
              <img src="./img/exit.png" alt="" />
            </div>
            <div className="driving-school-content">
              {(() => {
                switch (this.state.page) {
                  case 1:
                    return <Intro accept={this.go.bind(this)} licenseName={this.state.licenseName} />;
                  case 2:
                    return <Questions list={list[this.state.licenseName as keyof typeof list]} num={this.state.question} confirm={this.confirm.bind(this)} licenseName={this.state.licenseName} />;
                  case 3:
                    return <Outro miss={this.state.miss} lic={this.state.selectedLicense} />;
                  case 4:
                    return <Selector setSelectedCategory={this.selectLecenseType.bind(this)} categories={this.state.categories} playerLicenses={this.state.playerLicenses} />;
                  default:
                    return <Intro accept={this.go.bind(this)} licenseName={this.state.licenseName} />;
                  //return <Intro setSelectedCategory={this.go.bind(this)} categories={this.state.categories} playerLicenses={this.state.playerLicenses} />;
                }
              })()}
            </div>
          </div></div>
      </div>
    );
  }
}

export default DrivingSchool;
