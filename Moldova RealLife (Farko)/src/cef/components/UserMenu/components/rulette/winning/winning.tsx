import React, { Component } from "react";
import "./winning.less";
import "../../../style/style.css";
import { DropDataBase } from "../../../../../../shared/donate/donate-roulette/Drops/dropBase";
import png from "*.png";
import {
  drops,
  RarityType,
} from "../../../../../../shared/donate/donate-roulette/main";
import { Prize } from "../spinner/components/prize/prize";
import { VipDropData } from "../../../../../../shared/donate/donate-roulette/Drops/vipDrop";
import {
  DropSellType,
  RouletteType,
} from "../../../../../../shared/donate/donate-roulette/enums";
import { RealDropData } from "../../../../../../shared/donate/donate-roulette/Drops/realDrop";
import { VehicleDropData } from "../../../../../../shared/donate/donate-roulette/Drops/vehicleDrop";
import { StorageModal } from "../storage/storageModal";
import { CustomEvent } from "../../../../../modules/custom.event";
import { DropSlot } from "../spinner/DropSlot";

const prizesPng = Object.fromEntries(
  Object.entries(
    import.meta.glob("./../../assets/items/*.png", { eager: true })
  ).map(([key, value]) => {
    const name = key.match(/\/([^/]+)\.png$/)[1];
    return [name, value.default];
  })
);

// Это пример компонента под реакт для быстрого создания уже рабочего экземпляра.
export class WinningPage extends Component<
  {
    displayDrops: DropDataBase[];
    takePressed(): void;
    coins: number;
    toStorage(): void;
  },
  {
    //displayDrops: DropDataBase[];
    modalShow: boolean;
    itemList: DropSlot[];
  }
> {
  /** Это наш ивент, через который интерфейс может получать данные от клиента или сервера */
  constructor(props: any) {
    super(props);
    this.state = {
      //displayDrops: [],
      modalShow: false,
      itemList: [],
    };
    this.closeModal = this.closeModal.bind(this);
    this.sellPress = this.sellPress.bind(this);
  }

  componentDidMount() {
    let itemList: DropSlot[] = this.state.itemList;
    drops
      .filter((el) => el.rarity !== RarityType.CASINO)
      .forEach((d) => {
        itemList.push(new DropSlot(d));
      });
    this.setState({ ...this.state, itemList });
  }

  sellPress() {
    this.setState({ modalShow: true });
  }

  getDonatePrice() {
    return this.props.displayDrops
      .filter((d) => d.sellType === DropSellType.DONATE)
      .map((e) => e.sellPrice)
      .reduce((a, b) => a + b, 0);
  }

  getDollarsPrice() {
    return this.props.displayDrops
      .filter((d) => d.sellType === DropSellType.DOLLARS)
      .map((e) => e.sellPrice)
      .reduce((a, b) => a + b, 0);
  }

  closeModal() {
    this.setState({ modalShow: false });
  }

  render() {
    return (
      <>
        <div className="umenu-win-page">
          <div className="umenu-wtitle">Felicitari! Ai castigat: </div>
          <div className="umenu-witems">
            {" "}
            {this.props.displayDrops.map((item) => {
              return <Prize key={item.dropId} item={item} />;
            })}
          </div>
          <div className="umenu-wbtns">
            <div
              className="umenu-actionbutton"
              onClick={() => {
                this.props.takePressed();
                this.props.toStorage();
              }}
            >
              Depozit premii
            </div>
            <div
              className="umenu-actionbutton umenu-centerbtn-win"
              onClick={this.props.takePressed}
            >
              {this.props.displayDrops.length === 1
                ? "Take prize"
                : "Take prizes"}
            </div>
            <div
              className="umenu-actionbutton"
              onClick={() => {
                CustomEvent.triggerServer(
                  "droulette:sellDrops",
                  this.props.displayDrops.map((d) => d.dropId)
                );
                this.closeModal();
                this.props.takePressed();
              }}
            >{`Vinde pentru ${
              this.getDonatePrice() === 0 ? "" : this.getDonatePrice()
            }
                    
                      ${
                        this.getDollarsPrice() === 0
                          ? " "
                          : "$" + this.getDollarsPrice()
                      }`}</div>
          </div>
          <div className="winningpage__content">
            <div className="winningpage__content__title">
              Continutul ruletei
            </div>
            <div className="winningpage__content__items">
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
                    <div className="winningpage__content__item">
                      <img src={prizesPng[i.data.icon]} alt="" />
                      <div className="winningpage__content__item__name">
                        {i.data.name}
                      </div>
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
