import React, { Component } from "react";
import { CustomEvent } from "../../../../modules/custom.event";
import "./rulette.less";
import { CEF } from "../../../../modules/CEF";
import { CustomEventHandler } from "../../../../../shared/custom.event";
const png = Object.fromEntries(
  Object.entries(import.meta.glob("./assets/*.png", { eager: true })).map(
    ([key, value]) => {
      const name = key.match(/\/([^/]+)\.png$/)[1];
      return [name, value.default];
    }
  )
);
const svg = Object.fromEntries(
  Object.entries(import.meta.glob("./../assets/*.svg", { eager: true })).map(
    ([key, value]) => {
      const name = key.match(/\/([^/]+)\.svg$/)[1];
      return [name, value.default];
    }
  )
);

import "../../style/style.css";
import { ModalType } from "../donate-roulette";
import { SpinnerPage } from "./spinner/spinner";
import { StoragePage } from "./storage/storage";
import { WinningPage } from "./winning/winning";
import { DropDataBase } from "../../../../../shared/donate/donate-roulette/Drops/dropBase";

// Это пример компонента под реакт для быстрого создания уже рабочего экземпляра.
export class RulettePage extends Component<
  {
    type: string;
    backToSelect(): void;
    toWinning(drop: DropDataBase[]): void;
    coins: number;
    toStorage(): void;
    back(): void;
  },
  {
    winElements: DropDataBase[];
  }
> {
  private _mounted: boolean;
  /** Это наш ивент, через который интерфейс может получать данные от клиента или сервера */
  constructor(props: any) {
    super(props);
    this.state = {
      winElements: [],
      /** По умолчанию используется значение CEF.test. true будет если мы в браузере проверяем интерфейс.*/
    };
    this._mounted = false;
  }

  componentDidMount() {
    this._mounted = true;
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  render() {
    return (
      <>
        <div className="umenu-roulette">
          {this.props.type === ModalType.STANDART ||
          this.props.type === ModalType.PREMIUM ||
          this.props.type === ModalType.LUXE ? (
            <SpinnerPage
              type={this.props.type}
              spinFinished={(drop) => {
                if (!this._mounted) return;
                this.setState({ winElements: drop });
                this.props.toWinning(drop);
              }}
              coins={this.props.coins}
              toStorage={this.props.toStorage}
              back={this.props.back}
            />
          ) : (
            <>
              {this.props.type === ModalType.STORE ? (
                <StoragePage back={this.props.back} />
              ) : (
                <WinningPage
                  coins={this.props.coins}
                  displayDrops={this.state.winElements}
                  takePressed={this.props.backToSelect}
                  toStorage={this.props.toStorage}
                />
              )}
            </>
          )}
        </div>
      </>
    );
  }
}
