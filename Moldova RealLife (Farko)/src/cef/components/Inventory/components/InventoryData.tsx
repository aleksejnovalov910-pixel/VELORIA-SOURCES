import { InventoryDataCef, InventoryEquipList, InventoryItemCef, OWNER_TYPES, CONTAINERS_DATA, inventoryShared, convertInventoryItemObjectToArray, ExchangeData, ExchangeReadyStatus, PLAYER_INVENTORY_MAX_LEVEL, InventoryWeaponPlayerData } from "../../../../shared/inventory";
import { CEF } from "../../../modules/CEF";
import { system } from "../../../modules/system";
import { LangString } from "../../../modules/lang";
import { CustomEvent } from "../../../modules/custom.event";
import { systemUtil } from "../../../../shared/system";

const generateTestInventory = (count = 15) => {
  const items = inventoryShared.items.map((item, index) => {
    return convertInventoryItemObjectToArray({
      id: index + 1,
      item_id: item.item_id,
      count: item.default_count || 1,
      serial: "test",
      extra: `{
        "slot": 1
      }`,
    });
  });
  const res: InventoryItemCef[] = [];
  for (let id = 0; id < count; id++) {
    res.push(systemUtil.randomArrayElement(items));
  }
  return res;
};

export class InventoryData {
  static renderTestBlock(count = 3) {
    const data: InventoryDataCef[] = [];
    const myItems = [
      convertInventoryItemObjectToArray({
        item_id: 861,
        id: 121,
        count: 1,
        serial: "123123",
        extra: `{
          "slot": 1
        }`,
      }),
      convertInventoryItemObjectToArray({
        item_id: 500,
        id: 120,
        count: 1,
        serial: "123123",
        extra: `{
          "slot": 1
        }`,
      }),
      ...generateTestInventory(system.getRandomInt(10, 30)),
    ];

    myItems
      .filter((q) => CONTAINERS_DATA.find((s) => s.item_id === q[1]))
      .map((item) => {
        data.push({
          owner_id: item[0],
          owner_type: CONTAINERS_DATA.find((s) => s.item_id === item[1])
            .owner_type,
          items: myItems,
          weight_max: 80000,
          name: LangString(
            "components.Inventory.index_new.c3a41681bc690c0555cb5bfdb4512b63",
          ),
          desc: `#${item[0]}`,
        });
      });

    data.push({
      owner_id: CEF.id,
      owner_type: OWNER_TYPES.PLAYER,
      items: myItems,
      weight_max: 80000,
      name: LangString(
        "components.Inventory.index_new.6e8a49635a29e0beb37948749b4b9468",
      ),
      desc: "",
    });
    data.push({
      owner_id: 0,
      owner_type: OWNER_TYPES.WORLD,
      items: generateTestInventory(system.getRandomInt(5, 15)),
      weight_max: 80000,
      name: LangString(
        "components.Inventory.index_new.a17c93a09e8ecb30a12db5c660d64505",
      ),
      desc: "",
    });
    
    data.push({
      owner_id: 0,
      owner_type: OWNER_TYPES.BAG,
      items: generateTestInventory(system.getRandomInt(5, 15)),
      weight_max: 80000,
      name: "Backpack data",
      desc: "Backpack",
      show: true,
    });
    
    for (let q = 0; q < count; q++) {
      const id = system.getRandomInt(1000, 10000);
      const items = generateTestInventory(system.getRandomInt(5, 10));
      data.push({
        owner_id: id,
        owner_type: OWNER_TYPES.PLAYER,
        items,
        weight_max: 80000,
        name: LangString(
          "components.Inventory.index_new.04a41ce64245440ca4a27902591192a5",
        ),
        desc: `#${id}`,
      });
    }
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const hotkeys: any = [];
    for (let q = 0; q < 9; q++) {
      if (system.getRandomInt(1, 100) < 50) {
        hotkeys.push(null);
      } else {
        const item = system.randomArrayElement(myItems);
        hotkeys.push(item[0]);
      }
    }

    return {
      blocks: data,
      hotkeys,
      weapons: {
        item_id: 500,
        id: 120,
        ammo: 120,
        serial: "aqsasd",
        max_ammo: 100,
      },
      exchangeData: {
        myData: {
          playerName: "Abema",
          money: 0,
          items: generateTestInventory(system.getRandomInt(1, 3)),
          readyStatus: ExchangeReadyStatus.NOT_READY,
        },
        targetData: {
          playerName: "aboba",
          money: 45465654,
          items: generateTestInventory(system.getRandomInt(1, 3)),
          readyStatus: ExchangeReadyStatus.NOT_READY,
        },
      },
      isExchangeOpened: false
    };
  }

  static registerEventHandlers(instance: any) {
    const openExchangeEv = CustomEvent.register(
      "inventory:exchange",
      (
        myInventory: InventoryDataCef,
        exchange: ExchangeData,
        equip: InventoryEquipList,
        weapons: InventoryWeaponPlayerData,
        hotkeys: [number, number, number, number, number],
        inv_level: number,
      ) => {
        instance.openExchangeMenu(
          myInventory,
          exchange,
          equip,
          weapons,
          hotkeys,
          inv_level,
        );
      },
    );

    const updateExchangeEv = CustomEvent.register(
      "inventory:exchange:update",
      (exchangeData: ExchangeData) => {
        instance.setState({
          exchangeData,
        });
      },
    );

    const openInventoryEv = CustomEvent.register(
      "inventory:open",
      (
        blocks: InventoryDataCef[],
        equip: InventoryEquipList,
        weapons: InventoryWeaponPlayerData,
        hotkeys: [number, number, number, number, number],
        inv_level: number,
        hunger: number,
        water: number,
        armorSlot: number | null,
        phoneSlot: number | null,
        bagSlot: number | null,
      ) => {
        instance.openInventory(blocks, equip, weapons, hotkeys, inv_level, hunger, water, armorSlot, phoneSlot, bagSlot);
      },
    );
    
    const dressEv = CustomEvent.register(
      "dress:data",
      (equip: InventoryEquipList) => {
        instance.setState({ equip });
      },
    );

    CustomEvent.register(
      "inventory:updateSelfBlock",
      (myInventoryBlock: InventoryDataCef) => {
        const blocks = instance.state.blocks || [];
        const existingMyBlockIdx = blocks.findIndex(
          (block: InventoryDataCef) =>
            block.owner_type === OWNER_TYPES.PLAYER &&
            block.owner_id === CEF.id,
        );
        if (existingMyBlockIdx !== -1) {
          blocks.splice(existingMyBlockIdx, 1);
        }

        blocks.push(myInventoryBlock);

        instance.setState({
          blocks,
        });
      },
    );

    CustomEvent.register(
      "inventory:update",
      (
        blocks: InventoryDataCef[],
        allNearest: {
          owner_type: number;
          owner_id: number;
          have_access: boolean;
        }[],
        weapons: InventoryWeaponPlayerData,
        hotkeys: [number, number, number, number, number],
        inv_level: number,
        bagSlot: number | null,
      ) => {
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        const blocksDataOpen: any[] = (instance.state.blocks || [])
          .filter((q: InventoryDataCef) => q.show)
          .map((q: InventoryDataCef) => [q.owner_type, q.owner_id, q.left, q.top, q.drag]);
        const updatedBlocks = instance.state.blocks || [];
        blocks.map((block: InventoryDataCef) => {
          const fnd = updatedBlocks.findIndex(
            (q: InventoryDataCef) =>
              q.owner_type === block.owner_type &&
              q.owner_id === block.owner_id,
          );
          if (fnd > -1) {
            if (
              block.owner_type === OWNER_TYPES.PLAYER &&
              block.owner_id === CEF.id
            ) {
              updatedBlocks[fnd].items = block.items;
              updatedBlocks[fnd].weight_max = block.weight_max;
            } else {
              updatedBlocks[fnd] = block;
            }
          } else updatedBlocks.push(block);
        });
        updatedBlocks.map((block: InventoryDataCef, index: number) => {
          if (
            block.owner_type === OWNER_TYPES.PLAYER &&
            block.owner_id === CEF.id
          )
            return;
          if (block.owner_type === OWNER_TYPES.WORLD) return;
          if (
            allNearest.find(
              (q) =>
                q.owner_type === block.owner_type &&
                q.owner_id === block.owner_id,
            )
          )
            return;
          updatedBlocks.splice(index, 1);
        });
        instance.setState(
          { blocks: updatedBlocks, weapons, hotkeys, inv_level },
          () => {
            instance.setState({
              blocks: instance.state.blocks.map((q: InventoryDataCef) => {
                const show = blocksDataOpen.find(
                  (s) => s[0] === q.owner_type && s[1] === q.owner_id,
                );
                if (show) {
                  return {
                    ...q,
                    show: true,
                    left: show[2],
                    top: show[3],
                    drag: show[4],
                  };
                }
                return q;
              }),
              bagSlot: bagSlot,
            });
          },
        );
      },
    );

    return {
      openExchangeEv,
      updateExchangeEv,
      openInventoryEv,
      dressEv
    };
  }

  static unregisterEventHandlers(handlers: any) {
    if (handlers.openInventoryEv) handlers.openInventoryEv.destroy();
    if (handlers.updateInventoryEv) handlers.updateInventoryEv.destroy();
    if (handlers.dressEv) handlers.dressEv.destroy();
    if (handlers.updateExchangeEv) handlers.updateExchangeEv.destroy();
    if (handlers.openExchangeEv) handlers.openExchangeEv.destroy();
  }
} 