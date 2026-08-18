import React, { Component } from "react";
import "./style.less";
import { CEF } from "../../../modules/CEF";

const png = Object.fromEntries(
  Object.entries(import.meta.glob("../img/*.png", { eager: true })).map(
    ([key, value]) => {
      const name = key.match(/\/([^/]+)\.png$/)[1];
      return [name, value.default];
    }
  )
);

const rpng = Object.fromEntries(
  Object.entries(import.meta.glob("./assets/*.png", { eager: true })).map(
    ([key, value]) => {
      const name = key.match(/\/([^/]+)\.png$/)[1];
      return [name, value.default];
    }
  )
);

import "../style/style.css";
import { RulettePage } from "./rulette/rulette";
import { system } from "../../../modules/system";

export enum ModalType {
  STANDART = "standart",
  PREMIUM = "premium",
  LUXE = "luxe",
  STORE = "prize-store",
  WINNING = "winning",
}

// Это пример компонента под реакт для быстрого создания уже рабочего экземпляра.
export class DonateRoulette extends Component<
  {
    // show: boolean
    coins: number;
    dollars: number;
    close: any;
  },
  {
    r: boolean;
    type: ModalType;
    isClose: boolean;
    roulettsList: { type: ModalType; cost: number; oldCost: number | null }[];
  }
> {
  public balance = {
    d: system.numberFormat(CEF.user.money),
    c: this.props.coins,
  };
  /** Это наш ивент, через который интерфейс может получать данные от клиента или сервера */
  constructor(props: any) {
    super(props);
    this.state = {
      r: false,
      type: null,
      name: null,
      isClose: true,
      roulettsList: [
        { type: ModalType.STANDART, cost: 100, oldCost: null },
        { type: ModalType.PREMIUM, cost: 135, oldCost: null },
        { type: ModalType.LUXE, cost: 220, oldCost: null },
      ],
      /** По умолчанию используется значение CEF.test. true будет если мы в браузере проверяем интерфейс.*/
    };
  }

  render() {
    return (
      <>
        {this.state.r === false ? (
          <div className="umenu-roulette">
            <div className="umenu-title">RULETA</div>
            <div className="umenu-subtitle">
              Alege-ti tipul de ruleta si învarte roata pentru a castiga premii
              surpriza!
            </div>
            <div className="umenu-items">
              {this.state.roulettsList.map((r) => {
                return (
                  <div className="umenu-ritem">
                    <img src={rpng[r.type]} alt="" />

                    <div className="umenu-ritem-content">
                      <div className="umenu-name-price">
                        <div className="umenu-name">{r.type}</div>
                        <div className="umenu-price">
                          {r.cost}{" "}
                          {r.oldCost !== null && (
                            <span
                              style={{
                                textDecoration: "underline",
                                textUnderlinePosition: "from-font",
                              }}
                            >
                              (- {r.oldCost})
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          this.setState({
                            r: true,
                            type: r.type,
                            isClose: false,
                          })
                        }
                      >
                        Cumpara
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <RulettePage
            backToSelect={() => {
              this.setState({ r: false, type: null });
            }}
            toWinning={(d) => {
              this.setState({ r: true, type: ModalType.WINNING });
              CEF.playSound("roulette-win");
            }}
            type={this.state.type}
            coins={this.props.coins}
            toStorage={() => {
              this.setState({
                r: true,
                type: ModalType.STORE,
                isClose: false,
              });
            }}
            back={() => {
              this.state.isClose === true
                ? this.props.close()
                : this.setState({ r: false, type: null, isClose: true });
            }}
          />
        )}
      </>
    );
  }
}
