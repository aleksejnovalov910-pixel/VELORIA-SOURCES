import "./boxgame.less";
import React, { Component } from "react";
import { CustomEvent } from "../../modules/custom.event";
import { CustomEventHandler } from "../../../shared/custom.event";
import { systemUtil } from "../../../shared/system";
import CloseBonus from "./images/svg/CloseBonus";
import TimeBonus from "./images/svg/TimeBonus";
import { LangString, currentLang } from "../../modules/lang";
import closeBag from "./images/svg/close-bag.svg";

enum GameBoxType {
  START = 1,
  GET,
  FINISH,
}

export class HudMoneyGame extends Component<
  {},
  {
    type: GameBoxType;
    player?: string;
    time?: number;
  }
> {
  ev: CustomEventHandler;
  mgTime: NodeJS.Timeout;
  constructor(props: any) {
    super(props);

    this.state = {
      type: null,//GameBoxType.FINISH,
      //            time: 600,
      //            player: 'Player Name'

    };
    this.ev = CustomEvent.register(
      "hud:gamebox",
      (type: GameBoxType, player?: string, time?: number) => {
        this.setState({ ...this.state, type, player, time });
        this.updateGameBox(type);
      }
    );
    //        this.updateGameBox( this.state.type );
  }

  updateGameBox = (type: GameBoxType) => {
    if (type == GameBoxType.START) {
      if (this.mgTime) clearInterval(this.mgTime);
      this.mgTime = setInterval(() => {
        if (this.state.time > 0)
          this.setState({ ...this.state, time: this.state.time - 1 });
        else this.hideGame();
      }, 1000);
    } else if (type == GameBoxType.FINISH) {
      if (this.mgTime) clearInterval(this.mgTime);
      setTimeout(() => {
        this.hideGame();
      }, 5000);
    }
  };

  componentWillUnmount() {
    if (this.ev) this.ev.destroy();
    if (this.mgTime) clearInterval(this.mgTime);
  }
  hideGame = () => {
    if (this.mgTime) clearInterval(this.mgTime);
    this.setState({ time: 0, type: null });
  };

  formatMessage() {
    switch (this.state.type) {
      case GameBoxType.START: {
        return (
          <>
            <span>
            {LangString("components.HudBlock.boxgame.29fa636b20986971c33d58721d39bfc2")}
            {LangString("components.HudBlock.boxgame.788a7ed8b5b487f4afd2083bec09eebb")}
            </span>
          </>
        );
      }
      case GameBoxType.GET: {
        return (
          <>
            <span>
            {LangString("components.HudBlock.boxgame.899d6aaf071afb917ec97e0d9bd6d9b4")}{" "}
              <span style={{ fontWeight: "900" }}>{this.state.player}</span>
            </span>
          </>
        );
      }
      case GameBoxType.FINISH: {
        return (
          <>
            <span>
            {LangString("components.HudBlock.boxgame.22154fab7e94858791fadc3127d5ade6")}
            </span>
          </>
        );
      }
      default:
        return null;
    }
  }

  render() {
    if (!this.state.type) return <></>;
    return (
      <>
        <div className="hud-bonusSumka">
          <div className="hud-bonusSumka-close" onClick={this.hideGame}>
            <img src={closeBag} alt="close" />
          </div>
          <span>{this.formatMessage()}</span>
          <div className="hud-bonusSumka-time">
            <TimeBonus />
            <span>{systemUtil.secondsToString(this.state.time)}</span>
          </div>
        </div>
      </>
    );
  }
}
