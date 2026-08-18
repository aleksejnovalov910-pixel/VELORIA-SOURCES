import { LangString } from "../../modules/lang";
import React, { Component } from "react";

import "./style.less";
import {
  ANIMS_LIST,
  getPurchaseableModelForAnim,
  WALKING_STYLES,
} from "../../../shared/anim";
import test from "./assets/test.gif";
const anims = Object.fromEntries(
  Object.entries(import.meta.glob<{ default: string }>("./assets/items/*.gif", { eager: true })).map(
    ([key, value]) => {
      const name = key.match(/\/([^/]+)\.gif$/)[1];
      return [name, value.default];
    }
  )
);

import closeIcon from "./assets/closeIcon.svg";
import statusRed from "./assets/status-red.svg";
import statusGreen from "./assets/status-green.svg";
import social from "./assets/social.svg";
import services from "./assets/services.svg";
import dance from "./assets/dance.svg";
import poses from "./assets/walking.svg";
import sit from "./assets/sit.svg";
import speach from "./assets/speach.svg";
import dances from "./assets/dances.svg";
import joy from "./assets/joy.svg";
import searchIcon from "./assets/searchIcon.svg";
const assets = Object.fromEntries(
  Object.entries(import.meta.glob<{ default: string }>("./assets/*.svg", { eager: true })).map(
    ([key, value]) => {
      const name = key.match(/\/([^/]+)\.svg$/)[1];
      return [name, value.default];
    }
  )
);

const png = Object.fromEntries(
  Object.entries(import.meta.glob<{ default: string }>("./assets/*.png", { eager: true })).map(
    ([key, value]) => {
      const name = key.match(/\/([^/]+)\.png$/)[1];
      return [name, value.default];
    }
  )
);

import { CustomEvent } from "../../modules/custom.event";
import { CEF } from "../../modules/CEF";
import classNames from "classnames";
import { langData } from "../../../shared/lang";

type AnimArrayItem = { id: string; name: langData; catid: string };

export class Animations extends Component<
  {},
  {
    activeCat: string;
    array: AnimArrayItem[];
    favourite: {
      catid: string;
      animid: string;
    }[];
    purchased: number[];
    containerRef: React.RefObject<HTMLDivElement>;
  }
> {
  input: any = React.createRef();

  constructor(props: any) {
    super(props);

    this.state = {
      activeCat: "fav",
      array: [],
      favourite: [],
      purchased: [],
      containerRef: React.createRef<HTMLDivElement>(),
    };

    CustomEvent.register(
      "anim:setFavourite",
      (
        favourite: {
          catid: string;
          animid: string;
        }[]
      ) => {
        this.setState({ ...this.state, favourite });
      }
    );

    CustomEvent.callServer("anim:getPurchased").then((purchased: number[]) => {
      if (!purchased) return;
      this.setState({
        purchased,
      });
    });
  }

  componentDidMount() {
    setTimeout(() => {
      this.getList("fav");
      this.getList();
    }, 0);
    this.adjustZoom();
    window.addEventListener("resize", this.adjustZoom);

    // this.changeCat("fav")
  }

  componentWillUnmount = () => {
    window.removeEventListener("resize", this.adjustZoom);
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

  changeCat(category: string) {    
    this.getList(category);
    this.setState({ activeCat: category });
    // if (category === "pos") {
      // return;
    // }
  }

  getList(name: string = undefined) {
    let arr: AnimArrayItem[] = [],
      cat: string = name === undefined ? this.state.activeCat : name;

    if (cat === "fav") {
      this.state.favourite.map((item) => {
        if (this.isFavourite(item.animid)) {
          const category = ANIMS_LIST.find((cat) =>
            cat.anims.find((an) => an.id === item.animid)
          );

          if (!category) return;

          const data = category.anims.find((anim) => anim.id === item.animid);

          if (!data) return;
          arr.push({ id: item.animid, name: data.name, catid: category.id });
        }
      });
    } else if (!this.input.current || this.input.current.value === "") {
      const data = ANIMS_LIST.find((q) => q.id === cat);
      if (data) {
        const anims = data.anims;
        anims.forEach((anim) => {
          arr.push({ id: anim.id, name: anim.name, catid: data.id });
        });
      }
    } else {
      ANIMS_LIST.forEach((data) => {
        const anims = data.anims;
        anims.forEach((anim) => {
          arr.push({ id: anim.id, name: anim.name, catid: data.id });
        });
      });

      if (this.input.current) {
        arr = arr.filter((el) =>
          LangString(el.name)
            .toLowerCase()
            .includes(this.input.current.value.toLowerCase())
        );
      }
    }

    this.setState({ array: arr });
  }

  startAnim(value: string) {
    CustomEvent.triggerClient("anim:play", value);
  }

  changeWalkingStyle(styleIndex: number) {
    CustomEvent.triggerServer("anim:changeWalkingStyle", styleIndex);
  }

  setFavourite(catId: string, animId: string) {
    CustomEvent.triggerClient("anim:switchFavourite", catId, animId);
  }

  close() {
    CEF.gui.setGui(null);
  }

  stopAnim() {
    CustomEvent.triggerClient("anim:stopPlaying");
  }

  isFavourite(id: string): boolean {
    const purchaseableModel = getPurchaseableModelForAnim(id);
    if (purchaseableModel) {
      return (
        this.state.favourite.some((item) => item.animid === id) &&
        this.state.purchased.includes(purchaseableModel.id)
      );
    }
    return this.state.favourite.some((item) => item.animid === id);
  }

  isAnimAvailable(name: string): boolean {
    const purchaseableModel = getPurchaseableModelForAnim(name);
    if (purchaseableModel) {
      return this.state.purchased.includes(purchaseableModel.id);
    }
    return true;
  }

  getAnimationsPage() {
    return (
      <>
        <h1>
          {this.state.activeCat === "fav"
            ? "Favourite"
            : this.state.activeCat === "pos"
            ? ""
            : LangString(
                ANIMS_LIST.find((q) => q.id === this.state.activeCat).name
              )}
        </h1>
        {this.state.activeCat !== "fav" && (
          <div className="animation__right-search">
            <img src={assets["search"]} alt="" />
            <input
              type="text"
              placeholder="Cauta..."
              ref={this.input}
              onChange={() => this.getList()}
            />
          </div>
        )}

        <div className="animation__right-content">
          {this.state.array.map((el, key) => {
            return (
              <div
                className={classNames("animation__right-item", {
                  blocked: !this.isAnimAvailable(el.id),
                })}
                key={key}
              >
                <img
                  src={assets["masks"]}
                  alt=""
                  style={{ pointerEvents: "all" }}
                  onClick={() => this.startAnim(el.id)}
                />
                <h2>{LangString(el.name)}</h2>
                <img
                  className="animation__right-item-icon"
                  src={
                    this.isFavourite(el.id)
                      ? assets["heart"]
                      : assets["favorite"]
                  }
                  alt=""
                  style={{ pointerEvents: "all", marginRight: "15px" }}
                  onClick={() => this.setFavourite(el.catid, el.id)}
                />
              </div>
            );
          })}
        </div>
      </>
    );
  }

  getWalkingStylesPage() {
    return (
      <>
        <h1>
          {LangString(
            "components.Animations.Animations.41339e335e798a68abec0a9705c1d77f"
          )}
        </h1>
        <div className="animation__right-content">
          {WALKING_STYLES.map((el, index) => {
            return (
              <div className="animation__right-item" key={index}>
                <img
                  src={assets["masks"]}
                  alt=""
                  // className="animation__right-item-img"
                  onClick={() => this.changeWalkingStyle(index)}
                  style={{ pointerEvents: "all" }}
                />
                <h2>{LangString(el.name)}</h2>
              </div>
            );
          })}
        </div>
      </>
    );
  }

  render() {
    return (
      <div className="animation">
        <div className="animation__bg">

        </div>
        <div className="animation__box" ref={this.state.containerRef}>
          <div className="animation__top">
            <div className="animation__top-exit">
              <p>Stop Animation</p>
              <div
                className="animation__top-exit-img"
                onClick={() => this.stopAnim()}
              >
                <p>F10</p>
              </div>
            </div>
            <div className="animation__top-exit">
              <p>Exit</p>
              <div
                className="animation__top-exit-img"
                onClick={() => this.close()}
              >
                <img src={assets["exit"]} alt="Exit" />
              </div>
            </div>
          </div>
          <div className="animation__content">
            <div className="animation__menu">
              <h1>
menu <span>animatii</span>
              </h1>
              <div
                className={`animation__menu-item favorites ${
                  this.state.activeCat === "fav" ? "selected" : ""
                }`}
                onClick={() => this.changeCat("fav")}
              >
                <img src={assets["heart"]} alt="" />
                <h2>Favorite</h2>
              </div>
              <div className="animation__menu-list">
                {ANIMS_LIST.map((cat) => {
                  return (
                    <div
                      key={cat.id}
                      className={`animation__menu-item ${
                        this.state.activeCat === cat.id ? "selected" : ""
                      }`}
                      onClick={() => this.changeCat(cat.id)}
                    >
                      <img src={assets[cat.img]} alt="" />
                      <h2>{LangString(cat.name)}</h2>
                    </div>
                  );
                })}
                <div
                  className={`animation__menu-item ${
                    this.state.activeCat === "pos" ? "selected" : ""
                  }`}
                  onClick={() => this.changeCat("pos")}
                >
                  <img src={poses} alt="" />
                  <h2>
                    {LangString(
                      "components.Animations.Animations.41339e335e798a68abec0a9705c1d77f"
                    )}
                  </h2>
                </div>
              </div>
            </div>
            <div className="animation__right">
              {this.state.activeCat === "pos"
                ? this.getWalkingStylesPage()
                : this.getAnimationsPage()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
