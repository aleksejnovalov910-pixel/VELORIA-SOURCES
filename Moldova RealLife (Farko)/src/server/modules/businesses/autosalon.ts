import { langStringDefault } from "../../../shared/lang";
import { BusinessEntity } from "../typeorm/entities/business";
import { menu } from "../menu";
import { business, businessCatalogMenu } from "../business";
import { system } from "../system";
import { getVehicleConfigById, Vehicle } from "../vehicles";
import { CustomEvent } from "../custom.event";
import { AutosalonCarItem } from "../../../shared/autosalon";
import { LicenseName } from "../../../shared/licence";
import { BUSINESS_TYPE } from "../../../shared/business";
import { parking } from "./parking";
import { houses } from "../houses";
import { PARKING_START_COST } from "../../../shared/parking";
import { VEHICLE_FUEL_TYPE } from "../../../shared/vehicles";
import {
	getAchievConfigBiz,
	getAchievConfigByType,
} from "../../../shared/achievements";
import { saveEntity } from "../typeorm";
import {
	canUserStartBizWar,
	createBizMenuBizWarItem,
	startBizWar,
} from "../bizwar";
import { writeClientRatingLog } from "./tablet";
import { inventory } from "../inventory";

const openShop = (player: PlayerMp, item: BusinessEntity) => {
	if (!player.user) return;
	const user = player.user;
	if (item.sub_type === 0) {
		player.user.setGui("rent");
		if (player.rentCar)
			CustomEvent.triggerCef(
				player,
				"rentCar:denied",
				player.rentCar.modelname,
			);
		const rentCars: { name: string; cost: number }[] = [];
		item.catalog.map((car) => {
			const { name } = getVehicleConfigById(car.item);
			rentCars.push({ name: name, cost: car.price });
		});
		CustomEvent.triggerCef(player, "rentCar:open", item.id, rentCars);
		return;
	}
	const catalog: AutosalonCarItem[] = item.catalog
		.filter((car) => getVehicleConfigById(car.item))
		.map((car) => {
			const { name, fuel_type, fuel_max, fuel_min, model, stock } =
				getVehicleConfigById(car.item);
			return {
				...car,
				name,
				fuel_type,
				fuel_max,
				fuel_min,
				model,
				stock,
				parameters: [
					{
						label: "Cilindri",
						choices: 10,
						choice: 8,
					},
					{
						label: "Cauciucuri",
						choices: 8,
						choice: 8,
					},
					{
						label: "Volante",
						choices: 5,
						choice: 2,
					},
					{
						label: "Portbagaj",
						choices: 2,
						choice: 1,
					},
					{
						label: "Geanta",
						choices: 20,
						choice: 15,
					},
				],
			};
		});
	player.dimension = player.id + 1;
	CustomEvent.triggerClient(
		player,
		"autosalon:start",
		item.name,
		item.id,
		catalog,
		item.positions[0],
		item.positions[1],
		item.positions[2],
		item.donate,
		user.family && user.family.isCan(user.familyRank, "buyCar"),
	);
};

CustomEvent.registerClient("server:autosalon:stopBuyCar", (player) => {
	player.dimension = 0;
});

CustomEvent.registerCef("rentCar:stopRent", (player) => {
	const user = player.user;
	if (!user) return;
	if (!player.rentCar) return;
	Vehicle.destroy(player.rentCar);
	player.rentCar = null;
	user.setGui(null);
});

CustomEvent.registerCef(
	"rentCar:rent",
	(player, shopId: number, modelName: string) => {
		const user = player.user;
		if (!user) return;
		const shop = business.get(shopId);
		const car = shop.catalog.find(
			(el) => getVehicleConfigById(el.item).name == modelName,
		);
		if (!car) return;
		const { name, fuel_type, fuel_max, fuel_min, model, stock, license } =
			getVehicleConfigById(car.item);
		if (license && !user.haveActiveLicense(license))
			return player.notify(
				player.user.LangString(
					"autosalon.7a8cff631763c4494cf86adab5c444d8",
					name,
					LicenseName[license],
				),
				"error",
			);
		user
			.tryPayment(
				car.price,
				"all",
				() => {
					return !player.rentCar;
				},
				user.LangString("autosalon.07351cd0e8f8e949744cc018687124d9", name),
				`#${shop.id} ${shop.name}`,
			)
			.then((val) => {
				if (!val) return openShop(player, shop);
				const veh = Vehicle.spawn(
					model,
					new mp.Vector3(
						shop.positions[1].x,
						shop.positions[1].y,
						shop.positions[1].z,
					),
					shop.positions[1].h,
					player.dimension,
					true,
					false,
				);
				veh.rentCar = true;
				veh.rentCarOwner = user.id;
				veh.usedAfterRespawn = true;
				player.rentCar = veh;
				let sumBiz = car.price * 0.3;
				sumBiz = sumBiz + (sumBiz / 100) * (shop.upgrade * 10);
				business.addMoney(
					shop,
					sumBiz,
					player.user.LangString(
						"autosalon.ec1143f0713ae13857ef6bcb41b1aa86",
						name,
						user.name,
						user.id,
					),
				);
				player.user.achiev.setAchievTickBiz(
					shop.type,
					shop.sub_type,
					car.price,
				);
				setTimeout(() => {
					if (mp.players.exists(player) && mp.vehicles.exists(veh))
						player.user.putIntoVehicle(player.rentCar, 0);
				}, 100);
				user.setGui(null);
			});
	},
);

CustomEvent.registerClient(
	"autosalon:buyCar",
	async (
		player,
		itemId: number,
		shopId: number,
		primary: { r: number; g: number; b: number },
		secondary: { r: number; g: number; b: number },
		isFamilyMoney: boolean,
	) => {
		if (!player.user) return;
		const user = player.user;
		let shop = business.get(shopId);
		if (!shop) return;
		if (shop.type !== BUSINESS_TYPE.VEHICLE_SHOP) return;
		if (user.myVehicles.find((veh) => veh.onParkingFine))
			return player.notify(
				player.user.LangString("autosalon.f2297924e94b2f07019aae5d6e6c3de1"),
				"error",
			);
		const conf = shop.catalog.find((q) => q.item == itemId);
		if (!conf || !conf.price)
			return player.notify(
				player.user.LangString("autosalon.0a3974e6e1c234fb29c28e1717f6eaac"),
				"error",
			);
		if (!conf.count)
			return player.notify(
				player.user.LangString("autosalon.7c5d22c7efb06241777bbc262010c1f4"),
				"error",
			);
		// const pos = user.getFreeVehicleSlot()
		// if(!pos) return player.notify("Для покупки транспорта необходим собственный дом с свободным местом в гараже, либо свободное парковочное место", "error");
		const vehConf = getVehicleConfigById(itemId);
		if (!vehConf) return;
		if (vehConf.license && !user.haveActiveLicense(vehConf.license))
			return player.notify(
				player.user.LangString(
					"autosalon.9167a8c164647a1171f4e7a6f8dc50c5",
					vehConf.name,
					LicenseName[vehConf.license],
				),
				"error",
			);
		if (isFamilyMoney) {
			if (!user.family || !user.family.canBuyMoreCar)
				return player.notify(
					player.user.LangString("autosalon.d4a8328814a75398bfd84f4e341008cb"),
					"error",
				);
		} else {
			if (user.myVehicles.length >= user.current_vehicle_limit)
				return player.notify(
					player.user.LangString(
						"autosalon.033945b681cbe900d156b59a739939d8",
						user.current_vehicle_limit,
					),
					"error",
				);
		}
		const air = vehConf.fuel_type === VEHICLE_FUEL_TYPE.AIR;
		if (air && isFamilyMoney) {
			const airVeh = Vehicle.getFamilyVehicles(user.familyId).filter(
				(q) => q.avia,
			);
			if (airVeh.length > 0)
				return player.notify(
					player.user.LangString("autosalon.0c36c5149c6c171ebb02178044e0abd8"),
					"error",
				);
		}
		let place = await Vehicle.selectParkPlace(player, air, isFamilyMoney);
		if (!place)
			return player.notify(
				player.user.LangString("autosalon.d735cfd881a2429644b823312eaabcfd"),
				"error",
			);
		const getParkPos = () => {
			if (place.type === "house") {
				return houses.getFreeVehicleSlot(
					place.id,
					vehConf.fuel_type === VEHICLE_FUEL_TYPE.AIR,
				);
			} else {
				return parking.getFreeSlot(place.id);
			}
		};

		const success = () => {
			shop.removeItemCountByItemId(conf.item, 1);
			saveEntity(shop);
			const pos = getParkPos();
			const { x, y, z, d, h } = pos
				? pos
				: { x: 0, y: 0, z: 0, d: Vehicle.fineDimension, h: 0 };
			Vehicle.createNewDatabaseVehicle(
				player,
				itemId,
				primary,
				secondary,
				new mp.Vector3(x, y, z),
				h,
				d,
				conf.price,
				shop.donate,
				isFamilyMoney,
			).then(async (veh) => {
				let points = shop.positions.filter((_, index) => index >= 3);
				let nearestvehs = Vehicle.toArray()
					.filter(
						(veh) =>
							veh.dimension == 0 &&
							system.isPointInPoints(veh.position, points, 10),
					)
					.map((veh) => veh.position);
				let freePoint = points.find(
					(point) => !system.isPointInPoints(point, nearestvehs, 3),
				);
				if (!freePoint)
					freePoint = Vehicle.findFreeParkingZone(
						new mp.Vector3(points[0].x, points[0].y, points[0].z),
						200,
					);
				if (pos && place.type === "parking") {
					if (
						!user.tryRemoveBankMoney(
							PARKING_START_COST,
							true,
							user.LangString("autosalon.ea0fde185b782a43107bff3388945f85"),
							user.LangString(
								"autosalon.d0eaee300263be9735b8e7cbc1dce90e",
								place.id,
							),
						) &&
						!user.removeMoney(
							PARKING_START_COST,
							true,
							user.LangString("autosalon.ea0fde185b782a43107bff3388945f85"),
						)
					) {
						veh.moveToParkingFine(0);
						player.notify(
							player.user.LangString(
								"autosalon.151d652849bef6d67f77c5a220f4833e",
							),
							"error",
							null,
							15000,
						);
						return;
					}
				}
				veh.engine = false;
				veh.locked = true;
				if (freePoint) {
					Vehicle.teleport(
						veh.vehicle,
						new mp.Vector3(freePoint.x, freePoint.y, freePoint.z),
						freePoint.h,
						0,
					);
					veh.vehicle.usedAfterRespawn = true;
					player.notify(
						player.user.LangString(
							"autosalon.cc748835943da23c81b0a95168994851",
						),
						"success",
						player.user.LangString(
							"autosalon.052306732e8888c2fff54e10cee3c5df",
						),
					);
					if (system.distanceToPos(shop.positions[0], freePoint) > 20)
						user.setWaypoint(
							freePoint.x,
							freePoint.y,
							freePoint.z,
							user.LangString("autosalon.0aa6d528ad59700a75c06a42e664a17b"),
							true,
						),
							player.notify(
								player.user.LangString(
									"autosalon.f9c55000b3b15566e2914fbad35fdb59",
								),
							);
				} else {
					player.notify(
						player.user.LangString(
							"autosalon.887fd46508bb39accb038ade1f1a8ecc",
						),
						"success",
						player.user.LangString(
							"autosalon.b9c9ce56b7e07b4e8c024558f3373abb",
						),
					);
				}
				player.notify(
					player.user.LangString("autosalon.e852981b05333bff3b1e040923404a55"),
					"info",
					player.user.LangString("autosalon.2655998c86496bc0e1991df0fc5db051"),
				);
			});
		};
		if (isFamilyMoney) {
			const family = user.family;
			if (!family) return;
			if (!family.isCan(user.familyRank, "buyCar")) return;
			if (shop.donate) {
				if (family.donate < conf.price)
					return player.notify(
						player.user.LangString(
							"autosalon.1bb9748c3c4667ab5f2b5a52830568b4",
						),
						"error",
					);
				family.removeDonateMoney(
					conf.price,
					player,
					player.user.LangString(
						"autosalon.c14c517e81bf3c2e195621e0635729bc",
						vehConf.name,
					),
				);
			} else {
				if (family.money < conf.price)
					return player.notify(
						player.user.LangString(
							"autosalon.9898bd5b8f3b5310affc6b3bfcfa4206",
						),
						"error",
					);
				family.removeMoney(
					conf.price,
					player,
					player.user.LangString(
						"autosalon.e07716f507d6d16ea4040308490a1168",
						vehConf.name,
					),
				);
			}
			success();
			writeClientRatingLog(player, shopId, conf.price, vehConf.name, 1);
		} else {

			const item = user.inventory.find((item) => item.item_id == 40000);
			const discount = item ? 10 : 0;

			user
				.tryPayment(
					conf.price - (conf.price * discount / 100),
					shop.donate ? "donate" : "all",
					() => {
						const conf = shop.catalog.find((q) => q.item == itemId);
						if (!conf || !conf.price) {
							player.notify(
								player.user.LangString(
									"autosalon.f6eadd29294c5b480da6b5cf4e1c7be0",
								),
								"error",
							);
							return false;
						}
						if (!conf.count) {
							player.notify(
								player.user.LangString(
									"autosalon.02d9e2557202646cc77777074d4b72d0",
								),
								"error",
							);
							return false;
						}
						return !!getParkPos();
					},
					`buyCar ${vehConf.name}`,
					`#${shop.id} ${shop.name}`,
				)
				.then((status) => {
					if (!status) return;
					success();

					if (item) {
						inventory.deleteItem(item, item.owner_type, item.owner_id, true);
					}

					writeClientRatingLog(player, shopId, conf.price, vehConf.name, 1);
					if (!shop.donate)
						player.user.achiev.setAchievTickBiz(
							shop.type,
							shop.sub_type,
							conf.price,
						);
				});
		}
	},
);

export const autosalonMenu = (player: PlayerMp, item: BusinessEntity) => {
	if (!player.user) return;
	const user = player.user;
	if (
		!user.isAdminNow(6) &&
		item.userId !== user.id &&
		!canUserStartBizWar(user)
	)
		return openShop(player, item);
	let m = menu.new(
		player,
		"",
		user.isAdminNow(6)
			? player.user.LangString(
					"autosalon.236f11b101f2abacad8bfdc56b053f5d",
					item.id,
				)
			: "",
	);
	let sprite = "";

	m.newItem({
		name: langStringDefault("autosalon.3a843a15ca238162af91c9f6d8ccea08"),
		onpress: () => {
			m.close();
			openShop(player, item);
		},
	});

	createBizMenuBizWarItem(user, m, item);

	if (user.isAdminNow(6) || item.userId === user.id) {
		m.newItem({
			name: langStringDefault("autosalon.780aad9dd5b2c6052010ca1cffe0273b"),
			onpress: () => {
				businessCatalogMenu(player, item, () => {
					autosalonMenu(player, item);
				});
			},
		});
	}

	m.open();
};
