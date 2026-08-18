import { LangString, langStringDefault } from "./lang";
import { CustomEvent } from "./custom.event";
import { user } from "./user";
import { system } from "./system";
import { randomArrayElement } from "../../shared/arrays";
import { colshapes } from "./checkpoints";
import { doJobNow } from "./jobs";
import { TextTimerBar } from "./bars/classes/TextTimerBar";
import { DialogAccept } from "./accept";
import { dispatch } from "./dispatch";
import {
	DO_JOB_FOOD_MULTIPLER,
	DO_JOB_WATER_MULTIPLER,
	HEAL_ZONE_POS,
	hospital_anim,
	hospitalPos,
	HP_FOOD_RATE,
	HP_MINUS_RATE,
	HP_TOTAL_FOOD_WATER_RATE,
	HP_WATER_RATE,
	WATER_RATE,
} from "../../shared/survival";
import { QUICK_HEAL_COST } from "../../shared/economy";
import {
	getIllConfig,
	HEAL_MEDIC_POSITION,
	illData,
	type IllId,
} from "../../shared/ill";
import { MenuClass } from "./menu";
import { MARKERS_SETTINGS } from "../../shared/markers.settings";
import { anticheatProtect } from "./protection";
import { isOnAnyCargoBattle } from "./family.cargobattle";
import { gui } from "./gui";
import { getVipConfig } from "../../shared/vip";
import type { guiNames } from "../../shared/gui";
import { CamerasManager } from "./cameraManager";

const player = mp.players.local;
export const survival = {
	food: 0,
	water: 0,
};
let currentRespawnHash: string;
const currentRespawnHashCode = system.randomStr(10);

let currentHealHash: string;
const currentHealHashCode = system.randomStr(10);
CustomEvent.registerServer("survival:init", (food: number, water: number) => {
	survival.food = food;
	survival.water = water;
});

const selectIll = (heal = false): Promise<IllId> => {
	return new Promise((resolve) => {
		const m = new MenuClass(
			LangString("survival.42eaa1b3741029c9c93f2eba1735c888"),
		);
		m.onclose = () => {
			resolve(null);
		};

		m.workAnyTime = true;
		m.exitProtect = true;
		illData.map((ill) => {
			m.newItem({
				name: ill.name,
				more: heal
					? LangString(
							"survival.6439ace1115753e2065c3afc59701d15",
							system.numberFormat(ill.healByMedicCostPerOne),
						)
					: "",
				onpress: () => {
					m.close();
					resolve(ill.id);
				},
			});
		});

		m.open();
	});
};

colshapes.new(
	HEAL_MEDIC_POSITION,
	LangString("survival.795bf22cfaf9d450133e824072381704"),
	() => {
		if (user.fraction !== 16)
			return user.notify(
				LangString("survival.b1f13535a062c46e387c0ad99a8e88ef"),
				"error",
			);
		const m = new MenuClass(
			LangString("survival.82c7da7e1b1b8e3a3cd691d69beb302b"),
		);
		m.newItem({
			name: LangString("survival.7bbd70f3b71a28ed1d83822b86ae3cc6"),
			desc: LangString("survival.46391d3ff512d908f90114d40af3247d"),
			onpress: () => {
				const target = user.getNearestPlayer();
				if (!target)
					return user.notify(
						LangString("survival.73cdc8af130a9df0d640324e254167e4"),
						"error",
					);
				CustomEvent.callServer("illdata:data", target.remoteId).then(
					(res: { [p: string]: number }) => {
						if (!res) return;
						const s = new MenuClass(
							LangString("survival.8b4f3534b213a3bdc98f9577e7e5ea28"),
						);

						for (const q in res) {
							const data = getIllConfig(q as IllId);
							if (data) {
								const val = res[q];
								const valV = (val / 10).toFixed(0);
								const valVM = (data.max / 10).toFixed(0);
								const valVC = (data.critical / 10).toFixed(0);
								const cost = data.healByMedicCostPerOne * val;
								s.newItem({
									name: `${data.name}`,
									more: LangString(
										"survival.cbd0a8620e4628f6de3511af38a0109a",
										valV,
										valVM,
									),
									desc: LangString(
										"survival.f544387ecdc0a3c5cf4a629bb5ade6ec",
										valV,
										valVM,
										valVC,
									),
									onpress: () => {
										DialogAccept(
											LangString(
												"survival.2f392c0dc4ef624afe096b5dc29901d3",
												cost,
											),
											"small",
											20000,
										).then((status) => {
											if (!status) return;
											CustomEvent.triggerServer(
												"illdata:heal",
												target.remoteId,
												data.id,
												cost,
											);
										});
									},
								});
							}
						}

						s.open();
					},
				);
			},
		});
		m.open();
	},
);

HEAL_ZONE_POS.map((item) => {
	colshapes.new(
		item,
		`${langStringDefault("interaction.8233af0e55dacdab5aa6cdf4d1e9ec65")} $${system.numberFormat(QUICK_HEAL_COST.AUTO)}`,
		async () => {
			// if (healTimer <= 0)
			// 	return user.notify(
			// 		LangString("survival.b7f6e9768c95c7310cb90768c53b9bac"),
			// 		"error",
			// 	);
			const sum = (await user.haveActiveLicense("med"))
				? QUICK_HEAL_COST.AUTO_LICENSE
				: QUICK_HEAL_COST.AUTO;
			DialogAccept(
				LangString(
					"survival.18caa6eda471e787593ea5dab4d12c9c",
					system.numberFormat(sum),
				),
				"big",
			).then((status) => {
				if (!status) return;
				// if (healTimer <= 0)
				// 	return user.notify(
				// 		LangString("survival.ce705c88413e08f6cb25721468aa254a"),
				// 		"error",
				// 	);
				if (user.money < sum)
					return user.notify(
						LangString("survival.69ac8ecb0b3a7ba69ac1d3e583079a92"),
						"error",
					);
				CustomEvent.callServer("heal:payauto").then((q) => {
					if (!q) return;
					setHealTimer(30);
					user.notify(
						LangString("survival.52b42f8be87052caa0934d19c2411df5"),
						"success",
					);
				});
			});
		},
		{
			radius: 1,
			type: 27,
			colshapeRadius: 3,
			color: [255, 182, 193, 200],
		},
	);
});

const exitHealtProtect = [
	new mp.Vector3(346.12, -592.85, 28.79),
	new mp.Vector3(350.62, -581.76, 28.79),
	new mp.Vector3(320.41, -561.42, 28.78),
];

exitHealtProtect.map((pos) => {
	const shape = colshapes.new(
		pos,
		null,
		() => {
			if (healTimer <= 0) return;
			const pos = getNearestHealPoint();
			anticheatProtect("heal");
			CustomEvent.triggerServer("heal:tryrun", pos.x, pos.y, pos.z, pos.h);
		},
		{
			color: [0, 0, 0, 0],
			onenter: true,
		},
	);
});

const startTimer = 120;

CustomEvent.registerServer("hospital:healTimer", () => {
	return healTimer;
});
CustomEvent.registerServer("hospital:clearHealTimer", () => {
	if (healTimer)
		user.notify(
			LangString("survival.0569cf494164fcb7b567622242d811a8"),
			"success",
		);
	setHealTimer(0);
	return true;
});

export let hospitalTimer = -1;
export let automaticRespawnTimer = -1;
let qs: string;

let triggerDeath = false;

CustomEvent.registerServer(
	"player:dead",
	(killerName: string, killerId: number) => {
		if (
			mp.players.local.wasKilledByTakedown() &&
			user.login &&
			gui.currentGui !== "spawn"
		) {
			setTimeout(() => callDeath(killerName, killerId), 3500);
		} else {
			callDeath(killerName, killerId);
		}
	},
);

setInterval(() => {
	if (player.getHealth() > 0) {
		triggerDeath = false;
	} else if (!triggerDeath) {
		callDeath();
	}
}, 10000);

const deathWantedLevel = 0;

mp.events.add("gui:menuClosed", async (menu: guiNames) => {
	if (player.isDead()) {
		CustomEvent.triggerCef("deathpopup:show", true);
	}
});

const deathCamera = CamerasManager.hasCamera("death")
	? CamerasManager.getCamera("death")
	: CamerasManager.createCamera(
			"death",
			"default",
			mp.players.local.position,
			new mp.Vector3(-90, 0, 0),
			50,
		);

const mouseSensitivity = 6;

function deathCameraRender() {
// mp.events.add("render", () => {
	if (
		deathCamera?.isActive() &&
		deathCamera.isRendering() &&
		!mp.gui.cursor.visible
	) {
		mp.game.controls.disableAllControlActions(2);

		const x =
			mp.game.controls.getDisabledControlNormal(7, 1) * mouseSensitivity;
		const y =
			mp.game.controls.getDisabledControlNormal(7, 2) * mouseSensitivity;

		let currentRot = deathCamera.getRot(2);

		currentRot = new mp.Vector3(currentRot.x - y, 0, currentRot.z - x);

		deathCamera.setRot(currentRot.x, currentRot.y, currentRot.z, 2);
	}
};

const callDeath = async (killerName?: string, killerId?: number) => {
	if (!user.login) return;
	if (gui.currentGui === "spawn") return;

	if (triggerDeath) return;
	triggerDeath = true;

	CustomEvent.triggerServer("death:toggle", true);

	setDeathTimer(600);
	
	const qs2 = system.randomStr(10);
	qs = `${qs2}`;

	if (!player.dimension && !isOnAnyCargoBattle()) {
		deathCamera.setCoord(
			mp.players.local.position.x,
			mp.players.local.position.y,
			mp.players.local.position.z + 1,
		);
		CamerasManager.setActiveCamera(deathCamera, true);
		mp.events.add("render", deathCameraRender);

		CustomEvent.triggerCef("deathpopup:show", true);
		
		if (killerName && killerId) {
			CustomEvent.triggerCef("deathpopup:setKillerName", killerId, killerName);
		} else if (killerId) {
			CustomEvent.triggerCef("deathpopup:setKillerId", killerId);
		} else {
			CustomEvent.triggerCef("deathpopup:setSuicide");
		}

		while (player.isDead()) await system.sleep(100);

		CamerasManager.setActiveCamera(deathCamera, false);
		mp.events.remove("render", deathCameraRender);
		CustomEvent.triggerCef("deathpopup:show", false);
	} else {
		setDeathTimer(5);
	}
};

mp.events.add("deathpopup:accept", () => {
	mp.console.logInfo('deathpopup:accept called');

	const posvec = getNearestHealPoint();
	
	CustomEvent.triggerCef("deathpopup:show", false);
	
	reviveTimer = 0;
	hospitalTimer = 0;
	automaticRespawnTimer = 0;
	
	CamerasManager.setActiveCamera(deathCamera, false);
	mp.events.remove("render", deathCameraRender);
	
	anticheatProtect("heal");
	
	CustomEvent.triggerServer("survival:death", posvec.x, posvec.y, posvec.z);
	CustomEvent.triggerServer("death:toggle", false);
	
	currentRespawnHash = null;
})

export let healTimer = 0;
CustomEvent.registerServer("heal:start", (time: number) => {
	healTimer = time;
	currentHealHash = system.encryptCodes(
		healTimer.toString(),
		currentHealHashCode,
	);
	user.notify(
		LangString("survival.63c4a39afd298641dbf6e641d74b868d"),
		"info",
		null,
		12000,
	);

	mp.players.local.freezePosition(true);
	user.playAnim(hospital_anim.seq, hospital_anim.upper, hospital_anim.loop);
});

setInterval(() => {
	if (!user.login) return;
	if (!player.isDead() && deathCamera.isActive() && reviveTimer === 0) {
		CamerasManager.setActiveCamera(deathCamera, false);
		mp.events.remove("render", deathCameraRender);
		CustomEvent.triggerCef("deathpopup:show", false);
	}
	if (healTimer <= 0) return;
	setHealTimer(healTimer - 1);
	const vipdata = user.vipData;
	if (!vipdata || !vipdata.healmultipler) return;
	if (healTimer <= 5) return;
	setTimeout(() => {
		if (healTimer <= 5) return;
		setHealTimer(healTimer - 1);
	}, 500);
}, 1000);

export const getNearestHealPoint = () => {
	let posid = 0;
	let posvec: Vector3Mp;
	let heading = 0;

	hospitalPos.map((item, index) => {
		if (!index) {
			const i = randomArrayElement(item);
			posvec = new mp.Vector3(i.x, i.y, i.z);

		} else if (
			system.distanceToPos2D(item[0], player.position) <
			system.distanceToPos2D(posvec, player.position)
		) {
			const i = randomArrayElement(item);
			posvec = new mp.Vector3(i.x, i.y, i.z);
			heading = i.h;
			posid = index;
		}
	});
	return {
		...posvec,
		h: heading,
	};
};

const healerTimer = new TextTimerBar(
	LangString("survival.dc892c04ed42f8859f4af1c26df918f5"),
	"",
);
healerTimer.hidden = true;
const setHealTimer = (time: number) => {
	let hack = false;
	if (currentHealHash && healTimer) {
		if (
			currentHealHash !==
			system.encryptCodes(healTimer.toString(), currentHealHashCode)
		) {
			healTimer = 1000;
			hack = true;
			user.cheatDetect(
				"memory",
				LangString("survival.6d19baf64d21791e92ab7e3f9bd2f02d"),
			);
			CustomEvent.triggerServer("heal:setTime", healTimer);
		}
	}
	if (!hack) healTimer = time;
	currentHealHash = system.encryptCodes(
		healTimer.toString(),
		currentHealHashCode,
	);
	if (healTimer === 0) {
		healerTimer.hidden = true;
		user.notify(
			LangString("survival.ab3566ddf5ed56890c26d6e5df15f001"),
			"success",
		);
		currentHealHash = null;
		CustomEvent.triggerServer("heal:end");

		mp.players.local.freezePosition(false);
		user.stopAnim();

		return;
	}
	else {
		if (!mp.players.local.isPlayingAnim(hospital_anim.seq[0][0], hospital_anim.seq[0][1], 3)) {
			
		const pos = getNearestHealPoint();

		mp.players.local.setCoords(pos.x, pos.y, pos.z, true, true, true, true);
		mp.players.local.setHeading(pos.h);

		mp.players.local.freezePosition(true);
		user.playAnim(hospital_anim.seq, hospital_anim.upper, hospital_anim.loop);
		}
	}
	if (healTimer % 30 === 0) {
		CustomEvent.triggerServer("heal:setTime", healTimer);
	}
	const pos = getNearestHealPoint();
	if (system.distanceToPos2D(player.position, pos) > 200 || !user.inInterrior) {
		anticheatProtect("heal");
		CustomEvent.triggerServer("heal:tryrun", pos.x, pos.y, pos.z, pos.h);
	}
	healerTimer.text = system.secondsToString(time);
	healerTimer.hidden = false;
};

let reviveTimer = 0;

const setDeathTimer = (time: number) => {
	let hack = false;
	if (hospitalTimer && currentRespawnHash) {
		if (
			currentRespawnHash !==
			system.encryptCodes(hospitalTimer.toString(), currentRespawnHashCode)
		) {
			user.cheatDetect(
				"memory",
				LangString("survival.c54c516a21a4b3fff4c80cf255ebc6ff"),
			);
			hospitalTimer = 1000;
			hack = true;
		}
	}
	if (!hack) {
		hospitalTimer = time;
		automaticRespawnTimer = time * 2;
	}
	currentRespawnHash = system.encryptCodes(
		hospitalTimer.toString(),
		currentRespawnHashCode,
	);
	if (time <= 0) {
		CustomEvent.triggerCef("deathpopup:show", false);
		CamerasManager.setActiveCamera(deathCamera, false);
		mp.events.remove("render", deathCameraRender);
		reviveTimer = 0;
	} else reviveTimer = time;
	
	if (time > 0) {
		CustomEvent.triggerCef("deathpopup:setTime", hospitalTimer, automaticRespawnTimer);
	}
	
	mp.game.gameplay.disableAutomaticRespawn(true);
	mp.game.gameplay.ignoreNextRestart(true);
	mp.game.gameplay.setFadeInAfterDeathArrest(true);
	mp.game.gameplay.setFadeOutAfterDeath(false);
};

setInterval(() => {
	if (!user.login) return;
	if (hospitalTimer <= 0 && automaticRespawnTimer <= 0) return;
	if (!user.dead) {
		reviveTimer = 0;
		hospitalTimer = 0;
		automaticRespawnTimer = 0;
		return;
	}

	if (hospitalTimer > 0) {
		hospitalTimer--;
	}
	if (automaticRespawnTimer > 0) {
		automaticRespawnTimer--;
	}

	CustomEvent.triggerCef("deathpopup:setTime", hospitalTimer, automaticRespawnTimer);

	if (automaticRespawnTimer <= 0) {
		const posvec = getNearestHealPoint();
		if (!player.isDead()) CustomEvent.triggerCef("deathpopup:show", false);
		reviveTimer = 0;
		anticheatProtect("heal");
		CustomEvent.triggerServer("survival:death", posvec.x, posvec.y, posvec.z);
		CustomEvent.triggerServer("death:toggle", false);
		hospitalTimer = -1;
		automaticRespawnTimer = -1;
		currentRespawnHash = null;
	}
}, 1000);

setInterval(() => {
	if (!user.login) return;
	if (user.isAdminNow()) return;
	let waterMinus = 0.01;
	let foodMinus = 0.01;
	if (player.isSprinting()) waterMinus += WATER_RATE.SPRINTING;
	if (player.isRunning()) waterMinus += WATER_RATE.RUNNING;
	if (player.isStrafing()) waterMinus += WATER_RATE.STRAFING;
	if (player.isSwimming()) waterMinus += WATER_RATE.SWIMMING;
	if (player.isSwimmingUnderWater()) waterMinus += WATER_RATE.DIVING;

	if (survival.water < 0) survival.water = 0;

	if (player.isSprinting()) foodMinus += WATER_RATE.SPRINTING;
	if (player.isRunning()) foodMinus += WATER_RATE.RUNNING;
	if (player.isStrafing()) foodMinus += WATER_RATE.STRAFING;
	if (player.isSwimming()) foodMinus += WATER_RATE.SWIMMING;
	if (player.isSwimmingUnderWater()) foodMinus += WATER_RATE.DIVING;

	if (doJobNow) {
		waterMinus *= DO_JOB_WATER_MULTIPLER;
		foodMinus *= DO_JOB_FOOD_MULTIPLER;
	}
	survival.water -= waterMinus;
	survival.food -= foodMinus;
	if (survival.water < 0) survival.water = 0;
	if (survival.food < 0) survival.food = 0;
}, 1000);

setInterval(() => {
	try {
		if (!user.login) return;
		if (user.isAdminNow()) return;
		let hp = 0;
		if (survival.water === 0) hp += HP_WATER_RATE;
		if (survival.food === 0) hp += HP_FOOD_RATE;
		if (survival.water === 0 && survival.food === 0)
			hp += HP_TOTAL_FOOD_WATER_RATE;
		if (hp === 0) return;
		player.setHealth(Math.trunc(100 + player.getHealth() - hp));
	} catch (err) {
		let hp = 0;
		if (survival.water === 0) hp += HP_WATER_RATE;
		if (survival.food === 0) hp += HP_FOOD_RATE;
		if (survival.water === 0 && survival.food === 0)
			hp += HP_TOTAL_FOOD_WATER_RATE;
		if (hp === 0) return;
		CustomEvent.triggerServer(
			"srv:log",
			`HP: ${Math.trunc(100 + player.getHealth() - hp)}`,
		);
	}
}, HP_MINUS_RATE * 1000);

setInterval(() => {
	if (!user.login) return;
	if (user.isAdminNow()) return;
	CustomEvent.triggerServer("survival:sync", survival.food, survival.water);
}, 120000);

let hp = mp.players.local.getHealth();

CustomEvent.registerServer("survival:setHP", (count: number) => {
	mp.players.local.setHealth(count + 100);
});

setInterval(() => {
	const health = mp.players.local.getHealth();
	if (hp === health) return;
	CustomEvent.triggerServer("survival:updateHealth", health);
	hp = health;
}, 500);

setInterval(() => {
	if (!user.login) return;
	const health = mp.players.local.getHealth();
	const armour = mp.players.local.getArmour();
	const food = survival.food / 10;
	const water = survival.water / 10;
	CustomEvent.triggerCef("hud:updateStats", health, armour, food, water);
}, 1000);
