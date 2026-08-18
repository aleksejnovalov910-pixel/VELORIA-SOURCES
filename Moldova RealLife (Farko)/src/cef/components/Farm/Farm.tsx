// Lang file ready
import { Shop } from "./components/Shop";
import { Entrance } from "./components/Entrance";
import { Dots } from "./components/Dots";

import React, { Component } from "react";
import "./style.less";

// @ts-ignore
const png = Object.fromEntries(
  Object.entries(import.meta.glob("./assets/*.png", { eager: true })).map(
    ([key, value]) => {
      const name = key.match(/\/([^/]+)\.png$/)[1];
      return [name, value.default];
    }
  )
);
// @ts-ignore
const svg = Object.fromEntries(
  Object.entries(import.meta.glob("./assets/*.svg", { eager: true })).map(
    ([key, value]) => {
      const name = key.match(/\/([^/]+)\.svg$/)[1];
      return [name, value.default];
    }
  )
);
import { CustomEvent } from "../../modules/custom.event";
import { FarmUiComponent } from "../../../shared/farm/dtos";
import { CustomEventHandler } from "../../../shared/custom.event";
import { Statistic } from "./components/Statistic";
import { Rating } from "./components/Rating";
import { Can } from "./components/Game/Can";
import { Milk } from "./components/Game/Milk";
import { Best } from "./components/Best";

export class Farm extends Component<
  {},
  {
    component: FarmUiComponent;
    hidden: boolean;
  }
> {
  ev: CustomEventHandler;
  constructor(props: any) {
    super(props);

    this.state = {
      component: "shop", ///entrance
      hidden: false,
    };
    this.ev = CustomEvent.register(
      "farm:setComponent",
      (component: FarmUiComponent) => {
        this.setState({
          component,
        });
      }
    );
  }

  componentWillUnmount = () => {
    if (this.ev) this.ev.destroy();
    this.setState({
      hidden: false,
    });
  };

  hideBg = (hide: boolean) => {
    this.setState({
      hidden: hide,
    });
  };

  render() {
    return (
      <div
        className={`farm ${
          this.state.component === "shop" ||
          this.state.component === "rating" ||
          (this.state.hidden && this.state.component === "entrance")
            ? "farm-shop-empty"
            : ""
        }`}
      >
        {this.state.component === "shop" && <Shop />}
        {this.state.component === "entrance" && (
          <Entrance onHidden={this.hideBg} />
        )}
        {this.state.component === "dots" && <Dots />}
        {this.state.component === "statistic" && <Statistic />}
        {this.state.component === "rating" && <Rating />}
        {this.state.component === "milk" && <Milk />}
        {this.state.component === "can" && <Can />}
        {this.state.component === "best" && <Best />}
      </div>
    );
  }
}
