import { LangString } from "../../../../modules/lang";
import React, { Component } from "react";

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
import { CEF } from "../../../../modules/CEF";
import { CustomEvent } from "../../../../modules/custom.event";
import { IFarmOwnerData } from "../../../../../shared/farm/dtos";
import { ACTIVITY_RENT_TIME_IN_HOURS } from "../../../../../shared/farm/progress.config";
import { systemUtil } from "../../../../../shared/system";
import "./style.less";

interface ratingPerson {
  money: number;
  name: string;
  level: number;
  percent: number;
}

export class Rating extends Component<
  {},
  {
    id: number;
    rentTime: [number, number];
    authorizedCapital: number;
    paidOut: number;
    rating: ratingPerson[];
    attentionShow: boolean;
    amountRef: React.RefObject<any>;
    containerRef: React.RefObject<HTMLDivElement>;
    containerRef2: React.RefObject<HTMLDivElement>;
  }
> {
  constructor(props: any) {
    super(props);

    this.state = {
      id: 1,
      rentTime: [0, 0],
      authorizedCapital: 40000,
      paidOut: 2000,
      rating: [
        {
          money: 30000,
          name: "Nick Gross",
          level: 40,
          percent: 10,
        },
        {
          money: 300,
          name: "Borz Borz",
          level: 40,
          percent: 100,
        },
        {
          money: 300,
          name: "Borz Borz",
          level: 40,
          percent: 67,
        },
        {
          money: 300,
          name: "Borz Borz",
          level: 40,
          percent: 30,
        },
      ],
      attentionShow: false,
      amountRef: React.createRef(),
      containerRef: React.createRef(),
      containerRef2: React.createRef(),
    };

    CustomEvent.register("farm:owner", (data: IFarmOwnerData) => {
      let maxEarned = 0;
      data.workers.forEach((worker) => {
        if (worker.money > maxEarned) maxEarned = worker.money;
      });

      this.setState({
        id: data.id,
        authorizedCapital: data.capital,
        paidOut: data.totalPaid,
        rentTime: [
          Math.floor(
            (data.rentedAt +
              ACTIVITY_RENT_TIME_IN_HOURS * 3600 -
              systemUtil.timestamp) /
              3600
          ),
          Math.floor(
            ((data.rentedAt +
              ACTIVITY_RENT_TIME_IN_HOURS * 3600 -
              systemUtil.timestamp) %
              3600) /
              60
          ),
        ],
        rating: data.workers.map((worker) => {
          return {
            name: worker.name,
            level: worker.level,
            money: worker.money,
            percent: (worker.money / maxEarned) * 100,
          };
        }),
      });
    });
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
    const container2 = this.state.containerRef2.current;
    const zoomCountOne = window.innerWidth / 1920;
    const zoomCountTwo = window.innerHeight / 1080;
    if (container && container2) {
      if (zoomCountOne < zoomCountTwo) {
        container.style.zoom = zoomCountOne.toString();
        container2.style.zoom = zoomCountOne.toString();
      } else {
        container.style.zoom = zoomCountTwo.toString();
        container2.style.zoom = zoomCountTwo.toString();
      }
    }
  };

  close() {
    CEF.gui.setGui(null);
  }

  closeAttention() {
    this.setState({ ...this.state, attentionShow: false });
  }

  addCapital() {
    this.setState({ ...this.state, attentionShow: !this.state.attentionShow });
  }

  stopRent() {
    CustomEvent.triggerServer("farm:rent:stop", this.state.id);
  }

  spaceNumber(value: number) {
    return value.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, " ");
  }

  enterAttention() {
    const value = Number(
      systemUtil.filterInput(this.state.amountRef.current.value)
    );

    if (isNaN(value) || value <= 0 || value > 999999)
      return CEF.alert.setAlert(
        "error",
        LangString(
          "components.Farm.components.Rating.Rating.1c1229c06ab9407cef44579ae56a0db1"
        )
      );

    CustomEvent.triggerServer("farm:capital:add", value);
  }

  render() {
    return (
      <div className="farmrating__wrapper">
        <div
          className={`farmrating__modal ${
            this.state.attentionShow ? "show" : ""
          }`}
        >
          <div
            className="farmrating__modal__content"
            ref={this.state.containerRef2}
          >
            <div className="farmrating__modal__content__title">
              Add statuary capital
            </div>
            <div className="farmrating__modal__content__item">
              <svg
                className="farmrating__modal__content__item__icon"
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="50"
                viewBox="0 0 50 50"
                fill="none"
              >
                <path
                  d="M0 2C0 0.895432 0.895431 0 2 0H48C49.1046 0 50 0.895431 50 2V48C50 49.1046 49.1046 50 48 50H2C0.895432 50 0 49.1046 0 48V2Z"
                  fill="url(#paint0_radial_1225_6478)"
                  fill-opacity="0.16"
                />
                <path
                  d="M35.6066 14.3934C32.7735 11.5604 29.0066 10 25 10C20.9934 10 17.2265 11.5603 14.3934 14.3934C11.5604 17.2265 10 20.9934 10 25C10 29.0066 11.5603 32.7735 14.3934 35.6066C17.2265 38.4396 20.9934 40 25 40C29.0066 40 32.7735 38.4397 35.6066 35.6066C38.4396 32.7735 40 29.0066 40 25C40 20.9934 38.4397 17.2265 35.6066 14.3934ZM25 36.8359C18.4737 36.8359 13.1641 31.5263 13.1641 25C13.1641 18.4737 18.4737 13.1641 25 13.1641C31.5263 13.1641 36.8359 18.4737 36.8359 25C36.8359 31.5263 31.5263 36.8359 25 36.8359Z"
                  fill="white"
                />
                <path
                  d="M25 14.9219C19.443 14.9219 14.9219 19.443 14.9219 25C14.9219 30.557 19.443 35.0781 25 35.0781C30.557 35.0781 35.0781 30.557 35.0781 25C35.0781 19.443 30.557 14.9219 25 14.9219ZM28.7811 28.596C28.5676 28.9977 28.2799 29.3229 27.9178 29.5708C27.5554 29.8189 27.1389 30.0002 26.6676 30.1139C26.4097 30.1764 26.1449 30.221 25.8734 30.2494V32.2979H24.1156V30.2107C23.6819 30.1513 23.2538 30.0567 22.8355 29.9279C22.0614 29.6898 21.3667 29.3526 20.7517 28.9159L21.6597 27.1448C21.749 27.2341 21.9101 27.3508 22.1433 27.4946C22.3763 27.6385 22.6517 27.7825 22.9694 27.9262C23.2868 28.0702 23.6391 28.1918 24.0261 28.2909C24.4129 28.3902 24.8096 28.4397 25.2165 28.4397C26.3477 28.4397 26.9132 28.0776 26.9132 27.3531C26.9132 27.125 26.8485 26.9315 26.7198 26.7727C26.5907 26.6141 26.4072 26.4752 26.1691 26.3561C25.9311 26.2369 25.6432 26.1279 25.306 26.0286C24.9294 25.9181 24.5523 25.809 24.1749 25.7013C23.6688 25.5624 23.2298 25.4111 22.8577 25.2472C22.4857 25.0836 22.1754 24.8901 21.9275 24.6668C21.6794 24.4435 21.4933 24.1857 21.3695 23.8929C21.2454 23.6004 21.1834 23.2507 21.1834 22.8437C21.1834 22.3079 21.2825 21.8316 21.4812 21.415C21.6794 20.9982 21.9547 20.651 22.307 20.3732C22.6592 20.0955 23.0685 19.8845 23.5349 19.7405C23.7254 19.6824 23.9193 19.6363 24.1156 19.6025V17.6869H25.8734V19.5773C26.3019 19.6326 26.7081 19.7315 27.0917 19.8743C27.7168 20.1078 28.2624 20.3829 28.729 20.7004L27.8212 22.3674C27.7516 22.298 27.6251 22.2037 27.4415 22.0844C27.2579 21.9654 27.0346 21.8489 26.7718 21.7347C26.5088 21.6207 26.2236 21.5242 25.9162 21.4445C25.6099 21.3654 25.2948 21.3254 24.9785 21.3255C24.4129 21.3255 23.9911 21.4296 23.7135 21.6381C23.4356 21.8464 23.2967 22.1391 23.2967 22.5161C23.2967 22.7345 23.3488 22.9157 23.453 23.0595C23.5571 23.2035 23.7082 23.3298 23.9069 23.4389C24.1053 23.5482 24.3557 23.6472 24.6585 23.7365C24.9611 23.8258 25.3108 23.9203 25.7077 24.0194C26.2236 24.1583 26.6924 24.3071 27.1142 24.4657C27.5358 24.6245 27.8929 24.823 28.1856 25.0611C28.4781 25.2993 28.704 25.5845 28.8629 25.9168C29.0215 26.2494 29.1009 26.6586 29.1009 27.1446C29.1011 27.7104 28.9942 28.194 28.7811 28.596Z"
                  fill="white"
                />
                <defs>
                  <radialGradient
                    id="paint0_radial_1225_6478"
                    cx="0"
                    cy="0"
                    r="1"
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="translate(25 25) rotate(90) scale(25)"
                  >
                    <stop stop-color="#999999" stop-opacity="0.51" />
                    <stop offset="1" stop-color="white" stop-opacity="0.53" />
                  </radialGradient>
                </defs>
              </svg>
              <div className="farmrating__modal__content__item__text">
                Enter the amount
                <div className="farmrating__modal__content__item__input">
                  <div>$</div>
                  <input
                    ref={this.state.amountRef}
                    type="number"
                    placeholder={"0"}
                  />
                </div>
              </div>
            </div>
            <div className="farmrating__modal__content__btns">
              <div
                className="farmrating__modal__content__btn"
                onClick={() => this.enterAttention()}
              >
                Add
              </div>

              <div
                className="farmrating__modal__content__btn"
                onClick={() => this.closeAttention()}
              >
                Cancel
              </div>
            </div>
          </div>
        </div>
        <div className="farmrating" ref={this.state.containerRef}>
          <div className="farmrating__header">
            <div className="farmrating__header__item">
              <img src={png["fieldHeader"]} alt="" />

              <div className="farmrating__header__title">
                Your <span>Field</span>
              </div>
            </div>
            <div className="farmrating__header__exit">
              Exit
              <div
                className="farmrating__header__exit__btn"
                onClick={() => this.close()}
              >
                <img src={png["close"]} alt="" />
              </div>
            </div>
          </div>
          <div className="farmrating__btns">
            <div className="farmrating__btn" onClick={() => this.addCapital()}>
              Add capital
            </div>
            <div className="farmrating__btn" onClick={() => this.stopRent()}>
              Cansel Lease
            </div>
          </div>
          <div className="farmrating__line" />
          <div className="farmrating__items">
            <div className="farmrating__item">
              <div className="farmrating__item__title">
                {this.spaceNumber(this.state.authorizedCapital)} $
              </div>
              <div className="farmrating__item__text">
                {LangString(
                  "components.Farm.components.Rating.Rating.acf42671421c93351a30e1d0fff13ed8"
                )}
              </div>
            </div>
            <div className="farmrating__item">
              <div className="farmrating__item__title">
                {this.spaceNumber(this.state.paidOut)} $
              </div>
              <div className="farmrating__item__text">
                {LangString(
                  "components.Farm.components.Rating.Rating.a42d02426dab44757fda330ec6492b22"
                )}
              </div>
            </div>
            <div className="farmrating__item big">
              <div className="farmrating__item__title">
                {this.state.rentTime[0]}{" "}
                {LangString(
                  "components.Farm.components.Rating.Rating.c3392021199dbb26ca20c6e446bca389"
                )}{" "}
                {this.state.rentTime[1]}{" "}
                {LangString(
                  "components.Farm.components.Rating.Rating.68b2d9e668cb0ebcb23a589c4d8c0640"
                )}
              </div>
              <div className="farmrating__item__text">
                {" "}
                {LangString(
                  "components.Farm.components.Rating.Rating.4a217c1ebdfebb7c3848f3ea7a616c5c"
                )}
              </div>
            </div>
          </div>
          <div className="farmrating__line" />
          <div className="farmrating__bars">
            {this.state.rating.map((el, key) => {
              return (
                <div className="farmrating__bar" key={key}>
                  <div className="farmrating__bar__title">
                    ${this.spaceNumber(el.money)}
                  </div>
                  <div
                    className="farmrating__bar__bar"
                    style={{ height: `${1.18 * el.percent}px` }}
                  />
                  <div className="farmrating__bar__text">{el.name}</div>
                  <div className="farmrating__bar__lvl">{el.level} lvl</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

// OLD

// <div className="farm-rating">
// 				<div className="exit" onClick={() => this.close()}>
// 					<div className="exit__icon">
// 						<img src={svg["closeIcon"]} alt="#" />
// 					</div>
// 					<div className="exit__title">
// 						{LangString(
// 							"components.Farm.components.Rating.Rating.0a959917e58ef9e68ac3921e9f6e7734",
// 						)}
// 					</div>
// 				</div>

// 				<img src={png["logo"]} className="farm-entrance__logo" alt="" />
// 				<img src={png["dot"]} className="farm-entrance__dot" alt="" />

// 				<img src={svg["block"]} alt="" className="farm-statistic__block" />
// 				<img src={png["shovel"]} alt="" className="farm-statistic__shovel" />

// 				{this.state.attentionShow && (
// 					<div className="farm-rating-attention">
// 						<div className="farm-rating-attention-body">
// 							<img
// 								src={svg["close"]}
// 								className="farm-rating-attention-body__close"
// 								alt=""
// 								onClick={() => this.closeAttention()}
// 							/>

// 							<div className="farm-rating-attention-body__title">
// 								{LangString(
// 									"components.Farm.components.Rating.Rating.85658e92c8a91e70927bba3f615aef5e",
// 								)}
// 							</div>

// 							<div className="farm-rating-attention-body__input">
// 								<div>$</div>
// 								<input
// 									ref={this.state.amountRef}
// 									type="number"
// 									placeholder={LangString(
// 										"components.Farm.components.Rating.Rating.ee86d17ff064773739cf79d9cb02ca70",
// 									)}
// 								/>
// 							</div>

// 							<div className="farm-rating-attention-body-buttons">
// 								<div onClick={() => this.enterAttention()}>
// 									{LangString(
// 										"components.Farm.components.Rating.Rating.5d0f747d424468ce28e7aa387c4d5a00",
// 									)}
// 								</div>
// 								<div onClick={() => this.closeAttention()}>
// 									{LangString(
// 										"components.Farm.components.Rating.Rating.c9273483d563224c8059b3fde51e438a",
// 									)}
// 								</div>
// 							</div>
// 						</div>
// 					</div>
// 				)}

// 				<div className="farm-rating-body">
// 					<div className="farm-rating-body__buttons">
// 						<div
// 							className="farm-rating-body__button"
// 							onClick={() => this.addCapital()}
// 						>
// 							<img src={svg["coin"]} alt="" />
// 							{LangString(
// 								"components.Farm.components.Rating.Rating.6b4a41a845404b442cc30abe2657707f",
// 							)}
// 						</div>

// 						<div
// 							className="farm-rating-body__button"
// 							onClick={() => this.stopRent()}
// 						>
// 							<img src={svg["closeIcon"]} alt="" />
// 							{LangString(
// 								"components.Farm.components.Rating.Rating.76fc9d46db96fb0802744c5ac52d3656",
// 							)}
// 						</div>
// 					</div>

// 					<div className="farm-statistic-body-information">
// 						<div>
// 							<span>
// 								{LangString(
// 									"components.Farm.components.Rating.Rating.acf42671421c93351a30e1d0fff13ed8",
// 								)}
// 							</span>
// 							<p>{this.spaceNumber(this.state.authorizedCapital)} $</p>
// 						</div>
// 						<hr />
// 						<div>
// 							<span>
// 								{LangString(
// 									"components.Farm.components.Rating.Rating.a42d02426dab44757fda330ec6492b22",
// 								)}
// 							</span>
// 							<p>{this.spaceNumber(this.state.paidOut)} $</p>
// 						</div>
// 						<div>
// 							<span>
// 								{LangString(
// 									"components.Farm.components.Rating.Rating.4a217c1ebdfebb7c3848f3ea7a616c5c",
// 								)}
// 							</span>
// 							<p>
// 								{this.state.rentTime[0]}{" "}
// 								{LangString(
// 									"components.Farm.components.Rating.Rating.c3392021199dbb26ca20c6e446bca389",
// 								)}{" "}
// 								{this.state.rentTime[1]}{" "}
// 								{LangString(
// 									"components.Farm.components.Rating.Rating.68b2d9e668cb0ebcb23a589c4d8c0640",
// 								)}
// 							</p>
// 						</div>
// 					</div>

// 					<div className="farm-rating-body-content">
// 						{this.state.rating.map((el, key) => {
// 							return (
// 								<div className="farm-rating-body-content-block" key={key}>
// 									<div className="farm-rating-body-content-block__money">
// 										{this.spaceNumber(el.money)}$
// 									</div>
// 									<div
// 										className="farm-rating-body-content-block__column"
// 										style={{ height: `${el.percent}%` }}
// 									/>
// 									<div className="farm-rating-body-content-block__name">
// 										{el.name}
// 									</div>
// 									<div className="farm-rating-body-content-block__lvl">
// 										{el.level} lvl
// 									</div>
// 								</div>
// 							);
// 						})}
// 					</div>
// 				</div>
// 			</div>
