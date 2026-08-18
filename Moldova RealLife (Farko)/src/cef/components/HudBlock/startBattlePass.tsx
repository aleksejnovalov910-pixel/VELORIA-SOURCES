import "./startBattlePass.less";
import React, { Component } from "react";
import CloseBonus from "./images/svg/CloseBonus";
import TimeBonus from "./images/svg/TimeBonus";
import { CustomEvent } from "../../modules/custom.event";
import { CustomEventHandler } from "../../../shared/custom.event";
import { systemUtil } from "../../../shared/system";

export class HudStartBattlePass extends Component<
  {},
  {
    show: boolean;
    player?: string;
    time: number;
  }
> {
  ev: CustomEventHandler;
  mgTime: NodeJS.Timeout;
  constructor(props: any) {
    super(props);

    this.state = {
      show: true,
      time: 600,
      player: "Player Name",
    };
    this.ev = CustomEvent.register(
      "hud:gamebox",
      (show: boolean, player?: string, time?: number) => {
        this.setState({ ...this.state, show, player, time });
        this.updateGameBox();
      }
    );
    this.updateGameBox();
  }

  updateGameBox = () => {
    if (this.mgTime) clearInterval(this.mgTime);
    this.mgTime = setInterval(() => {
      if (this.state.time > 0)
        this.setState({ ...this.state, time: this.state.time - 1 });
      else this.hideGame();
    }, 1000);
  };

  componentWillUnmount() {
    if (this.ev) this.ev.destroy();
    if (this.mgTime) clearInterval(this.mgTime);
  }

  hideGame = () => {
    if (this.mgTime) clearInterval(this.mgTime);
    this.setState({ time: 0, show: false });
  };

  render() {
    if (!this.state.show) return <></>;
    return (
      <>
        <div className="hud-startBattlePass">
          <div className="hud-startBattlePass-close" onClick={this.hideGame}>
            <CloseBonus />
          </div>
          <span>battle pass starts in</span>
          <div className="hud-startBattlePass-time">
            <TimeBonus />
            <span>{systemUtil.secondsToString(this.state.time)}</span>
          </div>
        </div>
      </>
    );
  }
}
