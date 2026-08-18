import { LangString } from "../../modules/lang";
import React, { Component } from "react";
import "./style.less";

import { CustomEvent } from "../../modules/custom.event";
const svg = Object.fromEntries(
  Object.entries(
    import.meta.glob("./../LSCnew/assets/*.svg", { eager: true })
  ).map(([key, value]) => {
    const name = key.match(/\/([^/]+)\.svg$/)[1];
    return [name, value.default];
  })
);

const png = Object.fromEntries(
  Object.entries(import.meta.glob("./assets/*.png", { eager: true })).map(
    ([key, value]) => {
      const name = key.match(/\/([^/]+)\.png$/)[1];
      return [name, value.default];
    }
  )
);

import { systemUtil } from "../../../shared/system";
import { fuelTypeNames, VEHICLE_FUEL_TYPE } from "../../../shared/vehicles";
import { CEF } from "../../modules/CEF";

interface LSCState {
  name: string;
  owner: string;
  price: number;
  fuel: number;
  fuelType: VEHICLE_FUEL_TYPE;
  plate: string;
  bag: number;
  tuning: { id: number; name: string }[];
  inputPrice: number;
  pos: number;
  containerRef: React.RefObject<HTMLDivElement>;
}

export class BuyCar extends Component<any, LSCState> {
  ev: import("../../../shared/custom.event").CustomEventHandler;
  constructor(props: any) {
    super(props);

    this.state = {
      name: "BMW 5",
      owner: "Admin",
      price: 9999999999,
      fuel: 80,
      fuelType: VEHICLE_FUEL_TYPE.A95,
      plate: "x779yy",
      bag: 100,
      tuning: [
        {
          id: 1,
          name: LangString(
            "components.Buycar.index.9ffd0ee053e71d82e392077e48b7050e"
          ),
        },
        {
          id: 2,
          name: LangString(
            "components.Buycar.index.2a884ff4f4a44d6aed34feba0c65fc30"
          ),
        },
      ],
      inputPrice: 0,
      pos: 0,
      containerRef: React.createRef<HTMLDivElement>(),
    };

    this.ev = CustomEvent.register("buycar:show", (data: LSCState) => {
      this.setState({ ...data });
    });
  }
  componentDidMount = () => {
    this.adjustZoom();
    window.addEventListener("resize", this.adjustZoom);
  };
  componentWillUnmount = () => {
    window.removeEventListener("resize", this.adjustZoom);
    if (this.ev) this.ev.destroy();
  };

  adjustZoom = () => {
    const container = this.state.containerRef.current;
    if (container) {
      const zoomCountOne = window.innerWidth / 1920;
      const zoomCountTwo = window.innerHeight / 1080;

      if (zoomCountOne < zoomCountTwo) {
        container.style.zoom = zoomCountOne.toString();
      } else {
        container.style.zoom = zoomCountTwo.toString();
      }
    }
  };

  buycar = () => {
    if (!this.state.price) {
      CustomEvent.triggerServer(
        "vehicle:sell:place",
        this.state.pos,
        this.state.inputPrice
      );
    } else {
      CustomEvent.triggerServer(
        "vehicle:sell:buy",
        this.state.pos,
        this.state.price
      );
    }
    CEF.gui.setGui(null);
  };

  buycarFamily = () => {
    if (this.state.price) {
      CustomEvent.triggerServer(
        "vehicle:sell:buy",
        this.state.pos,
        this.state.price,
        true
      );
    }
    CEF.gui.setGui(null);
  };

//   render = () => {
//     return (
//       <>
//         <div className="buycar">
//           <div className="buycar__bg">
//           </div>
//           <div className="buycar__box" ref={this.state.containerRef}>
//             <div className="buycar__main">
//               <div className="buycar__top">
//                 <img className="buycar__top-img-3" src={png["3"]} alt="" />
//                 <img className="buycar__top-img-2" src={png["2"]} alt="" />
//                 <img className="buycar__top-img-1" src={png["1"]} alt="" />
//                 <div className="buycar__top-car-img">
//                   <img src={png["car"]} alt="" />
//                 </div>
//                 <div className="buycar__top-details">
//                   <h1>{this.state.name}</h1>
//                   <div className="owner buycar__item">
//                     <div className="buycar__item-img">
//                       <img src={png["owner"]} alt="" />
//                     </div>
//                     <h2>
//                       Owner <span>{this.state.owner}</span>
//                     </h2>
//                   </div>
//                   <div className="car-number buycar__item">
//                     <div className="buycar__item-img">
//                       <img src={png["plate"]} alt="" />
//                     </div>
//                     <h2>
//                       Car number <span>{this.state.plate}</span>
//                     </h2>
//                   </div>
//                 </div>
//               </div>
//               <div className="buycar__content">
//                 <div className="buycar__content-information">
//                   <h1>Informatie</h1>
//                   <div className="buycar__content-informations">
//                     <div className="buycar__content__info buycar__item">
//                       <div className="buycar__item-img">
//                         <img src={png["element-0"]} alt="" />
//                       </div>
//                       <h2>
//                         Fuel capacity{" "}
//                         <span>
//                           {this.state.fuel}
//                           {this.state.fuelType === VEHICLE_FUEL_TYPE.ELECTRO
//                             ? "kW"
//                             : "L"}
//                         </span>
//                       </h2>
//                     </div>
//                     <div className="buycar__content__info buycar__item">
//                       <div className="buycar__item-img">
//                         <img src={png["element-1"]} alt="" />
//                       </div>
//                       <h2>
//                         Type of fuel{" "}
//                         <span>{fuelTypeNames[this.state.fuelType]}</span>
//                       </h2>
//                     </div>
//                     <div className="buycar__content__info buycar__item">
//                       <div className="buycar__item-img">
//                         <img src={png["element-2"]} alt="" />
//                       </div>
//                       <h2>
//                         Trunk size <span>{this.state.bag}</span>
//                       </h2>
//                     </div>
//                     <div className="buycar__content__info buycar__item">
//                       <div className="buycar__item-img">
//                         <img src={png["element-3"]} alt="" />
//                       </div>
//                       <h2>
//                         Cost{" "}
//                         {this.state.price ? (
//                           <span>
//                             $ {systemUtil.numberFormat(this.state.price)}
//                           </span>
//                         ) : (
//                           <input
//                             type="text"
//                             placeholder="select a cost..."
//                             value={
//                               this.state.inputPrice ? this.state.inputPrice : ""
//                             }
//                             onChange={(e) => {
//                               if (
//                                 /^\d{1,10}$/.test(e.target.value) == true ||
//                                 !e.target.value.length
//                               )
//                                 this.setState({
//                                   ...this.state,
//                                   inputPrice: Number(e.target.value),
//                                 });
//                             }}
//                           />
//                         )}
//                       </h2>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="buycar__additions">
//                   <h1>Additions</h1>
//                   <div className="buycar__additions-items">
//                     {this.state.tuning.map((data, idx) => {
//                       return (
//                         <div
//                           className="buycar__additions-item buycar__item"
//                           key={idx}
//                         >
//                           <div className="buycar__item-img">
//                             <img src={svg[`tuning-item-${data.id}`]} alt="" />
//                           </div>
//                           <h2>
//                             <span>{data.name}</span>
//                           </h2>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//               </div>
//               <div className="buycar__controls">
//                 {this.state.price ? (
//                   <>
//                     <button
//                       type="button"
//                       className="buycar__buy"
//                       onClick={this.buycar}
//                     >
//                       Buy
//                     </button>
//                     <button
//                       type="button"
//                       className="buycar__buy-family"
//                       onClick={this.buycarFamily}
//                     >
//                       Buy for family
//                     </button>
//                   </>
//                 ) : (
//                   <button
//                     type="button"
//                     className="buycar__sell"
//                     onClick={this.buycar}
//                   >
//                     Sell
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </>
//     );
//   };
// }
render = () => {
    return (
      <>
        <div className="buycar">
          <div className="buycar__bg">
          </div>
          <div className="buycar__box" ref={this.state.containerRef}>
            <div className="buycar__main">
              <div className="buycar__top">
                <img className="buycar__top-img-3" src={png["3"]} alt="" />
                <img className="buycar__top-img-2" src={png["2"]} alt="" />
                <img className="buycar__top-img-1" src={png["1"]} alt="" />
                <div className="buycar__top-car-img">
                  <img src={png["car"]} alt="" />
                </div>
                <div className="buycar__top-details">
                  <h1>{this.state.name}</h1>
                  <div className="owner buycar__item">
                    <div className="buycar__item-img">
                      <img src={png["owner"]} alt="" />
                    </div>
                    <h2>
                      Proprietar <span>{this.state.owner}</span>
                    </h2>
                  </div>
                  <div className="car-number buycar__item">
                    <div className="buycar__item-img">
                      <img src={png["plate"]} alt="" />
                    </div>
                    <h2>
                      Numar masina <span>{this.state.plate}</span>
                    </h2>
                  </div>
                </div>
              </div>
              <div className="buycar__content">
                <div className="buycar__content-information">
                  <h1>Informatii</h1>
                  <div className="buycar__content-informations">
                    <div className="buycar__content__info buycar__item">
                      <div className="buycar__item-img">
                        <img src={png["element-0"]} alt="" />
                      </div>
                      <h2>
                        Capacitate combustibil{" "}
                        <span>
                          {this.state.fuel}
                          {this.state.fuelType === VEHICLE_FUEL_TYPE.ELECTRO
                            ? "kW"
                            : "L"}
                        </span>
                      </h2>
                    </div>
                    <div className="buycar__content__info buycar__item">
                      <div className="buycar__item-img">
                        <img src={png["element-1"]} alt="" />
                      </div>
                      <h2>
                        Tip combustibil{" "}
                        <span>{fuelTypeNames[this.state.fuelType]}</span>
                      </h2>
                    </div>
                    <div className="buycar__content__info buycar__item">
                      <div className="buycar__item-img">
                        <img src={png["element-2"]} alt="" />
                      </div>
                      <h2>
                        Marime portbagaj <span>{this.state.bag}</span>
                      </h2>
                    </div>
                    <div className="buycar__content__info buycar__item">
                      <div className="buycar__item-img">
                        <img src={png["element-3"]} alt="" />
                      </div>
                      <h2>
                        Pret{" "}
                        {this.state.price ? (
                          <span>
                            $ {systemUtil.numberFormat(this.state.price)}
                          </span>
                        ) : (
                          <input
                            type="text"
                            placeholder="selecteaza un pret..."
                            value={
                              this.state.inputPrice ? this.state.inputPrice : ""
                            }
                            onChange={(e) => {
                              if (
                                /^\d{1,10}$/.test(e.target.value) == true ||
                                !e.target.value.length
                              )
                                this.setState({
                                  ...this.state,
                                  inputPrice: Number(e.target.value),
                                });
                            }}
                          />
                        )}
                      </h2>
                    </div>
                  </div>
                </div>

                <div className="buycar__additions">
                  <h1>Tuning</h1>
                  <div className="buycar__additions-items">
                    {this.state.tuning.map((data, idx) => {
                      return (
                        <div
                          className="buycar__additions-item buycar__item"
                          key={idx}
                        >
                          <div className="buycar__item-img">
                            <img src={svg[`tuning-item-${data.id}`]} alt="" />
                          </div>
                          <h2>
                            <span>{data.name}</span>
                          </h2>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="buycar__controls">
                {this.state.price ? (
                  <>
                    <button
                      type="button"
                      className="buycar__buy"
                      onClick={this.buycar}
                    >
                      Cumpara
                    </button>
                    <button
                      type="button"
                      className="buycar__buy-family"
                      onClick={this.buycarFamily}
                    >
                      Cumpara pentru familie
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="buycar__sell"
                    onClick={this.buycar}
                  >
                    Vinde
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
};
}