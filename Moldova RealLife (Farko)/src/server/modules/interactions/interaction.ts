import { langString, langStringDefault } from "../../../shared/lang";
import { CustomEvent } from "../custom.event";
import { menu } from "../menu";
import { system } from "../system";
import {
	GIVE_MONEY_PER_TASK,
	QUICK_HEAL_COST,
	VEHICLE_FINE_POLICE_MAX,
	VEHICLE_KEY_CREATE_COST,
} from "../../../shared/economy";
import { SYNC_ANIM_LIST } from "../../../shared/anim";
import { Vehicle } from "../vehicles";
import { inventory } from "../inventory";
import { User } from "../user";
import {
	CRIME_ROBBERY_INTEREST,
	CRIME_ROBBERY_PROFIT_LIMIT,
	FACTION_ID,
} from "../../../shared/fractions";
import { taxi } from "../taxi";
import { business } from "../business";
import { houses } from "../houses";
import {
	CUFFS_ITEM_ID,
	CUFFS_KEY_ITEM_ID,
	getItemName,
	OWNER_TYPES,
	SCREWS_DESTROYER_ITEM_IDS,
	SCREWS_ITEM_ID,
} from "../../../shared/inventory";
import { getDocumentData } from "../city.hall";
import { ANCHOR_LIST } from "../../../shared/vehicles";
import {
	LicenceType,
	LicenseName,
	REMOVE_LICENSE_RANK,
} from "../../../shared/licence";
// import {
// 	canFight,
// 	getZoneAtPosition,
// 	getZoneConf,
// 	getZoneOwner,
// 	setZoneControl,
// 	startFight,
// } from "../gangwar";
import { UdoData } from "../../../shared/licence";
// import { nonHiddenMasksIds } from "../../../shared/masks";
import {
	ADV_JAIL_FREE_COST_MIN,
	ADV_JAIL_FREE_COST_MIN_MORE,
	ADV_JAIL_FREE_COST_MIN_MORE_TIME,
	ADV_MONEY_PERCENT_TO_USER,
} from "../../../shared/jail";
import { MoneyChestClass } from "../money.chest";
import { GANGWAR_RADIUS } from "../../../shared/gangwar";
import { parking } from "../businesses/parking";
import { vehTaskData } from "../task";
import { FRACTION_LIST_TASKS_NPC } from "../../../shared/tasks";
import { gui } from "../gui";
// import {
// 	FIRE_EXTINGUISHER_MIXTURE_ITEM_ID,
// 	FIRE_EXTINGUISHER_MIXTURE_PER_BALLOON,
// 	FIRETRUCK_FILL_MIXTURE_RANGE,
// 	FIRETRUCK_MAX_BALLOON_COUNT,
// } from "../jobs/firefighter/config";
// import { isWaterSpotInRange } from "../jobs/firefighter/FireStation";
import { InterractionMenu } from "./InterractionMenu";
import { activeCars } from "../vehicle.grab";
import { sendExchangeRequest } from "../inventory.exchange";
import { Carry } from "../carry";
import { BANNED_TAXI_MODELS } from "../../../shared/taxi";
import { fraction, fractionCfg } from "../fractions/main";
import { FRACTION_RIGHTS } from "../../../shared/fractions/ranks";

CustomEvent.registerClient('vehicle:interaction', (player, targetId: number) => {
    vehInteract(player, targetId);
});

const vehInteract = (player: PlayerMp, targetId: number) => {
    const user = player.user;
    if (!user) return;
    const target = mp.vehicles.at(targetId);
    if (!target) return;
    const check = () => {
        if (!mp.players.exists(player)) return false;
        if (!mp.vehicles.exists(target)) return false;
        if (system.distanceToPos(player.position, target.position) > 5) return false;
        if (player.dimension !== target.dimension) return false;
        return true;
    }

	const unlockVehGrab = () => {
		if (!check()) return;
		if (player.dimension) return player.notify('Aici nu poti sparge usile', 'error');
		if (player.vehicle) return player.notify('Nu trebuie sa fii in vehicul', 'error');
		user.waitTimer(5, 30, 'Spargem usile', ["amb@medic@standing@tendtodead@idle_a", "idle_a"], target).then(status => {
			if (!status) return;
			if (!mp.players.exists(player)) return;
			if (!check()) return;
			if (!Vehicle.getLocked(target)) return;
			const itm = user.haveItem(813);
			if (!itm) return;
			if (system.getRandomInt(1, 7) === 3 || (target.entity && target.entity.data && target.entity.data.keyProtect)) {
				itm.useCount(1, player);
				player.notify('Unealta s-a stricat', 'error');
			}
			if (
				(target.entity && target.entity.data && target.entity.data.keyProtect) ||
				(target.fraction && fractionCfg.getFraction(target.fraction).gos)
			) {
				return player.notify('A fost activata protectia antifurt', 'error');
			}
			Vehicle.setLocked(target, false);
			Vehicle.setEngine(target, true);
			player.notify('Lacatul a fost spart', "success");
			// Daca a spart masina pentru misiune speciala
			if (activeCars.find(c => c.veh.id == target.id)) {
				mp.players.toArray().filter(u => u.user?.fractionData?.police).forEach(policePlayer => {
					policePlayer.notifyWithPicture(
						"Predare vehicul",
						'Lamar',
						`Cineva a spart masina ${target.modelname}, Numarul de inmatriculare ${target.numberPlate}. Coordonatele au fost trimise pe harta.`,
						'DIA_LAMAR'
					);
					policePlayer.outputChatBox(`!{25B000} Cineva a spart masina ${target.modelname}, Numarul de inmatriculare ${target.numberPlate}. Coordonatele au fost trimise pe harta`);
					CustomEvent.triggerClient(policePlayer, 'vehicleGrab:setBlipPos', target.position.x, target.position.y, target.position.z);
				});
				CustomEvent.triggerClient(player, 'vehicleGrab:deleteBlip');
			}
			player.user.achiev.achievTickByType("vehJack");
		});
	};
	
	if (target.isMission && target.missionOwner !== user.id)
		return player.notify('Nu poti interactiona cu acest vehicul', 'error');
	
	const interaction = new InterractionMenu(player, true);
	interaction.autoClose = true;
	
	// // Pentru pompieri
	// if (target.fireSquad && player.user.fireSquad && target.fireSquad === player.user.fireSquad) {
	// 	interaction.add(
	// 		'Umple cu agent de stingere',
	// 		'',
	// 		'star',
	// 		() => {
	// 			if (!isWaterSpotInRange(target.position, FIRETRUCK_FILL_MIXTURE_RANGE)) {
	// 				player.notify('Nu exista un punct de umplere in apropiere. Acestea sunt doar la statia de pompieri.', 'error');
	// 				return;
	// 			}
	
	// 			if (target.fireExtinguishingMixtureCount === FIRETRUCK_MAX_BALLOON_COUNT) {
	// 				player.notify('Vehiculul este deja plin cu baloane de agent de stingere.', 'error');
	// 				return;
	// 			}
	
	// 			target.fireExtinguishingMixtureCount = FIRETRUCK_MAX_BALLOON_COUNT;
	// 			player.notify(`Acum in masina sunt ${FIRETRUCK_MAX_BALLOON_COUNT} baloane cu agent de stingere.`, 'success');
	// 		}
	// 	);
	
	// 	interaction.add(
	// 		'Ia agent de stingere',
	// 		'',
	// 		'star',
	// 		async () => {
	// 			if (target.fireExtinguishingMixtureCount === 0) {
	// 				player.notify('Nu mai sunt baloane cu agent de stingere in masina. Trebuie sa te intorci la statie pentru reumplere.', 'error');
	// 				return;
	// 			}
	
	// 			const isPlayerAlreadyHasMixture =
	// 				player.user.allMyItems.some(item => item.item_id === FIRE_EXTINGUISHER_MIXTURE_ITEM_ID)
	// 				|| await CustomEvent.callClient(player, 'firefighter:getMixtureInWeapon');
	// 			if (isPlayerAlreadyHasMixture) {
	// 				player.notify('Inca nu ai consumat balonul actual cu agent de stingere.');
	// 				return;
	// 			}
	
	// 			target.fireExtinguishingMixtureCount--;
	// 			await player.user.giveItem(FIRE_EXTINGUISHER_MIXTURE_ITEM_ID, true, true, FIRE_EXTINGUISHER_MIXTURE_PER_BALLOON);
	// 		}
	// 	);
	// }
	
	// Pentru misiunea de livrare
	if (target.missionType == 'fractionVehicleDeliver') {
		const data = vehTaskData.get(user.id);
		if (!data || !data.count)
			return player.notify('Nu poti interactiona cu acest vehicul', 'error');
	
		const cfg = FRACTION_LIST_TASKS_NPC[data.npc].tasks[data.task];
		if (!cfg)
			return player.notify('Nu poti interactiona cu acest vehicul', 'error');
	
		if (cfg.returnPoint) {
			if (!Vehicle.getLocked(target))
				return player.notify('Livreaza vehiculul la locatia marcata pe harta', 'error');
			else
				interaction.add("Sparge usile", 'Criminal', 'car', () => {
					const data = vehTaskData.get(user.id);
					if (!data || !data.count) return player.notify('Nu poti interactiona cu acest vehicul', 'error');
					if (!user.haveItem(813)) return player.notify('Nu ai unealta potrivita', 'error');
					unlockVehGrab();
				});
		} else {
			interaction.add("Evacuare", '', 'evacuation', () => {
				const data = vehTaskData.get(user.id);
				if (!data || !data.count)
					return player.notify('Nu poti interactiona cu acest vehicul', 'error');
				Vehicle.destroy(target);
				data.count--;
				if (data.count > 0) {
					vehTaskData.set(user.id, data);
				} else {
					FRACTION_LIST_TASKS_NPC[data.npc].tasks[data.task].positions.push(...data.points);
					if (data.returnNeed) {
						user.setWaypoint(data.returnNeed.x, data.returnNeed.y, data.returnNeed.z, 'Recompensa pentru livrare vehicul');
						return player.notify('Acum trebuie sa te intorci pentru a incasa recompensa');
					} else {
						user.addMoney(data.reward, true, 'Recompensa pentru livrare vehicul');
						vehTaskData.set(user.id, data);
	
						setTimeout(() => {
							vehTaskData.delete(user.id);
						}, data.cooldown * 60000);
					}
				}
			});
		}
	
		return interaction.open();
	}




	if (target.entity && target.entity.owner === user.id) {
		interaction.add("Administrare chei", '', 'car', () => {
			const m = menu.new(player, 'Administrare chei', 'Actiuni');
			m.onclose = () => {
				if (check()) return vehInteract(player, targetId);
			}
	
			m.newItem({
				name: "Fa chei duplicate",
				more: `$${system.numberFormat(VEHICLE_KEY_CREATE_COST)}`,
				desc: 'Cheile permit deschiderea si inchiderea vehiculului de catre oricine le detine',
				onpress: () => {
					player.user.tryPayment(VEHICLE_KEY_CREATE_COST, "card", () => {
						return check();
					}, `Plata pentru serviciul de duplicare a cheilor pentru vehiculul ${Vehicle.getName(target)} #${target.dbid}`, "Servicii auto").then(q => {
						if (!q) return;
						inventory.createItem({
							owner_type: OWNER_TYPES.PLAYER,
							owner_id: player.user.id,
							item_id: houses.key_id,
							advancedNumber: target.entity.key,
							advancedString: "car",
							serial: `Vehicul ${Vehicle.getName(target)} #${target.dbid}`,
						})
						player.notify("Ai primit un duplicat al cheilor", "success");
					})
				}
			});
			m.newItem({
				name: "Schimba lacatul",
				desc: 'Dupa schimbarea lacatului, vechile chei nu vor mai functiona',
				onpress: () => {
					menu.accept(player).then(status => {
						if (!status) return;
						if (!check()) return;
						target.entity.key = system.getRandomInt(1000000, 9999999);
						target.entity.save();
						player.notify('Lacatul a fost schimbat', 'success');
						m.close();
					})
				}
			});
	
			m.open();
		});
	}
	
	if (user.is_police && target.dbid) {
		interaction.add("Impound", 'Factiune', 'evacuation', async () => {
			const sum = await menu.input(player, 'Introdu suma amenzii', '', 4, 'int');
			if (isNaN(sum) || typeof sum !== "number" || sum < 0 || sum > VEHICLE_FINE_POLICE_MAX)
				return player.notify(`Suma introdusa nu este valida. Suma maxima este $${system.numberFormat(VEHICLE_FINE_POLICE_MAX)}`, 'error');
			const reason = await menu.input(player, 'Introdu motivul amenzii', '', 100);
			if (!reason) return player.notify('Motivul nu a fost specificat', "error");
			if (!check()) return;
			if (target.getOccupants().length !== 0) return player.notify("Vehiculul trebuie sa fie gol", "error");
			target.entity.moveToParkingFine(sum, true, `${reason}. Amenda data de ${user.name}[${user.dbid}]`);
			if (target.entity.owner)
				User.writeRpHistory(target.entity.owner, `Vehiculul ${target.entity.name} ${target.numberPlate} a fost trimis la depozitul de amenzi cu o amenda de $${system.numberFormat(sum)}`);
			user.log(user.isAdminNow(2) ? 'AdminJob' : 'gosJob', `Vehiculul ${target.entity.name} ${target.numberPlate} a fost trimis la depozitul de amenzi cu o amenda de $${system.numberFormat(sum)}`, target.entity.owner);
			player.notify('Vehiculul a fost trimis la depozitul de amenzi', 'success');
		});
	}
	
	if (target === player.vehicle && user.isDriver && Vehicle.haveDriftMode(target)) {
		interaction.add("Setari drift mode", '', 'carTrunk', () => {
			if (!check()) return;
			CustomEvent.triggerCef(player, 'drift:setting', Vehicle.getDriftSettings(target));
		});
	}
	
	if (Vehicle.getLocked(target) && user.haveItem(813)) {
		interaction.add("Sparge usile", 'Criminal', 'car', () => {
			unlockVehGrab();
		});
	}
	
	if (user.taxiJob && user.taxiCar && user.taxiCar === target) {
		interaction.add("Meniu comenzi taxi", '', 'receipt', () => {
			taxi.orderList(player);
		});
	}
	
	if (user.taxiJob && !user.taxiCar && Vehicle.hasAccessToVehicle(player, target) && target.entity && target.entity.owner) {
		interaction.add("Incepe taxi", '', 'car', () => {
			if (!target.modelname) return player.notify('Nu poti lucra ca taxi cu acest vehicul', 'error');
			if (BANNED_TAXI_MODELS.find(el => el === target.modelname))
				return player.notify('Nu poti lucra ca taxi cu acest vehicul', 'error');
	
			user.taxiCar = target;
			CustomEvent.triggerClient(player, 'taxi:car', user.taxiCar.id);
			player.notify('Ai inceput munca de taxi cu vehiculul tau personal!', 'success');
		});
	}
	
	if (target.getOccupants().length >= 1) {
		interaction.add("Lista pasageri", '', 'peoples', () => {
			if (!check()) return;
			if (target.getOccupants().length < 1) return;
			const m = menu.new(player, 'Pasageri', 'Lista');
			target.getOccupants().map(pl => {
				if (pl.dbid === user.id) return;
				m.newItem({
					name: `${user.getShowingNameString(pl)} #${pl.dbid}`,
					onpress: () => {
						m.close();
						if (!check()) return;
						playerInteract(player, pl.id);
					}
				});
			});
			m.open();
		});
	}
	
	if (ANCHOR_LIST.find(q => q.toLowerCase() === target.modelname.toLowerCase())) {
		interaction.add(
			Vehicle.getFreezeStatus(target) ? 'Ridica ancora' : 'Ancoreaza vehiculul',
			'',
			'car',
			() => {
				Vehicle.freeze(target, !Vehicle.getFreezeStatus(target));
			}
		);
	}
	
	interaction.add("Inventar", '', 'fileTray', () => {
		let hasAccess = Vehicle.hasAccessToVehicle(player, target);
	
		if (Vehicle.getLocked(target) && !hasAccess) {
			player.notify("Nu ai acces", "error");
			vehInteract(player, targetId);
			return;
		}
	
		if (Vehicle.openTruckStatus(target)) inventory.openInventory(player);
		else return player.notify('Portbagajul este inchis', 'error'), vehInteract(player, targetId);
	});
	
	interaction.add(Vehicle.getLocked(target) ? 'Deschide usile' : 'Inchide usile', '', 'carHood', () => {
		Vehicle.lockVehStatusChange(player, target);
		vehInteract(player, targetId);
	});
	
	if (target.rentCar) {
		interaction.add('Incheie inchirierea', '', 'car', () => {
			if (target.rentCarOwner) {
				const owner = User.get(target.rentCarOwner);
				if (!owner) return;
				if (owner.user.id !== player.user.id) return;
				owner.rentCar = null;
				Vehicle.destroy(target);
			}
		});
	}
	
	const vehRotation = target.rotation;
	if (player.vehicle == null && (vehRotation.x < -70 || vehRotation.x > 70)) {
		interaction.add('Rastoarna vehiculul', '', 'carHood', () => {
			if (target.getOccupants().length > 0) return player.notify("Cineva se afla in masina!");
			target.rotation = new mp.Vector3(0, vehRotation.y, vehRotation.z);
		});
	}
	
	if (Vehicle.haveHood(target)) {
		interaction.add(Vehicle.openHoodStatus(target) ? "Inchide capota" : "Deschide capota", '', 'carTrunk', () => {
			if (!check()) return;
			if (!user.canUseInventory) return;
			if (Vehicle.getLocked(target) && !Vehicle.openHoodStatus(target))
				return player.notify("Vehiculul este incuiat", "error"), vehInteract(player, targetId);
			Vehicle.setHoodStatus(target, !Vehicle.openHoodStatus(target));
			vehInteract(player, targetId);
		});
	}
	
	if (user.familyId != 0 && user.isFamilyLeader && target.entity && user.myVehicles.includes(target.entity)) {
		interaction.add('Transfera vehiculul catre familie', 'Actiuni', 'car', () => {
			if (!check()) return;
	
			if (!user.family.canBuyMoreCar) return user.notify('Familia a atins limita de vehicule');
			if (!target.entity || !user.myVehicles.includes(target.entity)) return;
			if (BATTLE_PASS_VEHICLES.find(el => target.entity.model === el) !== undefined)
				return player.notify('Nu poti transfera vehicule din battle pass');
	
			menu.accept(player, `Confirma transferul vehiculului ${target.entity.model} catre familie`, 'small').then(status => {
				if (!status) return;
				if (!check()) return;
				if (!target.entity || !user.myVehicles.includes(target.entity)) return;
				if (user.familyId == 0 || !user.isFamilyLeader) return;
				if (!user.family.canBuyMoreCar) return user.notify('Familia nu are suficiente sloturi pentru vehicule');
	
				Vehicle.selectParkPlace(player, target.entity.avia, true).then(place => {
					if (!place) return player.notify("Pentru a transfera vehiculul trebuie selectat un loc de parcare", "error");
					if (!check()) return;
					if (!target.entity || !user.myVehicles.includes(target.entity)) return;
					const getParkPos = () => {
						if (place.type === "house") return houses.getFreeVehicleSlot(place.id, target.entity.avia)
						else return parking.getFreeSlot(place.id)
					}
					if (user.familyId == 0 || !user.isFamilyLeader) return;
					if (!user.family.canBuyMoreCar) return user.notify('Familia nu are sloturi suficiente pentru vehicule');
					target.entity.setOwnerFamily(user.family.entity, getParkPos());
					user.notify(`Ai transferat vehiculul catre familie`);
				});
			});
		});
	}
	
	const nearestPlayer = user.getNearestPlayer(2);
	if (user.isAdminNow(2) || user.is_police || (user.fraction === FACTION_ID.GOV && user.rank >= 3)) {
		interaction.add("Evacuare parcare", 'Actiuni', 'evacuation', async () => {
			if (!check()) return;
			if (target.getOccupants().length != 0)
				return player.notify('Vehiculul nu trebuie sa aiba pasageri', 'error');
			target.getOccupants().map(q => {
				q.user.leaveVehicle();
			});
			setTimeout(() => {
				if (!check()) return;
				player.notify("Vehicul evacuat");
				if (target.entity && target.entity.owner)
					user.log(
						user.isAdminNow(2) ? 'AdminJob' : 'gosJob',
						`Vehiculul ${Vehicle.getName(target)} ${target.numberPlate} a fost evacuat`,
						target.entity.owner
					);
				Vehicle.respawn(target);
			}, 500);
		});
	}
	const truckCfg = Vehicle.haveTruck(target);
	
	interaction.add(Vehicle.openTruckStatus(target) ? "Inchide portbagajul" : "Deschide portbagajul", '', 'carTrunk', () => {
		if (!check()) return;
		if (!user.canUseInventory) return;
		let hasAccess = Vehicle.hasAccessToVehicle(player, target);
		if (!hasAccess) return player.notify('Nu ai cheile acestui vehicul', 'error'), vehInteract(player, targetId);
	
		Vehicle.setTruckStatus(target, !Vehicle.openTruckStatus(target));
		vehInteract(player, targetId);
	
		let vehicleInventoryBlock;
	
		if (target.garagecarid) {
			vehicleInventoryBlock = [OWNER_TYPES.FRACTION_VEHICLE, target.garagecarid];
		}
		else if (!target.dbid) {
			vehicleInventoryBlock = [OWNER_TYPES.VEHICLE_TEMP, target.inventoryTmp];
		}
		else {
			vehicleInventoryBlock = [OWNER_TYPES.VEHICLE, target.dbid];
		}
	
		if (!vehicleInventoryBlock) {
			return;
		}
	
		inventory.reloadInventoryAdvanced(target.position, 10, target.dimension, false, vehicleInventoryBlock);
	});
	
	if (player.user && player.user.sanitationTrashBag && target.getVariable('sanitation')) {
		interaction.add('Depune sacul de gunoi', '', 'carTrunk', () => {
			if (!player.user.sanitationSquad)
				return player.notify('Nu faci parte dintr-o sesiune de salubritate', 'error');
	
			if (player.user.sanitationSquad !== target.getVariable('sanitation'))
				return player.notify('Aceasta masina nu apartine sesiunii tale', 'error');
	
			player.user.sanitationTrashBag = false;
			target.trashBags += 1;
	
			CustomEvent.triggerClient(player, 'sanitation:deleteTrashBag');
		});
	}
	
	if (nearestPlayer && nearestPlayer.user && (nearestPlayer.user.cuffed || nearestPlayer.getVariable('inVehicleTruck'))) {
		interaction.add(
			nearestPlayer.getVariable('inVehicleTruck')
				? "Scoate persoana din portbagaj"
				: "Baga persoana in portbagaj",
			'Actiuni',
			'carTrunk',
			() => {
				if (!check()) return;
				if (!truckCfg) return;
				const nearestPlayer = user.getNearestPlayer(2);
				if (!mp.players.exists(nearestPlayer)) return;
				if (!nearestPlayer.user.cuffed && !nearestPlayer.getVariable('inVehicleTruck')) return;
				if (!Vehicle.openTruckStatus(target))
					return player.notify("Deschide portbagajul", "error"), vehInteract(player, targetId);
				const pos = system.offsetPosition(target.position, target.rotation, new mp.Vector3(truckCfg.x, truckCfg.y, truckCfg.z));
				if (system.distanceToPos(player.position, pos) > 2)
					return player.notify("Esti prea departe de portbagaj", "error"), vehInteract(player, targetId);
				if (system.distanceToPos(nearestPlayer.position, pos) > 2)
					return player.notify("Tinta este prea departe de portbagaj", "error"), vehInteract(player, targetId);
				if (nearestPlayer.vehicle)
					return player.notify('Tinta este deja intr-un vehicul', 'error');
				if (!nearestPlayer.getVariable('inVehicleTruck') && target.playerInTruck)
					return player.notify("Portbagajul este deja ocupat", "error"), vehInteract(player, targetId);
				if (nearestPlayer.getVariable('inVehicleTruck') && target.playerInTruck !== nearestPlayer.dbid)
					return player.notify("Incerci sa scoti o persoana din portbagajul altui vehicul", "error"), vehInteract(player, targetId);
				target.playerInTruck = nearestPlayer.getVariable('inVehicleTruck') ? null : nearestPlayer.dbid;
				nearestPlayer.setVariable('inVehicleTruck', nearestPlayer.getVariable('inVehicleTruck') ? null : target.id);
				vehInteract(player, targetId);
			}
		);
	}
	if (!target.playerInTruck) {
		interaction.add("Intra in portbagaj", 'Actiuni', 'carTrunk', () => {
			if (!check()) return;
			if (target.playerInTruck) return;
			if (Carry.isPlayerCarry(player) || Carry.isPlayerCarried(player)) return;
			if (!truckCfg) return;
			if (!Vehicle.openTruckStatus(target))
				return player.notify("Deschide portbagajul", "error"), vehInteract(player, targetId);
			if (player.vehicle)
				return player.notify('Iesi din vehicul', 'error');
			const pos = system.offsetPosition(target.position, target.rotation, new mp.Vector3(truckCfg.x, truckCfg.y, truckCfg.z));
			if (system.distanceToPos(player.position, pos) > 2)
				return player.notify("Esti prea departe de portbagaj", "error"), vehInteract(player, targetId);
			if (target.playerInTruck)
				return player.notify("Portbagajul este deja ocupat", "error"), vehInteract(player, targetId);
			target.playerInTruck = player.getVariable('inVehicleTruck') ? null : player.dbid;
			player.setVariable('inVehicleTruck', player.getVariable('inVehicleTruck') ? null : target.id);
		});
	} else if (target.playerInTruck === player.dbid) {
		interaction.add("Iesi din portbagaj", 'Actiuni', 'carTrunk', () => {
			if (!truckCfg) return;
			if (!check()) return;
			if (!Vehicle.openTruckStatus(target) && user.canUseInventory)
				return player.notify("Portbagajul este inchis si nu poti iesi", "error"), vehInteract(player, targetId);
			target.playerInTruck = null;
			player.setVariable('inVehicleTruck', null);
		});
	}
	

    interaction.open();
}

CustomEvent.registerClient('player:interaction', (player, targetId: number) => {
    playerInteract(player, targetId);
})

let healByItemTimer = new Map<number, boolean>();

const playerInteract = async (player: PlayerMp, targetId: number) => {
    const user = player.user;
    if (!user) return;
	if (targetId === player.id) return player.notify("Nu poti interactiona cu tine insuti", "error");
    const target = mp.players.at(targetId);
    if (!mp.players.exists(target)) return;

    const check = () => {
        if (!mp.players.exists(player)) return false;
        if (!mp.players.exists(target)) return false;
        if (system.distanceToPos(player.position, target.position) > 5) return false;
        if (player.dimension !== target.dimension) return false;

        return true;
    }

    const interaction = new InterractionMenu(player)
    interaction.autoClose = true;

	if (user.is_police) {
		if (user.is_police) {
			interaction.add('Acorda amenda', 'Factiune', 'receipt', () => {
				if (!check()) return;
				menu.input(player, 'Introdu suma amenzii', '', 4, 'int').then(sum => {
					if (!check()) return;
					if (!sum || sum <= 0 || isNaN(sum)) return;
					if (sum > 10000) return player.notify(`Nu poti seta mai mult de ${system.numberFormat(10000)}`);
					menu.input(player, 'Introdu motivul', '', 30).then(reason => {
						if (!check()) return;
						if (!reason) return;
						reason = system.filterInput(reason);
						if (!reason) return;
						player.notify('Cererea a fost trimisa');
						menu.accept(target, `Esti de acord sa platesti amenda de $${system.numberFormat(sum)}?`, 'small', 30000).then(status => {
							if (!check()) return;
							if (!status) return player.notify('Refuzat', 'error');
							if (!target.user.newFine(player, sum, reason)) {
								player.notify('Persoana nu poate plati amenda', 'error');
								target.notify('Nu ai posibilitatea sa platesti amenda', 'error');
							} else {
								player.notify('Persoana a platit amenda', 'success');
								const chest = MoneyChestClass.getByFraction(user.fraction);
								if (chest) chest.addMoney(player, sum * 0.8, false);
								user.addMoney(sum * 0.2, true, 'Acordare amenda');
							}
						});
					})
				})
			});
		}
       if (user.is_police) {
            interaction.add("Perchezitioneaza", 'Factiune', 'receipt', async () => {
                if (!check()) return;

                // Verificare daca tinta este in viata
                if (target.user.health <= 0) {
                    player.notify("Jucatorul este inconstient", "error");
                    return;
                }

                // Verificare distanta
                const distance = system.distanceToPos(player.position, target.position);
                if (distance > 3) {
                    player.notify("Esti prea departe de tinta", "error");
                    return;
                }

                inventory.openInventory(player, OWNER_TYPES.PLAYER);
            });
        }


		/// REMOVE LICENSE 
		if (user.is_police) {
			interaction.add('Confisca licenta', 'Factiune', 'receipt', async () => {
				const data = target.user.entity;
				const licenses = [...(data.licenses || [])];

				if (licenses.length === 0) {
					return player.notify('Jucatorul nu are nicio licenta activa', 'error');
				}

				const m = menu.new(player, 'Confiscare licenta', 'Alege licenta');
				licenses.forEach(([id]) => {
					m.newItem({
						name: `Confisca: ${LicenseName[id]}`,
						onpress: () => {
							m.close();

							menu.input(player, 'Scrie motivul confiscarii', '', 100).then(async reason => {
								if (!reason || reason.length < 3) {
									return player.notify('Motivul este invalid sau prea scurt', 'error');
								}

								// Scoatem licenta din lista
								const newLicenses = licenses.filter(([lic]) => lic !== id);
								data.licenses = newLicenses;

								// Stergem itemul fizic (daca exista)
								const items = inventory.getInventory(OWNER_TYPES.PLAYER, data.id);
								if (items && items.length > 0) {
									const licItem = items.find(itm =>
										itm.item_id === 803 &&
										itm.advancedNumber === data.id &&
										itm.serial?.startsWith(`${id}-`)
									);
									if (licItem) {
										inventory.deleteItem(licItem);
									}
								}

								await data.save();

								// Notificari
								player.notify(`Ai confiscat licenta ${LicenseName[id]} de la ${target.user.name}`, 'success');
								target.notify(`Politistul ${player.user.name} ti-a confiscat licenta ${LicenseName[id]}.\nMotiv: ${reason}`, 'warning');

								// Logging
								player.user.log('gosJob', `Confiscata licenta ${LicenseName[id]} - Motiv: ${reason}`, data.id);
								User.writeRpHistory(data.id, `[POLITIE] ${user.name} (#${user.id}) a confiscat licenta ${LicenseName[id]} - Motiv: ${reason}`);
							});
						}
					});
				});
				m.open();
			});
		}

		if (user.fraction === 1 && user.tag && user.tag.toLowerCase().includes('avocat') && target.user.jail_time) {
			interaction.add('Elibereaza din inchisoare', 'Factiune', 'thief', () => {
				if (!check()) return;
				const sum = Math.max(ADV_JAIL_FREE_COST_MIN, Math.floor((ADV_JAIL_FREE_COST_MIN_MORE_TIME > target.user.jail_time ? ADV_JAIL_FREE_COST_MIN : ADV_JAIL_FREE_COST_MIN_MORE) * (target.user.jail_time / 60)))
				menu.accept(target, `Esti de acord sa fii eliberat pentru $${system.numberFormat(sum)}?`).then(status => {
					if (!check()) return;
					if (!status) return player.notify('Refuzat', 'error');
					if (!target.user.jail_time) return;
					if (target.user.money < sum) return player.notify('Nu ai suficienti bani pentru plata', 'error');
					target.user.removeMoney(sum, true, 'Plata pentru serviciul de avocat');
					const foradv = ((sum / 100) * ADV_MONEY_PERCENT_TO_USER);
					user.addMoney(foradv, true, 'Servicii avocat');
					const chest = MoneyChestClass.getByFraction(1);
					if (chest) chest.addMoney(player, sum - foradv, false);
					player.notify('Serviciul a fost prestat', 'success');
					target.notify('Ai fost eliberat', 'success');
					target.user.jail_time = 5;
					target.user.jail_reason = 'Eliberare';
					CustomEvent.triggerClient(target, 'jail:sync', 5, 'Eliberare', false);
				});
			});
		}
		
		// if (user.is_gang && target.user.is_gang && user.rank >= 8 && target.user.rank >= 8 && user.fraction !== target.user.fraction) {
		// 	const zone = getZoneAtPosition(player.position);
		// 	if (zone) {
		// 		const cfg = getZoneConf(zone);
		// 		if (cfg && !cfg.spawn) {
		// 			const zoneowner = getZoneOwner(zone);
		// 			if (zoneowner === target.user.fraction) {
		// 				interaction.add('Declara razboi pentru teritoriu', 'Fractie', 'swords', () => {
		// 					if (!check()) return;
		// 					if (system.distanceToPos2D({ x: cfg.x, y: cfg.y }, player.position) > GANGWAR_RADIUS / 2)
		// 						return player.notify('Apropiati-va mai mult de centrul zonei', 'error');
		// 					menu.accept(target, `Esti de acord cu razboiul pentru teritoriu?`).then(status => {
		// 						if (!check()) return;
		// 						if (!status) return player.notify('Refuzat', 'error');
		// 						if (!canFight(zone, user.fraction)) return player.notify('Nu se poate ataca acum', 'error');
		// 						startFight(zone, user.fraction);
		// 					});
		// 				});
		// 			} else if (zoneowner === user.fraction && user.isLeader && target.user.isLeader) {
		// 				interaction.add('Transfera teritoriul', 'Fractie', 'swords', () => {
		// 					if (!check()) return;
		// 					menu.accept(player, `Esti sigur?`).then(status => {
		// 						if (!check()) return;
		// 						if (!status) return player.notify('Refuzat', 'error');
		// 						if (!canFight(zone, user.fraction)) return player.notify('Este in desfasurare un razboi, nu poti transfera teritoriul', 'error');
		// 						setZoneControl(zone, target.user.fraction);
		// 						player.notify('Teritoriul a fost transferat', 'success');
		// 						target.notify('Teritoriul a fost transferat', 'success');
		// 					});
		// 				});
		// 			}
		// 		}
		// 	}
		// }
		
		if (user.fraction === 16) {
			if (target.user.health < 0.1) {
				interaction.add('Injectie cu epinefrina', 'Tratament', 'heart', () => {
					if (!check()) return;
					if (healByItemTimer.has(user.id)) return player.notify('Recent ai folosit deja epinefrina', 'error');
					if (target.user.health > 0) return player.notify('Pacientul nu are nevoie de reanimare');
					const item = user.haveItem(910);
					if (!item) return player.notify('Nu ai epinefrina', 'error');
					// gui.chat.sendDoCommand(player, `A facut injectie intramusculara cu epinefrina si a inceput resuscitarea cardio-respiratorie`);
					user.waitTimer(5, 5, 'Reanimare', ["missheistfbi3b_ig8_2", "cpr_loop_paramedic", true], target).then(status2 => {
						if (!status2) return;
						if (!check()) return;
						if (healByItemTimer.has(user.id)) return player.notify('Recent ai folosit deja epinefrina', 'error');
						if (target.user.health > 0) return player.notify('Pacientul nu are nevoie de reanimare');
						const item = user.haveItem(910);
						if (!item) return player.notify('Nu ai epinefrina', 'error');
						item.useCount(1, player);
						let chance = system.getRandomInt(0, 100);
						if (user.haveActiveLicense('reanimation')) chance = 100;
						if (chance < 90) return player.notify('Reanimarea nu a reusit', 'error');
						target.user.health = 100;
						player.notify('Ai reanimat persoana', 'success');
						target.notify('Ai fost reanimat', 'success');
						CustomEvent.triggerClient(player, 'markDeath:destroy'); // Eliminam markerul de pe jucatorul mort daca exista
						healByItemTimer.set(user.id, true);
						const ids = user.id;
						setTimeout(() => {
							healByItemTimer.delete(ids);
						}, 5 * 60000)
					});
				});
				interaction.add('Reanimeaza', 'Tratament', 'heart', () => {
					if (!check()) return;
					if (target.user.health > 0) return player.notify('Pacientul nu are nevoie de reanimare');
					if (system.timestamp - target.user.lastReanimationTime <= 180)
						return player.notify('Pacientul a fost reanimat recent');
					const itm = user.haveItem(902);
					if (!itm) return player.notify('Nu ai trusa de reanimare', 'error');
					if (target.user.health > 0) return player.notify('Pacientul nu are nevoie de reanimare');
					user.waitTimer(5, 10, 'Reanimare', ["missheistfbi3b_ig8_2", "cpr_loop_paramedic", true], target)
						.then(status => {
							if (!status) return;
							if (!mp.players.exists(player)) return;
							if (!check()) return;
							if (target.user.health > 0) return player.notify('Pacientul nu are nevoie de reanimare');
							const itm = user.haveItem(902);
							if (!itm) return player.notify('Nu ai trusa de reanimare', 'error');
							user.addMoney(350, true, 'Reanimare');
							target.user.health = 100;
							itm.useCount(1, player);
							player.notify('Ai reanimat persoana', 'success');
							CustomEvent.triggerClient(player, 'markDeath:destroy');
							target.notify('Ai fost reanimat', 'success');
							target.user.lastReanimationTime = system.timestamp;
						});
				});
			} else if (target.user.health < 100) {
				interaction.add('Trateaza', 'Tratament', 'heart', () => {
					if (!check()) return;
					if (target.user.health === 100) return;
					const itm = user.haveItem(902);
					if (!itm) return player.notify('Nu ai trusa medicala', 'error');
					menu.input(player, 'Introdu suma (0-700)', 100, 3, 'int').then(sum => {
						if (typeof sum !== "number") return;
						if (isNaN(sum)) return;
						if (sum < 0 || sum > 700) return player.notify('Suma introdusa nu este corecta', 'error');
						if (!check()) return;
						if (target.user.health === 100) return;
						menu.accept(target, `Vrei sa te tratezi pentru ${system.numberFormat(sum)}?`).then(status => {
							if (!status) return;
							if (!check()) return;
							if (target.user.health === 100) return;
							const itm = user.haveItem(902);
							if (!itm) return player.notify('Nu ai trusa medicala', 'error');
							if (sum > 0) {
								if (target.user.money < sum) return target.notify('Nu ai suficienti bani pentru tratament', 'error');
								target.user.removeMoney(sum, true, 'Plata tratament');
								user.addMoney(sum, true, 'Tratament');
							}
							target.user.health = 100;
							itm.useCount(1, player);
							player.notify('Ai tratat persoana', 'success');
							target.notify('Ai fost tratat', 'success');
						})
					})
		
				});
			}
		}
		
		if (target.user.health > 0.1) {
			const timer = await target.user.getHospitalTimer();
			if (!check()) return;
			if (timer > 0) {
				const sum = target.user.haveActiveLicense('med') ? QUICK_HEAL_COST.MANUAL_LICENSE : QUICK_HEAL_COST.MANUAL;
				interaction.add(`Trateaza-te $${sum}`, 'Tratament', 'documentText', async () => {
					if (!check()) return;
					const timer = await target.user.getHospitalTimer();
					if (timer <= 0) return;
					if (!check()) return;
					menu.accept(target, `Vrei sa te externezi pentru $${sum}?`).then(status => {
						if (!status) return;
						if (!check()) return;
						if (target.user.money < sum) return target.notify('Nu ai suficienti bani pentru externare din spital', 'error');
						target.user.removeMoney(sum, true, `Tratare pacient  ${target.user.name} #${target.user.id}`);
						CustomEvent.triggerClient(target, 'hospital:clearHealTimer');
						player.notify('Ai tratat persoana cu succes', 'success');
						user.addMoney(sum * 0.3, true, 'Externare din spital');
						const chest = MoneyChestClass.getByFraction(16);
						if (chest) chest.addMoney(player, sum - (sum * 0.3), false);
					});
				});
			}
		}
		
	} else if (target.user.health <= 0) {
		interaction.add('Injectie cu epinefrina', 'Tratament', 'heart', () => {
			if (!check()) return;
			if (healByItemTimer.has(user.id)) return player.notify('Recent ai folosit deja epinefrina', 'error');
			if (target.user.health > 0) return player.notify('Pacientul nu are nevoie de reanimare');
			const item = user.haveItem(910);
			if (!item) return player.notify('Nu ai epinefrina', 'error');
			// gui.chat.sendDoCommand(player, `A facut injectie intramusculara cu epinefrina si a inceput resuscitarea cardio-respiratorie`);
			user.waitTimer(5, 5, 'Reanimare', ["missheistfbi3b_ig8_2", "cpr_loop_paramedic", true], target).then(status2 => {
				if (!status2) return;
				if (!check()) return;
				if (healByItemTimer.has(user.id)) return player.notify('Recent ai folosit deja epinefrina', 'error');
				if (target.user.health > 0) return player.notify('Pacientul nu are nevoie de reanimare');
				const item = user.haveItem(910);
				if (!item) return player.notify('Nu ai epinefrina', 'error');
				item.useCount(1, player);
				let chance = system.getRandomInt(0, 100);
				if (user.haveActiveLicense('reanimation')) chance = 100;
				if (chance < 66) return player.notify('Reanimarea nu a reusit', 'error');
				target.user.health = 100;
				player.notify('Ai reanimat persoana', 'success');
				target.notify('Ai fost reanimat', 'success');
				healByItemTimer.set(user.id, true);
				const ids = user.id;
				setTimeout(() => {
					healByItemTimer.delete(ids);
				}, 1 * 60000);
			})
		});
	}
	const nearestVehicle = user.getNearestVehicle(4);
	if (nearestVehicle) {
		const truckCfg = Vehicle.haveTruck(nearestVehicle);
		if (truckCfg) {
			if (target && target.user && (target.user.cuffed || target.getVariable('inVehicleTruck'))) {
				interaction.add(
					target.getVariable('inVehicleTruck')
						? "Scoate persoana din portbagaj"
						: "Baga persoana in portbagaj",
					'Transport',
					'carTrunk',
					() => {
						if (!check()) return;
						if (!target.user.cuffed && !target.getVariable('inVehicleTruck')) return;
						if (!Vehicle.openTruckStatus(nearestVehicle))
							return player.notify("Deschide portbagajul", "error"), vehInteract(player, targetId);
						const pos = system.offsetPosition(
							nearestVehicle.position,
							nearestVehicle.rotation,
							new mp.Vector3(truckCfg.x, truckCfg.y, truckCfg.z)
						);
						if (system.distanceToPos(player.position, pos) > 2)
							return player.notify("Esti prea departe de portbagaj", "error"), vehInteract(player, targetId);
						if (system.distanceToPos(target.position, pos) > 2)
							return player.notify("Tinta este prea departe de portbagaj", "error"), vehInteract(player, targetId);
						if (target.vehicle)
							return player.notify('Tinta este deja intr-un vehicul', 'error');
						if (!target.getVariable('inVehicleTruck') && nearestVehicle.playerInTruck)
							return player.notify("Portbagajul este deja ocupat", "error"), vehInteract(player, targetId);
						if (target.getVariable('inVehicleTruck') && nearestVehicle.playerInTruck !== target.dbid)
							return player.notify("Incerci sa scoti o persoana din portbagajul altui vehicul", "error"), vehInteract(player, targetId);
						nearestVehicle.playerInTruck = target.getVariable('inVehicleTruck') ? null : target.dbid;
						target.setVariable('inVehicleTruck', target.getVariable('inVehicleTruck') ? null : nearestVehicle.id);
						vehInteract(player, targetId);
					}
				);
			}
		}
	}
	
	if (
		user.fraction && user.fractionData.mafia && user.isLeader &&
		target.user.fraction && target.user.fractionData.mafia && target.user.isLeader
	) {
		const biz = business.data
			.filter(biz => biz.mafiaOwner === user.fraction)
			.find(biz => system.isPointInPoints(player.position, biz.positions, 10));
		if (biz) {
			interaction.add("Transfera controlul asupra afacerii", 'Actiuni', 'peoples', () => {
				if (!check()) return;
				menu.accept(player).then(status => {
					if (!status) return;
					if (!check()) return;
					biz.mafiaOwner = target.user.fraction;
					biz.save().then(() => {
						if (!check()) return;
						player.notify('Afacerea a fost transferata', "success");
						target.notify('Afacerea a fost transferata', "success");
					});
				});
			});
		}
	}
	
	if (target.vehicle && target.user.cuffed) {
		interaction.add("Scoate din vehicul", 'Transport', 'carTrunk', () => {
			if (!check()) return;
			if (target.vehicle && target.user.cuffed) {
				target.user.leaveVehicle();
			}
		});
	}
	
	if (!target.vehicle && target.user.cuffed) {
		interaction.add("Baga in cel mai apropiat vehicul", 'Transport', 'carTrunk', () => {
			if (!check()) return;
			if (!target.vehicle && target.user.cuffed) {
				const veh = User.getNearestVehicle(player, 3);
				if (!veh) return player.notify('Nu s-a gasit niciun vehicul in apropiere', 'error');
				if (veh.getOccupant(2) && veh.getOccupant(3))
					return player.notify('Nu mai sunt locuri libere in vehicul', 'error');
				if (veh.getOccupant(2)) target.user.putIntoVehicle(veh, 3);
				else target.user.putIntoVehicle(veh, 2);
			}
		});
	}
	
	if (player.vehicle && user.isDriver && player.vehicle === target.vehicle) {
		interaction.add("Da afara din vehicul", 'Transport', 'carTrunk', () => {
			if (!check()) return;
			if (player.vehicle && user.isDriver && player.vehicle === target.vehicle) {
				if (player.vehicle.taxiCar) {
					if (player.dbid === player.vehicle.taxiCar) {
						const order = taxi.list.find(q => q.driver === player.dbid && target.dbid === q.user);
						if (order) {
							const dist = system.distanceToPos2D(player.position, order.end);
							if (dist > 20)
								return player.notify('Nu poti da afara pasagerul pana nu ajungi la destinatie', 'error');
						}
					}
				}
				target.user.leaveVehicle();
				target.notify('Soferul te-a dat afara din vehicul', 'error');
			}
		});
	}
	

	const items = user.allMyItems;
	const itcard = items.find(q => q.item_id === 800 && user.id + "_" + user.social_number === q.serial);
	if (itcard) {
		interaction.add(getItemName(itcard), 'Documente', 'documentText', async () => {
			if (!check()) return;
			if (!(await menu.accept(target, "Doresti sa vezi documentele?", null, 15000))) return player.notify('Jucatorul a refuzat');
			if (!check()) return;
			let data = await getDocumentData(itcard);
			if (!data) return player.notify("Documente invalide", "error");
			CustomEvent.triggerCef(target, "cef:idcard:new", data);
		});
	}

	if (UdoData.find(q => q.id === user.fraction)) {
		const doc = user.haveItem(824);
		if (doc) {
			interaction.add(getItemName(doc), 'Documente', 'documentText', async () => {
				if (!check()) return;
				if (!(await menu.accept(target, "Doresti sa vezi documentele?", null, 15000))) return player.notify('Jucatorul a refuzat');
				if (!check()) return;
				CustomEvent.triggerCef(target, "udo:show", user.udoData);
			});
		}
	}

	items.filter(q => q.item_id === 802).map(item => {
		interaction.add(getItemName(item), 'Documente', 'documentText', async () => {
			if (!check()) return;
			if (!(await menu.accept(target, "Doresti sa vezi documentele?", null, 15000))) return player.notify('Jucatorul a refuzat');
			if (!check()) return;
			const [document, date, code, id, name, social, idCreator, nameCreator, socialCreator, real] = item.serial.split('|');
			CustomEvent.triggerCef(target, "document:show", document, date, code, id, name, social, idCreator, nameCreator, socialCreator, real);
		});
	});

	items.filter(q => q.item_id === 803).map(item => {
		interaction.add(getItemName(item), 'Documente', 'documentText', async () => {
			if (!check()) return;
			if (!(await menu.accept(target, "Doresti sa vezi documentele?", null, 15000))) return player.notify('Jucatorul a refuzat');
			if (!check()) return;
			const [type, serial, code, timestring, userid] = item.serial.split('-');
			const time = parseInt(timestring);
			const userdata = await User.getData(parseInt(userid));
			if (!userdata) return player.notify("Proprietarul documentelor a parasit serverul"), inventory.deleteItem(item);
			CustomEvent.triggerCef(target, "license:show", {
				type,
				serial: parseInt(serial),
				time,
				player: userdata.rp_name,
				code
			});
		});
	});	
	interaction.add("Ofera bani", '', 'cash', () => {
		if (!check()) return;
		menu.input(player, `Introdu suma ($1 - $${system.numberFormat(system.smallestNumber(GIVE_MONEY_PER_TASK, user.money))})`, "", GIVE_MONEY_PER_TASK.toString().length, 'int').then(sum => {
			if (!sum) return;
			if (!check()) return;
			if (isNaN(sum)) return player.notify("Suma introdusa nu este corecta", "error");
			if (sum <= 0) return player.notify("Suma introdusa nu este corecta", "error");
			if (sum > 9999999) return player.notify("Suma introdusa nu este corecta", "error");
			if (sum > GIVE_MONEY_PER_TASK) return player.notify(`Suma depaseste limita $${system.numberFormat(GIVE_MONEY_PER_TASK)}`, "error");
			if (sum > player.user.money) return player.notify(`Nu ai suficienti bani cash pentru a da $${system.numberFormat(sum)}`, "error");
	
			menu.accept(target, `Vrei sa primesti $${system.numberFormat(sum)}?`, 'small').then(status => {
				if (!status) return;
				if (!check()) return;
				user.giveMoneyToPlayer(target, sum);
			});
		});
	});
	
	interaction.add("Propune schimb", '', 'exchange', () => sendExchangeRequest(player, target));


	// if (target.user.cuffed) {
	// 	let uncuffText: string = null;

	// 	// Scoate cătușele doar dacă e poliție sau guvern
	// 	if (target.user.policeCuffed && (user.is_government || user.is_police)) {
	// 		uncuffText = 'Scoate catusele';
	// 	} else if (!target.user.policeCuffed && (user.is_gang || user.is_mafia)) {
	// 		uncuffText = 'Taie bridele';
	// 	}

	// 	if (uncuffText) {
	// 		interaction.add(uncuffText, 'Fractiune', 'handcuffs', () => {
	// 			if (!check()) return;
	// 			user.setUncuffedTarget(target);
	// 		});
	// 	}
	// } else if (!target.user.cuffed){
	// 	let cuffText: string = null;

	// 	// Pune cătușele doar dacă e poliție sau guvern
	// 	if (user.is_police || user.is_government) {
	// 		cuffText = 'Pune catusele';
	// 	} else if (user.is_gang || user.is_mafia) {
	// 		cuffText = 'Leaga cu bride';
	// 	}

	// 	if (cuffText) {
	// 		interaction.add(cuffText, 'Fractiune', 'handcuffs', () => {
	// 			if (!check()) return;
	// 			user.setCuffedTarget(target);
	// 		});
	// 	}
	// }
	if (target.user.cuffed) {
		let uncuffText: string = null;

		// Scoate cătușele doar dacă e poliție sau guvern
		if (target.user.policeCuffed && (user.is_police || user.is_government)) {
			uncuffText = 'Scoate catusele';
		} 
		// Taie bride doar dacă e gang sau mafie
		else if (!target.user.policeCuffed && (user.is_gang || user.is_mafia)) {
			uncuffText = 'Taie bridele';
		}

		if (uncuffText) {
			interaction.add(uncuffText, 'Catuse', 'handcuffs', () => {
				if (!check()) return;
				user.setUncuffedTarget(target);
			});
		}
	} else if (!target.user.cuffed) {
		let cuffText: string = null;

		// Pune cătușele doar dacă e poliție sau guvern
		if (user.is_police || user.is_government) {
			cuffText = 'Pune catusele';
		} 
		// Leagă cu bride doar dacă e gang sau mafie
		else if (user.is_gang || user.is_mafia) {
			cuffText = 'Leaga cu bride';
		}

		if (cuffText) {
			interaction.add(cuffText, 'Catuse', 'handcuffs', () => {
				if (!check()) return;
				user.setCuffedTarget(target);
			});
		}
	}

	// if (user.is_police) {
	// 	const inMask = !nonHiddenMasksIds.includes(target.getClothes(1).drawable);
	// 	if (inMask) interaction.add("Scoate masca", 'Factiune', 'mask', () => {
	// 		if (!check()) return;
	// 		if (target.user.getJobDress && target.user.getJobDress.find(q => q[0] === 1)) {
	// 			const d = [...target.user.getJobDress];
	// 			if (d.findIndex(q => q[0] === 1) > -1) d.splice(d.findIndex(q => q[0] === 1), 1);
	// 			target.user.setJobDress(d);
	// 		} else target.user.setDressValueById(950, 0);
	// 		player.notify('Masca a fost scoasa');
	// 		target.notify('Ti-a fost scoasa masca');
	// 	});
	// }
	
	if (user.is_gang || user.is_mafia) {
		// Daca tinta este legata cu bride de gang
		if (target.user.cuffed && !target.user.policeCuffed) {
			interaction.add('Jefuieste', 'Factiune', 'thief', () => {
				if (!check()) return;
				if (target.user.dead) {
					return player.notify('Nu poti jefui un jucator mort', 'error');
				}
				if (!target.user.canBeRobbed)
					return player.notify('Nu poti jefui aceeasi persoana prea des', 'error');
				if (user.family && target.user.family && user.familyId == target.user.familyId)
					return player.notify('Nu poti jefui un membru al familiei', 'error');
	
				let totalRobbed = Math.floor(target.user.money * CRIME_ROBBERY_INTEREST / 100);
				if (totalRobbed > CRIME_ROBBERY_PROFIT_LIMIT) totalRobbed = CRIME_ROBBERY_PROFIT_LIMIT;
	
				target.user.removeMoney(totalRobbed, false, `Jefuit de jucatorul ${player.user.dbid} cu suma ${system.numberFormat(totalRobbed)}`);
				player.user.addMoney(totalRobbed, false, `A jefuit jucatorul ${target.user.dbid} cu suma ${system.numberFormat(totalRobbed)}`);
	
				user.playAnimation([['oddjobs@shop_robbery@rob_till', 'loop']], true, false);
	
				target.notify(`Ai fost jefuit cu suma de ${system.numberFormat(totalRobbed)}`);
				target.user.lastRobbedTime = system.getTimeStamp();
				user.log('Jajplayer', `a jefuit pe ${target.user.name} cu suma ${system.numberFormat(totalRobbed)}`, target);

			});
		}
	}
	
	if (user.haveItem(869)) {
		interaction.add("Ofera flori", 'Social', 'flowers', () => {
			if (!check()) return;
			menu.accept(target, `Accepti florile?`, 'small').then(status => {
				if (!check()) return;
				if (!status) return player.notify('Invitatia a fost respinsa', 'error');
				const item = user.haveItem(869);
				if (!item) return;
				player.user.removeAttachment('item_869');
				inventory.updateItemOwner(item.id, OWNER_TYPES.PLAYER, target.dbid, OWNER_TYPES.PLAYER, player.dbid);
				target.user.addAttachment('item_869');
				user.playSyncAnimation(target, ['mp_common', 'givetake2_a'], ['mp_common', 'givetake1_a']);
			});
		});
	}
	
	if (target.user.cuffed) {
		if (user.haveItem(813)) {
			interaction.add("Deschide catusele", '', 'handcuffs', () => {
				if (!check()) return;
				if (!target.user.cuffed) return;
				user.waitTimer(3, 15, 'Deschide catusele', ['mp_arresting', 'a_uncuff'], target).then(status => {
					if (!status) return;
					if (!mp.players.exists(player)) return;
					if (!check()) return;
					if (!target.user.cuffed) return;
					if (
						target.user.cuffed && target.user.policeCuffed &&
						!user.is_police &&
						target.user.getNearestPlayers(50).find(q => q && q.user && q.user.is_police && q.health > 0)
					) return player.notify('Nu poti scoate catusele daca un politist este in apropiere', 'error');
					const item = user.haveItem(813);
					if (!item) return;
					item.useCount(1, player);
					if (!system.getLockHackingStatus()) return player.notify("Unealta s-a stricat!", "error");
					target.user.cuffed = false;
					player.notify('Catusele au fost desfacute', 'success');
					target.notify('Catusele au fost desfacute', 'success');
				});
			});
		}
	
		if (target.user.policeCuffed) {
			if (user.is_government || user.is_police) {
				interaction.add(!target.user.follow ? "Ia dupa tine" : "Opreste urmarirea", 'Factiune', 'handshake', () => {
					if (!check()) return;
					user.setFollowTarget(target);
				});
			}
		} else {
			interaction.add(!target.user.follow ? "Ia dupa tine" : "Opreste urmarirea", 'Factiune', 'handshake', () => {
				if (!check()) return;
				user.setFollowTarget(target);
			});
		}
	}
	
	if (
		user.family &&
		!target.user.familyId &&
		user.familyId !== target.user.familyId &&
		user.family.isCan(user.familyRank, 'invite')
	) {
		interaction.add("Invita in familie", 'Familie', 'peoples', async () => {
			if (!check()) return;
			if (user.family.maximumMembersCount <= await user.family.getMembersCount())
				return player.notify('Familia ta a atins limita de membri');
			if (target.user.familyId)
				return player.notify("Nu poti invita o persoana care deja face parte dintr-o familie", 'error');
	
			player.notify('Invitatie trimisa', 'success');
			menu.accept(target, `Vrei sa te alaturi familiei ${user.family.name}?`, 'small').then(status => {
				if (!check()) return;
				if (!status) return player.notify('Invitatia a fost refuzata', 'error');
				target.user.family = user.family;
				user.log('familyInvite', `a primit in familie pe ${user.family.name}`, target);
				player.notify('Invitatia a fost acceptata', 'success');
				target.notify('Invitatia a fost acceptata', 'success');
			});
		});
	}
	
	if (user.fraction && user.fraction !== target.user.fraction) {
		if (fraction.getRightsForRank(user.fraction, user.rank).includes(FRACTION_RIGHTS.INVITE)) {
			interaction.add("Invita in organizatie", 'Factiune', 'businessSharp', () => {
				if (!check()) return;
				if (target.user.fraction)
					return player.notify("Nu poti invita o persoana care deja face parte dintr-o organizatie", 'error');
				if (target.user.haveActiveWarns) {
					player.notify('Nu poti invita aceasta persoana', 'error');
					target.notify('Ai un avertisment activ, nu poti fi invitat', 'error');
					return;
				}
				player.notify('Invitatie trimisa', 'success');
				menu.accept(target, `Vrei sa te alaturi organizatiei ${fractionCfg.getFractionName(user.fraction)}?`, 'small').then(status => {
					if (!check()) return;
					if (!status) return player.notify('Invitatia a fost refuzata', 'error');
					target.user.fraction = user.fraction;
					user.log('fractionInvite', `a primit in organizatie pe ${fractionCfg.getFractionName(user.fraction)}`, target);
					player.notify('Invitatia a fost acceptata', 'success');
					target.notify('Invitatia a fost acceptata', 'success');
				});
			});
		}
	}
	
	if (user.gr6job && user.gr6jobLeader && target.user.gr6job && !target.user.gr6jobId) {
		interaction.add("Adauga in echipa GR6", '', 'peoples', () => {
			if (!check()) return;
			menu.accept(target, `Vrei sa intri in echipa GR6?`, 'small').then(status => {
				if (!status) return;
				if (!check()) return;
				if (user.gr6job && user.gr6jobLeader && target.user.gr6job && !target.user.gr6jobId) {
					target.user.gr6jobId = user.gr6jobId;
					target.user.gr6jobLeader = false;
					player.notify("Echipa a fost marita");
					target.notify("Ai intrat in echipa cu succes");
				}
			});
		});
	}
	
	if (
		user.familyId != 0 &&
		target.user.familyId == user.familyId &&
		target.user.isFamilyLeader
	) {
		interaction.add('Transfera vehiculul in familie', 'Factiune', 'car', () => {
			if (!check()) return;
	
			if (!target.user.family.canBuyMoreCar) return user.notify('Familia a atins limita de vehicule');
			if (!user.myVehicles.length) return user.notify('Nu ai vehicule');
			const m = menu.new(player, 'Transfera vehicul in familie');
			user.myVehicles.map(v => {
				m.newItem({
					name: v.model,
					onpress: () => {
						if (!check()) return;
						if (!user.myVehicles.includes(v)) return;
						if (system.distanceToPos(v.vehicle.position, player.position) > 50)
							return user.notify('Vehiculul trebuie sa fie aproape de tine');
						m.close();
						menu.accept(
							target,
							`Jucatorul ${target.user.getShowingNameString(player)} (${target.user.getShowingIdString(player)}) vrea sa transfere vehiculul ${v.model} familiei tale`,
							'small'
						).then(status => {
							if (!status) return;
							if (!check()) return;
							if (!user.myVehicles.includes(v)) return;
							if (
								user.familyId == 0 ||
								target.user.familyId != user.familyId ||
								!target.user.isFamilyLeader
							)
								return;
							if (!target.user.family.canBuyMoreCar)
								return user.notify('Familia a atins limita de vehicule');
							// if (BATTLE_PASS_VEHICLES.find(el => v.model === el) !== undefined)
							// 	return player.notify('Nu poti transfera vehicule din battle pass');
	
							// v.setOwnerFamily(target.user.family.entity, )
	
							Vehicle.selectParkPlace(target, v.avia, true).then(place => {
								if (!place)
									return target.notify(
										"Trebuie sa alegi un loc de parcare pentru acest vehicul",
										"error"
									);
								if (!check()) return;
								if (!user.myVehicles.includes(v)) return;
								const getParkPos = () => {
									if (place.type === "house")
										return houses.getFreeVehicleSlot(place.id, v.avia);
									else return parking.getFreeSlot(place.id);
								};
								if (
									user.familyId == 0 ||
									target.user.familyId != user.familyId ||
									!target.user.isFamilyLeader
								)
									return;
								if (!target.user.family.canBuyMoreCar)
									return target.notify('Familia nu are sloturi disponibile pentru un nou vehicul');
								v.setOwnerFamily(target.user.family.entity, getParkPos());
								user.notify(`Ai transferat vehiculul catre familie`);
								target.notify('Ai primit un nou vehicul in familie');
							});
						});
					}
				});
			});
	
			m.open();
		});
	}
	
	if (!target.user.cuffed) {
		interaction.add("Romantic", '', 'heart', () => {
			if (!check()) return;
			let subinteract = new InterractionMenu(player);
			subinteract.onBack = () => {
				playerInteract(player, targetId);
			}
			SYNC_ANIM_LIST.map(item => {
				subinteract.add(item.name, '', 'lips', () => {
					if (!check()) return;
					menu.accept(target, `Doresti sa joci animatia ${item.name} cu ${target.user.getShowingNameString(player)} (${target.user.getShowingIdString(player)})?`, 'small').then(status => {
						if(!status) return;
						if (!check()) return;
						let playerAnim = typeof item.anim1 === "string" ? item.anim1 : (player.user.male ? item.anim1[0] : item.anim1[1]);
						let targetAnim = typeof item.anim2 === "string" ? item.anim2 : (target.user.male ? item.anim2[0] : item.anim2[1]);
						player.user.playSyncAnimation(target, [item.dict1, playerAnim], [item.dict2, targetAnim], item.dist)
					})
				})
			})
			subinteract.open();
		})
	}
	
	// if (!user.isFamiliar(target)) interaction.add(user.isFamiliar(target) ? "Fa cunostinta din nou" : "Fa cunostinta", 'Social', 'chatbubbles', () => {
	// 	if (!check()) return;
	// 	player.notify("Ai propus persoanei sa faceti cunostinta", "success");
	// 	menu.accept(target, "Vrei sa faci cunostinta? (" + player.dbid + ")", 'small').then(status => {
	// 		if (!check()) return;
	// 		if (!status) return player.notify("Persoana a refuzat sa faca cunostinta cu tine", "error");
	// 		if (!user.player || !target || !mp.players.exists(user.player) || !mp.players.exists(target)) return;
	
	// 		user.newFamiliar(target, target.user.name);
	// 		target.user.newFamiliar(player, user.name);
	
	// 		function normalizeHeading(heading) {
	// 			if (heading > 180) return heading - 360;
	// 			else if (heading < -180) return heading + 360;
	// 			return heading;
	// 		}
	
	// 		function alignEntities(entity1, entity2) {
	// 			const heading1 = entity1.getHeading();
	// 			const heading2 = entity2.getHeading();
	// 			const headingDifference = heading2 - heading1;
	// 			const alignedHeading1 = heading1 + headingDifference / 2;
	// 			const alignedHeading2 = heading2 - headingDifference / 2;
	// 			const correctedHeading1 = normalizeHeading(alignedHeading1);
	// 			const correctedHeading2 = normalizeHeading(alignedHeading2);
	// 			entity1.setRotation(0, 0, correctedHeading1, 2, true);
	// 			entity2.setRotation(0, 0, correctedHeading2, 2, true);
	// 		}
	
	// 		alignEntities(user.player, target);
	
	// 		user.playAnimation([["mp_ped_interaction", "handshake_guy_a"]], true);
	// 		target.user.playAnimation([["mp_ped_interaction", "handshake_guy_b"]], true);
	// 		if (!user.isFamiliar(target)) {
	// 			player.user.achiev.achievTickByType("newMeet")
	// 			target.user.achiev.achievTickByType("newMeet")
	// 		}
	// 		player.notify("Ati facut cunostinta cu succes", "success")
	// 		target.notify("Ati facut cunostinta cu succes", "success")
	// 	})
	// })
	
    mp.events.call('interaction:openPlayer', player, target, interaction);

    interaction.open();
}

CustomEvent.registerClient('interractionMenu:select', (player, id: number, index: number) => {
    const m = InterractionMenu.get(id);
    if(!m) return;
    m.handle(index);
})
CustomEvent.registerClient('interractionMenu:onBack', (player, id: number) => {
    const m = InterractionMenu.get(id);
    if(!m) return;
    m.handle(99);
})
CustomEvent.registerClient('interractionMenu:onExit', (player, id: number) => {
    const m = InterractionMenu.get(id);
    if(!m) return;
    m.handle(100);
})

mp.events.add('playerDeath', player => {
    truckLeaveEvent(player)
})

mp.events.add('playerQuit', player => {
    truckLeaveEvent(player)
})

const truckLeaveEvent = (player: PlayerMp) => {
    if(!player.user) return;
    if (player.dbid && player.getVariable('inVehicleTruck')) {
        player.setVariable('inVehicleTruck', null);
        const veh = Vehicle.toArray().find(target => target.playerInTruck === player.dbid);
        if (veh) veh.playerInTruck = null
    }
}