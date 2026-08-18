import { LangString } from "../../modules/lang";
import React from "react";
import "./assets/style.less";
import "./../Personage/assets/pers.less";
import { CEF } from "../../modules/CEF";
import { CustomEvent } from "../../modules/custom.event";
import { CustomEventHandler } from "../../../shared/custom.event";
import exitsvg from "./../IdCard/assets/exit.svg";
import check from "./../ClothShop/assets/check.svg";
const svg = Object.fromEntries(
  Object.entries(
    import.meta.glob("./../Personage/assets/*.svg", { eager: true })
  ).map(([key, value]) => {
    const name = key.match(/\/([^/]+)\.svg$/)[1];
    return [name, value.default];
  })
);
import personage, { colors, Ranges } from "./../Personage/config";
import { AddSlider, sliders } from "../Personage/Slider";
const hairsf = Object.fromEntries(
  Object.entries(
    import.meta.glob("./../Personage/assets/hairs/female/*.jpg", {
      eager: true,
    })
  ).map(([key, value]) => {
    const name = key.match(/\/([^/]+)\.jpg$/)[1];
    return [name, value.default];
  })
);
const hairsm = Object.fromEntries(
  Object.entries(
    import.meta.glob("./../Personage/assets/hairs/male/*.jpg", { eager: true })
  ).map(([key, value]) => {
    const name = key.match(/\/([^/]+)\.jpg$/)[1];
    return [name, value.default];
  })
);
import {
  BarberData,
  getComponentCost,
  nailsConfig,
} from "../../../shared/barbershop";
const nailsPictures = Object.fromEntries(
  Object.entries(import.meta.glob("./assets/nails/*.png", { eager: true })).map(
    ([key, value]) => {
      const name = key.match(/\/([^/]+)\.png$/)[1];
      return [name, value.default];
    }
  )
);

const icons = Object.fromEntries(
  Object.entries(import.meta.glob("./assets/*.svg", { eager: true })).map(
    ([key, value]) => {
      const name = key.match(/\/([^/]+)\.svg$/)[1];
      return [name, value.default];
    }
  )
);
const png = Object.fromEntries(
  Object.entries(import.meta.glob("./assets/*.png", { eager: true })).map(
    ([key, value]) => {
      const name = key.match(/\/([^/]+)\.png$/)[1];
      return [name, value.default];
    }
  )
);

const hairs = [hairsm, hairsf];

const enum params {
  BROW,
  BROWOPACITY,
  COLOR_BROWS,
  BEARD,
  BEARDOPACITY,
  COLOR_BEARD,
  HAIR,
  COLOR_HAIR1,
  COLOR_HAIR2,
  EYE_COLOR,
  LIPS,
  LIPS_OPACITY,
  LIPS_COLOR,
  MAKEUP,
  MAKEUP_OPACITY,
  MAKEUP_COLOR,
  BLUSH,
  BLUSH_OPACITY,
  BLUSH_COLOR,
  NAILS,
}
const enum page_hair {
  HAIR = 0,
  BROWS,
  BEARD,
  LIPS,
  NAILS,
}

export const defaultParam = {
  lips: 0,
  lipsOpacity: 0,
  lipsColor: 0,
  makeup: 0,
  makeupOpacity: 0,
  makeupColor: 0,
  subpage: 0,
  hair: 0,
  hairColor: 0,
  hairColor2: 0,
  eyebrows: 0,
  eyecolor: 0,
  eyebrowsColor: 0,
  eyebrowOpacity: 0.5,
  beard: 0,
  beardColor: 0,
  beardOpacity: 0.5,
  blush: 0,
  blushOpacity: 0.0,
  blushColor: 0.0,
  nails: -1,
};

export interface BarberType extends BarberData {
  id: number;
  show: boolean;
  subpage: number;
  old_params: Partial<BarberData>;
  old_data: [params, number][];
  data: { item: number; price: number; count: number; max_count: number }[];
}
export class BarberShop extends React.Component<{}, BarberType> {
  ev: CustomEventHandler;
  constructor(props: any) {
    super(props);
    this.state = {
      data: [],
      id: 0,
      show: true,
      sex: 0,
      ...defaultParam,
      old_params: {},
      old_data: [],
    };
    this.ev = CustomEvent.register(
      "barbershop:load",
      (data: BarberData, dataCatalog: any, id: number) => {
        this.setState({
          ...this.state,
          ...data,
          old_params: data,
          id,
          data: dataCatalog,
        });
      }
    );
    if (CEF.test) {
      setTimeout(() => {
        this.setState({
          old_params: {
            hair: 0,
            hairColor: 0,
            hairColor2: 0,
            eyebrows: 0,
            eyecolor: 0,
            eyebrowsColor: 0,
            eyebrowOpacity: 0.5,
            beard: 0,
            beardColor: 0,
            beardOpacity: 0.5,
          },
        });
      }, 500);
    }
  }

  get male() {
    return this.state.sex === 0;
  }
  get female() {
    return !this.male;
  }

  getOldParamValue(key: keyof BarberData) {
    return this.state.old_params[key];
  }
  get changedData() {
    let ret: Partial<BarberData> = {};
    for (let keys in defaultParam) {
      let key: keyof typeof defaultParam = keys as any;
      if (this.state[key] != this.getOldParamValue(key as keyof BarberData))
        ret[key as keyof BarberData] = this.state[key];
    }

    return ret;
  }
  get finalySum() {
    const changed = this.changedData;
    let sum = 0;
    for (let key in changed) {
      if (key != "subpage")
        sum += getComponentCost(key as keyof BarberData, this.state.data);
    }
    return sum;
  }

  clickBuy = () => {
    const data = this.changedData;
    CustomEvent.triggerServer("barbershop:buy", data, this.state.id);
    // this.close(); // 🔹 închide CEF imediat după cumpărare
  };
  componentWillUnmount = () => {
    if (this.ev) this.ev.destroy();
  };
  componentDidMount = () => {};
  closeMenu = () => {
    this.setState({ ...this.state, show: false });
  };
  close(): void {
      CEF.playSound("exitmagazin");
      CEF.gui.setGui(null);
      CustomEvent.triggerClient("barber:close"); // trimite către client
  };

  setAppearance = (type: string, value: number) => {
    mp.trigger("client:user:personage:eventManager", type, value);
  };
  getName = (type: page_hair) => {
    // Mehrwert schaffen
    switch (type) {
      case page_hair.HAIR:
        return LangString(
          "components.BarberShop.BarberShop.789e5c62ead4151bc6db26b3876ce6ab"
        );
      case page_hair.BROWS:
        return LangString(
          "components.BarberShop.BarberShop.4c08ae3b4a775cba6c85ae5dc49a5c56"
        );
      case page_hair.BEARD:
        return LangString(
          "components.BarberShop.BarberShop.8b4bef5a8e9a060c3de9e9f780426dca"
        );
    }
  };

  setOldParam(type: params, value: number) {
    if (this.state.old_data.find((q) => q[0] === type)) return;
    this.setState({ old_data: [...this.state.old_data, [type, value]] });
  }

  setParam = (type: params, value: number) => {
    switch (type) {
      case params.EYE_COLOR: {
        this.setOldParam(type, this.state.old_params.eyecolor);
        this.setState((state) => {
          return { ...state, eyecolor: value };
        });
        return this.setAppearance("eyeColor", value);
      }
      case params.HAIR: {
        this.setOldParam(type, this.state.old_params.hair);
        this.setState((state) => {
          return { ...state, hair: value };
        });
        this.setAppearance("hair", value);
        this.setAppearance("hairColor", this.state.hairColor);
        this.setAppearance("hairColor2", this.state.hairColor2);
        return;
      }
      case params.COLOR_HAIR1: {
        this.setOldParam(type, this.state.old_params.hairColor);
        this.setState((state) => {
          return { ...state, hairColor: value };
        });
        return this.setAppearance("hairColor", value);
      }
      case params.COLOR_HAIR2: {
        this.setOldParam(type, this.state.old_params.hairColor2);
        this.setState((state) => {
          return { ...state, hairColor2: value };
        });
        return this.setAppearance("hairColor2", value);
      }
      case params.BROWOPACITY: {
        this.setOldParam(type, this.state.old_params.eyebrowOpacity);
        this.setState((state) => {
          return { ...state, eyebrowOpacity: value };
        });
        return this.setAppearance("eyebrowsOpacity", value);
      }
      case params.BROW: {
        this.setOldParam(type, this.state.old_params.eyebrows);
        this.setState((state) => {
          return { ...state, eyebrows: value };
        });
        return this.setAppearance("eyebrows", value);
      }
      case params.COLOR_BROWS: {
        this.setOldParam(type, this.state.old_params.eyebrowsColor);
        this.setState((state) => {
          return { ...state, eyebrowsColor: value };
        });
        return this.setAppearance("eyebrowsColor", value);
      }
      case params.BEARD: {
        this.setOldParam(type, this.state.old_params.beard);
        this.setState((state) => {
          return { ...state, beard: value };
        });
        return this.setAppearance("beard", value);
      }
      case params.BEARDOPACITY: {
        this.setOldParam(type, this.state.old_params.beardOpacity);
        this.setState((state) => {
          return { ...state, beardOpacity: value };
        });
        return this.setAppearance("beardOpacity", value);
      }
      case params.COLOR_BEARD: {
        this.setOldParam(type, this.state.old_params.beardColor);
        this.setState((state) => {
          return { ...state, beardColor: value };
        });
        return this.setAppearance("beardColor", value);
      }
      case params.LIPS: {
        this.setOldParam(type, this.state.old_params.lips);
        this.setState((state) => {
          return { ...state, lips: value };
        });
        return this.setAppearance("lips", value);
      }
      case params.LIPS_OPACITY: {
        this.setOldParam(type, this.state.old_params.lipsOpacity);
        this.setState((state) => {
          return { ...state, lipsOpacity: value };
        });
        return this.setAppearance("lipsOpacity", value);
      }
      case params.LIPS_COLOR: {
        this.setOldParam(type, this.state.old_params.lipsColor);
        this.setState((state) => {
          return { ...state, lipsColor: value };
        });
        return this.setAppearance("lipsColor", value);
      }

      case params.MAKEUP: {
        this.setOldParam(type, this.state.old_params.makeup);
        this.setState((state) => {
          return { ...state, makeup: value };
        });
        return this.setAppearance("makeup", value);
      }
      case params.MAKEUP_OPACITY: {
        this.setOldParam(type, this.state.old_params.makeupOpacity);
        this.setState((state) => {
          return { ...state, makeupOpacity: value };
        });
        return this.setAppearance("makeupOpacity", value);
      }
      case params.MAKEUP_COLOR: {
        this.setOldParam(type, this.state.old_params.makeupColor);
        this.setState((state) => {
          return { ...state, makeupColor: value };
        });
        return this.setAppearance("makeupColor", value);
      }

      case params.BLUSH: {
        this.setOldParam(type, this.state.old_params.blush);
        this.setState((state) => {
          return { ...state, blush: value };
        });
        return this.setAppearance("blush", value);
      }
      case params.BLUSH_OPACITY: {
        this.setOldParam(type, this.state.old_params.blushOpacity);
        this.setState((state) => {
          return { ...state, blushOpacity: value };
        });
        return this.setAppearance("blushOpacity", value);
      }
      case params.BLUSH_COLOR: {
        this.setOldParam(type, this.state.old_params.blushColor);
        this.setState((state) => {
          return { ...state, blushColor: value };
        });
        return this.setAppearance("blushColor", value);
      }

      case params.NAILS: {
        this.setOldParam(type, this.state.old_params.nails);
        this.setState((state) => {
          return { ...state, nails: value };
        });
        return this.setAppearance("nails", value);
      }
    }
  };
  setSubPage = (subpage: number) => {
    this.setState({ ...this.state, subpage });
    mp.trigger("barbershop::subPageChanged", subpage);
  };

  // render() {
  //   const changed = !!this.finalySum;
  //   return (
  //     <>
  //       <div
  //         className="barbershop"
  //       >
  //         <div className="barbershop_box">
  //           <div className="barbershop__top">
  //             <div className="barbershop__top__title">
  //               <h1>
  //                 <span>BARBERSHOP</span>
  //               </h1>
  //               <p>Lorem ipsum dolor sit amet, consectetur adipiscing</p>
  //             </div>
  //             <div
  //               className="barbershop__top__exit"
  //               onClick={() => this.close()}
  //             >
  //               <p>Exit</p>
  //               <div className="barbershop__top__exit__img">
  //                 <img src={icons["exit"]} alt="Exit" />
  //               </div>
  //             </div>
  //           </div>
  //           <div className="barbershop__box">
  //             {this.PageDataHair()}

  //             {/* <div>
  //               <h1>${this.finalySum}</h1>
  //               <h2>
  //                 {LangString(
  //                   "components.BarberShop.BarberShop.ea7bb3ad6be8769013229abc973ee6c4"
  //                 )}
  //               </h2>
  //             </div> */}

  //             <div className="barbershop__price">
  //               <div className="barbershop__price__top">
  //                 <h1>Total Price:</h1>
  //                 <h2>$ {this?.finalySum || 0}</h2>
  //               </div>
  //               <button
  //                 className="barbershop__price__btn"
  //                 type="button"
  //                 onClick={this.clickBuy}
  //               >
  //                 Buy
  //               </button>
  //             </div>
  //             {/* <div
  //                   className="barbershop_key reset"
  //                   onClick={(e) => {
  //                     e.preventDefault();
  //                     const d = [...this.state.old_data];
  //                     d.map(([type, value]) => {
  //                       this.setParam(type, value);
  //                     });
  //                     this.setState({ old_data: [] });
  //                   }}
  //                 >
  //                   <img src={exitsvg} />
  //                   {LangString(
  //                     "components.BarberShop.BarberShop.4fc99f001b2cb24aacb3da6c0437dade"
  //                   )}
  //                 </div>
  //                 <div className="barbershop_key" onClick={this.clickBuy}>
  //                   <img src={check} />
  //                   {LangString(
  //                     "components.BarberShop.BarberShop.434b0d1296c2bd418757ccf112eca30f"
  //                   )}
  //                 </div> */}
  //             {/* </> */}
  //           </div>
  //           {/* ) : (
  //               <></>
  //             )} */}
  //         </div>
  //       </div>
  //     </>
  //   );
  // }
  render() {
  const changed = !!this.finalySum;
  return (
    <>
      <div className="barbershop">
        <div className="barbershop_box">
          <div className="barbershop__top">
            <div className="barbershop__top__title">
              <h1>
                <span>BARBERSHOP</span>
              </h1>
              <p>Personalizeaza-ti aspectul si alege un stil unic pentru personajul tau</p>
            </div>
            <div
              className="barbershop__top__exit"
              onClick={() => this.close()}
            >
              <p>Exit</p>
              <div className="barbershop__top__exit__img">
                <img src={icons["exit"]} alt="Iesire" />
              </div>
            </div>
          </div>
          <div className="barbershop__box">
            {this.PageDataHair()}

            <div className="barbershop__price">
              <div className="barbershop__price__top">
                <h1>Pret total:</h1>
                <h2>$ {this?.finalySum || 0}</h2>
              </div>
              <button
                className="barbershop__price__btn"
                type="button"
                onClick={this.clickBuy}
              >
                Cumpara
              </button>
            </div>

            {/* Optional: buton de resetare si cumparare rapida, daca vrei sa le reactualizezi */}
            {/* 
            <div
              className="barbershop_key reset"
              onClick={(e) => {
                e.preventDefault();
                const d = [...this.state.old_data];
                d.map(([type, value]) => {
                  this.setParam(type, value);
                });
                this.setState({ old_data: [] });
              }}
            >
              <img src={exitsvg} />
              Reseteaza
            </div>
            <div className="barbershop_key" onClick={this.clickBuy}>
              <img src={check} />
              Confirma
            </div>
            */}
          </div>
        </div>
      </div>
    </>
  );
}


  get hairPage() {
    const pages = [
      icons["hair"],
      icons["brow"],
      this.male ? svg["beard"] : icons["make-up"],
      icons["lips"],
    ];

    if (this.female) {
      pages.push(icons["nails"]);
    }

    return pages;
  }

  get getCategories() {
    const categories = [
      "Frizuri",
      "Sprancene",
      this.male ? "Barba" : "Machiaj",
      "Buze",
    ];

    if (this.female) {
      categories.push("Manicure");
    }

    return categories;
  }

  PageDataHair = () => {
    return (
      <>
        <div className="pers_box_face">
          <div className="barbershop__types">
            {this.hairPage.map((data: any, index: number) => {
              return (
                <div
                  onClick={() => this.setSubPage(index)}
                  key={index}
                  className={`barbershop__type ${
                    this.state.subpage === index ? "selected" : ""
                  }`}
                >
                  <img src={data} />
                  <h1>{this.getCategories[index]}</h1>
                </div>
              );
            })}
          </div>
          {this.PageDataSubHair()}
        </div>
        {this.state.subpage === page_hair.HAIR
          ? this.PageDataColor(
              [params.COLOR_HAIR1, params.COLOR_HAIR2],
              [
                this.state.hairColor,
                this.state.hairColor2,
                this.state.old_params.hairColor,
                this.state.old_params.hairColor2,
              ],
              true
            )
          : null}
      </>
    );
  };

  PageDataSubHair = () => {
    switch (this.state.subpage) {
      case page_hair.HAIR: {
        return (
          <div className="pers_hair_subtype">
            {personage.hair[this.state.sex].map(
              (data: number, index: number) => (
                <img
                  onClick={() => this.setParam(params.HAIR, data)}
                  key={index}
                  className={`${
                    this.state.hair === data ? "pers_parent_select" : ""
                  } ${this.state.old_params.hair === data ? "initial" : ""}`}
                  src={`${
                    hairs[this.state.sex][
                      `${this.state.sex === 0 ? "m" : "f"}${
                        personage.hair[this.state.sex][index]
                      }`
                    ]
                  }`}
                ></img>
              )
            )}
          </div>
        );
      }
      case page_hair.BROWS: {
        return (
          <div className="pers_face_subtype">
            {this.AddButton(
              "Tip sprancene",
              this.state.eyebrows,
              1,
              0,
              personage.eyebrows,
              (value: number) => this.setParam(params.BROW, value)
            )}
            {this.AddButton(
              "Culoare ochi",
              this.state.eyecolor,
              1,
              0,
              personage.eyeColor,
              (value: number) => this.setParam(params.EYE_COLOR, value)
            )}
            <div>
              {this.AddSlider(
                sliders.SLIDER_PARAM,
                this.state.eyebrowOpacity,
                0.01,
                Ranges.opacity[0],
                Ranges.opacity[1],
                (value: number) => this.setParam(params.BROWOPACITY, value),
                "Intensitate sprancene"
              )}
              {/* <p className="pers_p_with_border">
                {LangString(
                  "components.BarberShop.BarberShop.babb10a94ad808af8d47cc842e5ac081"
                )}
              </p> */}
            </div>
            {this.PageDataColor(
              [params.COLOR_BROWS],
              [this.state.eyebrowsColor],
              false,
              this.state.old_params.eyebrowsColor
            )}
          </div>
        );
      }
      case page_hair.BEARD: {
        return (
          <div className="pers_face_subtype">
            {this.female ? (
              <>
                {this.AddButton(
                  "Tipul makeup",
                  this.state.makeup,
                  1,
                  0,
                  personage.makeup,
                  (value: number) => this.setParam(params.MAKEUP, value)
                )}
                <div>
                  {this.AddSlider(
                    sliders.SLIDER_PARAM,
                    this.state.makeupOpacity,
                    0.01,
                    Ranges.opacity[0],
                    Ranges.opacity[1],
                    (value: number) =>
                      this.setParam(params.MAKEUP_OPACITY, value),
                    "Intensitate makeup"
                  )}
                </div>
                {this.PageDataColor(
                  [params.MAKEUP_COLOR],
                  [this.state.makeupColor],
                  false,
                  this.state.old_params.makeupColor
                )}
              </>
            ) : (
              <>
                {this.AddButton(
                  "Tip barba",
                  this.state.beard,
                  1,
                  0,
                  personage.beard,
                  (value: number) => this.setParam(params.BEARD, value)
                )}
                <div>
                  {this.AddSlider(
                    sliders.SLIDER_PARAM,
                    this.state.beardOpacity,
                    0.01,
                    Ranges.opacity[0],
                    Ranges.opacity[1],
                    (value: number) =>
                      this.setParam(params.BEARDOPACITY, value),
                    "Intensitate barba"
                  )}
                </div>
                {this.PageDataColor(
                  [params.COLOR_BEARD],
                  [this.state.beardColor],
                  false,
                  this.state.old_params.beardColor
                )}
              </>
            )}
          </div>
        );
      }
      case page_hair.LIPS: {
        return (
          <div className="pers_face_subtype">
            {this.AddButton(
              "Tip buze",
              this.state.lips,
              1,
              0,
              personage.lips,
              (value: number) => this.setParam(params.LIPS, value)
            )}
            <div>
              {this.AddSlider(
                sliders.SLIDER_PARAM,
                this.state.lipsOpacity,
                0.01,
                Ranges.opacity[0],
                Ranges.opacity[1],
                (value: number) => this.setParam(params.LIPS_OPACITY, value),
                "Intensitate buze"
              )}
            </div>
            {this.PageDataColor(
              [params.LIPS_COLOR],
              [this.state.lipsColor],
              false,
              this.state.old_params.lipsColor
            )}
          </div>
        );
      }
      case page_hair.NAILS: {
        return (
          <div className="pers_hair_subtype">
            {nailsConfig.map((nailsData, index) => (
              <img
                onClick={() => this.setParam(params.NAILS, nailsData.Id)}
                key={index}
                className={`${
                  this.state.nails === nailsData.Id ? "pers_parent_select" : ""
                } ${
                  this.state.old_params.nails === nailsData.Id ? "initial" : ""
                }`}
                src={`${nailsPictures[nailsData.Id]}`}
              ></img>
            ))}
          </div>
        );
      }
    }
  };

  AddButton = (
    name: string,
    value: number,
    step: number,
    min: number,
    max: number,
    handler: (newValue: number) => void
  ) => {
    return (
      <div className="barbershop__add__btn">
        <h1>{name}</h1>
        <div className="barbershop__add__btn__content">
          <img
            src={icons["arrow-left"]}
            onClick={() => {
              if (value > min) handler((value -= step));
            }}
          />
          <h2>Varianta #{value + 1}</h2>
          <img
            src={icons["arrow-right"]}
            onClick={() => {
              if (value < max) handler((value += step));
            }}
          />
        </div>
      </div>
    );
  };

  AddSlider = (
    type: number,
    value: number,
    step: number,
    min: number,
    max: number,
    handler: (newValue: number) => void,
    name: string
  ) => {
    const newStep = step ? step : 0.01;
    const calculatePercentage = (value: number) => {
      return ((value - min) / (max - min)) * 100;
    };

    return (
      <div className="parameter">
        <h1>{name}</h1>
        <div className="parameter-line">
          <input
            type="range"
            min={min}
            max={max}
            value={value}
            step={newStep}
            onChange={(e) => {
              const newValue = Number(e.target.value);
              handler(newValue);
            }}
            style={{
              background: `linear-gradient(to right, #FF8C21 ${calculatePercentage(
                value
              )}%, #423f3e ${calculatePercentage(value)}%)`,
            }}
          />
        </div>
      </div>
    );
  };

  PageDataColor = (
    type: Array<number>,
    value: Array<number>,
    absolute?: boolean,
    old?: number
  ) => {
    console.log(type, value, absolute, old, value[0] === old);
    return (
      <div
        className={`pers_box_color ${
          value.length > 1 ? "pers_box_color_ex" : ""
        } ${absolute ? "absolute" : ""}`}
      >
        <div
          className={`pers_box_color_box ${
            value.length > 1 ? "pers_box_color_ex" : ""
          }`}
        >
          <p>{absolute ? "Culori principale:" : "Alege culoarea"}</p>
          <div className="pers_box_color_box_colors">
            {colors.map((color: string, index: number) => {
              return (
                <div
                  onClick={() => this.setParam(type[0], index)}
                  key={index}
                  className={`pers_box_color_item ${
                    value[0] === index ? "color_item_select" : ""
                  } ${value[2] === index ? "initial" : ""} 
									${index === old ? "initial" : ""}`}
                  style={{ backgroundColor: color }}
                />
              );
            })}
          </div>
        </div>
        {value.length > 1 ? (
          <div
            className={`pers_box_color_box ${
              value.length > 1 ? "pers_box_color_ex" : ""
            }`}
          >
            <p>Culori secundare:</p>
            <div className="pers_box_color_box_colors">
              {colors.map((color: string, index: number) => {
                return (
                  <div
                    onClick={() => this.setParam(type[1], index)}
                    key={index}
                    className={`pers_box_color_item ${
                      value[1] === index ? "color_item_select" : ""
                    } ${value[3] === index ? "initial" : ""}`}
                    style={{ backgroundColor: color }}
                  />
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    );
  };
}
