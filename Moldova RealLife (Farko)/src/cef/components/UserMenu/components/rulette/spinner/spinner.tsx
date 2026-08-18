// import png from "./../../assets/*.png";
import React, { Component } from "react";
import { CustomEvent } from "../../../../../modules/custom.event";
import "./spinner.less";
import "../../../style/style.css";
const png = Object.fromEntries(
  Object.entries(import.meta.glob("./../../assets/*.png", { eager: true })).map(
    ([key, value]) => {
      const name = key.match(/\/([^/]+)\.png$/)[1];
      return [name, value.default];
    }
  )
);
const svg = Object.fromEntries(
  Object.entries(import.meta.glob("../../../img/*.svg", { eager: true })).map(
    ([key, value]) => {
      const name = key.match(/\/([^/]+)\.svg$/)[1];
      return [name, value.default];
    }
  )
);
const rpng = Object.fromEntries(
  Object.entries(import.meta.glob("./../../assets/*.png", { eager: true })).map(
    ([key, value]) => {
      const name = key.match(/\/([^/]+)\.png$/)[1];
      return [name, value.default];
    }
  )
);

const prizesPng = Object.fromEntries(
  Object.entries(
    import.meta.glob("./../../assets/items/*.png", { eager: true })
  ).map(([key, value]) => {
    const name = key.match(/\/([^/]+)\.png$/)[1];
    return [name, value.default];
  })
);

import { CEF } from "../../../../../modules/CEF";
import { CustomEventHandler } from "../../../../../../shared/custom.event";
import { ModalType } from "../../donate-roulette";
import {
  drops,
  RarityType,
} from "../../../../../../shared/donate/donate-roulette/main";
import { DropDataBase } from "shared/donate/donate-roulette/Drops/dropBase";
// @ts-ignore
import Slot from "./slot.js";
import { DropSlot } from "./DropSlot";

// Это пример компонента под реакт для быстрого создания уже рабочего экземпляра.
export class SpinnerPage extends Component<
  {
    type: string;
    spinFinished(winElements: DropDataBase[]): void;
    toStorage(): void;
    coins: number;
    back(): void;
  },
  {
    dropItems: DropDataBase[];
    // <<<<<<< HEAD
    quantityPrizes: number;
    // =======

    width: number;
    height: number;
    canvas: React.RefObject<any>;
    parent: React.RefObject<any>;
    ctx: any;
    countElements: number;
    speed: number;
    frameRate: number;
    maxSpeed: number;
    duration: number;
    timeToStop: number;
    sizeItem: number;
    currentState: Slot[];
    itemList: DropSlot[];
    bgImg: null;
    lastFrame: number;
    headResult: Slot;
    winResult: Slot;
    winDrop: DropDataBase;
    cancel: boolean;
    antiFlood: number;
    stopFrom: number;
    sound: boolean;
    winBuilded: boolean;
    floodProtection: number;

    isRun: boolean;
    isStop: boolean;
    isWin: boolean;
    result: number;
    withoutAnimation: boolean;
    audio: any;
    spinCost: number;
    // >>>>>>> 1ee4c538ad946e4a3712006fcd219ca898dd378a
  }
> {
  private quantityPrizes: {
    name: string;
    value: number;
    checked?: boolean;
  }[] = [
    {
      name: "x1",
      value: 1,
      checked: true,
    },
    {
      name: "x3",
      value: 3,
    },
    {
      name: "x5",
      value: 5,
    },
  ];
  /** Это наш ивент, через который интерфейс может получать данные от клиента или сервера */
  private ev: CustomEventHandler;
  constructor(props: any) {
    super(props);
    this.state = {
      /** По умолчанию используется значение CEF.test. true будет если мы в браузере проверяем интерфейс.*/
      dropItems: drops,
      withoutAnimation: false,
      quantityPrizes: 1,
      width: 0,
      height: 0,
      canvas: React.createRef(),
      parent: React.createRef(),
      ctx: null,
      countElements: 9,
      speed: 0,
      frameRate: 36,
      maxSpeed: 60,
      duration: 2500,
      timeToStop: 0,
      sizeItem: 0,
      currentState: [],
      itemList: [],
      bgImg: null,
      lastFrame: 0,
      headResult: null,
      winResult: null,
      winDrop: null,
      cancel: false,
      antiFlood: 0,
      stopFrom: 0,
      sound: true,
      winBuilded: false,
      floodProtection: 0,
      spinCost:
        this.props.type === ModalType.LUXE
          ? 1000
          : this.props.type === ModalType.PREMIUM
          ? 500
          : this.props.type === ModalType.STANDART
          ? 200
          : null,

      isRun: false,
      isStop: false,
      isWin: false,
      result: -1,
      audio: null,
    };

    this.onChangeValue = this.onChangeValue.bind(this);

    this.addWinElement = this.addWinElement.bind(this);
    this.builWinCombination = this.builWinCombination.bind(this);
    this.updateState = this.updateState.bind(this);
    this.addRandomElement = this.addRandomElement.bind(this);
    this.initGame = this.initGame.bind(this);
    this.initImages = this.initImages.bind(this);
    this.removeElement = this.removeElement.bind(this);
    this.handleStop = this.handleStop.bind(this);
    this.handleLoop = this.handleLoop.bind(this);
    this.drawFrame = this.drawFrame.bind(this);
    this.requestWin = this.requestWin.bind(this);
    this.start = this.start.bind(this);
    this.requestSpin = this.requestSpin.bind(this);
    this.takeReward = this.takeReward.bind(this);

    this.ev = CustomEvent.register("droulette:spin", (winNumbers: number[]) => {
      if (winNumbers.length == 1) this.start(winNumbers[0]);
      else {
        const items = [];
        for (let i = 0; i < winNumbers.length; i++) {
          items.push(
            this.state.itemList.find(
              (item) => item.data.dropId == winNumbers[i]
            ).data
          );
        }
        // this.onFinishAnimation(items);
        this.props.spinFinished(items);
      }
    });
  }
  onChangeValue(event: any) {
    this.setState({
      dropItems: drops,
      quantityPrizes: event.target.value,
      withoutAnimation:
        event.target.value > 1 ? true : this.state.withoutAnimation,
    });
  }

  componentDidMount() {
    const parent = this.state.parent.current;
    let itemList: DropSlot[] = this.state.itemList;
    drops
      .filter((el) => el.rarity !== RarityType.CASINO)
      .forEach((d) => {
        //if (d.roulette.includes(this.props.type as RouletteType)) {
        itemList.push(new DropSlot(d));
        //}
      });
    this.setState({ ...this.state, itemList });

    this.setState({
      ctx: this.state.canvas.current.getContext("2d"),
      width: parent.clientWidth,
      // height: parent.offsetWidth / this.state.countElements,
      height: parent.clientHeight,
      canvas: this.state.canvas,
      frameRate: Math.floor(1000 / this.state.frameRate),
    });
    this.initImages();

    setTimeout(this.initGame, 500);
    // setTimeout(this.start, 1500);
  }

  // start() {
  //   if (!this.state.winBuilded) {
  //     this.setState({
  //       winBuilded: false,
  //       timeToStop: Date.now() + this.state.duration,
  //       isRun: true,
  //       isStop: false,
  //       isWin: false,
  //       result: 1,
  //     });
  //   }
  // }

  takeReward() {
    this.setState({
      isRun: false,
      isStop: false,
      isWin: false,
      winBuilded: false,
      result: -1,
    });
  }

  requestSpin() {
    if (this.state.isRun) return;

    CustomEvent.triggerServer(
      "droulette:request",
      this.props.type,
      this.state.quantityPrizes
    );
  }

  start(winNumber: number) {
    // CEF.playSound("roulette-single-spin");
    // const audio = new Audio(spin);
    // audio.volume = 0.4;
    // audio.play();
    // //this.setState({audio: audio})
    // setTimeout(() => {
    //   audio.remove();
    // })

    if (this.state.withoutAnimation) {
      const item = this.state.itemList.find((i) => i.data.dropId == winNumber);
      this.props.spinFinished([item.data]);
    } else {
      if (!this.state.winBuilded) {
        this.setState({
          winBuilded: false,
          timeToStop: Date.now() + this.state.duration,

          isRun: true,
          isStop: false,
          isWin: false,
          result: winNumber,
        });
      }
    }
  }

  addWinElement(id: number) {
    const last = this.state.currentState[this.state.currentState.length - 1];
    let currentOffset = last ? last.posX + last.size : 0;

    const item = this.state.itemList.find((i) => i.data.dropId == id);
    const slot = new Slot(
      this.state.ctx,
      item,
      this.state.parent.current.clientWidth / 7,
      currentOffset
    );
    this.state.currentState.push(slot);
    this.setState({ winDrop: item.data });
    return slot;
  }

  builWinCombination(val: number) {
    this.setState({ winBuilded: true });
    for (let index = 0; index < this.state.countElements; index++) {
      if (index == 0) {
        this.setState({ headResult: this.addRandomElement() });
      } else if (index == 3) {
        this.setState({ winResult: this.addWinElement(val) });
      } else this.addRandomElement();
    }
  }

  componentWillUnmount() {
    if (this.ev) this.ev.destroy();
    CEF.stopSound();
  }

  updateState() {
    if (this.state.cancel) return;
    if (this.state.lastFrame < Date.now()) {
      if (this.state.isRun) {
        this.setState({ lastFrame: Date.now() + this.state.frameRate });

        if (this.state.timeToStop < Date.now()) this.setState({ isStop: true });

        if (this.state.isStop) this.handleStop();
        else this.handleLoop();
      }
      this.drawFrame();
    }

    //this.state.canvas.current.requestAnimationFrame(this.updateState)
    requestAnimationFrame(this.updateState, this.state.canvas.current);
  }

  addRandomElement() {
    const last = this.state.currentState[this.state.currentState.length - 1];
    let currentOffset = last ? last.posX + last.size : 0;

    const item =
      this.state.itemList[
        Math.floor(Math.random() * this.state.itemList.length)
      ];
    const slot = new Slot(
      this.state.ctx,
      item,
      this.state.parent.current.clientWidth / 7,
      currentOffset
    );
    this.state.currentState.push(slot);
    return slot;
  }

  initGame() {
    this.setState({ currentState: [] });

    for (let index = 0; index < this.state.countElements + 2; index++) {
      this.addRandomElement();
    }

    requestAnimationFrame(this.updateState, this.state.canvas.current);
  }

  initImages() {
    this.state.itemList.forEach((item) => {
      item.img = new Image(this.state.height, this.state.width);
      item.img.src =
        prizesPng[item.data.icon] === undefined
          ? prizesPng["1"]
          : prizesPng[item.data.icon];
      item.rarityImg = new Image(this.state.height, this.state.width);
      item.rarityImg.src =
        png[
          item.data.rarity === RarityType.LEGENDARY
            ? "gold"
            : item.data.rarity === RarityType.SPECIAL
            ? "red"
            : item.data.rarity === RarityType.UNIQUE
            ? "pink"
            : item.data.rarity === RarityType.RARE
            ? "purple"
            : item.data.rarity === RarityType.COMMON
            ? "blue"
            : "red"
        ];
    });
  }

  removeElement() {
    this.state.currentState.shift();
  }

  handleStop() {
    if (this.state.speed > this.state.maxSpeed * 0.8) {
      if (this.state.currentState[0].canDelete()) {
        this.removeElement();
        this.addRandomElement();
      }

      this.state.currentState.forEach((item) => {
        item.moveX(this.state.speed);
      });
      this.setState({ speed: this.state.speed - 1 });
    } else {
      if (!this.state.winBuilded) {
        this.builWinCombination(this.state.result);
        this.setState({ stopFrom: this.state.headResult.posX });
      }
      const kof = Math.abs(this.state.headResult.posX / this.state.stopFrom);
      this.setState({
        speed: Math.max(Math.floor(this.state.maxSpeed * kof * 0.75 + 3), 5),
      });
      if (
        this.state.headResult.posX <= 0
        // (this.state.parent.current.clientHeight * 0.85) / -3.2
      ) {
        const fix = this.state.headResult.posX;
        this.state.currentState.forEach((item) => {
          item.fixPos(fix);
        });
        this.setState({ speed: 0 });
        this.requestWin();
      } else {
        this.state.currentState.forEach((item) => {
          item.moveX(this.state.speed);
        });
      }
      if (this.state.currentState[0].canDelete()) {
        this.removeElement();
      }
    }
  }

  handleLoop() {
    if (!this) return;
    if (this.state.maxSpeed > this.state.speed)
      this.setState({ speed: this.state.speed + 5 });

    if (this.state.currentState[0].canDelete()) {
      this.removeElement();
      this.addRandomElement();
    }

    this.state.currentState.forEach((item) => {
      item.moveX(this.state.speed);
    });
  }

  drawFrame() {
    this.state.ctx.globalCompositeOperation = "normal";
    this.state.ctx.clearRect(0, 0, this.state.width, this.state.height);
    this.state.currentState.forEach((item, i) => {
      item.win(this.state.isWin);
      item.draw(i);
    });
  }

  requestWin() {
    this.setState({
      isRun: false,
      isStop: false,
      isWin: true,
      result: -1,
    });
    setTimeout(() => {
      this.props.spinFinished([this.state.winDrop]);
    }, 100);
  }

  // onFinishAnimation(items: DropDataBase[]) {
  //   this.props.spinFinished(items);
  //   this.setState({
  //     isRun: false,
  //     isStop: false,
  //     isWin: true,
  //     result: -1,
  //   });
  // }

  render() {
    return (
      <>
        <div className="umenu-open">
          <div className="umenu-back" onClick={this.props.back}>
            <div className="umenu-icon">
              <img src={svg["back"]} alt="" />
            </div>
            <div className="umenu-text">Back</div>
          </div>
          <div className="umenu-title">{this.props.type}</div>
          <button onClick={this.props.toStorage}>Depozit premii</button>
          <div
            className="umenu-slots"
            id="spinner-container"
            ref={this.state.parent}
          >
            <div className="umenu-vector-top"></div>
            <canvas
              width={this.state.width}
              height={this.state.height}
              ref={this.state.canvas}
            />
            <div className="umenu-vector-bottom"></div>
          </div>
          <div className="umenu-amount">
            {this.quantityPrizes.map((q: any) => (
              <button
                key={q.name}
                className={`${
                  q.value === this.state.quantityPrizes
                    ? "umenu-amount-active"
                    : ""
                }`}
                onClick={() =>
                  this.setState({
                    dropItems: drops,
                    quantityPrizes: q.value,
                    withoutAnimation:
                      q.value > 1 ? true : this.state.withoutAnimation,
                  })
                }
              >
                {q.name}
              </button>
            ))}
          </div>
          {!this.state.isWin ? (
            <div className="umenu-caseopen" onClick={this.requestSpin}>
              Open case
            </div>
          ) : (
            <div className="umenu-caseopen" onClick={this.takeReward}>
              Take prize
            </div>
          )}
          <div className="umenu-fast">
            <div
              className={`umenu-checkbox-container ${
                this.state.withoutAnimation ? "umenu-checked" : ""
              }`}
              onClick={() =>
                this.setState({
                  withoutAnimation:
                    this.state.quantityPrizes === 1
                      ? !this.state.withoutAnimation
                      : this.state.withoutAnimation,
                })
              }
            >
              {this.state.withoutAnimation && (
                <div className="umenu-checkbox-checked"></div>
              )}
            </div>

            <div className="umenu-title">Fast Opening</div>
            <div className="umenu-subtitle">Without animations</div>
          </div>
          <div className="umenu-content">
            <div className="umenu-title">Premii posibile</div>
            <div className="umenu-items">
              {this.state.itemList
                .sort((a, b) => {
                  if (a.data.rarity < b.data.rarity) {
                    return 1;
                  }
                  if (a.data.rarity > b.data.rarity) {
                    return -1;
                  }
                  return 0;
                })
                .map((i) => {
                  return (
                    <div className="umenu-critem">
                      <img src={prizesPng[i.data.icon]} alt="" />
                      <div className="umenu-name">{i.data.name}</div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </>
    );
  }
}

// OLD

// // import png from "./../../assets/*.png";
// import React, { Component } from "react";
// import { CustomEvent } from "../../../../../modules/custom.event";
// import "./spinner.less";
// import "../../../style/style.css";
// const png = Object.fromEntries(
//   Object.entries(import.meta.glob("./../../assets/*.png", { eager: true })).map(
//     ([key, value]) => {
//       const name = key.match(/\/([^/]+)\.png$/)[1];
//       return [name, value.default];
//     }
//   )
// );
// const svg = Object.fromEntries(
//   Object.entries(import.meta.glob("../../../img/*.svg", { eager: true })).map(
//     ([key, value]) => {
//       const name = key.match(/\/([^/]+)\.svg$/)[1];
//       return [name, value.default];
//     }
//   )
// );
// const rpng = Object.fromEntries(
//   Object.entries(import.meta.glob("./../../assets/*.png", { eager: true })).map(
//     ([key, value]) => {
//       const name = key.match(/\/([^/]+)\.png$/)[1];
//       return [name, value.default];
//     }
//   )
// );

// const prizesPng = Object.fromEntries(
//   Object.entries(
//     import.meta.glob("./../../assets/items/*.png", { eager: true })
//   ).map(([key, value]) => {
//     const name = key.match(/\/([^/]+)\.png$/)[1];
//     return [name, value.default];
//   })
// );

// import { CEF } from "../../../../../modules/CEF";
// import { CustomEventHandler } from "../../../../../../shared/custom.event";
// import { ModalType } from "../../donate-roulette";
// import {
//   drops,
//   RarityType,
// } from "../../../../../../shared/donate/donate-roulette/main";
// import { DropDataBase } from "shared/donate/donate-roulette/Drops/dropBase";
// // @ts-ignore
// import Slot from "./slot.js";
// import { DropSlot } from "./DropSlot";

// // Это пример компонента под реакт для быстрого создания уже рабочего экземпляра.
// export class SpinnerPage extends Component<
//   {
//     type: string;
//     spinFinished(winElements: DropDataBase[]): void;
//     coins: number;
//   },
//   {
//     dropItems: DropDataBase[];
//     // <<<<<<< HEAD
//     quantityPrizes: number;
//     // =======

//     width: number;
//     height: number;
//     canvas: React.RefObject<any>;
//     parent: React.RefObject<any>;
//     ctx: any;
//     countElements: number;
//     speed: number;
//     frameRate: number;
//     maxSpeed: number;
//     duration: number;
//     timeToStop: number;
//     sizeItem: number;
//     currentState: Slot[];
//     itemList: DropSlot[];
//     bgImg: null;
//     lastFrame: number;
//     headResult: Slot;
//     winResult: Slot;
//     winDrop: DropDataBase;
//     cancel: boolean;
//     antiFlood: number;
//     stopFrom: number;
//     sound: boolean;
//     winBuilded: boolean;
//     floodProtection: number;

//     isRun: boolean;
//     isStop: boolean;
//     isWin: boolean;
//     result: number;
//     withoutAnimation: boolean;
//     audio: any;
//     spinCost: number;
//     // >>>>>>> 1ee4c538ad946e4a3712006fcd219ca898dd378a
//   }
// > {
//   private quantityPrizes: {
//     name: string;
//     value: number;
//     checked?: boolean;
//   }[] = [
//     {
//       name: "x1",
//       value: 1,
//       checked: true,
//     },
//     {
//       name: "x3",
//       value: 3,
//     },
//     {
//       name: "x5",
//       value: 5,
//     },
//   ];
//   /** Это наш ивент, через который интерфейс может получать данные от клиента или сервера */
//   private ev: CustomEventHandler;
//   constructor(props: any) {
//     super(props);
//     this.state = {
//       /** По умолчанию используется значение CEF.test. true будет если мы в браузере проверяем интерфейс.*/
//       dropItems: drops,
//       withoutAnimation: false,
//       quantityPrizes: 1,
//       width: 0,
//       height: 0,
//       canvas: React.createRef(),
//       parent: React.createRef(),
//       ctx: null,
//       countElements: 9,
//       speed: 0,
//       frameRate: 36,
//       maxSpeed: 60,
//       duration: 2500,
//       timeToStop: 0,
//       sizeItem: 0,
//       currentState: [],
//       itemList: [],
//       bgImg: null,
//       lastFrame: 0,
//       headResult: null,
//       winResult: null,
//       winDrop: null,
//       cancel: false,
//       antiFlood: 0,
//       stopFrom: 0,
//       sound: true,
//       winBuilded: false,
//       floodProtection: 0,
//       spinCost:
//         this.props.type === ModalType.LUXE
//           ? 1000
//           : this.props.type === ModalType.PREMIUM
//           ? 500
//           : this.props.type === ModalType.STANDART
//           ? 200
//           : null,

//       isRun: false,
//       isStop: false,
//       isWin: false,
//       result: -1,
//       audio: null,
//     };

//     this.onChangeValue = this.onChangeValue.bind(this);

//     this.addWinElement = this.addWinElement.bind(this);
//     this.builWinCombination = this.builWinCombination.bind(this);
//     this.updateState = this.updateState.bind(this);
//     this.addRandomElement = this.addRandomElement.bind(this);
//     this.initGame = this.initGame.bind(this);
//     this.initImages = this.initImages.bind(this);
//     this.removeElement = this.removeElement.bind(this);
//     this.handleStop = this.handleStop.bind(this);
//     this.handleLoop = this.handleLoop.bind(this);
//     this.drawFrame = this.drawFrame.bind(this);
//     this.requestWin = this.requestWin.bind(this);
//     this.start = this.start.bind(this);
//     this.requestSpin = this.requestSpin.bind(this);
//     this.takeReward = this.takeReward.bind(this);

//     this.ev = CustomEvent.register("droulette:spin", (winNumbers: number[]) => {
//       if (winNumbers.length == 1) this.start(winNumbers[0]);
//       else {
//         const items = [];
//         for (let i = 0; i < winNumbers.length; i++) {
//           items.push(
//             this.state.itemList.find(
//               (item) => item.data.dropId == winNumbers[i]
//             ).data
//           );
//         }
//         this.onFinishAnimation(items);
//       }
//     });
//   }
//   onChangeValue(event: any) {
//     this.setState({
//       dropItems: drops,
//       quantityPrizes: event.target.value,
//       withoutAnimation:
//         event.target.value > 1 ? true : this.state.withoutAnimation,
//     });
//   }

//   componentDidMount() {
//     const parent = this.state.parent.current;
//     let itemList: DropSlot[] = this.state.itemList;
//     drops
//       .filter((el) => el.rarity !== RarityType.CASINO)
//       .forEach((d) => {
//         //if (d.roulette.includes(this.props.type as RouletteType)) {
//         itemList.push(new DropSlot(d));
//         //}
//       });
//     this.setState({ ...this.state, itemList });

//     this.setState({
//       ctx: this.state.canvas.current.getContext("2d"),
//       width: parent.clientWidth,
//       // height: parent.offsetWidth / this.state.countElements,
//       height: parent.clientHeight,
//       canvas: this.state.canvas,
//       frameRate: Math.floor(1000 / this.state.frameRate),
//     });
//     this.initImages();

//     setTimeout(this.initGame, 500);
//     // setTimeout(this.start, 1500);
//   }

//   // start() {
//   //   if (!this.state.winBuilded) {
//   //     this.setState({
//   //       winBuilded: false,
//   //       timeToStop: Date.now() + this.state.duration,
//   //       isRun: true,
//   //       isStop: false,
//   //       isWin: false,
//   //       result: 1,
//   //     });
//   //   }
//   // }

//   takeReward() {
//     this.setState({
//       isRun: false,
//       isStop: false,
//       isWin: false,
//       winBuilded: false,
//       result: -1,
//     });
//   }

//   requestSpin() {
//     if (this.state.isRun) return;

//     this.start(50);
//     // CustomEvent.triggerServer("droulette:request", this.props.type, this.state.quantityPrizes);
//   }

//   start(winNumber: number) {
//     // CEF.playSound("roulette-single-spin");
//     // const audio = new Audio(spin);
//     // audio.volume = 0.4;
//     // audio.play();
//     // //this.setState({audio: audio})
//     // setTimeout(() => {
//     //   audio.remove();
//     // })

//     if (this.state.withoutAnimation) {
//       const item = this.state.itemList.find((i) => i.data.dropId == winNumber);
//       this.onFinishAnimation([item.data]);
//     } else {
//       if (!this.state.winBuilded) {
//         this.setState({
//           winBuilded: false,
//           timeToStop: Date.now() + this.state.duration,

//           isRun: true,
//           isStop: false,
//           isWin: false,
//           result: winNumber,
//         });
//       }
//     }
//   }

//   addWinElement(id: number) {
//     const last = this.state.currentState[this.state.currentState.length - 1];
//     let currentOffset = last ? last.posX + last.size : 0;

//     const item = this.state.itemList.find((i) => i.data.dropId == id);
//     const slot = new Slot(
//       this.state.ctx,
//       item,
//       this.state.parent.current.clientWidth / 7,
//       currentOffset
//     );
//     this.state.currentState.push(slot);
//     this.setState({ winDrop: item.data });
//     return slot;
//   }

//   builWinCombination(val: number) {
//     this.setState({ winBuilded: true });
//     for (let index = 0; index < this.state.countElements; index++) {
//       if (index == 0) {
//         this.setState({ headResult: this.addRandomElement() });
//       } else if (index == 3) {
//         this.setState({ winResult: this.addWinElement(val) });
//       } else this.addRandomElement();
//     }
//   }

//   componentWillUnmount() {
//     if (this.ev) this.ev.destroy();
//     CEF.stopSound();
//   }

//   updateState() {
//     if (this.state.cancel) return;
//     if (this.state.lastFrame < Date.now()) {
//       if (this.state.isRun) {
//         this.setState({ lastFrame: Date.now() + this.state.frameRate });

//         if (this.state.timeToStop < Date.now()) this.setState({ isStop: true });

//         if (this.state.isStop) this.handleStop();
//         else this.handleLoop();
//       }
//       this.drawFrame();
//     }

//     //this.state.canvas.current.requestAnimationFrame(this.updateState)
//     requestAnimationFrame(this.updateState, this.state.canvas.current);
//   }

//   addRandomElement() {
//     const last = this.state.currentState[this.state.currentState.length - 1];
//     let currentOffset = last ? last.posX + last.size : 0;

//     const item =
//       this.state.itemList[
//         Math.floor(Math.random() * this.state.itemList.length)
//       ];
//     const slot = new Slot(
//       this.state.ctx,
//       item,
//       this.state.parent.current.clientWidth / 7,
//       currentOffset
//     );
//     this.state.currentState.push(slot);
//     return slot;
//   }

//   initGame() {
//     this.setState({ currentState: [] });

//     for (let index = 0; index < this.state.countElements + 2; index++) {
//       this.addRandomElement();
//     }

//     requestAnimationFrame(this.updateState, this.state.canvas.current);
//   }

//   initImages() {
//     this.state.itemList.forEach((item) => {
//       item.img = new Image(this.state.height, this.state.width);
//       item.img.src =
//         prizesPng[item.data.icon] === undefined
//           ? prizesPng["1"]
//           : prizesPng[item.data.icon];
//       item.rarityImg = new Image(this.state.height, this.state.width);
//       item.rarityImg.src =
//         png[
//           item.data.rarity === RarityType.LEGENDARY
//             ? "gold"
//             : item.data.rarity === RarityType.SPECIAL
//             ? "red"
//             : item.data.rarity === RarityType.UNIQUE
//             ? "pink"
//             : item.data.rarity === RarityType.RARE
//             ? "purple"
//             : item.data.rarity === RarityType.COMMON
//             ? "blue"
//             : "red"
//         ];
//     });
//   }

//   removeElement() {
//     this.state.currentState.shift();
//   }

//   handleStop() {
//     if (this.state.speed > this.state.maxSpeed * 0.8) {
//       if (this.state.currentState[0].canDelete()) {
//         this.removeElement();
//         this.addRandomElement();
//       }

//       this.state.currentState.forEach((item) => {
//         item.moveX(this.state.speed);
//       });
//       this.setState({ speed: this.state.speed - 1 });
//     } else {
//       if (!this.state.winBuilded) {
//         this.builWinCombination(this.state.result);
//         this.setState({ stopFrom: this.state.headResult.posX });
//       }
//       const kof = Math.abs(this.state.headResult.posX / this.state.stopFrom);
//       this.setState({
//         speed: Math.max(Math.floor(this.state.maxSpeed * kof * 0.75 + 3), 5),
//       });
//       if (
//         this.state.headResult.posX <= 0
//         // (this.state.parent.current.clientHeight * 0.85) / -3.2
//       ) {
//         const fix = this.state.headResult.posX;
//         this.state.currentState.forEach((item) => {
//           item.fixPos(fix);
//         });
//         this.setState({ speed: 0 });
//         this.requestWin();
//       } else {
//         this.state.currentState.forEach((item) => {
//           item.moveX(this.state.speed);
//         });
//       }
//       if (this.state.currentState[0].canDelete()) {
//         this.removeElement();
//       }
//     }
//   }

//   handleLoop() {
//     if (!this) return;
//     if (this.state.maxSpeed > this.state.speed)
//       this.setState({ speed: this.state.speed + 5 });

//     if (this.state.currentState[0].canDelete()) {
//       this.removeElement();
//       this.addRandomElement();
//     }

//     this.state.currentState.forEach((item) => {
//       item.moveX(this.state.speed);
//     });
//   }

//   drawFrame() {
//     this.state.ctx.globalCompositeOperation = "normal";
//     this.state.ctx.clearRect(0, 0, this.state.width, this.state.height);
//     this.state.currentState.forEach((item, i) => {
//       item.win(this.state.isWin);
//       item.draw(i);
//     });
//   }

//   requestWin() {
//     setTimeout(() => {
//       this.onFinishAnimation([this.state.winDrop]);
//     }, 100);
//   }

//   onFinishAnimation(items: DropDataBase[]) {
//     this.props.spinFinished(items);
//     this.setState({
//       isRun: false,
//       isStop: false,
//       isWin: true,
//       result: -1,
//     });
//   }

//   render() {
//     return (
//       <>
//         <div className="umenu-open">
//           <div className="umenu-back">
//             <div className="umenu-icon">
//               <img src={svg["back"]} alt="" />
//             </div>
//             <div className="umenu-text">Back</div>
//           </div>
//           <div className="umenu-title">{this.props.type}</div>
//           <button>Prize storage</button>
//           <div
//             className="umenu-slots"
//             id="spinner-container"
//             ref={this.state.parent}
//           >
//             <div className="umenu-vector-top"></div>
//             <canvas
//               width={this.state.width}
//               height={this.state.height}
//               ref={this.state.canvas}
//             />
//             <div className="umenu-vector-bottom"></div>
//           </div>
//           <div className="umenu-amount">
//             {this.quantityPrizes.map((q: any) => (
//               <button
//                 key={q.name}
//                 className={`${
//                   q.value === this.state.quantityPrizes ? "amount-active" : ""
//                 }`}
//                 onClick={() => this.setState({ quantityPrizes: q.value })}
//               >
//                 {q.name}
//               </button>
//             ))}
//           </div>
//           {!this.state.isWin ? (
//             <div className="umenu-caseopen" onClick={this.requestSpin}>
//               Open case
//             </div>
//           ) : (
//             <div className="umenu-caseopen" onClick={this.takeReward}>
//               Take prize
//             </div>
//           )}
//           <div className="umenu-fast">
//             <div
//               className={`umenu-checkbox-container ${
//                 this.state.withoutAnimation ? "umenu-checked" : ""
//               }`}
//               onClick={() =>
//                 this.setState({
//                   withoutAnimation:
//                     this.state.quantityPrizes === 1
//                       ? !this.state.withoutAnimation
//                       : this.state.withoutAnimation,
//                 })
//               }
//             >
//               {this.state.withoutAnimation && (
//                 <div className="umenu-checkbox-checked"></div>
//               )}
//             </div>

//             <div className="umenu-title">Fast Opening</div>
//             <div className="umenu-subtitle">Without animations</div>
//           </div>
//           <div className="umenu-content">
//             <div className="umenu-title">Contents of the case</div>
//             <div className="umenu-items">
//               {this.state.itemList
//                 .sort((a, b) => {
//                   if (a.data.rarity < b.data.rarity) {
//                     return 1;
//                   }
//                   if (a.data.rarity > b.data.rarity) {
//                     return -1;
//                   }
//                   return 0;
//                 })
//                 .map((i) => {
//                   return (
//                     <div className="umenu-critem">
//                       <img src={prizesPng[i.data.icon]} alt="" />
//                       <div className="umenu-name">Porsche Carrera</div>
//                     </div>
//                   );
//                 })}
//             </div>
//           </div>
//         </div>
//       </>
//     );
//   }
// }
