import React, { Component } from "react";
import { LangString } from "../../../../../../modules/lang";
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
import {
  ACTIVITY_RENT_COST,
  ACTIVITY_RENT_TIME_IN_HOURS,
} from "../../../../../../../shared/farm/progress.config";
import { systemUtil } from "../../../../../../../shared/system";
import { CustomEvent } from "../../../../../../modules/custom.event";
import "./style.less";

export class FieldOwner extends Component<
  { id: number },
  { containerRef: React.RefObject<HTMLDivElement> }
> {
  constructor(props: any) {
    super(props);

    this.state = {
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
    CustomEvent.triggerServer("farm:rent", this.props.id);
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
          <div className="farmfield__content__infos">
            <div className="farmfield__content__info">
              <div className="farmfield__content__info__icon">
                <img src={png["fieldWorkers"]} alt="" />
              </div>
              <div className="farmfield__content__info__text">
                <span>
                  {LangString(
                    "components.Farm.components.Entrance.components.FieldOwner.FieldOwner.ab220d9dad9e2e85c96bbfce0746a19f"
                  )}
                </span>
                <span>
                  {LangString(
                    "components.Farm.components.Entrance.components.FieldOwner.FieldOwner.ce113e02b72cb4189121243e6d6d066b"
                  )}
                </span>
              </div>
            </div>
            <div className="farmfield__content__info">
              <div className="farmfield__content__info__icon">
                <img src={png["fieldMoney"]} alt="" />
              </div>
              <div className="farmfield__content__info__text">
                <span>
                  {LangString(
                    "components.Farm.components.Entrance.components.FieldOwner.FieldOwner.a31363f648471725728bc8497e90b948"
                  )}
                </span>
                <span>
                  {LangString(
                    "components.Farm.components.Entrance.components.FieldOwner.FieldOwner.bfdf305c72e1047daf63543697a3dd47"
                  )}
                </span>
              </div>
            </div>
          </div>
          <div className="farmfield__content__text">
            {LangString(
              "components.Farm.components.Entrance.components.FieldOwner.FieldOwner.e3593b4cd7319ee0b5823332551546d0"
            )}
          </div>
          <div className="farmfield__content__item">
            <div className="farmfield__content__item__text">Total price</div>
            <div className="farmfield__content__item__price">
              <span>$ {systemUtil.numberFormat(ACTIVITY_RENT_COST)}</span> /{" "}
              {ACTIVITY_RENT_TIME_IN_HOURS}{" "}
              {LangString(
                "components.Farm.components.Entrance.components.FieldOwner.FieldOwner.69b4852e304946cb9c1c90532de5659f"
              )}
            </div>
          </div>
          <div
            className="farmfield__content__button"
            onClick={() => this.startRent()}
          >
            RENT
          </div>
        </div>
      </div>
    );
  }
}

// OLD

// <div className="farm-entrance-block-content">
//   <img
//     src={png["shovel"]}
//     className="farm-entrance-block-content__shovel"
//     alt=""
//   />

//   <div className="farm-entrance-block-content__bigName">
//     {LangString(
//       "components.Farm.components.Entrance.components.FieldOwner.FieldOwner.10c9182950dbd4d2dc4caeb24d447f09"
//     )}
//   </div>

//   <div className="farm-entrance-block-content__name">
//     <div>
//       {LangString(
//         "components.Farm.components.Entrance.components.FieldOwner.FieldOwner.68ccc9fe47cc5df5392c9e13604c17f8"
//       )}
//     </div>
//     <span>
//       {LangString(
//         "components.Farm.components.Entrance.components.FieldOwner.FieldOwner.f86dde574ee51aa21183dea8805c9b72"
//       )}
//     </span>
//   </div>

//   <div className="farm-entrance-block-content__plan">
//     <img src={svg["check"]} alt="" />
//     <span>
//       {LangString(
//         "components.Farm.components.Entrance.components.FieldOwner.FieldOwner.ab220d9dad9e2e85c96bbfce0746a19f"
//       )}{" "}
//       <br />{" "}
//       {LangString(
//         "components.Farm.components.Entrance.components.FieldOwner.FieldOwner.ce113e02b72cb4189121243e6d6d066b"
//       )}
//     </span>
//     <img src={svg["coin"]} alt="" />
//     <span>
//       {LangString(
//         "components.Farm.components.Entrance.components.FieldOwner.FieldOwner.a31363f648471725728bc8497e90b948"
//       )}{" "}
//       <br />{" "}
//       {LangString(
//         "components.Farm.components.Entrance.components.FieldOwner.FieldOwner.bfdf305c72e1047daf63543697a3dd47"
//       )}
//     </span>
//   </div>

//   <div className="farm-entrance-block-content__title">
//     {LangString(
//       "components.Farm.components.Entrance.components.FieldOwner.FieldOwner.e3593b4cd7319ee0b5823332551546d0"
//     )}
//   </div>

//   <div className="farm-entrance-block-content__button">
//     <div onClick={() => this.startRent()}>RENT</div>
//     <span>$ {systemUtil.numberFormat(ACTIVITY_RENT_COST)}</span>
//     <p>
//       / {ACTIVITY_RENT_TIME_IN_HOURS}{" "}
//       {LangString(
//         "components.Farm.components.Entrance.components.FieldOwner.FieldOwner.69b4852e304946cb9c1c90532de5659f"
//       )}
//     </p>
//   </div>
// </div>
