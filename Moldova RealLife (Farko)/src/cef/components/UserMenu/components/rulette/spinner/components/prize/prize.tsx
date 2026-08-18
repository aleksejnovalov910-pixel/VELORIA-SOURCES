import React, { Component } from "react";
import "./prize.less";

const png = Object.fromEntries(
  Object.entries(
    import.meta.glob("../../../../assets/*.png", { eager: true })
  ).map(([key, value]) => {
    const name = key.match(/\/([^/]+)\.png$/)[1];
    return [name, value.default];
  })
);

const prizesPng = Object.fromEntries(
  Object.entries(
    import.meta.glob("../../../../assets/items/*.png", { eager: true })
  ).map(([key, value]) => {
    const name = key.match(/\/([^/]+)\.png$/)[1];
    return [name, value.default];
  })
);

import { RarityType } from "../../../../../../../../shared/donate/donate-roulette/main";
import { DropDataBase } from "shared/donate/donate-roulette/Drops/dropBase";

// Это пример компонента под реакт для быстрого создания уже рабочего экземпляра.
export class Prize extends Component<
  {
    item: DropDataBase;
    prizeType?: "storage" | "roulette";
    selected?: boolean;
    clicked?: any;
  },
  {}
> {
  /** Это наш ивент, через который интерфейс может получать данные от клиента или сервера */
  constructor(props: any) {
    super(props);
    this.state = {};

    this.press = this.press.bind(this);
  }

  press() {
    if (this.props.prizeType === "storage") {
      this.props.clicked();
      //this.setState({selected: !this.props.selected})
    }
  }

  render() {
    return (
      <>
        <div className="umenu-witem" onClick={this.press}>
          <img src={prizesPng[`${this.props.item.icon}`]} alt="" />
          <div className="umenu-text">{this.props.item.name}</div>
        </div>
      </>
    );
  }
}
