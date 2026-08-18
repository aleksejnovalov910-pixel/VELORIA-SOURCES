// Lang file ready
import {
	CAMERA_LOADING_SCREEN_SCENES,
	LOADING_SCREEN_SELECTED_SCENE,
} from "../../shared/cameraLoadingScreen";
import { system } from "./system";
import { playAnimsEntity } from "./anim";
import { CamerasManager, drawCameraConf } from "./cameraManager";
import { cameraManager } from "./camera";
import { sound } from "./sound";
import { CustomEvent } from "./custom.event";

export let loadScreenEnd = false;

const renderLoadingCamera = () => {
	return new Promise<any>(async (resolve) => {
		let done = false;
		const destroyCam = () => {
			if (camera && camera.doesExist()) {
				camera.setActive(false);
				camera.destroy();
			}
			camera = undefined as any;
		};
		const destroy = async (loaded = false) => {
			if (done) return;
			done = true;
			mp.game.cam.doScreenFadeOut(0);
			if (check) clearInterval(check);
			if (loaded) await system.sleep(200);

			[...vehs, ...peds].forEach((entity) => {
				entity.destroy();
			});
			mp.players.local.resetAlpha();
			destroyCam();
			if (cfg.loadIPL) {
				cfg.loadIPL.forEach((ipl) => {
					if (!removeIPLS.includes(ipl)) {
						mp.game.streaming.removeIpl(ipl);
					}
				});
			}
			if (cfg.disableStaticEmitters) {
				cfg.disableStaticEmitters.forEach((audio) => {
					mp.game.audio.setStaticEmitterEnabled(audio, true);
				});
			}
			resolve(true);
		};
		const check = setInterval(() => {
			if (loadScreenEnd) {
				destroy(true);
			}
		}, 10);

		let peds: PedMp[] = [];
		let vehs: VehicleMp[] = [];

		const cfg =
			CAMERA_LOADING_SCREEN_SCENES.find(
				(q) => q.id === LOADING_SCREEN_SELECTED_SCENE,
			) || CAMERA_LOADING_SCREEN_SCENES[0];

		if (cfg.mainMenu.playerPos)
			mp.players.local.position = new mp.Vector3(
				cfg.mainMenu.playerPos.x,
				cfg.mainMenu.playerPos.y,
				cfg.mainMenu.playerPos.z,
			);
		mp.players.local.setAlpha(0);
		let removeIPLS: string[] = [];
		if (cfg.loadIPL) {
			cfg.loadIPL.forEach((ipl) => {
				if (mp.game.streaming.isIplActive(ipl)) removeIPLS.push(ipl);
				mp.game.streaming.requestIpl(ipl);
			});
		}
		if (cfg.disableStaticEmitters) {
			cfg.disableStaticEmitters.forEach((audio) => {
				mp.game.audio.setStaticEmitterEnabled(audio, false);
			});
		}

		if (cfg.peds)
			cfg.peds.forEach(async (item) => {
				mp.game.streaming.requestModel(mp.game.joaat(item.model));
				while (!mp.game.streaming.hasModelLoaded(mp.game.joaat(item.model)))
					await mp.game.waitAsync(2);
				const entity = mp.peds.new(
					mp.game.joaat(item.model),
					new mp.Vector3(item.position.x, item.position.y, item.position.z),
					typeof item.rotation === "number" ? item.rotation : item.rotation.z,
					mp.players.local.dimension,
				);

				while (!entity.doesExist()) await mp.game.waitAsync(2);
				entity.setDiesInWater(false);
				entity.setInvincible(true);
				if (item.variations) {
					item.variations.forEach((q) => {
						entity.setComponentVariation(
							q.componentId,
							q.drawableId || 0,
							q.textureId || 0,
							2,
						);
					});
				}
				if (item.animation)
					playAnimsEntity(
						entity,
						[[item.animation.animDict, item.animation.animName]],
						false,
						true,
					);
				else if (item.scenario)
					entity.taskStartScenarioInPlace(item.scenario, 0, false);

				peds.push(entity);
			});
		if (cfg.vehicles)
			cfg.vehicles.forEach(async (item) => {
				mp.game.streaming.requestModel(mp.game.joaat(item.model));
				while (!mp.game.streaming.hasModelLoaded(mp.game.joaat(item.model)))
					await mp.game.waitAsync(2);

				const entity = mp.vehicles.new(
					mp.game.joaat(item.model),
					new mp.Vector3(item.position.x, item.position.y, item.position.z),
					{
						heading: item.heading || item.rotation?.z || 0.0,
						dimension: mp.players.local.dimension,
						numberPlate: item.numberPlate || undefined,
					},
				);

				while (!entity.doesExist()) await mp.game.waitAsync(2);

				if (item.colors) {
					entity.setColours(item.colors[0], item.colors[1]);
				}
				if (item.freezePosition) {
					entity.freezePosition(item.freezePosition);
				}
				if (item.lights) {
					entity.setLights(item.lights);
				}
				// if(item.numberPlate){
				//     entity.setNumberPlateText(item.numberPlate);
				// }
				if (item.engine) {
					entity.setEngineOn(item.engine, true, true);
				}
				if (item.dirt) {
					entity.setDirtLevel(item.dirt);
				}
				if (item.doors) {
					Object.entries(item.doors).forEach(([doorIndex, state]) => {
						entity.setDoorOpen(
							typeof doorIndex === "string" ? parseInt(doorIndex) : doorIndex,
							state,
							state,
						);
					});
				}
				if (item.modkit) {
					entity.setModKit(item.modkit);
				}
				if (item.tuning) {
					Object.entries(item.tuning).forEach(([modId, state]) => {
						entity.setMod(
							typeof modId === "string" ? parseInt(modId) : modId,
							state,
						);
					});
				}

				vehs.push(entity);
			});

		if (cfg.mainMenu.time)
			mp.game.time.setClockTime(
				cfg.mainMenu.time.hour,
				cfg.mainMenu.time.minute,
				cfg.mainMenu.time.second,
			);

		if (cfg.mainMenu.weather) {
			mp.game.gameplay.setWeatherTypeNow(cfg.mainMenu.weather);
			mp.game.gameplay.setOverrideWeather(cfg.mainMenu.weather);
		}

		const camCFG = cfg.mainMenu.splashScreen;
		let camera: CameraMp;
		const scenes = camCFG.shuffleScenes
			? system.shuffleArray(camCFG.camScenes)
			: camCFG.camScenes;
		for (const scene of scenes) {
			if (done) return;
			mp.game.cam.doScreenFadeIn(700);
			const duration = scene.duration || camCFG.defaultSceneDuration;
			camera = CamerasManager.createCamera(
				"loadingCamera",
				"default",
				new mp.Vector3(scene.from.pos.x, scene.from.pos.y, scene.from.pos.z),
				new mp.Vector3(0.0, 0.0, 0.0),
				scene.from.fov,
				null,
				null,
				duration,
			);
			camera.pointAtCoord(
				scene.from.pointAt.x,
				scene.from.pointAt.y,
				scene.from.pointAt.z,
			);
			if (scene.from.dof) {
				const dof = scene.from.dof;
				if (dof.nearDof) camera.setNearDof(dof.nearDof);
				if (dof.farDof) camera.setFarDof(dof.farDof);
				if (dof.strength) camera.setDofStrength(dof.strength);
				if (dof.shallowMode) camera.setUseShallowDofMode(dof.shallowMode);
			}
			if (scene.from.shake) {
				camera.setShakeAmplitude(scene.from.shake.amplitude);
			}
			if (scene.to) {
				CamerasManager.setActiveCameraWithInterp(
					camera,
					new mp.Vector3(scene.to.pos.x, scene.to.pos.y, scene.to.pos.z),
					new mp.Vector3(
						scene.to.pointAt.x,
						scene.to.pointAt.y,
						scene.to.pointAt.z,
					),
					duration,
					0,
					0,
					true,
					"Gewöhnlich",
					duration,
				);
			} else {
				CamerasManager.setActiveCamera(camera, true);
			}
			await system.sleep(duration - 1000);
			if (!loadScreenEnd) {
				mp.game.cam.doScreenFadeOut(700);
				await system.sleep(1000);
				destroyCam();
			}
		}

		destroy();
	});
};

// setTimeout(async () => {
// 	mp.game.cam.doScreenFadeOut(500);
// 	await system.sleep(1000);
// 	mp.game.cam.doScreenFadeIn(500);
// 	while (!loadScreenEnd) {
// 		await renderLoadingCamera();
// 		if (!loadScreenEnd) {
// 			await system.sleep(1000);
// 			// mp.game.cam.doScreenFadeIn(500);
// 		}
// 	}
// 	mp.game.cam.doScreenFadeIn(500);
// 	await system.sleep(1000);
// 	mp.game.cam.doScreenFadeIn(500);
// }, 1);

mp.events.add("loadingscreen:load", () => {
	loadScreenEnd = true;
	mp.game.cam.doScreenFadeOut(0);
	setTimeout(() => {
		mp.game.cam.doScreenFadeIn(200);
		setTimeout(() => {
			cameraManager.createOrbitCam(-143.31, -730.63, 31.27, 2150);
		}, 200);
	}, 1000);
});
