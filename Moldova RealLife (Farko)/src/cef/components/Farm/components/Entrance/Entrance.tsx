// Lang file ready
import React, { Component } from "react";

import { FieldOwner } from "./components/FieldOwner";
import { GreenhouseOwner } from "./components/GreenhouseOwner";
import { CattleOwner } from "./components/CattleOwner";

import { FieldWorker } from "./components/FieldWorker";
import { GreenhouseWorker } from "./components/GreenhouseWorker";
import { CattleWorker } from "./components/CattleWorker";

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
const parentPng = Object.fromEntries(
  Object.entries(import.meta.glob("../../assets/*.png", { eager: true })).map(
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

import "../../style.less";
import { CustomEvent } from "../../../../modules/custom.event";
import { EntranceComponent } from "../../../../../shared/farm/dtos";
import {
  ACTIVITY_RENT_TIME_IN_HOURS,
  FarmerLevel,
} from "../../../../../shared/farm/progress.config";
import { systemUtil } from "../../../../../shared/system";
import { GreenhouseReady } from "./components/GreenhouseReady";
import { CattleReady } from "./components/CattleReady";
import { FieldReady } from "./components/FieldReady";
import { CustomEventHandler } from "../../../../../shared/custom.event";
import { CEF } from "../../../../modules/CEF";

export interface IEntranceWorkerData {
  id: number;
  ownerName: string;
  level: FarmerLevel;
  rentTime: [number, number];
  salary: number;
}

const ENTRANCE_COMPONENTS = [
  "FieldOwner",
  "FieldReady",
  "CattleOwner",
  "CattleReady",
  "GreenhouseOwner",
  "GreenhouseReady",
];

export class Entrance extends Component<
  {
    onHidden: (show: boolean) => void;
  },
  {
    id?: number;
    component: EntranceComponent;
    workerData: IEntranceWorkerData;
  }
> {
  _ev1: CustomEventHandler;
  _ev2: CustomEventHandler;
  constructor(props: any) {
    super(props);

    this.state = {
      workerData: {
        id: 0,
        ownerName: "Kirill Perchik",
        level: FarmerLevel.First,
        rentTime: [1, 20],
        salary: 500,
      },
      component: "FieldOwner",
    };

    this._ev1 = CustomEvent.register(
      "farm:entrance:rent",
      (component: EntranceComponent, id: number) => {
        this.setState({
          component,
          id,
        });
      }
    );

    this._ev2 = CustomEvent.register(
      "farm:entrance:worker",
      (
        component: EntranceComponent,
        id: number,
        ownerName: string,
        rentedAt: number,
        salary,
        level: FarmerLevel
      ) => {
        this.setState({
          component,
          workerData: {
            id,
            level,
            rentTime: [
              Math.floor(
                (rentedAt +
                  ACTIVITY_RENT_TIME_IN_HOURS * 3600 -
                  systemUtil.timestamp) /
                  3600
              ),
              Math.floor(
                ((rentedAt +
                  ACTIVITY_RENT_TIME_IN_HOURS * 3600 -
                  systemUtil.timestamp) %
                  3600) /
                  60
              ),
            ],
            ownerName,
            salary,
          },
        });
      }
    );
  }

  close() {
    CEF.gui.setGui(null);
  }

  componentDidMount(): void {
    if (ENTRANCE_COMPONENTS.includes(this.state.component)) {
      this.props.onHidden(true);
    }
  }

  public componentWillUnmount() {
    if (this._ev2) this._ev2.destroy;
    if (this._ev1) this._ev1.destroy;

    this.props.onHidden(false);
  }

  render() {
    return (
      <div className="farmentrance__wrapper">
        <div className="farm-entrance">
          {!ENTRANCE_COMPONENTS.includes(this.state.component) && (
            <>
              <img src={png["logo"]} className="farm-entrance__logo" alt="" />
              <img src={png["dot"]} className="farm-entrance__dot" alt="" />
            </>
          )}
          {ENTRANCE_COMPONENTS.includes(this.state.component) && (
            <>
              <div className="farmentrance__exit">
                Exit
                <div
                  className="farmentrance__exit__btn"
                  onClick={() => this.close()}
                >
                  <img src={png["close"]} alt="" />
                </div>
              </div>
            </>
          )}

          <div className="farm-entrance-block">
            {!ENTRANCE_COMPONENTS.includes(this.state.component) && (
              <img
                src={svg["block"]}
                className="farm-entrance-block__background"
                alt=""
              />
            )}

            {this.state.component === "FieldOwner" && (
              <FieldOwner id={this.state.id} />
            )}
            {this.state.component === "GreenhouseOwner" && (
              <GreenhouseOwner id={this.state.id} />
            )}
            {this.state.component === "CattleOwner" && (
              <CattleOwner id={this.state.id} />
            )}

            {this.state.component === "FieldWorker" && (
              <FieldWorker data={this.state.workerData} />
            )}
            {this.state.component === "GreenhouseWorker" && (
              <GreenhouseWorker data={this.state.workerData} />
            )}
            {this.state.component === "CattleWorker" && (
              <CattleWorker data={this.state.workerData} />
            )}

            {this.state.component === "FieldReady" && <FieldReady />}
            {this.state.component === "CattleReady" && <CattleReady />}
            {this.state.component === "GreenhouseReady" && <GreenhouseReady />}
          </div>
        </div>
      </div>
    );
  }
}
