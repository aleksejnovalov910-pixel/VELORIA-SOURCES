import { LangString } from "../../../../../../modules/lang";
import React, { Component } from "react";

// @ts-ignore
const png = Object.fromEntries(
  Object.entries(import.meta.glob("../../assets/*.png", { eager: true })).map(
    ([key, value]) => {
      const name = key.match(/\/([^/]+)\.png$/)[1];
      return [name, value.default];
    }
  )
);
// @ts-ignore
const svg = Object.fromEntries(
  Object.entries(import.meta.glob("../../assets/*.svg", { eager: true })).map(
    ([key, value]) => {
      const name = key.match(/\/([^/]+)\.svg$/)[1];
      return [name, value.default];
    }
  )
);
import { systemUtil } from "../../../../../../../shared/system";
import { CEF } from "../../../../../../modules/CEF";
import { CustomEvent } from "../../../../../../modules/custom.event";
import "../FieldReady/style.less";

export class GreenhouseReady extends Component<
  {},
  {
    amountRef: React.RefObject<any>;
    containerRef: React.RefObject<HTMLDivElement>;
  }
> {
  constructor(props: any) {
    super(props);

    this.state = {
      amountRef: React.createRef(),
      containerRef: React.createRef(),
    };
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
    const zoomCountOne = window.innerWidth / 1920;
    const zoomCountTwo = window.innerHeight / 1080;
    if (container) {
      if (zoomCountOne < zoomCountTwo) {
        container.style.zoom = zoomCountOne.toString();
      } else {
        container.style.zoom = zoomCountTwo.toString();
      }
    }
  };

  startRent(): void {
    const value = Number(
      systemUtil.filterInput(this.state.amountRef.current.value)
    );

    if (isNaN(value) || value <= 0 || value > 999999)
      return CEF.alert.setAlert(
        "error",
        LangString(
          "components.Farm.components.Entrance.components.GreenhouseReady.GreenhouseReady.d947a187b0665bf9916c4de7062f7397"
        )
      );

    CustomEvent.triggerServer("farm:capital:add", value);
  }

  render() {
    return (
      <div className="farmfield" ref={this.state.containerRef}>
        <div className="farmfield__header">
          <img className="farmfield__header__bg" src={png["fieldBG"]} alt="" />
          <div className="farmfield__header__content">
            <div className="farmfield__header__text farmfield__header__text__shadow">
              RENT
            </div>
            <div className="farmfield__header__img">
              <img src={png["fieldHeader"]} alt="circle" />
            </div>
            <div className="farmfield__header__text">FIELD</div>
          </div>
        </div>
        <div className="farmfield__content">
          <div className="farmfield__content__texts">
            <div className="farmfield__content__title">
              {LangString(
                "components.Farm.components.Entrance.components.FieldReady.FieldReady.193659be80d8828530957a72303b12d8"
              )}{" "}
              {LangString(
                "components.Farm.components.Entrance.components.FieldReady.FieldReady.1f2fe9e862f745af60017c35a6a324a1"
              )}
            </div>
            <div className="farmfield__content__text">
              {LangString(
                "components.Farm.components.Entrance.components.FieldReady.FieldReady.c26d3591a65e5c38c557ad8cea2c5873"
              )}{" "}
              <br />
              {LangString(
                "components.Farm.components.Entrance.components.FieldReady.FieldReady.35520760d62cc4ca23c7c23ebeee8deb"
              )}
            </div>
          </div>
          <div className="farmfield__content__input">
            <div>$</div>
            <input
              ref={this.state.amountRef}
              type="number"
              placeholder={LangString(
                "components.Farm.components.Entrance.components.FieldReady.FieldReady.0b03707af64180d8f3d239e988f83551"
              )}
            />
          </div>
          <div
            className="farmfield__content__button"
            onClick={() => this.startRent()}
          >
            Introduction
          </div>
        </div>
      </div>
    );
  }
}

// OLD

// return (
// 	<div className="farm-entrance-block-content">
// 		<img
// 			src={png["greenhouse"]}
// 			className="farm-entrance-block-content__greenhouse"
// 			alt=""
// 		/>

// 		<div className="farm-entrance-block-content__bigName">HITZE</div>

// 		<div className="farm-entrance-block-content__name farm__readyTitle">
// 			<div>
// 				{LangString(
// 					"components.Farm.components.Entrance.components.GreenhouseReady.GreenhouseReady.a6f2fd7ba160e2b7ab8fcfc5764f166a",
// 				)}
// 			</div>
// 			<span>
// 				{" "}
// 				{LangString(
// 					"components.Farm.components.Entrance.components.GreenhouseReady.GreenhouseReady.e511e7e5daaf56a5274064c07b753882",
// 				)}
// 			</span>
// 		</div>

// 		<div className="farm-entrance-block-content__title">
// 			{LangString(
// 				"components.Farm.components.Entrance.components.GreenhouseReady.GreenhouseReady.ac8b51e3524a35af9e9c4b4473bb1b45",
// 			)}{" "}
// 			<br />
// 			{LangString(
// 				"components.Farm.components.Entrance.components.GreenhouseReady.GreenhouseReady.3090bb70cc5ac8c86c7a75fc52052afe",
// 			)}
// 		</div>

// 		<div className="farm-entrance-block-content-input">
// 			<div>$</div>
// 			<input
// 				ref={this.state.amountRef}
// 				type="number"
// 				placeholder={LangString(
// 					"components.Farm.components.Entrance.components.GreenhouseReady.GreenhouseReady.61ecb8defa75ad9be291a3fe71d33339",
// 				)}
// 			/>
// 		</div>

// 		<div
// 			className="farm-entrance-block-content__button"
// 			onClick={() => this.startRent()}
// 		>
// 			<div className="farm__bigButton">
// 				{LangString(
// 					"components.Farm.components.Entrance.components.GreenhouseReady.GreenhouseReady.fb2ae20573767e843a12ae3ee31dea02",
// 				)}
// 			</div>
// 		</div>
// 	</div>
// );
