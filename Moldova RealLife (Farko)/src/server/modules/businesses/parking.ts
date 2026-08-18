import { langStringDefault } from "../../../shared/lang";
import { menu } from "../menu";
import { colshapes } from "../checkpoints";
import {
	BUSINESS_REWARD_PERCENT,
	type IParkingData,
	type IParkingFloor,
	PARKING_AVIA,
	PARKING_AVIA_EXIT,
	PARKING_CARS,
	PARKING_CARS_PLAYER_MAX,
	PARKING_DAY_COST,
	PARKING_EXIT,
	PARKING_START_COST,
	PARKING_STEP,
} from "../../../shared/parking";
import type { BusinessEntity } from "../typeorm/entities/business";
import { business } from "../business";
import { system } from "../system";
import { CustomEvent } from "../custom.event";
import { User } from "../user";
import { Vehicle } from "../vehicles";
import { writeClientRatingLog } from "./tablet";
import { inventory } from "../inventory";

interface VehicleData {
	dbid: number;
	model: string;
	numberPlate: string;
	spawnPosition: { x: number; y: number; z: number };
	spawnRotation: { x: number; y: number; z: number };
	spawnDimension: number;
	usedAfterRespawn: boolean;
	inventoryTmp: number;
	afkTime: number;
	needRespawn: boolean;
	user: number;
}

export const parkingMenu = async (player: PlayerMp, item?: BusinessEntity) => {
	const user = player.user;
	if (!user) return;
	const parkingItem = item ?? parking.getParkingFromDimension(player.dimension);
	if (!parkingItem) {
		return player.notify(
			player.user.LangString("parking.f066bd041586991951b93c51354847fe"),
			"error",
		);
	}
	const slots = parking.getParkingZones(item);
	if (player.vehicle) {
		const veh = player.vehicle;
		if (!veh.entity)
			return player.notify(
				player.user.LangString("parking.11e04aa7372dadae9e51b66c443756a9"),
				"error",
			);
		if (!user.isDriver)
			return player.notify(
				player.user.LangString("parking.b98a492848e37cffb9c74a67cbc0a44e"),
				"error",
			);
		let slot = slots.find((q) => q.veh === player.vehicle);
		if (!slot) {
			if (veh.entity.owner !== player.dbid)
				return player.notify(
					player.user.LangString("parking.c428db0eb9a2d5833bbfc42d158b17b9"),
					"error",
				);
			if (slots.filter((q) => !q.veh).length === 0)
				return player.notify(
					player.user.LangString("parking.8c63dfb8900a2f20e3d1dd3dffc0c4ca"),
					"error",
				);
			if ((item.sub_type === 1) !== veh.entity.avia)
				return player.notify(
					player.user.LangString(
						"parking.fc9d6059848508ad63cdb3d3f516d9b1",
						veh.entity.name,
					),
					"error",
				);
			const allVehs = parking.allVehsInAllParking();
			const myCarsOnParks = allVehs.filter(
				(veh) =>
					veh.entity.owner === user.id &&
					veh.entity.id !== player.vehicle.entity.id,
			).length;
			if (myCarsOnParks >= PARKING_CARS_PLAYER_MAX) {
				return player.notify(
					player.user.LangString(
						"parking.fb62dae4302d6d7436f9409a8025164f",
						myCarsOnParks,
					),
					"error",
				);
			}
			if (
				!(await menu.accept(
					player,
					player.user.LangString(
						"parking.9b979f8564438670b2a9c19c531137b4",
						system.numberFormat(PARKING_START_COST),
						system.numberFormat(PARKING_DAY_COST),
					),
				))
			)
				return;
			if (!parking.getFreeSlot(item))
				return player.notify(
					player.user.LangString("parking.098bed66cb46c618f957264d7fbb5267"),
					"error",
				);
			if (
				!(await user.tryPayment(
					PARKING_START_COST,
					"all",
					() => {
						slot = parking.getFreeSlot(item);
						return !!slot;
					},
					user.LangString("parking.6b9966028f08d4cf322c1f24424e26c6"),
					user.LangString("parking.678c39ccc826abfb6aedea429d07cd75", item.id),
				))
			)
				return;
			if (!mp.vehicles.exists(veh)) return;
			veh.entity.position = {
				x: slot.x,
				y: slot.y,
				z: slot.z,
				h: slot.h,
				d: slot.d,
			};

			if (player.vehicle && mp.vehicles.exists(player.vehicle)) {
                if (player.vehicle.entity.data) {
                    player.vehicle.entity.data.engineHealth = player.vehicle.engineHealth;
					player.vehicle.setVariable('engineHealth', player.vehicle.engineHealth);
                    await player.vehicle.entity.save();
                }
            }

			player.notify(
				player.user.LangString("parking.6332be130f55737cf393e0f6a50d7a4c"),
				"success",
			);
			writeClientRatingLog(
				player,
				item.id,
				PARKING_START_COST,
				langStringDefault("parking.4e06380dc45dce9ce3d8c7df6ec357f5"),
				1,
			);
		}
		// if (slot) {
		// 	user.teleportVeh(slot.x, slot.y, slot.z, slot.h, slot.d);
		// 	veh.entity.engine = false;
		// 	veh.entity.locked = true;
		// 	setTimeout(() => {
		// 		if (mp.vehicles.exists(veh)) {
		// 			veh
		// 				.getOccupants()
		// 				.filter((target) => mp.players.exists(target) && target.user)
		// 				.map((target) => target.user.leaveVehicle());
		// 			veh.entity.engine = false;
		// 			veh.entity.locked = true;
		// 		}
		// 	}, system.TELEPORT_TIME);
		// 	return;
		// }
		if (slot) {
			if (mp.vehicles.exists(veh)) {
				veh
					.getOccupants()
					.filter((target) => mp.players.exists(target) && target.user)
					.map((target) => target.user.leaveVehicle());
				veh.entity.engine = false;
				veh.entity.locked = true;
			}
			setTimeout(() => {
				veh.position = new mp.Vector3(slot.x, slot.y, slot.z);
				veh.rotation = new mp.Vector3(0, 0, slot.h);
				veh.dimension = slot.d;
			}, system.TELEPORT_TIME);
			return;
		}
		return;
	}

	const poss = item.sub_type === 0 ? PARKING_CARS : PARKING_AVIA;

	function sanitizeVehicles(vehicles: VehicleMp[]) {
		return vehicles
			.map((vehicle) => ({
				dbid: vehicle.dbid,
				model: vehicle.modelname,
				numberPlate: vehicle.numberPlate,
				spawnPosition: {
					x: vehicle.position.x,
					y: vehicle.position.y,
					z: vehicle.position.z,
				},
				spawnRotation: {
					x: vehicle.rotation.x,
					y: vehicle.rotation.y,
					z: vehicle.rotation.z,
				},
				spawnDimension: vehicle.dimension,
				usedAfterRespawn: vehicle.usedAfterRespawn,
				inventoryTmp: vehicle.inventoryTmp,
				afkTime: vehicle.afkTime,
				needRespawn: vehicle.needRespawn,
				user: vehicle.user,
			}))
			.filter((veh) => veh.spawnDimension !== 0);
	}

	function GetPlayerVehicles(item: BusinessEntity): VehicleMp[] {
		const vehicles: VehicleMp[] = [];

		for (let id = 0; id <= item.upgrade; id++) {
			const dim = parking.getFloorForDimension(item, id);
			const slot = slots.filter((q) => q.d === dim && q.veh);
			const playerCars = slot
				.filter((q) => q.veh.entity.owner === player.dbid)
				.map((q) => q.veh);

			vehicles.push(...playerCars);
		}

		return vehicles;
	}

	function GetParkingFloors(item: BusinessEntity): IParkingFloor[] {
		const floors: IParkingFloor[] = [];

		for (let id = 0; id <= item.upgrade; id++) {
			const dim = parking.getFloorForDimension(item, id);
			const slot = slots.filter((q) => q.d === dim && q.veh);
			const haveCar = slot.find((q) => q.veh.entity.owner === player.dbid);

			const floor: IParkingFloor = {
				dimension: dim,
				serial: id + 1,
				current: dim === player.dimension,
				haveCar: !!haveCar,
				places: `${slot.length} / ${poss.length}`,
				freePlaces: slot.length < poss.length,
			};

			floors.push(floor);
		}

		return floors;
	}

	const ParkingData: IParkingData = {
		id: item.id,
		name: item.name,
		exit:
			player.dimension !== 0
				? [
						new mp.Vector3(
							item.positions[0].x,
							item.positions[0].y,
							item.positions[0].z,
						),
						item.positions[0].h,
						0,
					]
				: null,
		floors: GetParkingFloors(item),
		vehicles: sanitizeVehicles(GetPlayerVehicles(item)),
		singlePayment: system.numberFormat(PARKING_START_COST),
		dailyPayment: system.numberFormat(PARKING_DAY_COST),
		subType: item.sub_type,
	};
	if (ParkingData.vehicles.length === 0) {
		player.notify("Nu ai niciun vehicul în parcare", "error");
		return;
	}
	user.setGui("parking");
	CustomEvent.triggerCef(player, "parking:load", ParkingData);
};

CustomEvent.registerCef(
	"parking:exit",
	(player: PlayerMp, pos: Vector3Mp, heading: number, dimension: number) => {
		player.user.teleport(pos.x, pos.y, pos.z, heading, dimension);
	},
);
CustomEvent.registerCef(
	"parking:spawnVehicle",
	(player: PlayerMp, vehicle: VehicleData) => {
		const item = parking.getParkingFromDimension(vehicle.spawnDimension);
		if (!item) return;

		// Caută vehiculul jucătorului din parcare
		const vehicleFromParking = parking
			.allVehsInAllParking()
			.find((veh) => veh.dbid === vehicle.dbid);

		if (!vehicleFromParking) {
			player.notify("Vehiculul nu a fost gasit in parcare", "error");
			return;
		}

		// Pozitia de iesire (direct afara)
		const exitPos = item.positions[0];

		// Mutam masina direct afara
		vehicleFromParking.position = new mp.Vector3(exitPos.x, exitPos.y, exitPos.z);
		vehicleFromParking.rotation = new mp.Vector3(0, 0, exitPos.h);
		vehicleFromParking.dimension = 0;

		// O deblocam si pornim motorul
		vehicleFromParking.locked = false;
		vehicleFromParking.engine = true;

		// Punem jucatorul direct in masina
		player.putIntoVehicle(vehicleFromParking, 0);

		player.notify("Ai scos vehiculul din parcare", "success");
	},
);


// CustomEvent.registerCef(
// 	"parking:spawnVehicle",
// 	(player: PlayerMp, vehicle: VehicleData) => {
// 		const item = parking.getParkingFromDimension(vehicle.spawnDimension);
// 		if (!item) return;
// 		const zone = parking.getParkingZones(item);
// 		const vehicleFromParking = parking
// 			.allVehsInAllParking()
// 			.find(
// 				(veh) =>
// 					veh.dimension === vehicle.spawnDimension && veh.dbid === vehicle.dbid,
// 			);
// 		if (zone.find((q) => q.veh === vehicleFromParking)) {
// 			vehicleFromParking.position = new mp.Vector3(
// 				item.positions[0].x,
// 				item.positions[0].y,
// 				item.positions[0].z,
// 			);
// 			vehicleFromParking.rotation = new mp.Vector3(0, 0, item.positions[0].h);
// 			vehicleFromParking.dimension = player.dimension;
// 			vehicleFromParking.locked = false;
// 			vehicleFromParking.engine = true;
// 			player.putIntoVehicle(vehicleFromParking, 0);
// 			// setTimeout(() => {
// 				// Vehicle.repair(vehicleFromParking);
// 			// }, system.TELEPORT_TIME + 1000);
// 		}
// 	},
// );

CustomEvent.registerCef(
	"parking:toFloor",
	(player: PlayerMp, dimension: number, sub_type: number) => {
		if (dimension === player.dimension)
			return player.notify(
				player.user.LangString("parking.cc81b17186b1d4ad1901750c9f620e63"),
				"error",
			);
		const pos = sub_type === 0 ? PARKING_EXIT : PARKING_AVIA_EXIT;
		player.user.teleport(pos.x, pos.y, pos.z, player.heading, dimension);
	},
);

CustomEvent.register("newDay", () => {
	const data = parking.allVehsInAllParking();
	const targets = new Map<number, number>();
	const parkingsReward = new Map<number, number>();
	data.map((veh) => {
		if (targets.has(veh.entity.owner)) {
			targets.set(
				veh.entity.owner,
				targets.get(veh.entity.owner) + PARKING_DAY_COST,
			);
		} else {
			targets.set(veh.entity.owner, PARKING_DAY_COST);
		}
		const biz = parking.getParkingFromDimension(veh.entity.position.d);
		if (biz) {
			if (parkingsReward.has(biz.id)) {
				parkingsReward.set(
					biz.id,
					parkingsReward.get(biz.id) + PARKING_DAY_COST,
				);
			} else {
				parkingsReward.set(biz.id, PARKING_DAY_COST);
			}
		}
	});
	targets.forEach((sum, owner) => {
		User.getData(owner).then((data) => {
			if (!data) return;
			if (data.bank_number) {
				User.writeBankNotify(
					owner,
					data.bank_money >= sum ? "remove" : "reject",
					sum,
					langStringDefault("parking.bdd92b4b9b8afa48f6c4e59fe0c4c5f6"),
					langStringDefault("parking.7d8f5562d067b72ff57dd93c60f5aac6"),
				);
				if (data.bank_money >= sum) {
					data.bank_money -= sum;
					data.save();
				}
			}
		});
	});
	parkingsReward.forEach((sum, biz) => {
		business.addMoney(
			biz,
			(sum / 100) * BUSINESS_REWARD_PERCENT,
			langStringDefault("parking.e557013862980efc02be88fb2f6aec57"),
		);
	});
});

mp.events.add("playerEnterVehicle", (player, vehicle, seat) => {
	if (!vehicle) return;
	if (!player.user) return;
	if (!vehicle.dbid) return;
	if (!player.dimension) return;
	if (vehicle.getOccupant(0) !== player) return;
	const item = parking.getParkingFromDimension(vehicle.dimension);
	if (!item) return;
	const zone = parking.getParkingZones(item);
	if (zone.find((q) => q.veh === vehicle)) {
		vehicle.entity.engine = true;
		// player.user.teleportVeh(
		// 	item.positions[0].x,
		// 	item.positions[0].y,
		// 	item.positions[0].z,
		// 	item.positions[0].h,
		// 	0,
		// );
		// setTimeout(() => {
			// Vehicle.repair(vehicle);
		// }, system.TELEPORT_TIME + 1000);
	}
});

export const parking = {
	getFreeSlot: (biz: BusinessEntity | number) => {
		const item = typeof biz === "number" ? business.get(biz) : biz;
		const frees = parking.getParkingZones(item).filter((q) => !q.veh);
		if (frees.length === 0) return null;
		return system.randomArrayElement(frees);
	},
	getParkingZones: (item: BusinessEntity) => {
		const items: {
			x: number;
			y: number;
			z: number;
			h: number;
			d: number;
			veh?: VehicleMp;
		}[] = [];
		const dims: number[] = [];
		for (let id = 0; id <= item.upgrade; id++) {
			dims.push(parking.getFloorForDimension(item, id));
		}
		const allVehs = parking
			.allVehsInAllParking()
			.filter((veh) => dims.includes(veh.entity.position.d));
		const poss = item.sub_type === 0 ? PARKING_CARS : PARKING_AVIA;
		const range = item.sub_type === 0 ? 3 : 8;
		poss.map((pos) => {
			dims.map((d) => {
				items.push({
					...pos,
					d,
					veh: allVehs.find(
						(veh) =>
							veh.entity?.position &&
							d === veh.entity.position.d &&
							system.distanceToPos(veh.entity.position, pos) < range,
					),
				});
			});
		});
		return items;
	},
	allVehsInAllParking: () => {
		return Vehicle.toArray().filter(
			(veh) =>
				veh.entity &&
				!veh.entity.onParkingFine &&
				veh.entity.position &&
				system.isPointInPoints(
					veh.entity.position,
					[...PARKING_CARS, ...PARKING_AVIA],
					10,
				),
		);
	},
	getFloorForDimension: (item: BusinessEntity, floor = 0) => {
		return item.id * PARKING_STEP + floor;
	},
	getParkingFromDimension: (dimension: number) => {
		if (dimension < PARKING_STEP) return null;
		const i = Math.floor(dimension / PARKING_STEP);
		return business.get(i);
	},
};

colshapes.new(
	[PARKING_EXIT, PARKING_AVIA_EXIT],
	(player) =>
		player?.user?.LangString("parking.b885cfa520e6aa58f751e896ee008ca3") ??
		langStringDefault("parking.b885cfa520e6aa58f751e896ee008ca3"),
	(player) => {
		parkingMenu(player);
	},
	{ dimension: -1, type: 27, color: [0, 0, 120, 200] },
);
