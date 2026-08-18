import { langStringDefault } from "../../shared/lang";
import { ItemEntity } from "./typeorm/entities/inventory";
import { UserAnimation } from "./usermodule/animation";

import {
	ARMOR_ITEM_ID,
	AUTO_SOUND_ITEM_ID,
	business_stock_level,
	canUse,
	CONTAINERS_DATA,
	CUFFS_ITEM_ID,
	CUFFS_KEY_ITEM_ID,
	getBaseItemNameById,
	getContainerByItemID,
	getContainerByOwnerType,
	getItemName,
	getItemWeight,
	getWeaponAddonKeyByItemId,
	HOUSE_DEFAULT_WEIGHT_KG,
	InventoryChoiseItemData,
	InventoryDataCef,
	InventoryEquipList,
	InventoryItemCef,
	inventoryShared,
	ITEM_TYPE,
	OWNER_TYPES,
	PLAYER_DEFAULT_WEIGHT_KG,
	PLAYER_INVENTORY_KG_PER_LEVEL,
	SCREWS_DESTROYER_ITEM_IDS,
	SCREWS_ITEM_ID,
} from "../../shared/inventory";
import { system } from "./system";
import { CustomEvent } from "./custom.event";
import { User } from "./user";
import { menu } from "./menu";
import { business } from "./business";
import { getDocumentData } from "./city.hall";
import { dress } from "./customization";
import { Vehicle } from "./vehicles";
import { HOUSE_STOCK_POS, interriors } from "../../shared/inrerriors";
import { houses, isPlayerHasHouseKey } from "./houses";
import {
	HOUSE_CHEST_KG_DEFAULT,
	HOUSE_CHEST_KG_PER_LEVEL,
	HOUSE_UPGRADE_LEVEL_COST,
} from "../../shared/economy";
import { FractionGarage } from "./fraction.garages";
import { phone } from "./phone";
import {
	getIllConfig,
	illData,
	PILL_USE_TIMER,
	POISONING_CHANCE_PER_DAY,
	POISONING_DAYS,
} from "../../shared/ill";
import { generateFreeSimNumber } from "./businesses/shop";
import { VehicleConfigsEntity } from "./typeorm/entities/vehicle.configs";
import { PhoneEntity } from "./typeorm/entities/phoneData";
import { VEHICLE_FUEL_TYPE } from "../../shared/vehicles";
import { In } from "typeorm";
import { removeEntity, saveEntity } from "./typeorm";
import { LicenseName, UdoData } from "../../shared/licence";
import { FamilyTasks, FamilyTasksLoading } from "../../shared/family";
import { warehouses } from "./warehouse";
import { WAREHOUSE_SLOTS_POS } from "../../shared/warehouse";
import { tablet } from "./tablet";
import { Logs } from "./logs";
import { gui } from "./gui";
import { colshapes } from "./checkpoints";
import { gangfight } from "./gangfight";
import { SendUpdate } from "../../shared/GameVisualElement";
import { getNearestMarketInventory } from "./market/marketStock";
import { FarmActivityStock } from "./farm/models/stock";
import { FEED_LIST, SUPPLIES_LIST } from "../../shared/farm/config";
import { getFisherLevelByExp, RODS } from "../../shared/fish";
import { invokeHook } from "../../shared/hooks";
import { AUTOPILOT_ITEM_ID } from "../../shared/autopilot";
import { DivingMaps } from "../../shared/diving/work.config";
import {
	DIVING_FIRST_MAP_ITEM,
	DIVING_SECOND_MAP_ITEM,
	DIVING_THIRD_MAP_ITEM,
	DivingAchievementClothesItem,
} from "../../shared/diving/achievement.config";
import { CLOTH_VARIATION_ID_MULTIPLER } from "../../shared/cloth";
// import { BATTLE_PASS_SEASON } from "../../shared/battlePass/main";
// import { isBattlePassItem } from "../../shared/battlePass/history-seasons";
import { donateStorage } from "./donateStorage";
import drugFarm from "./drugFarm";
import { LEVEL_PERMISSIONS } from "../../shared/level.permissions";

setInterval(() => {
	inventory.getInventory(0, 0).map((item) => {
		if (item.dropped_time + 300 <= system.timestamp) inventory.deleteItem(item);
	});
}, 10000);

setTimeout(() => {
	if (!mp.config.announce) {
		let check: number[] = [];
		inventoryShared.items.map((q) => {
			if (check.includes(q.item_id)) {
				for (let s = 0; s < 10; s++)
					system.debug.error(
						`ATTENTION!!!! ITEM ${q.item_id} ${q.name} hat eine doppelte ID`,
					);
			}
			//if(!fs.existsSync(`./src/shared/icons/Item_${q.item_id}.png`)) system.debug.error(`ВНИМАНИЕ!!!! Предмет ${q.item_id} ${q.name} не имеет картинки для инвентаря`)
			check.push(q.item_id);
		});
	}
}, 10000);

CustomEvent.registerClientCef("inventory:reload:weapon", async (player) => {
	const user = player.user;
	if (!user) return;
	if (user.spam(500))
		return player.notify(
			player.user.LangString("inventory.8e256db9835304e3ba059f2fc359fdea"),
			"error",
		);
	user.reloadCurrentWeapon(false);
});
CustomEvent.registerClientCef("inventory:unload:weapon", (player) => {
	if (player.user.spam(500))
		return player.notify(
			player.user.LangString("inventory.60c608e10584ab7b530346af7aa58e58"),
			"error",
		);
	let currentWeapon = player.user.currentWeapon;
	if (!currentWeapon)
		return player.notify(
			player.user.LangString("inventory.24e97f845f2298579c8a979a92534e06"),
			"error",
		);
	player.user.unloadAmmo();
	inventory.reloadInventory(player, [OWNER_TYPES.PLAYER, player.user.id]);
});
CustomEvent.registerClientCef("inventory:unequip:weapon", (player) => {
	if (player.user.spam(500))
		return player.notify(
			player.user.LangString("inventory.d47e118a3f76c85a529187e1fcb6801a"),
			"error",
		);
	let currentWeapon = player.user.currentWeapon;
	if (!currentWeapon)
		return player.notify(
			player.user.LangString("inventory.63fc774ca99e0bce237db34e45a6989f"),
			"error",
		);
	player.user.removeCurrentWeapon(false, true);
	inventory.reloadInventory(player, [OWNER_TYPES.PLAYER, player.user.id]);
});

CustomEvent.registerCef(
	"player:unlock",
	(player, owner_type: OWNER_TYPES, owner_id: number, value: number) => {
		if (!player.user) return;
		if (player.user.spam(2000)) return;
		if (value != inventory.getPassword(owner_type, owner_id))
			return player.notify(
				player.user.LangString("inventory.f72c038f8b4e2dd73a5566a902c60fd3"),
				"error",
			);
		player.user.setSavedPassword(owner_type, owner_id, value);
		player.notify(
			player.user.LangString("inventory.c0c71539ef7ecc465bb3b9f1ab1c997f"),
			"success",
		);
	},
);

CustomEvent.registerCef("inventory:bag:selectDisplay", (player, id: number) => {
	if (!player.user) return;
	if (player.user.spam(1000)) return;

	const item = player.user.inventory.find((i) => i.id === id);
	if (!item)
		return player.notify(
			player.user.LangString("inventory.1cddc0a61da880b723a0ca87bab8be21"),
		);

	if (CONTAINERS_DATA.find((b) => b.item_id === item.item_id)?.bag_sync)
		player.user.entity.selectedBag = item.item_id;

	player.user.sync_bag();
});

CustomEvent.registerClient("inventory:flashlight", (player) => {
	if (!player.user) return;
	if (player.user.spam(2000)) return;
	player.setVariable(
		"flashlightWeapon",
		!player.getVariable("flashlightWeapon"),
	);
});
CustomEvent.registerCef("inventory:unequip_item", (player, id: number) => {
	if (!player.user) return;
	if (player.user.spam(2000)) return;
	const user = player.user;

	if (id >= 949 && id <= 960) {
		if (id !== ARMOR_ITEM_ID) {
			if (user.getJobDress)
				return player.notify(
					player.user.LangString("inventory.c653cbdef6f32e24e2d5264de27c8e2f"),
					"error",
				);
			if (!user.mp_character)
				return player.notify(
					player.user.LangString("inventory.abd29cfe1979577cb752d2837ba16a2c"),
					"error",
				);
		}

		user.setDressValueById(id, 0, user.customArmor);

		if (id === ARMOR_ITEM_ID) {
			user.armour = 0;
		}
		inventory.closeInventory(player);
	}
});

CustomEvent.registerCef(
	"inventory:close",
	(player) => {
		player.openInventory = null
		CustomEvent.triggerClient(player, "onInventoryClose")
	},
);
CustomEvent.registerClient(
	"inventory:close",
	(player) => {
		player.openInventory = null
		CustomEvent.triggerClient(player, "onInventoryClose")
	},
);
CustomEvent.registerClient(
	"inventory:open",
	(player, ownertype?: number, ownerid?: number) =>
		inventory.openInventory(player, ownertype, ownerid),
);
CustomEvent.registerCef(
	"inventory:choiceItem",
	async (player, data: InventoryChoiseItemData) => {
		if (!player.user) return;
		if (!player.openInventory) return;
		if (player.user.spam(500))return player.notify(player.user.LangString("inventory.2180f445145c203378b9cec2d8d03998"),"error",);

		if (
			(data.owner_type === OWNER_TYPES.BUSINESS ||
				data.target_type === OWNER_TYPES.BUSINESS) &&
			!player.user.isAdminNow(6)
		)
			return player.notify(
				player.user.LangString("inventory.205ef31e9017dd3f825ea297983eb3fd"),
				"error",
			);
		if (data.task == "useItem") {

			if (
				data.owner_type != OWNER_TYPES.PLAYER ||
				data.owner_id != player.user.id
			)
				return player.notify(
					player.user.LangString("inventory.3b902a9247623e61c291bb10dadd0641"),
					"error",
				);
			inventory.closeInventory(player);

			inventory.useItem(player, data.item.id, data.owner_type, data.owner_id);
			// if (data.item.id == player.user.entity.selectedBagId) player.user.entity.selectedBagId = null;

		} else if (data.task == "transfer") {
			let body_owner_type = data.owner_type;
			let body_owner_id = data.owner_id;
			
			inventory.transferItem(
				player,
				data.item.id,
				body_owner_type,
				body_owner_id,
				data.target_type,
				data.target_id,
				data.target_slot 
			);
			if (data.item.id == player.user.entity.selectedBagId) player.user.entity.selectedBagId = null;
		} else if (data.task == "drop") {
			if (data.owner_type === OWNER_TYPES.MARKET_STOCK) {
				return player.notify(
					player.user.LangString("inventory.bedc14c35ed04de3a1192c9b9e16668f"),
					"error",
				);
			}

			Logs.insertInventoryLog(
				inventory.get(data.item.id, data.owner_type, data.owner_id),
				player.user.id,
				0,
				"drop",
				`drop from ${data.owner_type}`,
			);
			const itemExtra = JSON.parse(data.item.extra || "{}");
			data.item.extra = JSON.stringify({
				...itemExtra,
				slot: -1
			});

			inventory.dropItem(player, data.item.id, data.owner_type, data.owner_id);
			if (data.item.id == player.user.entity.selectedBagId) player.user.entity.selectedBagId = null;
		} else if (data.task == "unload_hotkey") {
			const slotToUnload = data.hotkey_slot !== undefined ? data.hotkey_slot : data.owner_id;
			player.user.setHotkey(slotToUnload, 0);
			player.notify(
				player.user.LangString("inventory.e88af9b83684bdc05dc7a2fb17b2fc5d"),
				"success",
			);
			inventory.reloadInventory(player, [OWNER_TYPES.PLAYER, player.dbid]);
		} else if (data.task == "slot_move") {
			try {
				const itemId = data.item.id;
				const ownerType = data.owner_type;
				const ownerId = data.owner_id;
				const targetSlot = data.target_slot;
				const sourceSlot = data.source_slot;
				
				const targetOwnerType = data.target_type !== undefined ? data.target_type : ownerType;
				const targetOwnerId = data.target_id !== undefined ? data.target_id : ownerId;
				
				const item = inventory.get(itemId, ownerType, ownerId);
				if (!item) {
					return player.notify(
						player.user.LangString("inventory.52211c6222f478ab2d003f4fff2e257f"),
						"error",
					);
				}
				
				const targetItem = inventory.getItemBySlot(
					targetOwnerType, 
					targetOwnerId, 
					targetSlot
				);
				
				if (targetItem && targetItem.id !== item.id) {
					if (targetItem.item_id !== item.item_id) {
						return player.notify(
							player.user.LangString("inventory.52211c6222f478ab2d003f4fff2e257f"),
							"error"
						);
					}
					
					if (targetItem.item_id === item.item_id) {
						let targetItemExtraData: any = {};
						let itemExtraData: any = {};
						
						try {
							if (targetItem.extra) {
								targetItemExtraData = JSON.parse(targetItem.extra);
							}
						} catch (e) {
							targetItemExtraData = {};
						}
						
						try {
							if (item.extra) {
								itemExtraData = JSON.parse(item.extra);
							}
						} catch (e) {
							itemExtraData = {};
						}
						
						if (targetItem.count !== undefined && item.count !== undefined) {
							const totalQuantity = (targetItem.count || 0) + (item.count || 0);
							targetItem.count = totalQuantity;
							
							targetItem.extra = JSON.stringify(targetItemExtraData);
							await targetItem.save();
							
							inventory.deleteItem(item, ownerType, ownerId);
							
							inventory.reloadInventory(player, [ownerType, ownerId]);
							if (targetOwnerType !== ownerType || targetOwnerId !== ownerId) {
								inventory.reloadInventory(player, [targetOwnerType, targetOwnerId]);
							}
							
							player.notify("Items merged successfully", "success");
							if (item.owner_type != targetOwnerType) {
								if (data.item.id == player.user.entity.selectedBagId) player.user.entity.selectedBagId = null;
							}
							return;
						} else {
							targetItemExtraData.slot = sourceSlot;

							if (item.owner_type != targetOwnerType) {
								if (data.item.id == player.user.entity.selectedBagId) player.user.entity.selectedBagId = null;
							}
							
							targetItem.extra = JSON.stringify(targetItemExtraData);
							targetItem.slot = sourceSlot;
							targetItem.owner_type = ownerType;
							targetItem.owner_id = ownerId;
							await targetItem.save();
						}
					} else {
						let targetItemExtraData: any = {};
						
						try {
							if (targetItem.extra) {
								targetItemExtraData = JSON.parse(targetItem.extra);
							}
						} catch (e) {
							targetItemExtraData = {};
						}
						
						targetItemExtraData.slot = sourceSlot;
						
						if (item.owner_type != targetOwnerType) {
							if (data.item.id == player.user.entity.selectedBagId) player.user.entity.selectedBagId = null;
						}

						targetItem.extra = JSON.stringify(targetItemExtraData);
						targetItem.slot = sourceSlot;
						targetItem.owner_type = ownerType;
						targetItem.owner_id = ownerId;
						await targetItem.save();
					}
				}
				
				if (!targetItem || targetItem.id !== item.id) {
					let itemExtraData: any = {};
					
					try {
						if (item.extra) {
							itemExtraData = JSON.parse(item.extra);
						}
					} catch (e) {
						itemExtraData = {};
					}
					
					itemExtraData.slot = targetSlot;

					if (item.owner_type != targetOwnerType) {
						if (data.item.id == player.user.entity.selectedBagId) player.user.entity.selectedBagId = null;
					}
					
					item.extra = JSON.stringify(itemExtraData);
					item.slot = targetSlot;
					item.owner_type = targetOwnerType;
					item.owner_id = targetOwnerId;
					await item.save();
					
					inventory.reloadInventory(player, [ownerType, ownerId]);
					if (targetOwnerType !== ownerType || targetOwnerId !== ownerId) {
						inventory.reloadInventory(player, [targetOwnerType, targetOwnerId]);
					}
				}
				
			} catch (e) {
				console.error("Error in slot_move task:", e);
				player.notify("Error moving item between slots", "error");
			}
		} else if (data.task == "load_hotkey") {
			let item = inventory.get(data.item.id, OWNER_TYPES.PLAYER, player.dbid);
			if (!item) {
				player.notify(
					player.user.LangString("inventory.1216a00fe9492526993e53e852f61c42"),
					"error",
				);
				return;
			}
			player.user.setHotkey(data.owner_id, item.id);

			inventory.reloadInventory(player, [OWNER_TYPES.PLAYER, player.dbid]);
		} else if (data.task == "split") {
			if (data.owner_type === OWNER_TYPES.MARKET_STOCK) {
				return player.notify(
					player.user.LangString("inventory.acb5693c168ce974a5349e3463eea6ad"),
					"error",
				);
			}

			let count = data.target_id;
			if (!count)
				return player.notify(
					player.user.LangString("inventory.5c82c6dbdc731c2b670cde1887ebc0cc"),
					"error",
				);

			let item = inventory.get(data.item.id, data.owner_type, data.owner_id);
			if (item.count - count <= 0)
				return player.notify(
					player.user.LangString("inventory.2c5310831bee007e27f5a84fbc76ee8e"),
					"error",
				);

			if (data.owner_type === OWNER_TYPES.WORLD) {
				item.count -= count;

				inventory
					.createItem(
						{
							owner_type: 1,
							owner_id: player.user.id,
							count,
							item_id: item.item_id,
							temp: item.temp,
						},
						true,
					)
					.then((createdItem) => {
						if (!mp.players.exists(player)) return;

						inventory.dropItem(
							player,
							createdItem.id,
							createdItem.owner_type,
							player.user.id,
						);
					});
			} else {
				if (!item) {
					player.notify(
						player.user.LangString(
							"inventory.c7f1d42780526a6ce3a86d4b319ebc57",
						),
						"error",
					);
					return;
				}

				item.useCount(count, player);

				inventory
					.createItem(
						{
							owner_type: data.owner_type,
							owner_id: data.owner_id,
							count,
							item_id: item.item_id,
							temp: item.temp,
						},
						true,
					)
					.then(() => {
						if (mp.players.exists(player))
							inventory.reloadInventory(player, [
								data.owner_type,
								data.owner_id,
							]);
					});
			}
		}
	},
);

CustomEvent.registerClient("inventory:hotkey:user", (player, slot: number) => {
	if (!player.user) return;
	if (!player.user.canUseInventory) return;
	if (player.user.spam(500))
		return player.notify(
			player.user.LangString("inventory.b7383e683112763a3df68c63242c4798"),
			"error",
		);
	let id = player.user.hotkeys[slot];
	if (!id)
		return player.notify(
			player.user.LangString("inventory.2e5e6ecd1c496831e3dcdbd8f8a8cdf5"),
			"error",
			null,
			8000,
		);
	let item = inventory.get(id, OWNER_TYPES.PLAYER, player.dbid);
	if (!item)
		return (
			player.notify(
				player.user.LangString("inventory.91d73c28dcf743c08b3a2ba584f012b7"),
				"error",
				null,
				8000,
			),
			player.user.setHotkey(slot, 0)
		);

	const itemCfg = inventoryShared.get(item.item_id);
	if (itemCfg.blockHotkey) {
		player.notify(
			player.user.LangString("inventory.c4cceb2f94def564f26e1769f108b4a0"),
			"error",
		);
		return;
	}

	inventory.useItem(player, item.id, OWNER_TYPES.PLAYER, player.user.id);
});

function updateItemOwner(
	id: number,
	owner_type: OWNER_TYPES,
	owner_id: number,
	old_owner_type?: number,
	old_owner_id?: number,
	verifyGun?: boolean,
): void;
function updateItemOwner(
	item: ItemEntity,
	owner_type: OWNER_TYPES,
	owner_id: number,
): void;
function updateItemOwner(
	itm: number | ItemEntity,
	owner_type: OWNER_TYPES,
	owner_id: number,
	old_owner_type?: number,
	old_owner_id?: number,
	verifyGun = true,
) {
	if (!itm) {
		console.error("[INVENTORY] Attempted to update owner of undefined item");
		return;
	}
	
	let item =
		typeof itm === "number"
			? inventory.get(itm, old_owner_type, old_owner_id)
			: itm;
	old_owner_type = parseInt(`${item?.owner_type}`);
	old_owner_id = parseInt(`${item?.owner_id}`);
	let id = item?.id;
	if (!item)
		return console.error(
			`inventory.updateItemOwner try update non existent item ${id} owner_type ${owner_type} owner_id ${owner_id} old_owner_type ${old_owner_type} old_owner_id ${old_owner_id}`,
		);
	const world = item.owner_type == 0;
	let itmCfg = inventoryShared.get(item.item_id);
	if (!itmCfg) return;
	if (itmCfg.blockMove) return;
	if (item.owner_type == OWNER_TYPES.PLAYER) {
		let target = User.get(item?.owner_id);
		if (target) {
			target.user.inventoryAttachSync();
			if (itmCfg.type == ITEM_TYPE.WEAPON && verifyGun) {
				let curWeapon = target.user.currentWeapon;
				if (curWeapon) {
					if (curWeapon.id == item.id) {
						target.user.removeCurrentWeapon(false, true);
					}
				}
			}
		}
	}
	if (
		itmCfg.need_group &&
		owner_type != OWNER_TYPES.WORLD &&
		owner_type != OWNER_TYPES.BUSINESS &&
		owner_type != OWNER_TYPES.EXCHANGE_MENU
	) {
		let allItems = inventory.getInventory(owner_type, owner_id);
		if (allItems) {
			let targetItem = allItems.find(
				(q) =>
					q.item_id == item.item_id && q.id !== item.id && q.temp === item.temp,
			);
			if (targetItem) {
				inventory.deleteItem(item);
				targetItem.count += item.count;
				if (!targetItem.temp) targetItem.save();
				if (world) {
					if (item.prop) item.prop.destroy();
					item.prop = null;
					if (item.colshape && item.colshape.exists) {
						item.colshape.destroy();
						item.colshape = null;
					}
				}
				return;
			}
		}
	}
	let oldInventory = inventory.getInventory(item.owner_type, item.owner_id);
	if (oldInventory && oldInventory.findIndex((q) => q.id == id) > -1)
		oldInventory.splice(
			oldInventory.findIndex((q) => q.id == id),
			1,
		);
	if (owner_type === OWNER_TYPES.PLAYER) {
		let target = User.get(owner_id);
		if (target) {
			target.user.questTick();
			target.user.currentWeaponSync();
			target.user.inventoryAttachSync();
			if (!target.user.entity.successItem.includes(item.item_id)) {
				const cfg = inventoryShared.get(item.item_id);
				if (cfg && cfg.helpDesc && cfg.helpIcon) {
					target.user.entity.successItem = [
						...target.user.entity.successItem,
						item.item_id,
					];
					CustomEvent.triggerCef(
						target,
						"success:screen:showitem",
						item.item_id,
					);
				}
			}
		}
	}
	item.owner_type = owner_type;
	item.owner_id = owner_id;
	insert_item_into_inventory(item);
	if (!item.temp) item.save();
	if (owner_type !== OWNER_TYPES.WORLD) {
		if (item.prop) {
			if (mp.objects.exists(item.prop)) item.prop.destroy();
			item.prop = null;
		}
		if (item.colshape && item.colshape.exists) {
			item.colshape.destroy();
			item.colshape = null;
		}
	}
	CustomEvent.trigger(
		"inventory:updateowner",
		id,
		owner_type,
		owner_id,
		old_owner_type,
		old_owner_id,
	);
	if ([owner_type, old_owner_type].includes(OWNER_TYPES.WEAPON_MODS)) {
		if (owner_type === OWNER_TYPES.WEAPON_MODS) {
			const weapon = inventory.get(owner_id);
			if (weapon && weapon.owner_type === OWNER_TYPES.PLAYER) {
				const target = User.get(weapon.owner_id);
				if (
					target &&
					target.user &&
					target.user.currentWeapon?.id === weapon.id
				)
					target.user.syncAddonsWeapon();
			}
		}

		if (old_owner_type === OWNER_TYPES.WEAPON_MODS) {
			const weapon = inventory.get(old_owner_id);
			if (weapon && weapon.owner_type === OWNER_TYPES.PLAYER) {
				const target = User.get(weapon.owner_id);
				if (
					target &&
					target.user &&
					target.user.currentWeapon?.id === weapon.id
				)
					target.user.syncAddonsWeapon();
			}
		}
	}
	return;
}

CustomEvent.registerClient(
	"playerDamage",
	(
		player: PlayerMp,
		healthLoss: number,
		armorLoss: number,
		healthLeft: number,
		armorLeft: number,
	) => {
		if (!player.user) {
			return;
		}

		player.user.customArmor = armorLeft;

		if (armorLoss <= 0 || armorLeft > 0) {
			return;
		}

		const playerDress = player.user.dress as InventoryEquipList;
		if (playerDress.armor === 0) {
			return;
		}

		player.user.setDressValueById(ARMOR_ITEM_ID, 0, armorLeft);
	},
);

/** Уникальный ID для временных предметов */
let inventoryTempId = 5000000000;

export const INVENTORY_USE_ITEM_HOOK = "inv:useItemHook";

export const inventory = {
	/**
	 * Получает общее количество предметов определенного id.
	 */
	getItemsCountById: (player: PlayerMp, itemId: number) => {
		return player.user.inventory
			.filter((i) => i.item_id === itemId)
			.map((i) => (inventoryShared.get(i.item_id).canSplit ? i.count : 1))
			.reduce((prev, next) => prev + next, 0);
	},
	getItemsCountByType: (player: PlayerMp, itemType: ITEM_TYPE) => {
		return player.user.inventory
			.map((i) => ({ cfg: inventoryShared.get(i.item_id), item: i }))
			.filter((i) => i.cfg.type === itemType)
			.map((i) => (i.cfg.canSplit ? i.item.count : 1))
			.reduce((prev, next) => prev + next, 0);
	},
	getTempId: () => {
		inventoryTempId++;
		return inventoryTempId;
	},
	dropItem: (
		player: PlayerMp,
		id: number,
		owner_type: OWNER_TYPES,
		owner_id: number,
		death = false,
		isSplit = false,
	) => {
		const user = player.user;
		if (player.vehicle)
			return player.notify(
				player.user.LangString("inventory.06f9c71e6c84201f80b5050107c5e435"),
				"error",
			);
		let item = inventory.get(id, owner_type, owner_id);
		if (!item)
			return player.notify(
				player.user.LangString("inventory.8f6e4e0474532ea9f6472abd5ecf5c40"),
				"error",
			);
		let itmCfg = inventoryShared.get(item.item_id);
		if (!itmCfg)
			return player.notify(
				player.user.LangString("inventory.63467024c9180b9e6e7e0f720580416a"),
				"error",
			);
		if (itmCfg.blockMove)
			return player.notify(
				player.user.LangString("inventory.bf5e6d0d784038c4c9e3c0bc403024c2"),
				"error",
			);
		if (
			// isBattlePassItem(item.advancedString) ||
			item.advancedString === "BATTLE_PASS_CLOTHES"
		)
			return player.notify(
				player.user.LangString("inventory.2926bf0a7b62ea9c33fb234aeff34738"),
				"error",
			);
		if (donateStorage.isDonateItem(item))
			return player.notify(
				player.user.LangString("inventory.820e48e644ebbfaa7e4f3397e9ac7e50"),
				"error",
			);

		if (
			inventoryShared.get(item.item_id) &&
			inventoryShared.get(item.item_id).type === ITEM_TYPE.BAGS
		) {
			const container = CONTAINERS_DATA.find(
				(el) => el.item_id === item.item_id,
			);
			const items = inventory.getInventory(container.owner_type, item.id);
			let haveBattlePassItems: boolean = false;
			let haveDonateStorageItems: boolean = false;

			items.forEach((element) => {
				if (
					// isBattlePassItem(element.advancedString) ||
					element.advancedString === "BATTLE_PASS_CLOTHES"
				)
					haveBattlePassItems = true;

				if (donateStorage.isDonateItem(element)) haveDonateStorageItems = true;
			});

			if (haveBattlePassItems)
				return player.notify(
					player.user.LangString("inventory.f261ac1c6e8bc7502d099ec9c2343a63"),
					"error",
				);

			if (haveDonateStorageItems)
				return player.notify(
					player.user.LangString("inventory.76db246eb7946feb8fd0929b2d76d9b3"),
					"error",
				);
		}

		if (item.owner_type == OWNER_TYPES.WORLD)
			return player.notify(
				player.user.LangString("inventory.2ba5a5cbcb053005da5ded9852ba3a12"),
				"error",
			);
		let allNearest = inventory.getAllNearestInventory(player);
		if (
			!(item.owner_type == OWNER_TYPES.PLAYER && item.owner_id == user.id) &&
			!allNearest.find(
				(q) => q.owner_type == item.owner_type && q.owner_id == item.owner_id,
			)
		) {
			return player.notify(
				player.user.LangString("inventory.0b3faf6fa50f6625e561ebd4c7ea40f7"),
				"error",
			);
		}

		if (!isSplit) {
			let nearest = inventory.getDroppedItems(player, 6);
			if (nearest.length > 7)
				return player.notify(
					player.user.LangString("inventory.22500a6edb9e0df242a88426e2904c2b"),
					"error",
				);
		}

		if (item.owner_type === OWNER_TYPES.WEAPON_MODS)
			return player.notify(
				player.user.LangString("inventory.5690a3f66436a42ceff6b1ddd075fdb8"),
				"error",
			);

		if (
			itmCfg.protect &&
			(item.owner_type !== OWNER_TYPES.PLAYER ||
				item.owner_id != player.user.id)
		)
			return player.notify(
				player.user.LangString("inventory.c06c9fff6c3cef0e2b105bc3bde494b4"),
				"error",
			);
		if (
			itmCfg.canFactionsTake &&
			!itmCfg.canFactionsTake.includes(player.user.fraction)
		)
			return player.notify(
				player.user.LangString("inventory.ce811d11c02c5e2551d9c783fc72e858"),
				"error",
			);
		if (itmCfg.item_id === 863)
			return player.notify(
				player.user.LangString("inventory.4ef5c6c3429fd27ff5614be312eab5c3"),
				"error",
			);
		if (itmCfg.item_id == 864) {
			return player.notify(
				player.user.LangString("inventory.41199e93d6bb66f4e5d949b24db6bf98"),
				"error",
			);
		}

		if (player.user.entity.selectedBag === item.item_id) {
			player.user.entity.selectedBag = null;
			player.user.sync_bag();
		}

		if (
			!inventory.placeItemOnGround(
				item,
				player.user.dropPos,
				player.heading,
				player.dimension,
			)
		)
			return;
		if (!death)
			player.user.playAnimation([["random@domestic", "pickup_low"]], true);
		inventory.reloadInventory(player, [owner_type, owner_id]);
	},
	placeItemOnGround: (
		item: ItemEntity,
		pos: Vector3Mp,
		heading: number,
		dimension: number,
		verifyGun = true,
	) => {
		let itmCfg = inventoryShared.get(item.item_id);
		if (!itmCfg) return false;
		if (item.owner_type == OWNER_TYPES.WORLD) return false;
		if (item.prop) {
			item.prop.destroy();
			item.prop = null;
		}
		if (item.colshape && item.colshape.exists) {
			item.colshape.destroy();
			item.colshape = null;
		}
		item.prop = mp.objects.new(itmCfg.prop, pos, {
			dimension,
			rotation: new mp.Vector3(0, 0, heading),
		});
		const { owner_type, owner_id } = item;
		item.prop.setVariables({ item_id: item.item_id, inventory_dropped: true });
		item.x = pos.x;
		item.y = pos.y;
		item.z = pos.z;
		item.d = dimension;
		item.colshape = colshapes.new(
			pos,
			`${getItemName(item)}`,
			(player) => {
				if (player.user.dead) {
					return;
				}

				inventory.transferItem(
					player,
					item.id,
					OWNER_TYPES.WORLD,
					0,
					OWNER_TYPES.PLAYER,
					player.dbid,
					undefined 
				);
			},
			{
				color: [0, 0, 0, 0],
				dimension,
				// drawStaticName: 'label'
			},
		);
		item.dropped_time = system.timestamp;
		inventory.updateItemOwner(item.id, 0, 0, owner_type, owner_id, verifyGun);
		return true;
	},

	canUseInCar(
		player: PlayerMp,
		owner_type: OWNER_TYPES,
		new_owner_type: OWNER_TYPES,
	): boolean {
		if (!player.vehicle) return true;

		if (owner_type > 15200 || (owner_type < 15000 && owner_type !== 1)) {
			return false;
		} else
			return !(
				new_owner_type > 15200 ||
				(new_owner_type < 15000 && new_owner_type !== 1)
			);
	},

	transferItem: async (
		player: PlayerMp,
		id: number,
		owner_type: OWNER_TYPES,
		owner_id: number,
		new_owner_type: OWNER_TYPES,
		new_owner_id: number,
		target_slot?: number
	) => {
		const user = player.user;
		if (!user) return;
		
		const item = inventory.get(id, owner_type, owner_id);
		if (!item) {
			console.error(`[INVENTORY] Item with ID ${id} not found for transfer from ${owner_type}:${owner_id} to ${new_owner_type}:${new_owner_id}`);
			return player.notify(
				player.user.LangString("inventory.8f6e4e0474532ea9f6472abd5ecf5c40"),
				"error",
			);
		}
		
		if (!inventory.canUseInCar(player, owner_type, new_owner_type))
			return player.notify(
				player.user.LangString("inventory.3a9fcf68dffc458ee4ec151f860b03e4"),
				"error",
			);

		if (new_owner_type === OWNER_TYPES.MARKET_STOCK) {
			return player.notify(
				player.user.LangString("inventory.942a96a97274b39c4bc36d575c2d0b3e"),
				"error",
			);
		}

		const checkDistance = () => {
			if (!mp.players.exists(player)) return false;
			if (item.owner_type === OWNER_TYPES.WORLD) {
				return system.distanceToPos(item, player.position) <= 7;
			}
			let allNearest = inventory.getAllNearestInventory(player);
			if (
				!(item.owner_type == OWNER_TYPES.PLAYER && item.owner_id == user.id) &&
				!allNearest.find(
					(q) => q.owner_type == item.owner_type && q.owner_id == item.owner_id,
				)
			) {
				player.notify(
					player.user.LangString("inventory.72d77248324d4894539109d106d80c28"),
					"error",
				);
				return false;
			}

			if (
				new_owner_type != 0 &&
				!(new_owner_type == OWNER_TYPES.PLAYER && new_owner_id == user.id) &&
				!allNearest.find(
					(q) => q.owner_type == new_owner_type && q.owner_id == new_owner_id,
				)
			) {
				player.notify(
					player.user.LangString("inventory.8edc926ef8b6266608ed7340baea5492"),
					"error",
				);
				return false;
			}
			return true;
		};

		let itmCfg = inventoryShared.get(item.item_id);
		if (!itmCfg)
			return player.notify(
				player.user.LangString("inventory.b95a03cfbbe87b6b9cae5556197ea4ed"),
				"error",
			);
		if (itmCfg.item_id === 864) {
			if (
				new_owner_type == OWNER_TYPES.PLAYER &&
				(owner_type == OWNER_TYPES.VEHICLE ||
					owner_type == OWNER_TYPES.VEHICLE_TEMP ||
					owner_type == OWNER_TYPES.FRACTION_VEHICLE)
			) {
				if (user.haveItem(864))
					return player.notify(
						player.user.LangString(
							"inventory.d5b354975ffc122f55f2201072905b82",
						),
						"error",
					);
				if (player.vehicle)
					return player.notify(
						player.user.LangString(
							"inventory.564e8c25fa87d8f70bd52eefaa2ec957",
						),
						"error",
					);

				let veh: VehicleMp = null;
				if (item.owner_type == OWNER_TYPES.VEHICLE)
					veh = Vehicle.get(item.owner_id)
						? Vehicle.get(item.owner_id).vehicle
						: null;
				if (item.owner_type == OWNER_TYPES.VEHICLE_TEMP)
					veh = Vehicle.getByTmpId(item.owner_id);
				if (item.owner_type == OWNER_TYPES.FRACTION_VEHICLE)
					veh = Vehicle.getByCarageCarId(item.owner_id);
				if (!veh) return console.log("error inventory family cargo #1");
				if (!user.family)
					return player.notify(
						player.user.LangString(
							"inventory.587418e307da0f9e28f4fa6969a129c1",
						),
						"error",
					);
				else if (veh.familyQuestFamilyID != user.family.id)
					return player.notify(
						player.user.LangString(
							"inventory.98972d027f52932d0450ca8e27ecd444",
						),
						"error",
					);

				if (user.animation.isAnyAnimationWithResultNow) {
					return player.notify(
						player.user.LangString(
							"inventory.854c5bc9cfab4886545e1292356a893b",
						),
						"error",
					);
				}
			} else if (
				owner_type == OWNER_TYPES.PLAYER &&
				(new_owner_type == OWNER_TYPES.VEHICLE ||
					new_owner_type == OWNER_TYPES.VEHICLE_TEMP ||
					new_owner_type == OWNER_TYPES.FRACTION_VEHICLE)
			) {
				let veh: VehicleMp = null;
				if (new_owner_type == OWNER_TYPES.VEHICLE)
					veh = Vehicle.get(new_owner_id)
						? Vehicle.get(new_owner_id).vehicle
						: null;
				if (new_owner_type == OWNER_TYPES.VEHICLE_TEMP)
					veh = Vehicle.getByTmpId(new_owner_id);
				if (new_owner_type == OWNER_TYPES.FRACTION_VEHICLE)
					veh = Vehicle.getByCarageCarId(new_owner_id);
				if (!veh) return console.log("error inventory family cargo #2");
				if (!veh.familyQuestFamilyID)
					return player.notify(
						player.user.LangString(
							"inventory.f8c6a1c078402ffe1be9a9610cce924e",
						),
						"error",
					);
				if (!user.family || veh.familyQuestFamilyID != user.family.id)
					return player.notify(
						player.user.LangString(
							"inventory.5a6cecb6e102bceb61be431a63cf3df1",
						),
						"error",
					);
			} else
				return player.notify(
					player.user.LangString("inventory.fb59aa648c3d5578ecc751e9f19179f4"),
					"error",
				);

			const loadingPositions = FamilyTasksLoading.find(
				(ftl) => ftl.type == 0,
			).loadingCoords;
			FamilyTasks.map((ftl) => {
				if (ftl.type == 0)
					ftl.importCoords.map((ic) => loadingPositions.push(ic));
			});
			if (system.isPointInPoints(player.position, loadingPositions, 10.0))
				return player.notify(
					player.user.LangString("inventory.13222123c66fb9267a95a02a9be79b23"),
				);
		}
		if (itmCfg.blockMove)
			return player.notify(
				player.user.LangString("inventory.06210ffbfa182d1195cc89e468d88f81"),
				"error",
			);

		if (owner_type === OWNER_TYPES.WORLD && player.user.isInCombat) {
			return player.notify(
				player.user.LangString("inventory.4fa555f0ec5c0e7ce01663d8f80d5e51"),
				"error",
			);
		}

		if (
			new_owner_type >= OWNER_TYPES.BAG1 &&
			new_owner_type <= OWNER_TYPES.BAG_155
		) {
			const bagsInInventoryCount = inventory.getItemsCountByType(
				player,
				ITEM_TYPE.BAGS,
			);

			if (bagsInInventoryCount > 1) {
				return player.notify(
					player.user.LangString("inventory.591e006005b8ff18133b40c8143755ab"),
				);
			}
		}

		if (
			new_owner_type == OWNER_TYPES.PLAYER &&
			itmCfg.type === ITEM_TYPE.BAGS
		) {
			const bagsInInventoryCount = inventory.getItemsCountByType(
				player,
				ITEM_TYPE.BAGS,
			);

			if (bagsInInventoryCount >= 2) {
				return player.notify(
					player.user.LangString("inventory.19addfddf86fab744ae72f84a4441d72"),
				);
			}
		}

		if (
			itmCfg.item_id === 863 &&
			(new_owner_type !== OWNER_TYPES.PLAYER || new_owner_id !== user.id)
		)
			return player.notify(
				player.user.LangString("inventory.4a41efa543e5c1a7b2aea9af3b457e17"),
				"error",
			);
		if (itmCfg.protect) {
			const isContainer = getContainerByOwnerType(owner_type);
			if (isContainer) {
				const itemContainer = inventory.get(owner_id);
				if (itemContainer) {
					if (
						itemContainer.owner_type !== OWNER_TYPES.PLAYER ||
						itemContainer.owner_id !== user.id
					)
						return player.notify(
							player.user.LangString(
								"inventory.625903792e01bf43574a405019eeccec",
							),
							"error",
						);
				}
			} else if (owner_type === OWNER_TYPES.PLAYER && owner_id != user.id)
				return player.notify(
					player.user.LangString("inventory.3c9fe6e079f9c4aec2d9c6c0cbd2a4ad"),
					"error",
				);
		}
		if (
			itmCfg.canFactionsTake &&
			owner_type === OWNER_TYPES.WORLD &&
			!itmCfg.canFactionsTake.includes(user.fraction)
		)
			return player.notify(
				player.user.LangString("inventory.6df0ba058763c3a996a589a9e879522b"),
				"error",
			);
		let access = inventory.haveAccess(player, owner_type, owner_id);
		let namedesc = inventory.getInventoryNameAndDesc(
			owner_type,
			owner_id,
			player,
		);
		if (!access)
			return player.notify(
				player.user.LangString(
					"inventory.5501172187fc7a314f2e0194aa9e770b",
					namedesc.name,
				),
				"error",
			);
		let access2 = inventory.haveAccess(player, owner_type, owner_id);
		let namedesc2 = inventory.getInventoryNameAndDesc(
			new_owner_type,
			new_owner_id,
			player,
		);
		if (!access2)
			return player.notify(
				player.user.LangString(
					"inventory.283ceb1353e5e3442e61fd5833af5a1e",
					namedesc2.name,
				),
				"error",
			);
		let targetInv = inventory.getInventory(new_owner_type, new_owner_id);

		const checkWeight = (): boolean => {
			if (
				inventory.getWeightItems(targetInv) +
					getItemWeight(item.item_id, item.count) >
				inventory.getWeightInventoryMax(new_owner_type, new_owner_id)
			) {
				if (itmCfg.item_id == 864)
					player.notify(
						player.user.LangString(
							"inventory.851fb060ced4db40f3d37333993c4645",
							namedesc2.name,
						),
						"error",
					);
				else
					player.notify(
						player.user.LangString(
							"inventory.0fd2e5d1e7e074564bb90ae421bcd8a8",
							namedesc2.name,
						),
						"error",
					);

				return false;
			}

			return true;
		};

		if (!checkWeight()) {
			return;
		}

		if (new_owner_type == OWNER_TYPES.WEAPON_MODS) {
			const weapon = inventory.get(new_owner_id);
			if (weapon) {
				let allItems = inventory.getInventory(new_owner_type, new_owner_id);
				const wcfg = inventoryShared.getWeaponConfigByItemId(weapon.item_id);
				if (wcfg && wcfg.addons) {
					const typeT = getWeaponAddonKeyByItemId(weapon.item_id, item.item_id);
					if (!typeT)
						return player.notify(
							player.user.LangString(
								"inventory.0ad45ddbf58cf2dc6164c73050989ae7",
							),
							"error",
						);
					let groups: number[] = [];
					allItems.map((q) => {
						const type = getWeaponAddonKeyByItemId(weapon.item_id, q.item_id);
						const ids = wcfg.addons[type]?.group;
						if (ids) groups.push(ids);
					});
					const grT = wcfg.addons[typeT]?.group;
					if (grT && groups.includes(grT))
						return player.notify(
							player.user.LangString(
								"inventory.2960101813fc5186f9d4ff1c2bd4138b",
							),
							"error",
						);
				}
			}
		}
		const container = inventory.getContainerData(new_owner_type, new_owner_id);
		if (
			container &&
			container.access &&
			!container.access.includes(item.item_id)
		)
			return player.notify(
				player.user.LangString(
					"inventory.0f5f01fdef74a3d2c87d257be2beba94",
					getBaseItemNameById(container.item_id),
					getItemName(item),
				),
			);
		if (
			container &&
			CONTAINERS_DATA.find((q) => q.item_id === item.item_id) &&
			!inventoryShared.getWeaponConfigByItemId(item.item_id)
		)
			return player.notify(
				player.user.LangString(
					"inventory.fd6d4f5db63348e409987bb1eef97d3e",
					getBaseItemNameById(container.item_id),
					getItemName(item),
				),
			);
		if (!checkDistance()) return;
		if (new_owner_type == OWNER_TYPES.PLAYER && new_owner_id !== user.id) {
			const target = User.get(new_owner_id);
			if (!target)
				return player.notify(
					player.user.LangString("inventory.d6dd151105737b47884711b464542c63"),
					"error",
				);
			player.notify(
				player.user.LangString("inventory.1501908aef55a0dd61f09cff31fdc64e"),
				"success",
			);
			if (
				!(await menu.accept(
					target,
					target.user.LangString(
						"inventory.2343c6e60fe1c07f6155dd2b255d9553",
						getItemName(item),
					),
					"small",
				))
			)
				return user.notify(
					user.LangString("inventory.18bf3e42e2eb8fb3604160084aa70978"),
					"error",
				);
			if (!checkDistance()) return;
			if (!checkWeight()) {
				return;
			}
			if (!target.vehicle)
				target.user.playAnimation([["mp_common", "givetake2_a"]], true);
		}

		if (!player.vehicle && !container) {
			if (item.owner_type === 0)
				player.user.playAnimation([["random@domestic", "pickup_low"]], true);
			else player.user.playAnimation([["mp_common", "givetake2_a"]], true);
		}
		player.user.achiev.achievTickItemOwner(new_owner_type);

		if (owner_type === OWNER_TYPES.VEHICLE)
			Logs.new(
				`vehicle_${owner_id}`,
				`${user.name} ${user.id}`,
				langStringDefault(
					"inventory.5c3677494c199b18550189fec316cb86",
					getBaseItemNameById(item.item_id),
				),
			);
		if (new_owner_type === OWNER_TYPES.VEHICLE)
			Logs.new(
				`vehicle_${new_owner_id}`,
				`${user.name} ${user.id}`,
				langStringDefault(
					"inventory.f2443ac2ccadb3b31175f2aadfd55fa2",
					getBaseItemNameById(item.item_id),
				),
			);

		if ([OWNER_TYPES.HOUSE, OWNER_TYPES.STOCK_SAFE].includes(owner_type))
			Logs.new(
				`house_${owner_type}_${owner_id}`,
				`${user.name} ${user.id}`,
				langStringDefault(
					"inventory.3c3aa7cfa066d64a764b80d8cf994eeb",
					getBaseItemNameById(item.item_id),
				),
			);
		if (owner_type >= OWNER_TYPES.STOCK_1 && owner_type <= OWNER_TYPES.STOCK_15)
			Logs.new(
				`warehouse_${new_owner_id}`,
				`${user.name} ${user.id}`,
				`Aufgenommen ${getBaseItemNameById(item.item_id)}`,
			);

		if ([OWNER_TYPES.HOUSE, OWNER_TYPES.STOCK_SAFE].includes(new_owner_type))
			Logs.new(
				`house_${new_owner_type}_${new_owner_id}`,
				`${user.name} ${user.id}`,
				langStringDefault(
					"inventory.073c3a3ba9e12581532e1ce6dec7d831",
					getBaseItemNameById(item.item_id),
				),
			);
		if (new_owner_type === OWNER_TYPES.PLAYER && new_owner_id === user.id) {
			if (
				owner_type === OWNER_TYPES.PLAYER ||
				owner_type >= 15000 ||
				owner_type === OWNER_TYPES.BAG
			) {
				const ownerIsPlayer = owner_type === OWNER_TYPES.PLAYER;
				let target;

				if (ownerIsPlayer) {
					target = User.get(owner_id);
				} else {
					const bag = inventory.get(owner_id);
					if (bag) target = User.get(bag.owner_id);
				}

				if (target && target.user && target.user.cuffed && user.is_police) {
					inventory.deleteItem(id);
					// gui.chat.sendDoCommand(
					// 	player,
					// 	player.user.LangString(
					// 		"inventory.893623943d1d02040ea8c87870818b8a",
					// 		getItemName(item),
					// 		target.dbid,
					// 	),
					// );
					return;
				}
			}
		}

		if (
			new_owner_type === OWNER_TYPES.FARM_STOCK &&
			owner_type === OWNER_TYPES.PLAYER &&
			owner_id === user.id
		) {
			if (
				!SUPPLIES_LIST.map((s) => s.inventoryItemId).includes(item.item_id) &&
				!FEED_LIST.map((s) => s.inventoryItemId).includes(item.item_id)
			)
				return user.notify(
					user.LangString("inventory.b0f6dc9885f17e8cb3871bb47e4331a8"),
					"error",
				);
		}

		if (
			owner_type == OWNER_TYPES.FARM_STOCK &&
			new_owner_type != OWNER_TYPES.PLAYER
		) {
			return user.notify(
				user.LangString("inventory.d1141639b744159242d07de345da8e75"),
				"error",
			);
		}

		if (
			new_owner_type === OWNER_TYPES.PLAYER &&
			owner_type === OWNER_TYPES.FARM_STOCK &&
			new_owner_id === user.id
		) {
			if (player.farmWorker?.activity.id != owner_id)
				return user.notify(
					user.LangString("inventory.1be494349c419b977dd0bdbea19fce83"),
					"error",
				);

			if (
				(SUPPLIES_LIST.some((s) => s.vegInventoryItemId == item.item_id) ||
					item.item_id == 9000) &&
				player.farmWorker?.activity.owner != user.id
			)
				return user.notify(
					user.LangString("inventory.008a983800ecad60857f54655691e1bf"),
					"error",
				);
		}

		if (
			// isBattlePassItem(item.advancedString) ||
			item.advancedString === "BATTLE_PASS_CLOTHES"
		) {
			let blockBPTransfer = true;

			if (new_owner_type === OWNER_TYPES.PLAYER && new_owner_id === user.id)
				blockBPTransfer = false;
			else if (new_owner_type >= 15000 || new_owner_type === OWNER_TYPES.BAG) {
				const bag = inventory.get(new_owner_id);
				if (bag.owner_id === user.id) blockBPTransfer = false;
			} else if (new_owner_type === OWNER_TYPES.WEAPON_MODS) {
				blockBPTransfer = false;
			}

			if (blockBPTransfer)
				return player.notify(
					player.user.LangString("inventory.d7e61900480c7e2374d1bbd08023f97c"),
					"error",
				);
		}

		if (donateStorage.isDonateItem(item)) {
			let blockDITransfer = true;

			if (new_owner_type === OWNER_TYPES.PLAYER && new_owner_id === user.id)
				blockDITransfer = false;
			else if (new_owner_type >= 15000 || new_owner_type === OWNER_TYPES.BAG) {
				const bag = inventory.get(new_owner_id);
				if (bag.owner_id === user.id) blockDITransfer = false;
			} else if (new_owner_type === OWNER_TYPES.WEAPON_MODS) {
				blockDITransfer = false;
			}

			if (blockDITransfer)
				return player.notify(
					player.user.LangString("inventory.c88c92c6344b40bb9f0577d16f0f7776"),
					"error",
				);
		}

		if (
			inventoryShared.get(item.item_id) &&
			inventoryShared.get(item.item_id).type === ITEM_TYPE.BAGS
		) {
			const container = CONTAINERS_DATA.find(
				(el) => el.item_id === item.item_id,
			);
			const items = inventory.getInventory(container.owner_type, item.id);
			let haveBattlePassItems: boolean = false;
			let haveDonateBlockItems: boolean = false;

			items.forEach((element) => {
				if (
					// isBattlePassItem(element.advancedString) ||
					element.advancedString === "BATTLE_PASS_CLOTHES"
				)
					haveBattlePassItems = true;
			});

			items.forEach((element) => {
				if (donateStorage.isDonateItem(element)) haveDonateBlockItems = true;
			});

			if (haveBattlePassItems)
				return player.notify(
					player.user.LangString("inventory.c29745b6b1c3ce04e88ec7ea5e3394e0"),
					"error",
				);

			if (haveDonateBlockItems)
				return player.notify(
					player.user.LangString("inventory.daeffa1c189e0ad9b0fcc0abb9528d6e"),
					"error",
				);
		}

		if (!inventory.get(id, owner_type, owner_id)) return;


		if (player.user.entity.selectedBag === item.item_id) {
			player.user.entity.selectedBag = null;
			player.user.sync_bag();
		}

		const itemsInTargetInventory = inventory.getInventory(new_owner_type, new_owner_id);
		let targetSlotToUse = target_slot;
		let extraData: any = {};
		
		try {
			if (item.extra) {
				extraData = JSON.parse(item.extra);
			}
		} catch (e) {
			extraData = {};
		}
		
		const getItemSlot = (i: ItemEntity): number | undefined => {
			let slot: number | undefined;
			
			if (typeof i.slot === 'number') {
				slot = i.slot;
			}
			
			try {
				if (i.extra) {
					const extraData = JSON.parse(i.extra);
					if (typeof extraData.slot === 'number') {
						slot = extraData.slot;
					}
				}
			} catch (e) {
			}
			
			return slot;
		};
		
		const getOccupiedSlots = (items: ItemEntity[]): Set<number> => {
			const occupiedSlots = new Set<number>();
			
			items.forEach(i => {
				const slot = getItemSlot(i);
				if (slot !== undefined) {
					occupiedSlots.add(slot);
				}
			});
			
			return occupiedSlots;
		};
		
		const findFreeSlot = (occupiedSlots: Set<number>): number => {
			let freeSlot = 0;
			while (occupiedSlots.has(freeSlot)) {
				freeSlot++;
			}
			return freeSlot;
		};
		
		const isSlotOccupied = (items: ItemEntity[], slot: number, itemId: number): boolean => {
			return items.some(i => {
				const itemSlot = getItemSlot(i);
				return itemSlot === slot && i.id !== itemId;
			});
		};


		if (targetSlotToUse === undefined) {
			const occupiedSlots = getOccupiedSlots(itemsInTargetInventory);
			targetSlotToUse = findFreeSlot(occupiedSlots);
		} else {
			if (isSlotOccupied(itemsInTargetInventory, targetSlotToUse, item.id)) {
				const occupiedSlots = getOccupiedSlots(itemsInTargetInventory);
				targetSlotToUse = findFreeSlot(occupiedSlots);
			}
		}
		
		extraData.slot = targetSlotToUse;
		item.slot = targetSlotToUse;
		item.extra = JSON.stringify(extraData);
		await item.save();

		inventory.updateItemOwner(
			item,
			new_owner_type,
			new_owner_id,
		);

		inventory.reloadInventory(
			player,
			[new_owner_type, new_owner_id],
			[owner_type, owner_id],
		);

		mp.events.call(
			"inventory:itemTransferred",
			player,
			id,
			new_owner_type,
			new_owner_id,
			owner_type,
			owner_id,
		);

		Logs.insertInventoryLog(
			item,
			owner_id,
			new_owner_id,
			"transfer",
			`from ${owner_type} to ${new_owner_type}`,
		);
	},


	canTakeItem(
		owner_type: OWNER_TYPES,
		owner_id: number,
		item_id: number,
		amount = 1,
		count?: number,
	) {
		const current = inventory.getWeightItems(
			inventory.getInventory(owner_type, owner_id),
		);
		const max = inventory.getWeightInventoryMax(owner_type, owner_id);
		const addWeight =
			(count ? getItemWeight(item_id, count) : getItemWeight(item_id, count)) *
			amount;
		return current + addWeight <= max;
	},
	useItem: async (
		player: PlayerMp,
		id: number,
		owner_type: OWNER_TYPES,
		owner_id: number,
	) => {
		const user = player.user;
		if (user.walkingWithObject)
			return user.notify(
				user.LangString("inventory.d4968cebe09eb2167005bda41c34abda"),
				"error",
			);
		if (user.cuffed)
			return player.notify(
				player.user.LangString("inventory.a3b345fce25877a03467d3ee99e99358"),
				"error",
			);
		if (user.jailSyncHave)
			return player.notify(
				player.user.LangString("inventory.a1324c8720cb097fe389dbe78da7015b"),
				"error",
			);
		let item = inventory.get(id, owner_type, owner_id);
		if (!item)
			return player.notify(
				player.user.LangString("inventory.6076651329ffea7037c7f5aea820d58e"),
				"error",
			);
		let itmCfg = inventoryShared.get(item.item_id);
		if (!itmCfg)
			return player.notify(
				player.user.LangString("inventory.872bf1ee4b164fc5bfd7f435f004e4fe"),
				"error",
			);
		if (!canUse(item.item_id))
			return player.notify(
				player.user.LangString("inventory.0c809b2c5def5872fc05bce2b86083ca"),
				"error",
			);
		let count = itmCfg.default_count ? itmCfg.default_count : item.count;
		const illHave = illData.filter((q) => q.healItem === itmCfg.item_id);
		if (illHave.length > 0) {
			if (user.pillUseCoolDown.has(itmCfg.item_id))
				return player.notify(
					player.user.LangString(
						"inventory.3ae2329589f75668c9572c07262dae43",
						getItemName(item),
					),
					"error",
				);
			user.pillUseCoolDown.set(itmCfg.item_id, true);
			setTimeout(() => {
				if (!user) return;
				if (!mp.players.exists(player)) return;
				if (!user.exists) return;
				user.pillUseCoolDown.delete(itmCfg.item_id);
			}, PILL_USE_TIMER * 60000);
			user.playAnimation(
				[
					["mp_player_intdrink", "intro_bottle", 1],
					["mp_player_intdrink", "loop_bottle", 2],
					["mp_player_intdrink", "outro_bottle", 1],
				],
				true,
				false,
			);
			illHave.map((q) => {
				user.removeIll(q.id, q.healItemMultiple || Math.floor(q.max / 10));
			});
			if ([900, 903].includes(item.item_id)) {
				CustomEvent.triggerClient(player, "drug:clean");
			}
			item.useCount(1, player);
		}

		if (itmCfg.type === ITEM_TYPE.SMOKING) {
			mp.events.call("smoking:action", player, item.item_id, item);
		}

		if (item.item_id === AUTOPILOT_ITEM_ID) {
			if (!player.vehicle) {
				return player.notify(
					player.user.LangString("inventory.3293c360b0439cc0c0306f5b33e23b39"),
					"error",
				);
			}

			if (!player.vehicle?.entity?.data) {
				return player.notify(
					player.user.LangString("inventory.b29faeeadf21c1c21a88460fdcdfbf70"),
					"error",
				);
			}

			const vehicleData = player.vehicle.entity.data;
			if (vehicleData.isAutopilotInstalled) {
				return player.notify(
					player.user.LangString("inventory.aabe2e6b4218ce6555890aea88482ab9"),
					"error",
				);
			}

			vehicleData.isAutopilotInstalled = true;
			vehicleData.save();

			item.useCount(1);

			player.notify(
				player.user.LangString("inventory.a6c1041c848d14da4ed5b320ebef63cf") +
					player.user.LangString("inventory.5eeeb514be916406abf545f3b3c788d9"),
				"success",
			);
		}

		if (DivingMaps.find((el) => el.itemId === item.item_id)) {
			if (item.item_id === 6526) player.user.achiev.achievTickItem(6526);
			if (item.item_id === 6527) player.user.achiev.achievTickItem(6527);
			if (item.item_id === 6528) player.user.achiev.achievTickItem(6528);

			let itemConfig: DivingAchievementClothesItem | null = null;

			if (item.item_id === 6526) {
				itemConfig = DIVING_FIRST_MAP_ITEM;
			} else if (item.item_id === 6527) {
				itemConfig = DIVING_SECOND_MAP_ITEM;
			} else if (item.item_id === 6528) {
				itemConfig = DIVING_THIRD_MAP_ITEM;
			}

			player.user.log(
				"diving",
				langStringDefault(
					"inventory.79615eb2c2c9cb8168a7518dff6ca77e",
					item.item_id,
				),
			);

			if (itemConfig !== null) {
				let advancedNumber: number =
					itemConfig.variation * CLOTH_VARIATION_ID_MULTIPLER;

				advancedNumber += player.user.male
					? itemConfig.dressMaleCfg
					: itemConfig.dressFemaleCfg;

				player.user.giveItem(
					{
						item_id: itemConfig.item_id,
						serial: itemConfig.serial,
						advancedNumber: advancedNumber,
					},
					true,
				);
			}

			CustomEvent.triggerClient(player, "diving:useMap", item.item_id);
		}

		if (item.item_id === AUTO_SOUND_ITEM_ID) {
			if (!player.vehicle) {
				return player.notify(
					player.user.LangString("inventory.a3d83c46df46bea718dbdbb1d0da8bb1"),
					"error",
				);
			}

			if (!player.vehicle?.entity?.data) {
				return player.notify(
					player.user.LangString("inventory.ce2574fd5b8f0a6be6b1b6752f932941"),
					"error",
				);
			}

			const vehicleData = player.vehicle.entity.data;
			//@ts-ignore
			if (vehicleData.isAutoSoundInstalled) {
				return player.notify(
					player.user.LangString("inventory.aabe2e6b4218ce6555890aea88482ab9"),
					"error",
				);
			}

			//@ts-ignore
			vehicleData.isAutoSoundInstalled = true;
			vehicleData.save();

			item.useCount(1);

			player.notify(
				player.user.LangString("inventory.c7b7e284a5342536c7f20fd4081abf29") +
					player.user.LangString("inventory.86b85d5f4e78de4fdbf34707576a7286"),
				"success",
			);
		}

		if (
			[ITEM_TYPE.WATER, ITEM_TYPE.FOOD, ITEM_TYPE.ALCO].includes(itmCfg.type)
		) {
			if (itmCfg.type === ITEM_TYPE.ALCO) {
				count = system.smallestNumber(count, 45);
				user.addIll("alco", count);
				CustomEvent.triggerClient(
					player,
					"drug:use",
					system.biggestNumber(10, count),
					true,
				);
			}
			if (itmCfg.type != ITEM_TYPE.FOOD) {

				if (user.hasAttachment("item_" + itmCfg.item_id))
					return player.notify(
						player.user.LangString(
							"inventory.d145e7dbd06629e3ef1dea02ffe01ffe",
						),
						"error",
					);
				user.playAnimation(
					[
						["mp_player_intdrink", "intro_bottle", 1],
						["mp_player_intdrink", "loop_bottle", 1],
						["mp_player_intdrink", "outro_bottle", 1],
					],
					true,
					false,
				);
				player.user.water += (count) * (itmCfg.restore_water ? itmCfg.restore_water : 100);
			} else {
				if (user.hasAttachment("item_" + itmCfg.item_id))
					return player.notify(
						player.user.LangString(
							"inventory.2503009e007ba1320dc20c2454c05a6c",
						),
						"error",
					);
				user.playAnimation(
					[
						["mp_player_inteat@burger", "mp_player_int_eat_burger_enter", 1],
						["mp_player_inteat@burger", "mp_player_int_eat_burger", 1],
						["mp_player_inteat@burger", "mp_player_int_eat_burger_fp", 1],
						["mp_player_inteat@burger", "mp_player_int_eat_exit_burger", 1],
					],
					true,
					false,
				);
				if (item.item_id === 30) player.user.water += count;
				player.user.food += (count) * (itmCfg.restore_food ? itmCfg.restore_food : 100);
				if (!item.create) {
					const cfgIll = getIllConfig("food");
					if (system.getRandomInt(0, 30) <= (cfgIll.chance || 10)) {
						user.addIll("food", cfgIll.step);
					}
				}
			}


			if (item.create) {
				let lastTime =
					item.create + (itmCfg.poisoning || POISONING_DAYS) * 24 * 60;
				let m = lastTime - system.timestamp;
				if (m > 0) {
					let d = Math.floor(m / 60 / 24);
					if (d) {
						let chance = Math.min(100, POISONING_CHANCE_PER_DAY * d);
						let z = system.getRandomInt(0, 100);
						if (z <= chance) {
							const cfgIll = getIllConfig("food");
							user.addIll("food", cfgIll.step);
						}
					}
				}
			}
			user.addAttachment("item_" + itmCfg.item_id);
			setTimeout(() => {
				if (mp.players.exists(player))
					user.removeAttachment("item_" + itmCfg.item_id);
			}, 4000);
			item.useCount(count, player);
		}
		if (itmCfg.inHand) {
			if (user.hasAttachment("item_" + itmCfg.item_id))
				user.removeAttachment("item_" + itmCfg.item_id);
			else user.addAttachment("item_" + itmCfg.item_id);
		}

		if (item.item_id === 868) {
			if (player.dimension)
				return player.notify(
					player.user.LangString("inventory.286e7884cf9a70cdacd2de329b6df98c"),
					"error",
				);
			if (player.vehicle)
				return player.notify(
					player.user.LangString("inventory.51f44c2d8d8f303616e99c550689e618"),
					"error",
				);
			if (user.inSaveZone)
				return player.notify(
					player.user.LangString("inventory.bd28edc138a2a4977c05ec7b41fd0b01"),
					"error",
				);
			item.useCount(count, player);
			const targets = [...User.getNearestPlayers(player, 400), player];
			const pos = user.dropPos;
			targets.map((target) => {
				CustomEvent.triggerClient(target, "fireshow:play", [
					pos.x,
					pos.y,
					pos.z,
				]);
			});
			player.user.playAnimation(
				[["anim@mp_fireworks", "place_firework_3_box"]],
				false,
			);
			inventory.closeInventory(player);
		}
		if (item.item_id === 866) {
			if (item.advancedNumber !== user.id)
				return player.notify(
					player.user.LangString("inventory.d64c6c883bdfa684f6fec98e1f8d0ec4"),
					"error",
				);
			if (!item.advancedString)
				return player.notify(
					player.user.LangString("inventory.ac64fcd837959079214b0f446dd7444e"),
					"error",
				);
			const [type, model] = item.advancedString.split("|");
			if (type === "veh") {
				const vehConf = Vehicle.getVehicleConfig(model);
				if (!vehConf)
					return player.notify(
						player.user.LangString(
							"inventory.fbd51daa0dd13c63423de80a2e6c3fad",
						),
						"error",
					);
				if (vehConf.license && !user.haveActiveLicense(vehConf.license))
					return player.notify(
						player.user.LangString(
							"inventory.c07cac6bb1c000a9f59631a953ef1209",
							vehConf.name,
							LicenseName[vehConf.license],
						),
						"error",
					);
				if (user.myVehicles.length >= user.current_vehicle_limit)
					return player.notify(
						player.user.LangString(
							"inventory.ab1d90fdabd72859ac404a6de753d773",
							user.current_vehicle_limit,
						),
						"error",
					);
				Vehicle.createNewDatabaseVehicle(
					player,
					vehConf.id,
					{ r: 0, g: 0, b: 0 },
					{
						r: 0,
						g: 0,
						b: 0,
					},
					new mp.Vector3(0, 0, 0),
					0,
					Vehicle.fineDimension,
					0,
					1,
				);
				player.outputChatBox(
					player.user.LangString(
						"inventory.b80b1c230e846ca0fee5494105b118a2",
						vehConf.name,
					),
				);
			} else {
				return player.notify(
					player.user.LangString("inventory.24af15c3c61af9e2b304d0993db054bb"),
					"error",
				);
			}
			item.useCount(1, player);
			player.notify(
				player.user.LangString("inventory.bea44f66d06da8446b67d57b3f60cd90"),
				"success",
			);
			inventory.reloadInventory(player, [OWNER_TYPES.PLAYER, player.dbid]);
			return;
		}
		if ([817, 862, 884].includes(item.item_id)) {
			const veh = user.getNearestVehicle();
			if (!veh)
				return player.notify(
					player.user.LangString("inventory.6f91572c1d73b52ac3724f0d594d5652"),
					"error",
				);
			const cfg = Vehicle.getVehicleConfig(veh);
			if (cfg) {
				if (cfg.fuel_type === VEHICLE_FUEL_TYPE.ELECTRO && item.item_id !== 862)
					return player.notify(
						player.user.LangString(
							"inventory.12e284a07f8ef3b4ec27a8690b7c6e85",
							getBaseItemNameById(item.item_id),
							cfg.name,
						),
						"error",
					);
				if (cfg.fuel_type !== VEHICLE_FUEL_TYPE.ELECTRO && item.item_id !== 817)
					return player.notify(
						player.user.LangString(
							"inventory.d7b205ca980d6bdf3025eb8c7cfa7ed3",
							getBaseItemNameById(item.item_id),
							cfg.name,
						),
						"error",
					);	
			}
			const max = Vehicle.getFuelMax(veh);
			const current = Vehicle.getFuel(veh);
			const needFuel = Math.min(item.count, max - current);
			if (!needFuel)
				return player.notify(
					`${cfg.fuel_type === VEHICLE_FUEL_TYPE.ELECTRO ? langStringDefault("inventory.1df1d7c0789da80f8969279ca67f4a81") : langStringDefault("inventory.58fca129292f6f25bb70c3a771198a69")}`,
					"error",
				);
			item.useCount(needFuel, player);
			Vehicle.addFuel(veh, needFuel);
			player.notify(
				`${cfg.fuel_type === VEHICLE_FUEL_TYPE.ELECTRO ? langStringDefault("inventory.926250c3fe384a489a3e2d5dd66b523c") : langStringDefault("inventory.0151a1cbf14810863d5ab347af2443b5")}`,
				"success",
			);
		}
		if (itmCfg.type === ITEM_TYPE.DRUG) {
			if (user.drugUse)
				return player.notify(
					player.user.LangString("inventory.2783fd769e173f93362c13817225d03b"),
					"error",
				);

			if (user.isInCombat) {
				player.notify(
					player.user.LangString("inventory.ee6bbae746d4c32844b65bdf8da52655"),
					"error",
				);
				return;
			}

			user.drugUse = true;
			user.playAnimation(
				[
					["mp_player_intdrink", "intro_bottle", 1],
					["mp_player_intdrink", "loop_bottle", 2],
					["mp_player_intdrink", "outro_bottle", 1],
				],
				true,
				false,
			);
			user.addIll("narko", itmCfg.drugMultiple || 1);
			CustomEvent.triggerClient(
				player,
				"drug:use",
				system.biggestNumber(30, itmCfg.drugMultiple * 0.3),
			);
			item.useCount(1, player);
			if (itmCfg.drugHeal) {
				player.user.setRegeneration(itmCfg.drugHeal, 60, 5);
				//user.health = system.smallestNumber(user.health + (itmCfg.drugMultiple * 0.3), 100)
			}
			setTimeout(() => {
				if (mp.players.exists(player)) user.drugUse = false;
			}, 15000);
		}

		if (item.item_id === 865) {
			const veh = user.getNearestVehicle();
			if (!veh)
				return player.notify(
					player.user.LangString("inventory.07ed49f0fcc4e2a098c53460d2689dd6"),
					"error",
				);
			if (!veh.entity)
				return player.notify(
					player.user.LangString("inventory.e48ad0225115af58b318d400716fa2e1"),
					"error",
				);
			if (veh.entity.owner && veh.entity.owner !== user.id)
				return player.notify(
					player.user.LangString("inventory.8428f722146ae19940fd406fe9c4ca66"),
					"error",
				);
			if (veh.entity.familyOwner && veh.entity.familyOwner !== user.familyId)
				return player.notify(
					player.user.LangString("inventory.769b1da3f6a78207bcc87c49a417e9ce"),
					"error",
				);
			if (veh.entity.data.keyProtect)
				return player.notify(
					player.user.LangString("inventory.43d199e1c2497ee763be456c342bb96a"),
					"error",
				);
			item.useCount(1, player);
			user.playAnimation([["mp_common", "givetake2_a"]], true);
			veh.entity.data.keyProtect = 1;
			veh.entity.save();
			player.notify(
				player.user.LangString("inventory.ab74fef4fa49fc472c3b21765374b096"),
				"success",
			);
			inventory.reloadInventory(player, [OWNER_TYPES.PLAYER, player.dbid]);
			return;
		}
		if (item.item_id === 815) {
			if (player.vehicle)
				return player.notify(
					player.user.LangString("inventory.76040a7ff85de5a500dbf260f319a529"),
					"error",
				);

			inventory.closeInventory(player);
			const veh = user.getNearestVehicle();
			if (!veh)
				return player.notify(
					player.user.LangString("inventory.94791f9b7af73de3e5e52e56f526e8a5"),
				);

			if (veh.getOccupants().length > 0) {
				return player.notify(
					player.user.LangString("inventory.6d6badedbfa1f512599ab56a493cd4f9"),
				);
			}

			// Pornește animația de reparație
			player.user.playAnimation([["mini@repair", "fixing_a_ped", 1]], true, true);

			// După 5 secunde consumă trusa și repară vehiculul
			setTimeout(() => {
				if (!mp.players.exists(player)) return;
				item.useCount(1, player);
				Vehicle.repair(veh, true);
                // CustomEvent.callClient(player, 'anim:stop');

				// player.user.playAnimation([["mini@repair", "fixing_a_ped", 0]], false, false);
                player.stopAnimation();

                
				player.notify("Ai reparat vehiculul cu succes!", "success");
			}, 10000);

			return;
		}

		// // Набор инструментов
		// if (item.item_id === 815) {
		// 	if (player.vehicle)
		// 		return player.notify(
		// 			player.user.LangString("inventory.76040a7ff85de5a500dbf260f319a529"),
		// 			"error",
		// 		);
		// 	inventory.closeInventory(player);
		// 	const veh = user.getNearestVehicle();
		// 	if (!veh)
		// 		return player.notify(
		// 			player.user.LangString("inventory.94791f9b7af73de3e5e52e56f526e8a5"),
		// 		);
		// 	if (veh.getOccupants().length > 0) {
		// 		return player.notify(
		// 			player.user.LangString("inventory.6d6badedbfa1f512599ab56a493cd4f9"),
		// 		);
		// 	}
		// 	item.useCount(1, player);
		// 	Vehicle.repair(veh, true);
		// 	return;
		// }
		// Наручники
		if ([CUFFS_ITEM_ID, SCREWS_ITEM_ID].includes(item.item_id)) {
			const target = player.user.getNearestPlayer(2);
			if (!target)
				return player.notify(
					player.user.LangString("inventory.c9ef95a3094fd91ac4ec0ad261f1996c"),
					"error",
				);
			user.setCuffedTarget(target, item);
		}

		if (
			[CUFFS_KEY_ITEM_ID, ...SCREWS_DESTROYER_ITEM_IDS].includes(item.item_id)
		) {
			const target = player.user.getNearestPlayer(2);
			if (!target)
				return player.notify(
					player.user.LangString("inventory.9cd45dfd2e3b0c9d49b158fac41fdbeb"),
					"error",
				);
			user.setUncuffedTarget(target);
		}

		// Аптечка
		if (itmCfg.use && itmCfg.healUse) {
			if (user.isInCombat) {
				player.notify(
					player.user.LangString("inventory.f6f9083d2d509c7519f50d3709b5eba8"),
					"error",
				);
				return;
			}

			let attach: string;

			if (item.item_id === 902) {
				attach = "heal_902";
			} else if (item.item_id === 908) {
				attach = "heal_908";
			}

			if (attach) player.user.addAttachment(attach);

			user
				.playAnimationWithResult(
					["amb@prop_human_movie_studio_light@idle_a", "idle_a", true],
					5,
					langStringDefault("inventory.6abc79edcf4bf42b806caafe4343c4b1") +
						itmCfg.name,
				)
				.then((status) => {
					if (attach) player.user.removeAttachment(attach);
					if (!status) return;
					if (!mp.players.exists(player)) return;
					if (!user.inventory.find((q) => q.id === item.id))
						return player.notify(
							player.user.LangString(
								"inventory.0bdad43e986d7cf6bad7978d73f8ed3e",
							),
							"error",
						);
					player.user.health += itmCfg.healUse;

					item.useCount(1, player);
					player.notify(
						player.user.LangString(
							"inventory.d17b2b8201cd3d52a27b48f448018c56",
						),
						"success",
					);
					if (attach)
						CustomEvent.triggerClient(player, "attach:removeLocal", attach);
				});
		}
		// // ARMURA SIMPLA (ITEM 960)
		// if (item.item_id === 960) {
		// 	if (player.armour >= 100) {
		// 		player.notify("Ai deja armura echipata.", "error");
		// 		return;
		// 	}

		// 	// Trimite către client să schimbe componenta vestimentară

		// 	// Dă armură reală
		// 	player.armour = 100;

		// 	// Consumă itemul
		// 	item.useCount(1, player);

		// 	// Animație
		// 	player.user.playAnimation([["missmic4", "michael_tux_fidget"]], true);

		// 	player.notify("Ai echipat armura cu succes.", "success");
		// 	return;
		// }
		// Документы
		if ([800, 802, 803, 824].includes(item.item_id)) {
			if (item.item_id === 824 && !UdoData.find((q) => q.id === user.fraction))
				return player.notify(
					player.user.LangString("inventory.da39f4b0f616be7dadc9a250f6828837"),
					"error",
				);
			inventory.closeInventory(player);
			const show = async () => {
				if (item.item_id == 800) {
					let data = await getDocumentData(item);
					if (!data)
						return player.notify(
							player.user.LangString(
								"inventory.036a246cbfa6d96402bdee46e61df126",
							),
							"error",
						);
					// user.setGui('idcard');
					CustomEvent.triggerCef(player, "cef:idcard:new", data);
				} else if (item.item_id == 824) {
					CustomEvent.triggerCef(player, "udo:show", user.udoData);
				} else if (item.item_id == 802) {
					const [
						document,
						date,
						code,
						id,
						name,
						social,
						idCreator,
						nameCreator,
						socialCreator,
						real,
					] = item.serial.split("|");
					CustomEvent.triggerCef(
						player,
						"document:show",
						document,
						date,
						code,
						id,
						name,
						social,
						idCreator,
						nameCreator,
						socialCreator,
						real,
					);
				} else if (item.item_id == 803) {
					const [type, serial, code, timestring, userid] =
						item.serial.split("-");
					const time = parseInt(timestring);
					const userdata = await User.getData(parseInt(userid));
					if (!userdata)
						return (
							player.notify(
								player.user.LangString(
									"inventory.409cebd2669524e8ff00fc5e36c3a6aa",
								),
							),
							inventory.deleteItem(item)
						);

						const house = houses.getByUserList(player.user?.id);

						const licenses = player.user?.licenses?.map((license) => {
							return license[0];
						});

						CustomEvent.triggerCef(player, "license:show", {
							type,
							serial: parseInt(serial),
							time,
							player: userdata.rp_name,
							code,
							gender: item.advancedNumber,
							home: house ? `${house.name} #${house.id}` : '',
							id: player.user?.id,
							licenses: licenses
						});
				}
			};
			const m = menu.new(player, "", "");
			if (!user.selectNearestPlayer()) return show();
			m.newItem({
				name: langStringDefault("inventory.3aca8b4b3b861ea99db87faf2915f2a4"),
				onpress: async () => {
					m.close();
					show();
				},
			});
			m.newItem({
				name: langStringDefault("inventory.5c00476f90e2a5f9a53c7edadf340825"),
				onpress: async () => {
					user.selectNearestPlayer().then((target) => {
						m.close();
						menu
							.accept(
								target,
								target.user.LangString(
									"inventory.79c05b8faab564ef819c2d5065293ae6",
								),
								null,
								15000,
							)
							.then(async (status) => {
								if (!status) return;
								if (!mp.players.exists(player)) return;
								if (!mp.players.exists(target)) return;
								if (!item) return;
								if (!user.getNearestPlayers(5).find((q) => q.id === target.id))
									return target.notify(
										target.user.LangString(
											"inventory.bce23425f8d0c12fea647d9e9cd64f62",
										),
										"error",
									);
								if (item.item_id == 800) {
									let data = await getDocumentData(item);
									if (!data)
										return player.notify(
											player.user.LangString(
												"inventory.02189994cb3b12c478badb3a45ef319d",
											),
											"error",
										);
									// target.user.setGui('idcard');
									CustomEvent.triggerCef(target, "cef:idcard:new", data);
								} else if (item.item_id == 824) {
									CustomEvent.triggerCef(target, "udo:show", user.udoData);
								} else if (item.item_id == 802) {
									const [
										document,
										date,
										code,
										id,
										name,
										social,
										idCreator,
										nameCreator,
										socialCreator,
										real,
									] = item.serial.split("|");
									CustomEvent.triggerCef(
										target,
										"document:show",
										document,
										date,
										code,
										id,
										name,
										social,
										idCreator,
										nameCreator,
										socialCreator,
										real,
									);
								} else if (item.item_id == 803) {
									const [type, serial, code, timestring, userid] =
										item.serial.split("-");
									const time = parseInt(timestring);
									const userdata = await User.getData(parseInt(userid));
									if (!userdata)
										return (
											player.notify(
												player.user.LangString(
													"inventory.7b9a2409a1541b93b568769baeab2431",
												),
											),
											inventory.deleteItem(item)
										);
									if (!mp.players.exists(target)) return;
										// const documentData = await getDocumentData(item);
										const house = houses.getByUserList(player.user?.id);

										const licenses = userdata?.licenses?.map((license) => {
											return license[0];
										});

											CustomEvent.triggerCef(target, "license:show", {
												type,
												serial: parseInt(serial),
												time,
												player: userdata?.rp_name,
												code,
												gender: item.advancedNumber,
												home: house ? `${house.name} #${house.id}` : '',
												id: userdata?.id,
												licenses: licenses
											});
								}
							});
					});
				},
			});
			m.open();
			return;
		}
		if (item.item_id === 856) {
			await tablet.openForPlayer(player);
		}
		if (item.item_id === 853) {
			CustomEvent.triggerCef(player, "terminal:open");
			inventory.closeInventory(player);
		}
		if (item.item_id === 852) {
			CustomEvent.triggerCef(player, "radio:switchRadio");
			inventory.closeInventory(player);
		}
		if (item.item_id === 850) {
			if (!player.phoneCurrent) {
				phone.openPhone(player, item.id);
				inventory.closeInventory(player, false);
			} else {
				CustomEvent.triggerCef(player, "phone:closephone");
				player.phoneReadMessage = null;
				player.phoneCurrent = null;
			}
		}

		if (item.item_id == 40103) {
			await drugFarm.useWeed(player, item);
		}
		if (item.item_id == 40104) {
			await drugFarm.usePlantCane(player, item);
		}


		if (item.item_id === 851) {
			inventory.closeInventory(player);
			let itemsP = inventory
				.getInventory(OWNER_TYPES.PLAYER, player.user.id)
				.filter((item) => item.item_id === 850);
			const freePhones = itemsP.filter((q) => !q.advancedNumber);
			if (freePhones.length === 1) {
				let sim = inventory.get(item.id, OWNER_TYPES.PLAYER, player.user.id);
				if (!sim)
					return player.notify(
						player.user.LangString(
							"inventory.d477fc9ccc99572ce1a681a6174770a8",
						),
						"error",
					);
				let phone = inventory.get(
					freePhones[0].id,
					OWNER_TYPES.PLAYER,
					player.user.id,
				);
				if (!phone)
					return player.notify(
						player.user.LangString(
							"inventory.af5322ff2fc385687e8b7bd64cf47030",
						),
						"error",
					);
				if (phone.advancedNumber)
					return player.notify(
						player.user.LangString(
							"inventory.704236c53abe493cc2720f4bdb9a1b45",
						),
						"error",
					);
				phone.advancedNumber = sim.advancedNumber + 0;
				phone.advancedString = sim.advancedString + "";
				inventory.deleteItem(sim, OWNER_TYPES.PLAYER, player.user.id);
				if (!phone.temp) phone.save();
				user.notifyPhone(
					"System",
					user.LangString("inventory.1ec20fdcc15472b1d3960015450454e4"),
					user.LangString("inventory.cfe216b86fc79d2a8f48e73ab78c0c8d"),
					"success",
				);
				return;
			}
			if (itemsP.length == 0)
				return player.notify(
					player.user.LangString("inventory.c52dabcf411a832edabe1c39a8af8011"),
					"error",
				);
			let m = menu.new(
				player,
				"",
				player.user.LangString("inventory.f341a6e6c6b376582b3316da2f153928"),
			);
			itemsP.map((itemq) => {
				m.newItem({
					name: getItemName(itemq),
					icon: "Icon_" + itemq.item_id,
					more: `${itemq.advancedNumber ? langStringDefault("inventory.99364ddca3e5a1add01b5d9a62e7444b") : langStringDefault("inventory.0d2205cd77dc9dc6b40937837f77d2d4")}`,
					onpress: () => {
						if (itemq.advancedNumber)
							return player.notify(
								player.user.LangString(
									"inventory.2d543d10f9368cc56cdaadfeb0f2d52e",
								),
								"error",
							);
						m.close();
						let sim = inventory.get(
							item.id,
							OWNER_TYPES.PLAYER,
							player.user.id,
						);
						if (!sim)
							return player.notify(
								player.user.LangString(
									"inventory.96a0a5eaaaf52595378a258d1fa5824b",
								),
								"error",
							);
						let phone = inventory.get(
							itemq.id,
							OWNER_TYPES.PLAYER,
							player.user.id,
						);
						if (!phone)
							return player.notify(
								player.user.LangString(
									"inventory.1ec9d329ba123c2599dfac48cf7b7d8d",
								),
								"error",
							);
						if (phone.advancedNumber)
							return player.notify(
								player.user.LangString(
									"inventory.3d99def02bf5853f2580bc157975f6fa",
								),
								"error",
							);
						phone.advancedNumber = sim.advancedNumber + 0;
						phone.advancedString = sim.advancedString + "";
						inventory.deleteItem(sim, OWNER_TYPES.PLAYER, player.user.id);
						if (!phone.temp) phone.save();
						user.notifyPhone(
							"System",
							user.LangString("inventory.0acedf7b02174648ff12d744a48fbcb5"),
							user.LangString("inventory.77bec0149fdb4acb4249ec40b789e0c7"),
							"success",
						);
					},
				});
			});
			m.open();
			return;
		}
		if (itmCfg.type == ITEM_TYPE.CLOTH) {
			if (item.item_id !== ARMOR_ITEM_ID) {
				if (user.getJobDress)
					return player.notify(
						player.user.LangString(
							"inventory.b54a820a334e54abcfa415d18bf06e54",
						),
						"error",
					);
				if (!user.mp_character)
					return player.notify(
						player.user.LangString(
							"inventory.ee9ad6cedf350de0322895ce8a723cad",
						),
						"error",
					);
			}

			const dressCfg = dress.get(item.advancedNumber);
			if (!dressCfg)
				return player.notify(
					player.user.LangString("inventory.1ec99e9edf2d973c21de2bd9abe484e4"),
					"error",
				);

			if (item.item_id === ARMOR_ITEM_ID) {
				// У всех бронежилетов должны быть DressEntity как для мужского, так и для женского персонажа
				// Ищем аналог для противоположного пола
				if (dressCfg.male !== user.is_male) {
					item.advancedNumber = dress.data.find(
						(dressEntity) =>
							dressEntity.male === user.is_male &&
							dressEntity.name === item.serial,
					).id;
				}
			} else {
				if (dressCfg.male !== user.is_male)
					return player.notify(
						langStringDefault("inventory.5389d0860d300a496bdce2731d51542a") +
							(dressCfg.male
								? langStringDefault(
										"inventory.872d7140014a16f25306ec50996a0720",
									)
								: langStringDefault(
										"inventory.d54423af7cc7e9e8243e2be1e1d56115",
									)),
						"error",
					);
			}

			user.setDressValueById(
				item.item_id,
				item.advancedNumber,
				user.customArmor,
			);

			if (item.item_id === ARMOR_ITEM_ID) {
				user.armour = item.count;
			}

			inventory.deleteItem(item, OWNER_TYPES.PLAYER, user.id);
			inventory.reloadInventory(player, [OWNER_TYPES.PLAYER, player.dbid]);

			CustomEvent.triggerClient(player, "inventory:updatePersonage");
		}
		if (itmCfg.type == ITEM_TYPE.WEAPON) {
			player.user.currentWeapon =
				player.user.currentWeapon &&
				player.user.currentWeapon.item_id === item.item_id
					? null
					: {
							id: item.id,
							item_id: item.item_id,
							ammo: 0,
							serial: item.serial,
							unloaded: true,
							max_ammo: inventoryShared.getWeaponConfigByItemId(item.item_id)
								.ammo_max,
						};
		}
		if (itmCfg.type == ITEM_TYPE.WEAPON_MAGAZINE) {
			return;
		}
		if (itmCfg.type == ITEM_TYPE.AMMO_BOX) {
			return;
		}


		// 🪝 Jucătorul a folosit o undiță
		if (RODS.map(r => r.itemId).includes(item.item_id)) {

			// ✅ Verificare ore jucate
			if (user.playtime < LEVEL_PERMISSIONS.PESCAR) {
				return player.notify(`Ai nevoie de ${LEVEL_PERMISSIONS.PESCAR} ore jucate pentru job pescar.`, 'error');
			}
			// 🪱 Verificare momeala
			const BAIT_ITEM_ID = 40159;
			const baitItem = user.inventory.find(i => i.item_id === BAIT_ITEM_ID);

			if (!baitItem) {
				return player.notify("Nu ai rime pentru a pescui!", "error");
			}
			// ✅ Setează undița echipată
			user.rodInHandId = item.item_id;

			// ✅ Trimite către client datele pentru sistemul de pescuit
			CustomEvent.triggerClient(
				player,
				'rod:use',
				getFisherLevelByExp(user.getJobExp('fisher')),
				user.getJobExp('fisher'),
				user.entity.fishStats
			);
		}



		
		if (itmCfg.type == ITEM_TYPE.BAGS) {
			player.user.sync_bag();
		}

		invokeHook(INVENTORY_USE_ITEM_HOOK, player, item, itmCfg);

		inventory.reloadInventory(player, [owner_type, owner_id]);
		Logs.insertInventoryLog(item, owner_id, -1, "use", `useItem`);
	},
	closeInventory: (player: PlayerMp, sendGui = true) => {
		if (!mp.players.exists(player)) return;
		if (!player.openInventory) return;
		if (!player.user) return;
		if (sendGui) player.user.setGui(null);
		player.openInventory = null;
	},
	removeAllWeapons: (player: PlayerMp) => {
		const playerItems = player.user.allMyItems;
		const itemsToDelete = playerItems.filter(
			(item) => inventoryShared.get(item.item_id).type === ITEM_TYPE.WEAPON,
		);

		inventory.deleteItems(...itemsToDelete);
	},
	getDroppedItems: (player: PlayerMp, radius = 5) => {
		let res: ItemEntity[] = inventory.inventory_blocks
			.get(`0_0`)
			.filter(
				(q) =>
					q &&
					system.distanceToPos(q, player.position) <= radius &&
					q.d == player.dimension,
			);

		return res;
	},
	deleteItemsById: (player: PlayerMp, itemId: number, amount: number) => {
		const items = player.user.inventory.filter((i) => i.item_id === itemId);

		for (let item of items) {
			const itemConfig = inventoryShared.get(item.item_id);

			const leftToDelete = amount - (itemConfig.canSplit ? item.count : 1);

			if (itemConfig.canSplit) {
				if (item.count < amount) {
					item.count = 0;
				} else {
					item.count -= amount;
				}
			} else {
				item.count = 0;
			}

			if (item.count <= 0) {
				inventory.deleteItem(item, OWNER_TYPES.PLAYER, player.user.id);
			} else {
				item.save();
			}

			amount = leftToDelete;
			if (amount <= 0) {
				break;
			}
		}

		inventory.reloadInventory(player, [OWNER_TYPES.PLAYER, player.user.id]);
	},
	deleteItem: (
		itemget: number | ItemEntity,
		owner_type?: OWNER_TYPES,
		owner_id?: number,
		deleteFromDatabase = true,
	) => {
		let item =
			typeof itemget === "number"
				? inventory.get(itemget, owner_type, owner_id)
				: itemget;
		if (!item) return;
		if (item.prop) {
			if (mp.objects.exists(item.prop)) item.prop.destroy();
			item.prop = null;
		}
		if (item.colshape && item.colshape.exists) {
			item.colshape.destroy();
			item.colshape = null;
		}
		let oldInventory = inventory.getInventory(item.owner_type, item.owner_id);
		let itmCfg = inventoryShared.get(item.item_id);
		if (!itmCfg) {
			if (deleteFromDatabase && !item.temp) removeEntity(item);
		} else {
			if (item.owner_type == OWNER_TYPES.PLAYER) {
				if (itmCfg.type == ITEM_TYPE.WEAPON) {
					let target = User.get(item.owner_id);
					if (target) {
						let curWeapon = target.user.currentWeapon;
						if (curWeapon) {
							if (curWeapon.id == item.id) {
								target.user.removeCurrentWeapon(false, true);
							}
						}
					}
				} /*else if(inventoryShared.getWeaponConfigByMagazine(item.item_id)){
                    let target = User.get(item.owner_id);
                    if (target){
                        target.user.currentWeaponSync();
                    }
                }*/
			}
		}
		if (item.item_id === 850) {
			phone.getPhoneEntity(item.id, false).then((phone) => {
				if (phone) PhoneEntity.remove(phone);
			});
		}
		const container = CONTAINERS_DATA.find((q) => q.item_id === item.item_id);
		if (container) {
			inventory.clearInventory(container.owner_type, item.id);
		}
		if (oldInventory && oldInventory.findIndex((q) => q.id == item.id) > -1)
			oldInventory.splice(
				oldInventory.findIndex((q) => q.id == item.id),
				1,
			);
		if (deleteFromDatabase && !item.temp) removeEntity(item);

		Logs.insertInventoryLog(
			item,
			owner_id,
			-1,
			"delete",
			`delete from owner ${owner_type}`,
		);
	},
	deleteItems: (...itemget: ItemEntity[]) => {
		const multiple = itemget.length > 10;
		if (multiple) {
			let s = 0;
			const q = () => {
				ItemEntity.delete({ id: In(itemget.map((q) => q.id)) })
					.then((status) => {})
					.catch((err) => {
						system.debug.error(err);
						s++;
						if (s >= 5) return;
						setTimeout(() => {
							q();
						}, 3000);
					});
			};
			q();
		}
		itemget.map((item) =>
			inventory.deleteItem(item, item.owner_type, item.owner_id, !multiple),
		);
	},
	getPassword: (owner_type: number, owner_id: number) => {
		return 1234;
	},
	/**
	 * @param checkAllNearest "странный" параметр, отвечающий за проверку блоков с ближайшими через getAllNearest.
	 */
	reloadInventoryAdvanced: (
		position: Vector3Mp,
		range: number,
		dimension: number,
		checkAllNearest: boolean,
		...blocks: [number, number][]
	) => {
		setTimeout(() => {
			let inventories = new Map<string, InventoryItemCef[]>();
			let weights = new Map<string, number>();
			let weightsMax = new Map<string, number>();
			blocks.map((block) => {
				let items = inventory.getInventory(block[0], block[1]);
				inventories.set(
					`${block[0]}_${block[1]}`,
					items.map((q) => {
						return [q.id, q.item_id, q.count, q.serial, q.extra];
					}),
				);
				weights.set(`${block[0]}_${block[1]}`, inventory.getWeightItems(items));
				weightsMax.set(
					`${block[0]}_${block[1]}`,
					inventory.getWeightInventoryMax(block[0], block[1]),
				);
			});

			let players: PlayerMp[] = [];
			mp.players.forEachInRange(position, range, (pl) => {
				if (!pl.openInventory) return;
				if (pl.dimension != dimension) return;
				players.push(pl);
			});

			players.map((player) => {
				let allNearest = inventory.getAllNearestInventory(player);
				if (player.openInventory) {
					let ownertype = system.parseInt(player.openInventory.split("_")[1]);
					let ownerid = system.parseInt(player.openInventory.split("_")[2]);
					if (
						ownertype &&
						ownerid &&
						!allNearest.find(
							(q) => q.owner_id === ownerid && q.owner_type == ownertype,
						)
					) {
						allNearest.push({
							owner_type: ownertype,
							owner_id: ownerid,
							have_access: inventory.haveAccess(player, ownertype, ownerid),
						});
					}
				}
				if (!mp.players.exists(player)) return;
				if (!player.openInventory) return;
				if (!player.user) return;
				let blocksSend: InventoryDataCef[] = [];
				blocks.map((block) => {
					// полная херня, но с этой херней вероятность что-то сломать гораздо ниже
					// без неё, он не дает обновить блоки, которые закрылись от игрока
					if (checkAllNearest) {
						if (
							(block[0] != OWNER_TYPES.PLAYER || block[1] != player.user.id) &&
							!allNearest.find(
								(q) =>
									q.owner_type == block[0] &&
									q.owner_id == block[1] &&
									q.have_access,
							)
						)
							return;
					}

					let namedesc = inventory.getInventoryNameAndDesc(
						block[0],
						block[1],
						player,
					);
					let access = inventory.haveAccess(player, block[0], block[1]);

					blocksSend.push({
						name: namedesc.name,
						desc: namedesc.desc,
						owner_type: block[0],
						owner_id: block[1],
						// weight: weights.get(`${block[0]}_${block[1]}`),
						weight_max: weightsMax.get(`${block[0]}_${block[1]}`),
						items: access ? inventories.get(`${block[0]}_${block[1]}`) : [],
						closed: !access,
					});
				});

				blocksSend.push({
					name: langStringDefault("inventory.0a8120a6a470824d90a4533e26055cbf"),
					desc: langStringDefault("inventory.3b3cbf28eaf47b78e93417cdeea1c59c"),
					owner_type: 0,
					owner_id: 0,
					// weight: 0,
					weight_max: 0,
					items: inventory.getDroppedItems(player, 5).map((q) => {
						return [q.id, q.item_id, q.count, q.serial, q.extra];
					}),
				});
				CustomEvent.triggerCef(
					player,
					"inventory:update",
					blocksSend,
					allNearest,
					player.user.currentWeapon,
					player.user.hotkeys,
					player.user.entity.inventory_level,
					player.user.entity.selectedBagId
				);
			});
		}, 100);
	},
	reloadInventory: (target: PlayerMp, ...blocks: [number, number][]) => {
		if (!mp.players.exists(target)) return;

		inventory.reloadInventoryAdvanced(
			target.position,
			5,
			target.dimension,
			true,
			...blocks,
		);
	},
	reloadPersonalInventory: (player: PlayerMp) => {
		const myInventory: InventoryDataCef = {
			name: langStringDefault("inventory.8a7dde76fa4f83fe1f980a8922ca5a6b"),
			desc: player.user.name,
			owner_id: player.dbid,
			owner_type: OWNER_TYPES.PLAYER,
			weight_max: inventory.getWeightInventoryMax(
				OWNER_TYPES.PLAYER,
				player.dbid,
			),
			items: inventory
				.getInventory(OWNER_TYPES.PLAYER, player.dbid)
				.map((item) => [
					item.id,
					item.item_id,
					item.count,
					item.serial,
					item.extra,
				]),
		};

		CustomEvent.triggerCef(player, "inventory:updateSelfBlock", myInventory);
	},
	openInventory: (player: PlayerMp, ownertype?: number, ownerid?: number) => {
		if (!player.user) return;
		if (!player.user.canUseInventory) return;
		if (player.user.cuffed) return player.notify("Ai catuse nu poti folosi inventarul", "error")
		let blocks: InventoryDataCef[] = [];
		let myid = player.user.id;
		let myinventory: InventoryItemCef[] = [];
		let myitems = inventory.getInventory(OWNER_TYPES.PLAYER, myid);
		myitems.map((item) => {
			myinventory.push([
				item.id,
				item.item_id,
				item.count,
				item.serial,
				item.extra,
			]);
		});

		blocks.push({
			name: langStringDefault("inventory.a421e2b8f0d0263ccfdbf1628c9f3fb2"),
			desc: player.user.name,
			owner_id: myid,
			owner_type: OWNER_TYPES.PLAYER,
			weight_max: inventory.getWeightInventoryMax(OWNER_TYPES.PLAYER, myid),
			items: myinventory,
		});
		blocks.push({
			name: langStringDefault("inventory.cdb41345275f4df2a259fdf1cd54260a"),
			desc: langStringDefault("inventory.0b2ca04e63aec9602126bc375fb2be56"),
			owner_type: 0,
			owner_id: 0,
			weight_max: 0,
			items: inventory.getDroppedItems(player, 5).map((q) => {
				return [q.id, q.item_id, q.count, q.serial, q.extra];
			}),
		});
		inventory.getAllNearestInventory(player).map((inv) => {
			let namedesc = inventory.getInventoryNameAndDesc(
				inv.owner_type,
				inv.owner_id,
				player,
			);
			let items = inv.have_access
				? inventory.getInventory(inv.owner_type, inv.owner_id)
				: [];
			blocks.push({
				name: namedesc.name,
				desc: namedesc.desc,
				owner_type: inv.owner_type,
				owner_id: inv.owner_id,
				closed: !inv.have_access,
				weight_max: inventory.getWeightInventoryMax(
					inv.owner_type,
					inv.owner_id,
				),
				items: items.map((q) => {
					return [q.id, q.item_id, q.count, q.serial, q.extra];
				}),
			});
		});
		if (player.openInventory && !ownertype && !ownerid) {
			ownertype = system.parseInt(player.openInventory.split("_")[1]);
			ownerid = system.parseInt(player.openInventory.split("_")[2]);
		}
		if (
			ownertype &&
			!isNaN(ownertype) &&
			ownertype > 0 &&
			!isNaN(ownerid) &&
			ownerid > 0
		) {
			let namedesc = inventory.getInventoryNameAndDesc(
				ownertype,
				ownerid,
				player,
			);
			let items = inventory.getInventory(ownertype, ownerid);
			blocks.push({
				name: namedesc.name,
				desc: namedesc.desc,
				owner_type: ownertype,
				owner_id: ownerid,
				weight_max: inventory.getWeightInventoryMax(ownertype, ownerid),
				items: items.map((q) => {
					return [q.id, q.item_id, q.count, q.serial, q.extra];
				}),
			});
		}

		player.openInventory = `inv_${ownertype}_${ownerid}`;
		CustomEvent.triggerClient(
			player,
			"inventory:open",
			blocks,
			player.user.currentWeapon,
			player.user.hotkeys,
			player.user.entity.inventory_level,
			player.user.food / 10,
			player.user.water / 10,
			player.user.dress.armor,
			player.user.havePhone ? player.user.getArrayItem(850)[0]?.id : null,
			player.user.entity.selectedBagId,
		);
	},
	getWeightItems: (items: ItemEntity[]) => {
		let weight = 0;
		items.map((item) => {
			weight += getItemWeight(item.item_id, item.count);
		});
		return weight;
	},
	getWeightInventoryMax: (owner_type: OWNER_TYPES, owner_id: number) => {
		if (owner_type === OWNER_TYPES.GANGWAR_CONTAINER) return 0;
		if (owner_type == OWNER_TYPES.BUSINESS) {
			let biz = business.get(owner_id);
			if (!biz) return 0;
			let lvl = business_stock_level[biz.upgrade];
			if (!lvl) lvl = business_stock_level[business_stock_level.length - 1];
			return lvl;
		}
		if (owner_type == OWNER_TYPES.HOUSE) {
			let house = houses.get(owner_id);
			if (!house) return 0;
			let stockUpgrd = HOUSE_UPGRADE_LEVEL_COST[house.stock];
			if (!stockUpgrd) stockUpgrd = HOUSE_UPGRADE_LEVEL_COST[0];
			return (stockUpgrd.amount + HOUSE_DEFAULT_WEIGHT_KG) * 1000;
		}
		if (owner_type == OWNER_TYPES.STOCK_SAFE) {
			let house = houses.get(owner_id);
			if (!house) return 0;
			return (
				(HOUSE_CHEST_KG_DEFAULT +
					house.haveChestLevel * HOUSE_CHEST_KG_PER_LEVEL) *
				1000
			);
		}
		if (
			owner_type >= OWNER_TYPES.STOCK_1 &&
			owner_type <= OWNER_TYPES.STOCK_15
		) {
			let warehouse = warehouses.get(owner_id);
			if (warehouse) {
				return warehouse.getSlotWeightMax(owner_type - 4);
			}
		}
		if (owner_type == OWNER_TYPES.PLAYER) {
			const target = User.get(owner_id);
			if (target && target.user)
				return (
					target.user.entity.inventory_level *
						PLAYER_INVENTORY_KG_PER_LEVEL *
						1000 +
					PLAYER_DEFAULT_WEIGHT_KG * 1000
				);
			return PLAYER_DEFAULT_WEIGHT_KG * 1000;
		}
		if (CONTAINERS_DATA.find((q) => q.owner_type === owner_type)) {
			return CONTAINERS_DATA.find((q) => q.owner_type === owner_type).max_size;
		}
		if (
			[
				OWNER_TYPES.FRACTION_VEHICLE,
				OWNER_TYPES.VEHICLE,
				OWNER_TYPES.VEHICLE_TEMP,
			].includes(owner_type)
		) {
			let cfg: VehicleConfigsEntity;
			if (owner_type == OWNER_TYPES.VEHICLE) {
				const veh = Vehicle.get(owner_id);
				if (veh) cfg = veh.config;
			} else {
				const veh = (
					owner_type === OWNER_TYPES.FRACTION_VEHICLE
						? Vehicle.getByCarageCarId
						: Vehicle.getByTmpId
				)(owner_id);
				if (veh) cfg = Vehicle.getVehicleConfig(veh);
			}
			if (cfg) return cfg.stock * 1000;
		}
		return 10000000;
	},
	getInventoryNameAndDesc: (
		owner_type: OWNER_TYPES,
		owner_id: number,
		player: PlayerMp,
	) => {
		if (owner_type == OWNER_TYPES.BUSINESS) {
			let biz = business.get(owner_id);
			if (biz) {
				return {
					name: biz.name,
					desc: langStringDefault("inventory.6654910562e3c2305bb086fc12c62530"),
				};
			}
		} else if (owner_type == OWNER_TYPES.PLAYER && player.user.id == owner_id) {
			return {
				name: langStringDefault("inventory.d71e28c358b840dba7987dd69f6b1574"),
				desc: player.user.name,
			};
		} else if (owner_type == OWNER_TYPES.PLAYER) {
			return {
				name: player.user.getShowingNameString(owner_id),
				desc: `ID: ${owner_id}`,
			};
		} else if (owner_type == OWNER_TYPES.HOUSE && player.dimension) {
			let house = houses.get(owner_id);
			if (house) {
				return {
					name: langStringDefault(
						"inventory.56d4987a81147853a44d7a9af55cca6c",
						house.name,
						house.id,
					),
					desc: `LVL: ${house.stock}`,
				};
			}
		} else if (
			owner_type >= OWNER_TYPES.STOCK_1 &&
			owner_type <= OWNER_TYPES.STOCK_15 &&
			player.dimension
		) {
			let warehouse = warehouses.get(owner_id);
			if (warehouse) {
				const name = warehouse.getSlotName(owner_type - 4);
				return {
					name: langStringDefault(
						"inventory.77246fa1018c437f95364ebda76d893a",
						warehouse.id,
					),
					desc: langStringDefault(
						"inventory.92a7bd7bdf70f356e991ba6e3abe89d2",
						name,
					),
				};
			}
		} else if (owner_type == OWNER_TYPES.STOCK_SAFE && player.dimension) {
			let house = houses.get(owner_id);
			if (house) {
				return {
					name: langStringDefault(
						"inventory.0f4a5eeab8fa111919362895a1e1c4dd",
						house.name,
						house.id,
					),
					desc: `LVL: ${house.stock}`,
				};
			}
		} else if (owner_type == OWNER_TYPES.VEHICLE) {
			const veh = Vehicle.get(owner_id);
			if (veh) {
				const cfg = veh.config;
				if (cfg) {
					return {
						name:
							langStringDefault("inventory.5462583aac565be1f60d9fecf39bebcd") +
							cfg.name,
						desc: veh.number ? veh.number : `ID: ${veh.id}`,
					};
				}
			}
		} else if (owner_type == OWNER_TYPES.VEHICLE_TEMP) {
			const veh = Vehicle.getByTmpId(owner_id);
			if (veh) {
				const cfg = Vehicle.getVehicleConfig(veh);
				if (cfg) {
					return {
						name:
							langStringDefault("inventory.b3ac368f59d5e81b54bd39efdb40f900") +
							cfg.name,
						desc: veh.numberPlate ? veh.numberPlate : `ID: ${owner_id}`,
					};
				}
			}
		} else if (owner_type == OWNER_TYPES.FRACTION_VEHICLE) {
			const veh = Vehicle.toArray().find((veh) => veh.garagecarid === owner_id);
			if (veh) {
				const cfg = Vehicle.getVehicleConfig(veh);
				return {
					name: "Kofferraum " + (cfg ? cfg.name : veh.modelname),
					desc: veh.numberPlate,
				};
			}
		} else if (CONTAINERS_DATA.find((q) => q.owner_type === owner_type)) {
			const qs = inventory.getContainerData(owner_type, owner_id);
			const cfgname = getBaseItemNameById(qs.item_id);
			if (cfgname) {
				return {
					name: cfgname,
					desc: "#" + owner_id,
				};
			}
		} else if (owner_type === OWNER_TYPES.MARKET_STOCK) {
			return {
				name: langStringDefault("inventory.cc8776c3178db2f300aabacd5ae4980d"),
				desc: langStringDefault("inventory.0d8e6d7322aaf556f119ced29a0518ae"),
			};
		} else if (owner_type === OWNER_TYPES.FARM_STOCK) {
			return {
				name: langStringDefault("inventory.1d9f13059d0b33fabfa906e0631e4bc8"),
				desc: langStringDefault("inventory.037cabec7bc6fd1e6c9f63af1c2715a9"),
			};
		}
		return {
			name: langStringDefault("inventory.0ce2197cd45c7e99f251c408fa46ad47"),
			desc: "Nummer " + owner_id,
		};
	},
	getContainerData: (
		owner_type: OWNER_TYPES,
		owner_id: number,
		target_owner?: number,
		target_id?: number,
	) => {
		const containers = CONTAINERS_DATA.filter(
			(q) => q.owner_type === owner_type,
		);
		if (containers.length === 0) return null;
		if (containers.length === 1) return containers[0];
		let res: any;
		containers.map((q) => {
			if (res) return;
			const item = inventory.get(owner_id, target_owner, target_id);
			if (item)
				res = CONTAINERS_DATA.find(
					(z) => z.owner_type === owner_type && z.item_id === item.item_id,
				);
		});
		return res;
	},
	getAllNearestInventory: (player: PlayerMp) => {
		const user = player.user;
		let position = player.position;
		let dimension = player.dimension;
		let res: {
			owner_type: OWNER_TYPES;
			owner_id: number;
			have_access: boolean;
		}[] = [];

		const marketStockInventory = getNearestMarketInventory(player);
		if (marketStockInventory) {
			res.push(marketStockInventory);
		}

		const farmStockInventory = FarmActivityStock.getNearestInventory(player);
		if (farmStockInventory) {
			res.push(farmStockInventory);
		}

		CONTAINERS_DATA.map((container) => {
			user.getArrayItem(container.item_id).map((holder) => {
				res.push({
					owner_type: container.owner_type,
					owner_id: holder.id,
					have_access: true,
				});
			});
		});

		gangfight.list.forEach((item) => {
			if (
				player.dimension === item.d &&
				system.distanceToPos(player.position, item) < 5
			)
				res.push({
					owner_type: OWNER_TYPES.GANGWAR_CONTAINER,
					owner_id: item.id,
					have_access: item.factions.includes(user.fraction),
				});
		});

		mp.vehicles.forEachInRange(position, 5, (vehicle) => {
			if (vehicle.dimension !== dimension) return;
			if (
				Vehicle.getLocked(vehicle) &&
				!Vehicle.hasAccessToVehicle(player, vehicle)
			)
				return;
			if (vehicle.garagecarid) {
				const garage = FractionGarage.get(vehicle.garage);
				if (garage)
					res.push({
						owner_type: OWNER_TYPES.FRACTION_VEHICLE,
						owner_id: vehicle.garagecarid,
						have_access:
							!vehicle.locked &&
							(!Vehicle.haveTruck(vehicle) ||
								Vehicle.openTruckStatus(vehicle)) &&
							(user.hasPermission("admin:garage:accessRemote") ||
								user.fraction === garage.fraction),
					});
			} else if (!vehicle.dbid)
				res.push({
					owner_type: OWNER_TYPES.VEHICLE_TEMP,
					owner_id: vehicle.inventoryTmp,
					have_access: Vehicle.openTruckStatus(vehicle),
				});
			else
				res.push({
					owner_type: OWNER_TYPES.VEHICLE,
					owner_id: vehicle.dbid,
					have_access: Vehicle.openTruckStatus(vehicle),
				});
		});
		if (player.dimension > 0) {
			if (
				system.distanceToPos(
					player.position,
					new mp.Vector3(
						WAREHOUSE_SLOTS_POS[0][0],
						WAREHOUSE_SLOTS_POS[0][1],
						WAREHOUSE_SLOTS_POS[0][2],
					),
				) < 20
			) {
				const warehouse = warehouses.get(player.dimension);
				if (warehouse) {
					const haveAccess = inventory.haveAccess(
						player,
						OWNER_TYPES.STOCK_1,
						player.dimension,
					);
					WAREHOUSE_SLOTS_POS.map((item, index) => {
						if (warehouse.chests[index]) {
							const pos = new mp.Vector3(item[0], item[1], item[2]);
							if (system.distanceToPos(player.position, pos) < 5) {
								res.push({
									owner_type: 4 + index,
									owner_id: player.dimension,
									have_access: haveAccess,
								});
							}
						}
					});
				}
			}
			if (system.distanceToPos(player.position, HOUSE_STOCK_POS) < 5) {
				const house = houses.get(player.dimension);
				if (house && house.haveChest) {
					let haveAccess = false;
					if (player.user.isAdminNow(6)) haveAccess = true;
					if (!house.key) haveAccess = true;
					if (!haveAccess)
						haveAccess = !!inventory
							.getInventory(OWNER_TYPES.PLAYER, player.user.id)
							.find(
								(itm) =>
									itm.item_id == houses.key_id &&
									itm.advancedNumber == house.key &&
									itm.advancedString == "house_chest",
							);
					res.push({
						owner_type: OWNER_TYPES.STOCK_SAFE,
						owner_id: player.dimension,
						have_access: haveAccess,
					});
				}
			}
			let isHouseStockPushed = false; // Verbot, mehr als ein Lager pro int zu öffnen (Krücke für benutzerdefinierte ints)
			interriors.map((int) => {
				if (int.type === "garage") return;
				if (!int.stock) return;
				if (isHouseStockPushed) return;
				if (system.distanceToPos(player.position, int.stock) < 2) {
					const house = houses.get(player.dimension);
					if (
						!house ||
						(!player.user.isAdminNow(3) && !isPlayerHasHouseKey(player, house))
					)
						return;

					res.push({
						owner_type: OWNER_TYPES.HOUSE,
						owner_id: player.dimension,
						have_access: true,
					});
					isHouseStockPushed = true;
				}
			});
		}
		User.getNearestPlayers(player, 3, true)
			.filter((q) => q.dimension === player.dimension && q.user)
			.map((target) => {
				res.push({
					owner_type: OWNER_TYPES.PLAYER,
					owner_id: target.dbid,
					have_access: inventory.haveAccess(
						player,
						OWNER_TYPES.PLAYER,
						target.dbid,
					),
				});
			});
		res.map((data) => {
			if (!data.have_access) return;
			inventory
				.getInventory(data.owner_type, data.owner_id)
				.filter((item) => getContainerByItemID(item.item_id))
				.map((item) => {
					const cfg = getContainerByItemID(item.item_id);
					res.push({
						owner_type: cfg.owner_type,
						owner_id: item.id,
						have_access: true,
					});
				});
		});
		return res;
	},
	haveAccess: (player: PlayerMp, owner_type: OWNER_TYPES, owner_id: number) => {
		if (player.user.isAdminNow(6)) return true;
		if (owner_type == OWNER_TYPES.BUSINESS) {
			let biz = business.get(owner_id);
			if (biz) {
				return biz.userId == player.user.id;
			} else {
				return false;
			}
		}
		if (owner_type == OWNER_TYPES.PLAYER) {
			if (owner_id === player.dbid) return true;
			const target = User.get(owner_id);
			if (!target) return false;
			if (!target.user.cuffed) return false;
			if (!player.user.is_police) return false;
		}
		if (owner_type == OWNER_TYPES.VEHICLE) {
			return Vehicle.openTruckStatus(Vehicle.get(owner_id).vehicle);
		}
		if (owner_type == OWNER_TYPES.VEHICLE_TEMP) {
			return Vehicle.openTruckStatus(Vehicle.getByTmpId(owner_id));
		}
		if (owner_type == OWNER_TYPES.FRACTION_VEHICLE) {
			const vehicle = Vehicle.getByCarageCarId(owner_id);
			const garage = FractionGarage.get(vehicle.garage);

			return (
				!vehicle.locked &&
				(!Vehicle.haveTruck(vehicle) || Vehicle.openTruckStatus(vehicle)) &&
				(player.user.hasPermission("admin:garage:accessRemote") ||
					player.user.fraction === garage.fraction)
			);
		}
		if (owner_type == OWNER_TYPES.STOCK_SAFE) {
			const house = houses.get(owner_id);
			if (!house) return false;
			if (house.haveChest) {
				let haveAccess = false;
				if (player.user.isAdminNow(6)) haveAccess = true;
				if (!house.key) haveAccess = true;
				if (!haveAccess)
					haveAccess = !!inventory
						.getInventory(OWNER_TYPES.PLAYER, player.user.id)
						.find(
							(itm) =>
								itm.item_id == houses.key_id &&
								itm.advancedNumber == house.key &&
								itm.advancedString == "house_chest",
						);
				return haveAccess;
			}
		}
		if (
			owner_type >= OWNER_TYPES.STOCK_1 &&
			owner_type <= OWNER_TYPES.STOCK_15
		) {
			let warehouse = warehouses.get(owner_id);
			if (warehouse) {
				let haveAccess = false;
				if (player.user.isAdminNow(6)) haveAccess = true;
				if (!haveAccess)
					haveAccess = !!inventory
						.getInventory(OWNER_TYPES.PLAYER, player.user.id)
						.find(
							(itm) =>
								itm.item_id == 805 &&
								itm.advancedNumber == warehouse.key &&
								itm.advancedString == "warehouse",
						);
				return haveAccess;
			}
		}
		if (owner_type == OWNER_TYPES.HOUSE) {
			return true;
		}
		return true;
	},
	data: new Map<number, ItemEntity>(),
	inventory_blocks: new Map<string, ItemEntity[]>(),
	load: () => {
		return new Promise<void>((resolve, reject) => {
			let countRemoved = 0;
			console.time(
				langStringDefault("inventory.bef6a73820f45770d98bd117b453f8a4"),
			);
			inventory.inventory_blocks.set(`0_0`, []);
			ItemEntity.delete({
				owner_type: In([
					OWNER_TYPES.WORLD,
					OWNER_TYPES.TEMP,
					OWNER_TYPES.VEHICLE_TEMP,
				]),
			}).then((del) => {
				if (typeof del.affected === "number") countRemoved += del.affected;
				ItemEntity.delete({ temp: 1 }).then((del) => {
					if (typeof del.affected === "number") countRemoved += del.affected;
					ItemEntity.find().then((list) => {
						system.debug.info(
							langStringDefault(
								"inventory.8f06b500d552128e3c3a35372e454edc",
								list.length,
							),
						);
						list.map((item) => {
							if (item.owner_type === OWNER_TYPES.PLAYER_TEMP) {
								item.owner_type = OWNER_TYPES.PLAYER;
							}
							if (
								item.temp == 1 ||
								item.item_id === 863 ||
								[
									OWNER_TYPES.TEMP,
									OWNER_TYPES.WORLD,
									OWNER_TYPES.VEHICLE_TEMP,
								].includes(item.owner_type)
							) {
								item.remove();
								countRemoved++;
							} else {
								inventory.data.set(item.id, item);
								insert_item_into_inventory(item);
							}
						});
						system.debug.info("---------------");
						console.timeEnd(
							langStringDefault("inventory.bef6a73820f45770d98bd117b453f8a4"),
						);
						system.debug.info(
							langStringDefault("inventory.82a4a0bc205b2ecc94cbd0ab391f91fb"),
							list.length,
						);
						system.debug.info(
							langStringDefault("inventory.6f05d5ba51a905b8738328c00480549e"),
							countRemoved,
						);
						system.debug.info("---------------");
						resolve();
					});
				});
			});
		});
	},
	get: (id: number, owner_type?: number, owner_id?: number) => {
		if (typeof owner_type !== "number" || typeof owner_id !== "number")
			return inventory.data.get(id);
		let invBlock = inventory.getInventory(owner_type, owner_id);
		if (!invBlock) return inventory.data.get(id);
		return invBlock.find((q) => q.id === id);
	},
	clearInventory: (owner_type: OWNER_TYPES, owner_id: number) => {
		if (!inventory.inventory_blocks.has(`${owner_type}_${owner_id}`))
			inventory.inventory_blocks.set(`${owner_type}_${owner_id}`, []);
		else
			inventory.deleteItems(
				...inventory.inventory_blocks.get(`${owner_type}_${owner_id}`),
			);
	},
	getInventory: (owner_type: OWNER_TYPES, owner_id: number) => {
		if (!inventory.inventory_blocks.has(`${owner_type}_${owner_id}`))
			inventory.inventory_blocks.set(`${owner_type}_${owner_id}`, []);
		return inventory.inventory_blocks.get(`${owner_type}_${owner_id}`);
	},
	createItem: (
		param: Partial<ItemEntity>,
		notJoin = false,
	): Promise<ItemEntity> => {
		return new Promise((resolve, reject) => {
			if (!param.item_id)
				return (
					console.error(`inventory.createItem required param item_id`),
					reject(`inventory.createItem required param item_id`)
				);
			if (!param.owner_type)
				return (
					console.error(`inventory.createItem required param owner_type`),
					reject(`inventory.createItem required param owner_type`)
				);
			if (!param.owner_id)
				return (
					console.error(`inventory.createItem required param owner_id`),
					reject(`inventory.createItem required param owner_id`)
				);

			if (typeof param.temp !== "number") param.temp = 0;
			let itmCfg = inventoryShared.get(param.item_id);
			if (!itmCfg)
				return (
					console.error(
						`inventory.createItem item with id ${param.item_id} not found`,
					),
					reject(`inventory.createItem item with id ${param.item_id} not found`)
				);
			let count = 0;
			if (typeof param.count === "number") count = param.count;
			if (typeof param.count !== "number" && itmCfg.default_count)
				count = itmCfg.default_count;
			if (typeof count !== "number")
				return (
					console.error(
						`inventory.createItem no param count and no default count param for item ${param.item_id}`,
					),
					reject(
						`inventory.createItem no param count and no default count param for item ${param.item_id}`,
					)
				);
			if (
				itmCfg.need_group &&
				param.owner_type != OWNER_TYPES.BUSINESS &&
				!notJoin
			) {
				let allItems = inventory.getInventory(param.owner_type, param.owner_id);
				if (allItems) {
					let targetItem = allItems.find(
						(q) => q.item_id == param.item_id && param.temp === q.temp,
					);
					if (targetItem) {
						targetItem.count += count;
						if (!targetItem.temp) targetItem.save();
						return resolve(targetItem);
					}
				}
			}
			let itm = new ItemEntity();
			itm.create = system.timestamp;
			for (let name in param) {
				let val = param[name as keyof ItemEntity] as any;
				(itm as any)[name as any] = val;
			}
			itm.count = count;
			if (itm.item_id === 851 && !itm.advancedNumber) {
				const serial = generateFreeSimNumber();
				itm.advancedNumber = serial;
				itm.advancedString = `${Math.floor((itmCfg.defaultCost ? itmCfg.defaultCost : 100) / 2)}`;
				itm.serial = itm.serial + "_" + serial;
			}

			if (itm.temp === 1) {
				itm.id = inventory.getTempId();
				inventory.data.set(itm.id, itm);
				insert_item_into_inventory(itm);
				if (param.owner_type === OWNER_TYPES.PLAYER) {
					const target = User.get(param.owner_id);
					if (target && target.user) {
						target.user.questTick();
						target.user.currentWeaponSync();
						if (!target.user.entity.successItem.includes(itm.item_id)) {
							const cfg = inventoryShared.get(itm.item_id);
							if (cfg && cfg.helpDesc && cfg.helpIcon) {
								target.user.entity.successItem = [
									...target.user.entity.successItem,
									itm.item_id,
								];
								CustomEvent.triggerCef(
									target,
									"success:screen:showitem",
									itm.item_id,
								);
							}
						}
					}
				}
				resolve(itm);
			} else {
				saveEntity(itm)
					.then((item) => {
						inventory.data.set(item.id, item);
						insert_item_into_inventory(item);
						Logs.insertInventoryLog(
							item,
							0,
							param.owner_id,
							"create",
							`create to ${param.owner_type}`,
						);
						if (param.owner_type === OWNER_TYPES.PLAYER) {
							const target = User.get(param.owner_id);
							if (target && target.user) {
								target.user.questTick();
								target.user.currentWeaponSync();
								if (!target.user.entity.successItem.includes(item.item_id)) {
									const cfg = inventoryShared.get(item.item_id);
									if (cfg && cfg.helpDesc && cfg.helpIcon) {
										target.user.entity.successItem = [
											...target.user.entity.successItem,
											item.item_id,
										];
										CustomEvent.triggerCef(
											target,
											"success:screen:showitem",
											item.item_id,
										);
									}
								}

								if (param.item_id === houses.key_id) {
									SendUpdate(target, "houseKey");
								}
							}
						}
						resolve(item);
					})
					.catch((err) => {
						console.error(err);
						reject(err);
					});
			}
		});
	},
	updateItemOwner: updateItemOwner,
	moveItemsOwner: (
		owner_type: OWNER_TYPES,
		owner_id: number,
		new_owner_type: OWNER_TYPES,
		new_owner_id: number,
	) => {
		let oldInventory = inventory.getInventory(owner_type, owner_id);
		if (!oldInventory || oldInventory.length === 0) return;
		let newInventory = inventory.getInventory(new_owner_type, new_owner_id);
		if (newInventory && newInventory.length > 0) return;
		let savesList: ItemEntity[] = [];
		let resItems: ItemEntity[] = [];
		oldInventory.map((item) => {
			item.owner_type = new_owner_type;
			item.owner_id = new_owner_id;
			if (!item.temp) savesList.push(item);
			resItems.push(item);
		});
		inventory.inventory_blocks.set(`${owner_type}_${owner_id}`, []);
		inventory.inventory_blocks.set(
			`${new_owner_type}_${new_owner_id}`,
			resItems,
		);
		if (owner_type === OWNER_TYPES.PLAYER) {
			const target = User.get(owner_id);
			if (target && target.user) target.user.inventoryAttachSync();
		}
		if (new_owner_type === OWNER_TYPES.PLAYER) {
			const target = User.get(new_owner_id);
			if (target && target.user) target.user.inventoryAttachSync();
		}
		ItemEntity.save(savesList);
	},

	getItemBySlot: (
		owner_type: OWNER_TYPES,
		owner_id: number,
		slot: number
	): ItemEntity | null => {

		if (!inventory.inventory_blocks.has(`${owner_type}_${owner_id}`)) {
			return null;
		}


		return inventory.inventory_blocks
			.get(`${owner_type}_${owner_id}`)
			.find(item => item.slot === slot) || null;
	},
};

function insert_item_into_inventory(item: ItemEntity) {
	if (inventory.inventory_blocks.has(`${item.owner_type}_${item.owner_id}`)) {
		inventory.inventory_blocks
			.get(`${item.owner_type}_${item.owner_id}`)
			.push(item);
	} else {
		inventory.inventory_blocks.set(`${item.owner_type}_${item.owner_id}`, [
			item,
		]);
	}
}

CustomEvent.registerCef(
	"inventory:moveItemSlot",
	async (player, data: {
		item_id: number;
		source_type: OWNER_TYPES;
		source_id: number;
		source_slot: number;
		target_type: OWNER_TYPES;
		target_id: number;
		target_slot: number;
	}) => {
		if (!player.user) return;
		if (!player.openInventory) return;

		if (player.user.spam(500))
			return player.notify(
				player.user.LangString("inventory.2180f445145c203378b9cec2d8d03998"),
				"error",
			);

		if (
			(data.source_type === OWNER_TYPES.BUSINESS ||
			 data.target_type === OWNER_TYPES.BUSINESS) &&
			!player.user.isAdminNow(6)
		)
			return player.notify(
				player.user.LangString("inventory.205ef31e9017dd3f825ea297983eb3fd"),
				"error",
			);

		try {
			if (data.source_type === data.target_type && data.source_id === data.target_id) {
				const inventoryId = `${data.source_type}_${data.source_id}`;
				const currentInventory = inventory.inventory_blocks.get(inventoryId);

				if (!currentInventory) {
					player.notify("Inventory not found", "error");
					return;
				}

				const itemToMove = currentInventory.find(item => item.slot === data.source_slot);

				if (!itemToMove || itemToMove.id !== data.item_id) {
					player.notify(
						player.user.LangString("inventory.1216a00fe9492526993e53e852f61c42"), // "Предмет не найден"
						"error",
					);
					return;
				}

				const itemInTargetSlot = currentInventory.find(item => item.slot === data.target_slot);

				itemToMove.slot = -1;

				if (itemInTargetSlot) {
					itemInTargetSlot.slot = data.source_slot;
					await itemInTargetSlot.save();
				}

				itemToMove.slot = data.target_slot;
				await itemToMove.save();

				inventory.reloadInventory(player, [data.source_type, data.source_id]);

			} else {
				const item = inventory.get(data.item_id, data.source_type, data.source_id);
				if (!item) {
					player.notify(
						player.user.LangString("inventory.1216a00fe9492526993e53e852f61c42"), // "Предмет не найден"
						"error",
					);
					return;
				}

				inventory.transferItem(
					player,
					data.item_id,
					data.source_type,
					data.source_id,
					data.target_type,
					data.target_id,
					data.target_slot
				);

				// setTimeout(async () => {
				// 	const movedItem = inventory.get(data.item_id, data.target_type, data.target_id);
				// 	if (movedItem && movedItem.slot !== data.target_slot) {
				// 		movedItem.slot = data.target_slot;
				// 		await movedItem.save();
				// 		inventory.reloadInventory(player, [data.target_type, data.target_id]);
				// 	}
				// }, 150);
			}
		} catch (e) {
			console.error("Error in inventory:moveItemSlot:", e);
			player.notify("Error in move item to slot", "error");
		}
	}
);

CustomEvent.registerCef("inventory:bag:selectBag", (player, id: number) => {
	if (!player.user) return;
	if (player.user.spam(1000)) return;

	const item = player.user.inventory.find((i) => i.id === id);
	if (!item)
		return player.notify(
			player.user.LangString("inventory.1cddc0a61da880b723a0ca87bab8be21"),
		);

	if (player.user.entity.selectedBagId === item.id) {
		player.user.entity.selectedBagId = null;
		inventory.reloadInventory(player);
		return "hide";
	}

	const itemData = inventoryShared.items.find((i) => i.item_id === item.item_id);
	if (!itemData)
		return player.notify(
			player.user.LangString("inventory.1cddc0a61da880b723a0ca87bab8be21"),
		);

	if (itemData.type !== ITEM_TYPE.BAGS)
		return player.notify(
			player.user.LangString("inventory.1cddc0a61da880b723a0ca87bab8be21"),
		);

	player.user.entity.selectedBagId = item.id;

	inventory.reloadInventory(player);
	return "show";
})

CustomEvent.registerCef("inventory:getSpecialSlots", (player: PlayerMp) => {
	return [
		player.user.dress.armor,
		player.user.havePhone ? player.user.getArrayItem(850)[0]?.id : null,
		player.user.entity.selectedBagId
	];
})