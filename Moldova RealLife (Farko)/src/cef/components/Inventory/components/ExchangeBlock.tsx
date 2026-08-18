import React from "react";
import { ExchangeData, ExchangeReadyStatus, InventoryItemCef } from "../../../../shared/inventory";
import { CustomEvent } from "../../../modules/custom.event";
// @ts-ignore
const svg = Object.fromEntries(
  Object.entries(import.meta.glob("../images/svg/*.svg", { eager: true })).map(
    ([key, value]) => {
      const name = key.match(/\/([^/]+)\.svg$/)[1];
      //@ts-ignore
      return [name, value.default];
    },
  ),
);
// @ts-ignore
const iconsItems = Object.fromEntries(
  Object.entries(
    import.meta.glob("../../../../shared/icons/*.png", { eager: true }),
  ).map(([key, value]) => {
    const name = key.match(/\/([^/]+)\.png$/)[1];
    //@ts-ignore
    return [name, value.default];
  }),
);

interface ExchangeBlockProps {
  exchangeData: ExchangeData;
  onInputChange: (value: string) => void;
}

export const ExchangeBlock: React.FC<ExchangeBlockProps> = (props) => {
  const { exchangeData, onInputChange } = props;

  const getExchangeReadyButtonClass = (): string => {
    if (
      exchangeData.myData.readyStatus === ExchangeReadyStatus.NOT_READY ||
      exchangeData.targetData.readyStatus === ExchangeReadyStatus.NOT_READY
    ) {
      return "exchange-forReady";
    }
    return "exchange-forConfirm";
  };
  // const getExchangeWeight = (items: InventoryItemCef[]): number => {
  //   return items.reduce((acc, item) => acc + (item ? Number(item[3]) : 0), 0);
  // };

  const drawExchangeItems = (items: InventoryItemCef[], blockInteractions: boolean) => {
    const MAX_ITEMS_IN_EXCHANGE = 10;

    const itemsToDraw = items.concat();
    const fillAmount = MAX_ITEMS_IN_EXCHANGE - items.length;
    for (let i = 0; i < fillAmount; i++) itemsToDraw.push(null);

    return itemsToDraw.map((item, key) => {
      if (item === null) {
        return <div className="slot" tabIndex={-1} key={key} />;
      }

      let doubleClickTime: number = null;
      const itemId = item[0];
      return (
        <div
          tabIndex={-1}
          key={key}
          className={blockInteractions ? "slot" : "slot"}
          onClick={
            blockInteractions
              ? () => {}
              : () => {
                  if (
                    doubleClickTime === null ||
                    Date.now() > doubleClickTime
                  ) {
                    doubleClickTime = Date.now() + 700;
                    return;
                  }

                  doubleClickTime = null;
                  CustomEvent.triggerServer(
                    "inventory::exchange::delete",
                    itemId,
                  );

                  console.log("delete item", itemId);

                }
          }
          // onKeyDown={
          //   blockInteractions
          //     ? () => {}
          //     : () => {
          //         if (
          //           doubleClickTime === null ||
          //           Date.now() > doubleClickTime
          //         ) {
          //           doubleClickTime = Date.now() + 700;
          //           return;
          //         }

          //         doubleClickTime = null;
          //         CustomEvent.triggerServer(
          //           "inventory::exchange::delete",
          //           itemId,
          //         );

          //       }
          // }
        >
          {" "}
          <div className="item">
            <img tabIndex={-1} src={iconsItems[`Item_${item[1]}`]} alt="" />
            <span tabIndex={-1}>{item[2]}</span>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="exchange-blocks">
      <div className="exchange-blocks-block">
        <div className="exchange-title">
          Trade cu
          <span> {exchangeData.targetData.playerName}</span>
        </div>
        <div className="exchange-top">
          <div className="exchange-title exchange-title-you element-title">
            <div className="element-img">
              <h1>Tu oferi</h1>
            </div>
            {/* <div className="inventory-weight">
                    <div className="kg">
                      <p>
                        {(getExchangeWeight(exchangeData.myData.items) / 1000).toFixed(1)} /{" "}
                        <span>{(getExchangeWeight(exchangeData.myData.items) / 1000).toFixed(1)} kg</span>
                      </p>
                    </div>
                  </div> */}
          </div>
        </div>

        <div className="inventory-slots">
          {drawExchangeItems(
            exchangeData.myData.items,
            exchangeData.myData.readyStatus !==
              ExchangeReadyStatus.NOT_READY,
          )}
        </div>

        <div className="exchange-left-input">
          {/* <p>Specify the additional payment (if necessary)</p> */}
          <div className="exchange-input">
            <img src={svg.coin} alt="" />
            <input
              type="number"
              placeholder="Your additional payment"
              disabled={
                exchangeData.myData.readyStatus !==
                ExchangeReadyStatus.NOT_READY
              }
              onChange={(event) =>
                onInputChange(event.currentTarget.value)
              }
              value={exchangeData.myData.money}
            />

            {/* <button>Accept</button> */}
          </div>
        </div>
      </div>

      <div className="exchange-blocks-block">
        <div className="exchange-top">
          <div className="exchange-title element-title">
            <div className="element-img">
              <h1>
                Tu primesti
              </h1>
            </div>
          </div>
        </div>
        <div className="inventory-slots">
          {drawExchangeItems(
            exchangeData.targetData.items,
            true,
          )}
        </div>

        <div className="exchange-left-input exchange-left-input-target">
          <div className="exchange-input-target">
            <div className="exchange-input-target-item">
              <span className="description">Plata ta suplimentara</span>
              <span className="value">$ {new Intl.NumberFormat('ru-RU').format(exchangeData.targetData.money)}</span>
            </div>
            <div className="exchange-input-target-item ready-status-block">
              <span className="ready-text">{exchangeData.targetData.readyStatus === ExchangeReadyStatus.NOT_READY ? "Jucatorul nu este pregatit pentru schimb" : "Jucatorul este pregatit pentru schimb"}</span>
              <div className="ready-status">
                {exchangeData.targetData.readyStatus === ExchangeReadyStatus.NOT_READY ? (
                  <div className="ready-status-item">
                    <img src={svg.notReady} alt="" />
                  </div>
                ) : (
                  <div className="ready-status-item">
                    <img src={svg.ready} alt="" />
                  </div>
                )}
              </div>
            </div>
          </div>
            {/* <img src={svg.coin} alt="" />
            <input
              type="number"
              placeholder="0"
              disabled={true}
              value={exchangeData.targetData.money}
            />
          </div> */}
        </div>

        <div className="exchange-buttons">
          <div
            className={`button accept ${getExchangeReadyButtonClass()}`}
            onClick={() =>
              CustomEvent.triggerServer(
                "inventory::exchange::confirm",
              )
            }
            onKeyDown={() =>
              CustomEvent.triggerServer(
                "inventory::exchange::confirm",
              )
            }
          >
            <span>{exchangeData.targetData.readyStatus === ExchangeReadyStatus.READY && exchangeData.myData.readyStatus === ExchangeReadyStatus.READY ? "Confirm" : "Accept"}</span>
          </div>

          <div
            className="button"
            onClick={() =>
              CustomEvent.triggerServer(
                "inventory::exchange::decline",
              )
            }
            onKeyDown={() =>
              CustomEvent.triggerServer(
                "inventory::exchange::decline",
              )
            }
          >
            <span>Respinge</span>
          </div>
        </div>
      </div>
    </div>
  );
}; 