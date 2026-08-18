import { currentLang, LangString } from "../../modules/lang";
import React from "react";
// import "./assets/pers.less";
import "./assets/pers2.less";
import personage, { colors, EYE_COLORS, Ranges } from "./config";
import mouser from "./assets/mouser.svg";
import arrow from "./assets/arrow.svg";
import random from "./assets/random.svg";
const svg = Object.fromEntries(
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
import man from "./assets/man.svg";
import woman from "./assets/woman.svg";
const parents = Object.fromEntries(
  Object.entries(
    import.meta.glob("./assets/parents/*.png", { eager: true })
  ).map(([key, value]) => {
    const name = key.match(/\/([^/]+)\.png$/)[1];
    return [name, value.default];
  })
);
const hairsf = Object.fromEntries(
  Object.entries(
    import.meta.glob("./assets/hairs/female/*.jpg", { eager: true })
  ).map(([key, value]) => {
    const name = key.match(/\/([^/]+)\.jpg$/)[1];
    return [name, value.default];
  })
);
const hairsm = Object.fromEntries(
  Object.entries(
    import.meta.glob("./assets/hairs/male/*.jpg", { eager: true })
  ).map(([key, value]) => {
    const name = key.match(/\/([^/]+)\.jpg$/)[1];
    return [name, value.default];
  })
);
import { sliders } from "./Slider";
import { CEF } from "../../modules/CEF";
import { CustomEvent } from "../../modules/custom.event";
import { CharacterCreatorDress } from "../../../shared/character";

const hairs = [hairsm, hairsf];
const facePage = [svg["nose"], svg["forehead"], svg["eye"], svg["chin"]];
const hairPage = [svg["hair"], svg["brow"], svg["beard"]];
const mainPage = [
  svg["parents"],
  svg["dnk"],
  svg["face"],
  svg["body"],
  svg["clothe"],
  // svg["next"],
];

const enum pages {
  PAGE_PARENTS = 0,
  PAGE_FACE,
  PAGE_HAIR,
  PAGE_BODY,
  PAGE_CLOTHES,
}

const enum page_face {
  NOSE = 0,
  FOREHEAD,
  EYE,
  CHIN,
}
const enum page_hair {
  HAIR = 0,
  BROWS,
  BEARD,
}

const enum params {
  COLOR_EYE = 0,
  BROW,
  BROWOPACITY,
  COLOR_BROWS,
  BEARD,
  BEARDOPACITY,
  COLOR_BEARD,
  HAIR,
  COLOR_HAIR1,
  COLOR_HAIR2,
  FRECKLES,
  FRECKLESOPACITY,
  COLOR_FRECKLES,
  MAKEUP,
  MAKEUP_COLOR,
}

const { face, features, hair, eyebrows, freckles, beard, clothes, makeup } =
  personage;

interface PlayerData {
  sex: number;
  name: string;
  family: string;
  nameError: string;
  familyError: string;
  age: number;
  focus: number;
  promo: string;
}

interface PersData {
  player: PlayerData;
  page: number;
  subpage: number;
  item: number;
  floor: number;
  face: [number, number];
  skin: number;
  heredity: number;
  features: number[];
  hair: number;
  hairColor: number;
  hairColor2: number;
  eyebrows: number;
  eyebrowOpacity: number;
  eyebrowsColor: number;
  eyeColor: number;
  freckles: number;
  frecklesColor: number;
  frecklesOpacity: number;
  beard: number;
  beardColor: number;
  beardOpacity: number;
  pomade: number;
  pomadeColor: number;
  blush: number;
  blushColor: number;
  makeup: number;
  makeupColor: number;
  clothe: Array<number>;
  clotheId: Array<number>;
  dress: CharacterCreatorDress[];
}

export class Personage extends React.Component<{}, PersData> {
  containerRef: React.RefObject<HTMLDivElement>;
  constructor(props: any) {
    super(props);
    this.state = {
      dress: [],
      player: {
        sex: 0,
        name: "",
        family: "",
        nameError: null,
        familyError: null,
        age: Ranges.age[0],
        focus: -1,
        promo: "",
      },
      page: pages.PAGE_PARENTS,
      subpage: 0,
      item: 0,
      floor: 0,
      face: [0, 0],
      skin: 0.5,
      heredity: 0.5,
      features: [
        0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
        0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
      ],
      hair: 0,
      hairColor: 0,
      hairColor2: 0,
      eyebrows: 0,
      eyebrowOpacity: 0.5,
      eyebrowsColor: 0,
      eyeColor: 0,
      freckles: 0,
      frecklesColor: 0,
      frecklesOpacity: 0.1,
      beard: 0,
      beardColor: 0,
      beardOpacity: 0.5,
      pomade: 0,
      pomadeColor: 0,
      blush: 0,
      blushColor: 0,
      makeup: 0,
      makeupColor: 0,
      clothe: [0, 0, 0],
      clotheId: [0, 0, 0],
    };
    this.containerRef = React.createRef<HTMLDivElement>();

    setTimeout(() => {
      this.loadDress();
    }, 1000);

    if (!CEF.user.name) {
      CEF.playSound(`registerss`);
    }
  }
  componentDidMount = () => {
    this.adjustZoom();
    window.addEventListener("resize", this.adjustZoom);
  };
  componentWillUnmount = () => {
    window.removeEventListener("resize", this.adjustZoom);
  };
  setSex = (sex: number) => {
    mp.trigger("client:user:personage:eventManager", "floor", sex);
    this.setState(
      {
        player: { ...this.state.player, sex: sex },
        hair: 0,
        hairColor: 0,
        hairColor2: 0,
        eyebrows: 0,
        eyebrowsColor: 0,
        eyebrowOpacity: 0.5,
        eyeColor: 0,
        freckles: 0,
        frecklesColor: 0,
        frecklesOpacity: 0.1,
        beard: 0,
        beardColor: 0,
        beardOpacity: 0.5,
        pomade: 0,
        pomadeColor: 0,
        blush: 0,
        blushColor: 0,
        makeup: 0,
        makeupColor: 0,
        clothe: [0, 0, 0],
        clotheId: [0, 0, 0],
      },
      () => {
        this.loadDress();
      }
    );
  };
  confirm = async () => {
    if (
      !CEF.user.name &&
      (this.state.player.name.length < 2 || this.state.player.family.length < 2)
    )
      return this.setState({
        ...this.state,
        player: {
          ...this.state.player,
          nameError:
            this.state.player.name.length < 2
              ? LangString(
                  "components.Personage.Personage.f4f43a64600f362945be00e6f09e53bb"
                )
              : null,
          familyError:
            this.state.player.family.length < 2
              ? LangString(
                  "components.Personage.Personage.1860f5b8f8293d1878ce2c0cd8626ce8"
                )
              : null,
        },
      });
    if (
      !CEF.user.name &&
      (this.state.player.name.charAt(0).toLowerCase() ==
        this.state.player.name.charAt(0) ||
        this.state.player.family.charAt(0).toLowerCase() ==
          this.state.player.family.charAt(0))
    )
      return this.setState({
        ...this.state,
        player: {
          ...this.state.player,
          nameError:
            this.state.player.name.charAt(0).toLowerCase() ==
            this.state.player.name.charAt(0)
              ? LangString(
                  "components.Personage.Personage.9bbbe64ef5aec74c83ccf2e215da75b8"
                )
              : null,
          familyError:
            this.state.player.family.charAt(0).toLowerCase() ==
            this.state.player.family.charAt(0)
              ? LangString(
                  "components.Personage.Personage.d0ea7b312ef913a1f97bf3d17474beff"
                )
              : null,
        },
      });

    if (
      !CEF.user.name &&
      (await CustomEvent.callServer(
        "server:user:personage:checkName",
        this.state.player.name,
        this.state.player.family
      ))
    )
      return this.setState({
        ...this.state,
        player: {
          ...this.state.player,
          nameError: LangString(
            "components.Personage.Personage.b7cb0ff993a9286072dcfcc567276af0"
          ),
          familyError: LangString(
            "components.Personage.Personage.b7cb0ff993a9286072dcfcc567276af0"
          ),
        },
      });
    mp.trigger(
      "client:user:personage:eventManager",
      "save",
      0,
      this.state.player.name,
      this.state.player.family,
      !CEF.user.name ? this.state.player.age : 0,
      !CEF.user.name ? JSON.stringify(this.state.clotheId) : null,
      this.state.player.promo
    );
  };
  random = () => {
    this.setHeredity(
      Ranges.heredity[0] +
        Math.random() * (Ranges.heredity[1] - Ranges.heredity[0])
    );
    this.state.features.map((_, index: number) =>
      this.setFeatures(
        index,
        Ranges.features[0] +
          Math.random() * (Ranges.features[1] - Ranges.features[0]),
        index === this.state.features.length - 1 ? false : true
      )
    );
    this.setParent(
      0,
      Ranges.face[0][0] +
        Math.floor(Math.random() * (Ranges.face[0][1] - Ranges.face[0][0]))
    );
    this.setParent(
      1,
      Ranges.face[1][0] +
        Math.floor(Math.random() * (Ranges.face[1][1] - Ranges.face[1][0]))
    );
    this.setParam(
      params.HAIR,
      Ranges.hair[this.state.player.sex][0] +
        Math.floor(
          Math.random() *
            (Ranges.hair[this.state.player.sex][1] -
              Ranges.hair[this.state.player.sex][0])
        )
    );
    this.setParam(
      params.BROW,
      Ranges.eyebrows[0] +
        Math.floor(Math.random() * (Ranges.eyebrows[1] - Ranges.eyebrows[0]))
    );
    this.setParam(
      params.BEARD,
      Ranges.beard[0] +
        Math.floor(Math.random() * (Ranges.beard[1] - Ranges.beard[0]))
    );
    this.setParam(
      params.FRECKLES,
      Ranges.freckles[0] +
        Math.floor(Math.random() * (Ranges.freckles[1] - Ranges.freckles[0]))
    );
    this.setParam(
      params.BROWOPACITY,
      Ranges.opacity[0] +
        Math.floor(Math.random() * (Ranges.opacity[1] - Ranges.opacity[0]))
    );
    this.setParam(
      params.FRECKLESOPACITY,
      Ranges.opacity[0] +
        Math.floor(Math.random() * (Ranges.opacity[1] - Ranges.opacity[0]))
    );
    this.setParam(
      params.BEARDOPACITY,
      Ranges.opacity[0] +
        Math.floor(Math.random() * (Ranges.opacity[1] - Ranges.opacity[0]))
    );
    this.setParam(
      params.COLOR_HAIR1,
      Ranges.colors[0] +
        Math.floor(Math.random() * (Ranges.colors[1] - Ranges.colors[0]))
    );
    this.setParam(
      params.COLOR_HAIR2,
      Ranges.colors[0] +
        Math.floor(Math.random() * (Ranges.colors[1] - Ranges.colors[0]))
    );
    this.setParam(
      params.COLOR_EYE,
      Ranges.colors[0] +
        Math.floor(Math.random() * (Ranges.colors[1] - Ranges.colors[0]))
    );
    this.setParam(
      params.COLOR_BROWS,
      Ranges.colors[0] +
        Math.floor(Math.random() * (Ranges.colors[1] - Ranges.colors[0]))
    );
    this.setParam(
      params.COLOR_BEARD,
      Ranges.colors[0] +
        Math.floor(Math.random() * (Ranges.colors[1] - Ranges.colors[0]))
    );
    this.setParam(
      params.COLOR_FRECKLES,
      Ranges.colors[0] +
        Math.floor(Math.random() * (Ranges.colors[1] - Ranges.colors[0]))
    );
  };

  adjustZoom = () => {
    const container = this.containerRef.current;
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

  inputName = (focus: number) =>
    this.setState({
      ...this.state,
      player: {
        ...this.state.player,
        focus,
        nameError: focus === 0 ? null : this.state.player.nameError,
        familyError: focus === 1 ? null : this.state.player.familyError,
      },
    });
  setName = (type: number, e: any) => {
    if (!e.target.value.match(/^[a-zA-Z]{0,20}$/i)) return;
    if (!type)
      this.setState({ player: { ...this.state.player, name: e.target.value } });
    else
      this.setState({
        player: { ...this.state.player, family: e.target.value },
      });
  };
  setAge = (age: number, check = false) => {
    if (check) {
      age = Math.max(Ranges.age[0], age);
      age = Math.min(Ranges.age[1], age);
    }
    mp.trigger("client:user:personage:setAge", age);
    this.setState({ player: { ...this.state.player, age } });
  };
  setPromo = (promo: string) => {
    this.setState({
      player: {
        ...this.state.player,
        promo: promo ? promo.toUpperCase() : promo,
      },
    });
  };
  setPage = (page: number) => {
    // if (mainPage.length - 1 === page) return this.confirm();
    this.setState({ ...this.state, page, subpage: 0 });
  };
  setSubPage = (subpage: number) => this.setState({ ...this.state, subpage });
  setItem = (item: number) => this.setState({ ...this.state, item });
  setParent = (type: number, id: number) => {
    mp.trigger(
      "client:user:personage:eventManager",
      type ? "mother" : "father",
      face[type][id]
    );
    this.setState((state) => {
      state.face[type] = id;
      return { ...state };
    });
  };
  setHeredity = (heredity: number) => {
    mp.trigger("client:user:personage:eventManager", "heredity", heredity);
    mp.trigger("client:user:personage:eventManager", "skin", heredity);
    this.setState(() => {
      return {
        heredity,
        skin: heredity,
      };
    });
  };
  setFeatures = (id: number, value: number, no_update?: boolean) => {
    this.setState((state) => {
      state.features[id] = value;
      if (!no_update)
        mp.trigger(
          "client:user:personage:eventManager",
          "features",
          JSON.stringify(state.features)
        );
      return { ...state };
    });
  };
  setAppearance = (type: string, value: number) => {
    mp.trigger("client:user:personage:eventManager", type, value);
  };
  loadDress() {
    CEF.getDressPersonage(this.state.player.sex ? 0 : 1).then((dress) => {
      this.setState(
        {
          dress,
          clothe: [0, 0, 0],
          clotheId: [
            dress.find((q) => q.category === clothes[0].category)
              ? dress.find((q) => q.category === clothes[0].category).id
              : 0,
            dress.find((q) => q.category === clothes[1].category)
              ? dress.find((q) => q.category === clothes[1].category).id
              : 0,
            dress.find((q) => q.category === clothes[2].category)
              ? dress.find((q) => q.category === clothes[2].category).id
              : 0,
          ],
        },
        () => {
          this.reloadDress();
        }
      );
    });
  }
  reloadDress() {
    if (this.state.clotheId[0]) {
      const conf = this.state.dress.find(
        (q) => q.id === this.state.clotheId[0]
      );
      CustomEvent.triggerClient("cloth:preview", JSON.stringify(conf.data));
    }
    if (this.state.clotheId[1]) {
      const conf = this.state.dress.find(
        (q) => q.id === this.state.clotheId[1]
      );
      CustomEvent.triggerClient("cloth:preview", JSON.stringify(conf.data));
    }
    if (this.state.clotheId[2]) {
      const conf = this.state.dress.find(
        (q) => q.id === this.state.clotheId[1]
      );
      CustomEvent.triggerClient("cloth:preview", JSON.stringify(conf.data));
    }
  }
  setClothes = (category: number, index: number, value: number, id: number) => {
    this.setState((state) => {
      state.clothe[index] = value;
      state.clotheId[index] = id;
      return state;
    });
    const conf = this.state.dress.filter((q) => q.category === category)[value];
    CustomEvent.triggerClient("cloth:preview", JSON.stringify(conf.data));
  };
  setParam = (type: number, value: number) => {
    switch (type) {
      case params.HAIR: {
        this.setState((state) => {
          return { ...state, hair: value };
        });
        return this.setAppearance("hair", hair[this.state.player.sex][value]);
      }
      case params.COLOR_HAIR1: {
        this.setState((state) => {
          return { ...state, hairColor: value };
        });
        return this.setAppearance("hairColor", value);
      }
      case params.COLOR_HAIR2: {
        this.setState((state) => {
          return { ...state, hairColor2: value };
        });
        return this.setAppearance("hairColor2", value);
      }
      case params.COLOR_EYE:
        this.setState((state) => {
          return { ...state, eyeColor: value };
        });
        return this.setAppearance("eyeColor", value);
      case params.BROWOPACITY: {
        this.setState((state) => {
          return { ...state, eyebrowOpacity: value };
        });
        return this.setAppearance("eyebrowsOpacity", value);
      }
      case params.BROW: {
        this.setState((state) => {
          return { ...state, eyebrows: value };
        });
        return this.setAppearance("eyebrows", value);
      }
      case params.COLOR_BROWS: {
        this.setState((state) => {
          return { ...state, eyebrowsColor: value };
        });
        return this.setAppearance("eyebrowsColor", value);
      }
      case params.BEARD: {
        this.setState((state) => {
          return { ...state, beard: value };
        });
        return this.setAppearance("beard", value);
      }
      case params.BEARDOPACITY: {
        this.setState((state) => {
          return { ...state, beardOpacity: value };
        });
        return this.setAppearance("beardOpacity", value);
      }
      case params.COLOR_BEARD: {
        this.setState((state) => {
          return { ...state, beardColor: value };
        });
        return this.setAppearance("beardColor", value);
      }
      case params.FRECKLES: {
        this.setState((state) => {
          return { ...state, freckles: value };
        });
        return this.setAppearance("freckles", value);
      }
      case params.FRECKLESOPACITY: {
        this.setState((state) => {
          return { ...state, frecklesOpacity: value };
        });
        return this.setAppearance("frecklesOpacity", value);
      }
      case params.COLOR_FRECKLES: {
        this.setState((state) => {
          return { ...state, frecklesColor: value };
        });
        return this.setAppearance("frecklesColor", value);
      }
      case params.MAKEUP: {
        this.setState((state) => {
          return { ...state, makeup: value };
        });
        return this.setAppearance("makeup", value);
      }
      case params.MAKEUP_COLOR: {
        this.setState((state) => {
          return { ...state, makeupColor: value };
        });
        return this.setAppearance("makeupColor", value);
      }
    }
  };
  render() {
    return (
      <div className="pers_main">
        <div className="pers__bg">
        </div>
        <div className="pers__box" ref={this.containerRef}>
          <div className="pers__top">
            <div className="pers__top-title">
              <h1>
                <span>Creare</span>caracter
              </h1>
              <p>Aici va puteti personaliza caracterul cum doriti</p>
            </div>
            <div className="pers__top-randomly" onClick={this.random}>
              <img src={svg["random"]} alt="" />
              <p>Random</p>
            </div>
          </div>
          <div className="pers__main">
            {PersData(
              this.state.player,
              this.setSex,
              this.setName,
              this.inputName,
              this.setAge,
              this.setPromo
            )}
            {/* <div className="pers__main-right"></div> */}
            <div className="pers__main-right">
              {/* <div className="pers_box"> */}
              <div className="pers__main-right-categories">
                {mainPage.map((data: any, index: number) => {
                  return (
                    <div
                      onClick={() => this.setPage(index)}
                      key={index}
                      className={`pers__main-right-category ${
                        this.state.page === index ? "selected" : ""
                      }`}
                    >
                      <img src={data} />
                    </div>
                  );
                })}
              </div>
              <div
                className="pers__main-right-content"
                style={
                  this.state.page === pages.PAGE_HAIR &&
                  this.state.subpage === page_hair.HAIR
                    ? { height: "515px" }
                    : {}
                }
              >
                {PageDataParent(
                  this.state,
                  this.setItem,
                  this.setParent,
                  this.setHeredity
                )}
                {PageDataFace(
                  this.state,
                  this.setSubPage,
                  this.setFeatures,
                  this.setParam
                )}
                {PageDataHair(this.state, this.setSubPage, this.setParam)}
                {PageDataBody(this.state, this.setParam)}
                {this.PageDataClothes()}
              </div>
              {/* </div> */}
            </div>
          </div>
          <div className="pers__bottom">
            <div className="pers__bottom-rotate">
              <img src={svg["mouse1"]} alt="" />
              <p>Folositi mouse-ul pentru a roti caracterul</p>
            </div>
            <h1 className="pers__bottom-save" onClick={() => this.confirm()}>
              ✔
            </h1>
          </div>
        </div>
      </div>
    );
  }
  PageDataClothes() {
    if (this.state.page != pages.PAGE_CLOTHES) return null;
    return (
      <>
        <div
          className="pers_box_body"
          style={{
            width: "100%",
            marginTop: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {clothes.map((data, index: number) => {
            const catalogItem = this.state.dress.filter(
              (q) => q.category === data.category
            );
            if (!catalogItem.length) return <></>;
            return (
              <div
                key={`dress_create_pers_${index}`}
                style={{ height: "100px" }}
              >
                {AddButton(
                  `${data.name}${
                    catalogItem[this.state.clothe[index]]
                      ? ` (${catalogItem[this.state.clothe[index]].name})`
                      : ""
                  }`,
                  catalogItem[this.state.clothe[index]]
                    ? this.state.clothe[index]
                    : 0,
                  1,
                  0,
                  catalogItem.length - 1,
                  (value: number) => {
                    this.setClothes(
                      data.category,
                      index,
                      value,
                      catalogItem[value].id
                    );
                  }
                )}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

const PageDataColor = (
  type: Array<number>,
  state: PersData,
  setParam: (type: number, value: number) => void,
  value: Array<number>,
  marginLeft?: boolean,
  small?: boolean,

  colorList = colors
) => {
  return (
    <div className={`pers__colors ${value.length > 1 ? "absolute" : ""}`}>
      <div
        className={`pers__colors__box ${
          value.length > 1 ? "pers_box_color_ex" : ""
        }`}
      >
        <h1
          className="h-title mt-15"
          style={{ marginLeft: marginLeft ? "27px" : "17px" }}
        >
          {value.length > 1 ? "Culoare principala" : "Alegeti o culoare"}
        </h1>
        <div className="colors" style={{ maxHeight: small ? "300px" : "" }}>
          {colorList.map((color: string, index: number) => {
            return (
              <div
                onClick={() => setParam(type[0], index)}
                key={index}
                className={`colors__item ${
                  value[0] === index ? "selected" : ""
                }`}
                style={{ backgroundColor: color }}
              />
            );
          })}
        </div>
      </div>
      {value.length > 1 ? (
        <div
          className={`pers__colors__box ${
            value.length > 1 ? "pers_box_color_ex" : ""
          }`}
        >
          <h1 className="h-title" style={{ marginLeft: "27px" }}>
          Culoarea secundara
          </h1>
          <div className="colors">
            {colorList.map((color: string, index: number) => {
              return (
                <div
                  onClick={() => setParam(type[1], index)}
                  key={index}
                  className={`colors__item ${
                    value[1] === index ? "selected" : ""
                  }`}
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

const PageDataBody = (
  state: PersData,
  setParam: (type: number, value: number) => void
) => {
  if (state.page != pages.PAGE_BODY) return null;
  return (
    <>
      <div className="pers_box_body" style={{ marginTop: "20px" }}>
        {AddButton(
          "Alegeti varianta",
          state.freckles,
          1,
          0,
          freckles,
          (value: number) => setParam(params.FRECKLES, value)
        )}
        <div>
          {/* {AddSlider(
            sliders.SLIDER_PARAM,
            state.frecklesOpacity,
            0.01,
            Ranges.opacity[0],
            Ranges.opacity[1],
            (value: number) => setParam(params.FRECKLESOPACITY, value)
          )} */}
          <div className="pers__main__parents__footer mt-15">
            <h1 className="h-title ml-0 mb-5">
              <span>Intensitatea pistruilor</span>
            </h1>
            {AddSlider(
              sliders.SLIDER_PARAM,
              state.frecklesOpacity,
              0.01,
              Ranges.opacity[0],
              Ranges.opacity[1],
              (value: number) => setParam(params.FRECKLESOPACITY, value)
            )}
          </div>
          {/* <p className="pers_p_with_border">
            {LangString(
              "components.Personage.Personage.8bda00e8e635401ad97b92d81a07640e"
            )}
          </p> */}
        </div>
        <div style={{ marginTop: "25px" }}>
          {PageDataColor([params.COLOR_FRECKLES], state, setParam, [
            state.frecklesColor,
          ])}
        </div>
      </div>
    </>
  );
};

const PageDataHair = (
  state: PersData,
  setSubPage: (sub: number) => void,
  setParam: (type: number, value: number) => void
) => {
  if (state.page != pages.PAGE_HAIR) return null;
  return (
    <>
      <div className="pers__main__face hairstyle">
        <div className="pers__main__face-menu">
          {hairPage.map((data: any, index: number) => {
            return (
              <div
                onClick={() => setSubPage(index)}
                key={index}
                className={`pers__main__face-menu-item hairstyle ${
                  state.subpage === index ? "selected" : ""
                }`}
              >
                <img src={data} />
              </div>
            );
          })}
        </div>
        {PageDataSubHair(state, setParam)}
      </div>
      {state.subpage === page_hair.HAIR
        ? PageDataColor(
            [params.COLOR_HAIR1, params.COLOR_HAIR2],
            state,
            setParam,
            [state.hairColor, state.hairColor2]
          )
        : null}
    </>
  );
};

const PageDataFace = (
  state: PersData,
  setSubPage: (sub: number) => void,
  setFeatures: (id: number, value: number) => void,
  setParam: (type: number, value: number) => void
) => {
  if (state.page != pages.PAGE_FACE) return null;
  return (
    <>
      <div className="pers__main__face">
        <div className="pers__main__face-menu">
          {facePage.map((data: any, index: number) => {
            return (
              <div
                onClick={() => setSubPage(index)}
                key={index}
                className={`pers__main__face-menu-item ${
                  state.subpage === index ? "selected" : ""
                }`}
              >
                <img src={data} />
              </div>
            );
          })}
        </div>
        <div className="pers__main__face-list">
          {PageDataSubFace(state, setFeatures, setParam)}
        </div>
      </div>
    </>
  );
};

const PageDataSubHair = (
  state: PersData,
  setParam: (type: number, value: number) => void
) => {
  switch (state.subpage) {
    case page_hair.HAIR: {
      return (
        <div className="pers__main__parents-content">
          {hair[state.player.sex].map((data: number, index: number) => (
            <div
              onClick={() => setParam(params.HAIR, index)}
              key={index}
              className={`pers__main__parents-content-item ${
                state.hair === index ? "selected" : ""
              }`}
            >
              <img
                src={`${
                  hairs[state.player.sex][
                    `${state.player.sex === 0 ? "m" : "f"}${
                      hair[state.player.sex][index]
                    }`
                  ]
                }`}
              />
            </div>
          ))}
        </div>
      );
    }
    case page_hair.BROWS: {
      return (
        <div className="pers_face_subtype" style={{ marginTop: "10px" }}>
          {AddButton(
            "Alegeti varianta",
            state.eyebrows,
            1,
            0,
            eyebrows,
            (value: number) => setParam(params.BROW, value)
          )}
          <div>
            <div className="pers__main__parents__footer mt-15">
              <h1 className="h-title ml-0 mb-5">
                <span>Intensitate sprancene</span>
              </h1>
              {AddSlider(
                sliders.SLIDER_PARAM,
                state.eyebrowOpacity,
                0.01,
                Ranges.opacity[0],
                Ranges.opacity[1],
                (value: number) => setParam(params.BROWOPACITY, value)
              )}
            </div>
          </div>
          <div style={{ marginTop: "25px" }}>
            {PageDataColor(
              [params.COLOR_BROWS],
              state,
              setParam,
              [state.eyebrowsColor],
              false,
              true
            )}
          </div>
        </div>
      );
    }
    case page_hair.BEARD: {
      if (state.player.sex === 1)
        return (
          <div className="pers_face_subtype" style={{ marginTop: "10px" }}>
            {AddButton(
              "Alegeti varianta",
              state.makeup,
              1,
              0,
              makeup,
              (value: number) => setParam(params.MAKEUP, value)
            )}
            <div style={{ marginTop: "25px" }}>
              {PageDataColor(
                [params.MAKEUP_COLOR],
                state,
                setParam,
                [state.makeupColor],
                false,
                true
              )}
            </div>
          </div>
        );
      else
        return (
          <div className="pers_face_subtype" style={{ marginTop: "10px" }}>
            {AddButton(
              "Alegeti varianta",
              state.beard,
              1,
              0,
              beard,
              (value: number) => setParam(params.BEARD, value)
            )}
            <div>
              <div className="pers__main__parents__footer mt-15">
                <h1 className="h-title ml-0 mb-5">
                  <span>Intensitate barba</span>
                </h1>
                {AddSlider(
                  sliders.SLIDER_PARAM,
                  state.beardOpacity,
                  0.01,
                  Ranges.opacity[0],
                  Ranges.opacity[1],
                  (value: number) => setParam(params.BEARDOPACITY, value)
                )}
              </div>
            </div>
            <div style={{ marginTop: "25px" }}>
              {PageDataColor(
                [params.COLOR_BEARD], // 
                state,
                setParam,
                [state.beardColor],
                false,
                true
              )}
            </div>
          </div>
        );
    }
  }
};

const PageDataSubFace = (
  state: PersData,
  setFeatures: (id: number, value: number) => void,
  setParam: (type: number, value: number) => void
) => {
  switch (state.subpage) {
    case page_face.NOSE: {
      return (
        <>
          {state.features.slice(0, 6).map((i: number, id: number) => {
            let handler = (value: number) => setFeatures(id, value);
            return (
              <div key={id} className="pers__main__parents__footer">
                <h1 className="h-title ml-0 mb-5">
                  <span>{features[id]}</span>
                </h1>
                {AddSlider(
                  sliders.SLIDER_PARAM,
                  state.features[id],
                  0.01,
                  Ranges.features[0],
                  Ranges.features[1],
                  handler
                )}
                <h2 className="h-title" style={{ marginTop: "10px" }}>
                  <span>Ingust</span>
                  <span>Lat</span>
                </h2>
              </div>
            );
          })}
        </>
      );
    }
    case page_face.FOREHEAD: {
      return (
        <>
          {state.features.slice(6, 11).map((i: number, id: number) => {
            let handler = (value: number) => setFeatures(id + 6, value);
            return (
              <div key={id} className="pers__main__parents__footer">
                <h1 className="h-title ml-0 mb-5">
                  <span>{features[id + 6]}</span>
                </h1>
                {AddSlider(
                  sliders.SLIDER_PARAM,
                  state.features[id + 6],
                  0.01,
                  Ranges.features[0],
                  Ranges.features[1],
                  handler
                )}
                <h2 className="h-title" style={{ marginTop: "10px" }}>
                  <span>Ingust</span>
                  <span>Lat</span>
                </h2>
              </div>
            );
          })}
        </>
      );
    }
    case page_face.EYE: {
      return (
        <>
          {state.features.slice(11, 12).map((i: number, id: number) => {
            let handler = (value: number) => setFeatures(id + 11, value);
            return (
              <>
                <div key={id} className="pers__main__parents__footer">
                  <h1 className="h-title mb-5" style={{ marginLeft: "20px" }}>
                    <span>{features[id + 11]}</span>
                  </h1>
                  {AddSlider(
                    sliders.SLIDER_PARAM,
                    state.features[id + 11],
                    0.01,
                    Ranges.features[0],
                    Ranges.features[1],
                    handler
                  )}
                  {/* <h2 className="h-title" style={{ marginTop: "10px" }}>
                    <span>Narrower</span>
                    <span>Wider</span>
                  </h2> */}
                </div>
                {PageDataColor(
                  [params.COLOR_EYE],
                  state,
                  setParam,
                  [state.eyeColor],
                  true,
                  false,
                  EYE_COLORS
                )}
              </>
            );
          })}
        </>
      );
    }
    case page_face.CHIN: {
      return (
        <>
          {state.features.slice(12, 20).map((i: number, id: number) => {
            let handler = (value: number) => setFeatures(id + 12, value);
            return (
              // <div key={id}>
              //   {AddSlider(
              //     sliders.SLIDER_PARAM,
              //     state.features[id + 12],
              //     0.01,
              //     Ranges.features[0],
              //     Ranges.features[1],
              //     handler
              //   )}
              //   <p className="pers_p_with_border">{features[id + 12]}</p>
              // </div>
              <div key={id} className="pers__main__parents__footer">
                <h1 className="h-title ml-0 mb-5">
                  <span>{features[id + 12]}</span>
                </h1>
                {AddSlider(
                  sliders.SLIDER_PARAM,
                  state.features[id + 12],
                  0.01,
                  Ranges.features[0],
                  Ranges.features[1],
                  handler
                )}
                <h2 className="h-title" style={{ marginTop: "10px" }}>
                  <span>Ingust</span>
                  <span>Lat</span>
                </h2>
              </div>
            );
          })}
        </>
      );
    }
  }
};
const PageDataParent = (
  state: PersData,
  setItem: (id: number) => void,
  setParent: (type: number, id: number) => void,
  setHeredity: (heredity: number) => void
) => {
  if (state.page != pages.PAGE_PARENTS) return null;
  return (
    <>
      <div className="pers__main__parents">
        <div className="pers__main__parents-top mb-15">
          <h1 className="h-title">Alegeti un parinte</h1>
          <div className="parent-boxes">
            <div
              className={`parent-box ${state.item === 1 ? "selected" : ""}`}
              onClick={() => setItem(1)}
            >
              <p>Mama</p>
            </div>
            <div
              className={`parent-box ${state.item === 0 ? "selected" : ""}`}
              onClick={() => setItem(0)}
            >
              <p>Tata</p>
            </div>
          </div>
        </div>
        <div className="pers__main__parents-content">
          {face[state.item].map((data: number, index: number) => (
            <div
              className={`pers__main__parents-content-item ${
                state.face[state.item] === index ? "selected" : ""
              }`}
              key={index}
              onClick={() => setParent(state.item, index)}
            >
              <img
                src={`${
                  parents[`${state.item === 0 ? "male" : "female"}_${index}`]
                }`}
              />
            </div>
          ))}
        </div>
        <div className="pers__main__parents__footer mb-15 mt-15">
          <h1 className="h-title ml-0">
            <span>Asemanare cu parintii</span>
          </h1>
          {AddSlider(
            sliders.SLIDER_FLOOR,
            state.heredity,
            0.01,
            Ranges.heredity[0],
            Ranges.heredity[1],
            setHeredity
          )}
          <h2 className="h-title" style={{ marginTop: "10px" }}>
            <span>Mama</span>
            <span>Tata</span>
          </h2>
        </div>
      </div>
    </>
  );
};

const PersData = (
  player: PlayerData,
  setSex: (sex: number) => void,
  setName: (type: number, e: any) => void,
  inputName: (type: number) => void,
  setAge: (age: number) => void,
  setPromo: (promo: string) => void
) => {
  return (
    <>
      <div className={`pers__main-left ${CEF.user.name ? "auto" : ""}`}>
        <div className="gender mb-15">
          <h1 className="h-title">Alegeti un gen</h1>
          <div className="gender-boxes">
            <div
              className={`gender-box ${!player.sex ? "selected" : ""}`}
              onClick={() => setSex(0)}
            >
              <img src={svg["male1"]} alt="" />
              <p>Barbat</p>
            </div>

            <div
              className={`gender-box ${player.sex ? "selected" : ""}`}
              onClick={() => setSex(1)}
            >
              <img src={svg["female1"]} alt="" />
              <p>Femeie</p>
            </div>
          </div>
        </div>

        {!CEF.user.name && (
          <>
            <div className="name mb-15 flex-left">
              <h1 className="h-title">Numele</h1>
              <input
                type="text"
                className="input-box"
                placeholder="Introdu numele tau..."
                maxLength={30}
                readOnly={!!CEF.user.name ? true : false}
                disabled={!!CEF.user.name ? true : false}
                onFocus={() => inputName(0)}
                onBlur={() => inputName(-1)}
                onChange={(e: any) => setName(0, e)}
                value={
                  CEF.user.name
                    ? CEF.user.name.split(" ")[0]
                    : player.nameError
                    ? player.nameError
                    : player.name
                }
              />
            </div>

            <div className="surname mb-15 flex-left">
              <h1 className="h-title">Numele de familie</h1>
              <input
                type="text"
                className="input-box"
                placeholder="Introdu numele de familie..."
                maxLength={30}
                readOnly={!!CEF.user.name ? true : false}
                disabled={!!CEF.user.name ? true : false}
                onFocus={() => inputName(1)}
                onBlur={() => inputName(-1)}
                onChange={(e: any) => setName(1, e)}
                value={
                  CEF.user.name
                    ? CEF.user.name.split(" ")[1]
                    : player.familyError
                    ? player.familyError
                    : player.family
                }
              />
            </div>

            <div className="promocode mb-15 flex-left">
              <h1 className="h-title" style={{ marginBottom: "-10px" }}>
                <span>Varsta</span>
                <span style={{ color: "#148a1d", marginLeft: "290px" }}>
                  {player.age}
                </span>
              </h1>

              <div className="age-parameter">
                {AddSlider(
                  sliders.SLIDER_AGE,
                  player.age,
                  1,
                  Ranges.age[0],
                  Ranges.age[1],
                  setAge
                )}
              </div>
            </div>

            <div className="promocode mb-15 flex-left mt-15">
              <h1 className="h-title">Cod referal</h1>
              <input
                type="text"
                className="input-box"
                placeholder="Introdu codul de referal..."
                maxLength={30}
                onChange={(e: any) => setPromo(e.currentTarget.value)}
                value={player.promo}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};

const AddSlider = (
  type: number,
  value: number,
  step: number,
  min: number,
  max: number,
  handler: (newValue: number) => void,
  name?: string
) => {
  const newStep = step ? step : 0.01;
  const calculatePercentage = (value: number) => {
    return ((value - min) / (max - min)) * 100;
  };

  return (
    <div className="parameter">
      {name && <h1>{name}</h1>}
      <div className="parameter__line">
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
            background: `linear-gradient(to right, #148a1d ${calculatePercentage(
              value
            )}%, #423f3e ${calculatePercentage(value)}%)`,
          }}
        />
      </div>
    </div>
  );
};

const AddButton = (
  name: string,
  value: number,
  step: number,
  min: number,
  max: number,
  handler: (newValue: number) => void
) => {
  return (
    <div className="pers__add__btn">
      <h1>{name}</h1>
      <div className="pers__add__btn__content">
        <img
          src={svg["arrow-left"]}
          onClick={() => {
            if (value > min) handler(value - step);
          }}
        />
        <h2>Varianta #{value + 1}</h2>
        <img
          src={svg["arrow-right"]}
          onClick={() => {
            if (value < max) handler(value + step);
          }}
        />
      </div>
    </div>
  );
};
