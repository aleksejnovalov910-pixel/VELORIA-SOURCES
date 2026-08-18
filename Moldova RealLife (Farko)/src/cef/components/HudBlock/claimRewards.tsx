import "./claimRewards.less";
import React, { Component } from "react";
import { CustomEvent } from "../../modules/custom.event";
import type { CustomEventHandler } from "../../../shared/custom.event";
import rewardStars from "./images/rewardStars.png";
export class HudClaimRewards extends Component<
  // biome-ignore lint/complexity/noBannedTypes: <explanation>
  {},
  {
    show: boolean;
    player?: string;
  }
> {
  ev: CustomEventHandler;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  constructor(props: any) {
    super(props);

    this.state = {
      show: true,
    };
    this.ev = CustomEvent.register("hud:gamebox", (show: boolean) => {
      this.setState({ ...this.state, show });
    });
  }

  componentWillUnmount() {
    if (this.ev) this.ev.destroy();
  }

  hideGame = () => {
    this.setState({ show: false });
  };

  render() {
    if (!this.state.show) return <></>;
    return (
      <div className="hud-claimRewards">
        <img src={rewardStars} alt="rewardStars" />
        CLAIM FREE REWARD
        <span>For every 2 hour played</span>
      </div>
    );
  }
}
