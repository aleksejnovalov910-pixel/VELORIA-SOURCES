export const LOADING_SCREEN_SELECTED_SCENE = "main";

interface CameraLoadingScreenSceneData {
	id: string;
	mainMenu: {
		playerPos?: { x: number; y: number; z: number };
		time: {
			hour: number;
			minute: number;
			second: number;
		};
		weather: string;
		snow?: boolean;
		/** List of ambient url, if doesn't set - select random from LOADING_SCREEN_AMBIENTS  */
		ambientMusic?: string[];
		splashScreen: {
			fadeIn: number;
			defaultSceneDuration: number;
			transitionDuration: number;
			shuffleScenes?: boolean;
			camScenes: {
				from: {
					pos: { x: number; y: number; z: number };
					pointAt: { x: number; y: number; z: number };
					shake?: {
						type: string;
						amplitude: number;
					};
					fov: number;
					dof?: {
						nearDof: number;
						farDof: number;
						strength: number;
						shallowMode: boolean;
					};
				};
				to?: {
					pos: { x: number; y: number; z: number };
					pointAt: { x: number; y: number; z: number };
					shake: {
						type: string;
						amplitude: number;
					};
					fov: number;
					dof?: {
						nearDof: number;
						farDof: number;
						strength: number;
						shallowMode: boolean;
					};
				};

				duration?: number;
			}[];
		};
	};
	peds?: {
		model: string;
		position: { x: number; y: number; z: number };
		rotation: { x: number; y: number; z: number } | number;
		freezePosition?: boolean;
		variations?: {
			componentId: number;
			drawableId?: number;
			textureId?: number;
		}[];
		animation?: { animDict: string; animName: string };
		scenario?: string;
	}[];
	vehicles?: {
		model: string;
		position: { x: number; y: number; z: number };
		rotation?: { x: number; y: number; z: number };
		heading?: number;
		colors: [number, number];
		freezePosition?: boolean;
		lights?: number;
		numberPlate: string;
		engine?: boolean;
		dirt?: number;
		modkit?: number;
		doors?: { [doorIndex: number]: boolean };
		tuning?: { [modId: number]: number };
	}[];
	deleteObjects?: {
		x: number;
		y: number;
		z: number;
		radius: number;
		model: string | number;
	}[];
	disableStaticEmitters?: string[];
	loadIPL?: string[];
}

// export const LOADING_SCREEN_DEFAULT_AMBIENTS: string[] = [
//   "https://r2.gta5onyx.com/files/music/BOTA.ogg",
//   "https://r2.gta5onyx.com/files/music/DeepDown.ogg",
//   "https://r2.gta5onyx.com/files/music/FakeId.ogg",
//   "https://r2.gta5onyx.com/files/music/GetOver.ogg",
//   "https://r2.gta5onyx.com/files/music/HundredMiles.ogg",
//   "https://r2.gta5onyx.com/files/music/OneKiss.ogg",
//   "https://r2.gta5onyx.com/files/music/TikTok.ogg",
//   "https://r2.gta5onyx.com/files/music/Woman.ogg",
// ];

export const CAMERA_LOADING_SCREEN_SCENES: CameraLoadingScreenSceneData[] = [
	{
		id: "main",
		mainMenu: {
			playerPos: new mp.Vector3(1533.79053, 6623.119, 1.50712311),
			time: {
				hour: 13,
				minute: 10,
				second: 0,
			},
			weather: "CLEAR",
			splashScreen: {
				fadeIn: 1500,
				defaultSceneDuration: 7e3,
				transitionDuration: 2e3,
				camScenes: [
					{
						from: {
							pos: new mp.Vector3(1483.96826, 6760.72559, -20.0270805),
							pointAt: new mp.Vector3(1491.64966, 6741.7041, -12.7472305),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.4,
							},
							fov: 30,
							dof: {
								nearDof: 1,
								farDof: 30,
								strength: 1,
								shallowMode: !0,
							},
						},
						duration: 1e4,
					},
					{
						from: {
							pos: new mp.Vector3(1493.13013, 6627.9126, 2.44088411),
							pointAt: new mp.Vector3(1495.8418, 6631.29053, 2.600281),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.2,
							},
							fov: 35,
							dof: {
								nearDof: 1,
								farDof: 50,
								strength: 1,
								shallowMode: !0,
							},
						},
					},
					{
						from: {
							pos: new mp.Vector3(1545.60327, 6654.479, 6.48325872),
							pointAt: new mp.Vector3(1547.7948, 6649.0332, 1.77074158),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.2,
							},
							fov: 35,
							dof: {
								nearDof: 1,
								farDof: 10,
								strength: 1,
								shallowMode: !0,
							},
						},
						to: {
							pos: new mp.Vector3(1541.30432, 6649.87451, 6.48325872),
							pointAt: new mp.Vector3(1547.7948, 6649.0332, 1.77074158),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.2,
							},
							fov: 35,
							dof: {
								nearDof: 1,
								farDof: 10,
								strength: 1,
								shallowMode: !0,
							},
						},
						duration: 8e3,
					},
					{
						from: {
							pos: new mp.Vector3(1501.14319, 6634.85352, 1.29143095),
							pointAt: new mp.Vector3(1502.05566, 6635.60693, 1.22276545),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.2,
							},
							fov: 35,
							dof: {
								nearDof: 1,
								farDof: 10,
								strength: 1,
								shallowMode: !0,
							},
						},
					},
					{
						from: {
							pos: new mp.Vector3(1562.49084, 6647.36963, 2.98420596),
							pointAt: new mp.Vector3(1560.36816, 6648.51953, 3.01998615),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.2,
							},
							fov: 40,
							dof: {
								nearDof: 1,
								farDof: 6,
								strength: 1,
								shallowMode: !0,
							},
						},
					},
					{
						from: {
							pos: new mp.Vector3(1537.1687, 6625.30127, 3.01284862),
							pointAt: new mp.Vector3(1527.56836, 6629.74561, 2.50184679),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.2,
							},
							fov: 25,
							dof: {
								nearDof: 1,
								farDof: 15,
								strength: 1,
								shallowMode: !0,
							},
						},
						to: {
							pos: new mp.Vector3(1533.76953, 6620.39648, 2.51284909),
							pointAt: new mp.Vector3(1527.56836, 6629.74561, 2.50184679),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.2,
							},
							fov: 25,
							dof: {
								nearDof: 1,
								farDof: 15,
								strength: 1,
								shallowMode: !0,
							},
						},
						duration: 8e3,
					},
					{
						from: {
							pos: new mp.Vector3(1495.86499, 6629.69287, 1.64574385),
							pointAt: new mp.Vector3(1506.56494, 6612.87988, 3.47582316),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.2,
							},
							fov: 13,
							dof: {
								nearDof: 1,
								farDof: 15,
								strength: 1,
								shallowMode: !0,
							},
						},
					},
					{
						from: {
							pos: new mp.Vector3(1486.00525, 6600.95264, 15.7759609),
							pointAt: new mp.Vector3(1494.60437, 6613.31494, 14.8240366),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.2,
							},
							fov: 20,
							dof: {
								nearDof: 1,
								farDof: 60,
								strength: 1,
								shallowMode: !0,
							},
						},
					},
					{
						from: {
							pos: new mp.Vector3(1486.57886, 6630.11328, 3.38183713),
							pointAt: new mp.Vector3(1482.2948, 6644.44043, 3.43600988),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.2,
							},
							fov: 20,
							dof: {
								nearDof: 1,
								farDof: 60,
								strength: 1,
								shallowMode: !0,
							},
						},
						to: {
							pos: new mp.Vector3(1486.57886, 6630.11328, 2.33183813),
							pointAt: new mp.Vector3(1482.2948, 6644.44043, 2.34601092),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.2,
							},
							fov: 20,
							dof: {
								nearDof: 1,
								farDof: 60,
								strength: 1,
								shallowMode: !0,
							},
						},
						duration: 8e3,
					},
					{
						from: {
							pos: new mp.Vector3(1541.00317, 6637.23828, 1.46332622),
							pointAt: new mp.Vector3(1543.76428, 6638.37988, 1.79957092),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.2,
							},
							fov: 19,
							dof: {
								nearDof: 1,
								farDof: 7,
								strength: 1,
								shallowMode: !0,
							},
						},
					},
					{
						from: {
							pos: new mp.Vector3(1538.02539, 6635.9375, 1.51807857),
							pointAt: new mp.Vector3(1532.81177, 6649.896, 0.67993027),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.2,
							},
							fov: 12,
							dof: {
								nearDof: 1,
								farDof: 6,
								strength: 1,
								shallowMode: !0,
							},
						},
					},
					{
						from: {
							pos: new mp.Vector3(1557.78821, 6661.04785, 3.26499271),
							pointAt: new mp.Vector3(1565.67249, 6662.54443, 1.24814212),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.2,
							},
							fov: 25,
							dof: {
								nearDof: 1,
								farDof: 10,
								strength: 1,
								shallowMode: !0,
							},
						},
						to: {
							pos: new mp.Vector3(1557.78821, 6661.04785, 3.26499271),
							pointAt: new mp.Vector3(1584.05469, 6700.53516, 0.103681572),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.2,
							},
							fov: 25,
							dof: {
								nearDof: 1,
								farDof: 30,
								strength: 1,
								shallowMode: !0,
							},
						},
						duration: 8e3,
					},
				],
			},
		},
		peds: [
			{
				model: "a_f_m_beach_01",
				position: new mp.Vector3(1548.7356, 6646.60254, 1.87852359),
				rotation: new mp.Vector3(-4.70000124, 2.14163549e-7, 45.805603),
				freezePosition: !0,
				variations: [
					{
						componentId: 0,
						drawableId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict: "amb@world_human_seat_steps@female@hands_by_sides@idle_a",
					animName: "idle_a",
				},
			},
			{
				model: "a_m_m_soucent_03",
				position: new mp.Vector3(1559.9187, 6648.26562, 2.38473654),
				rotation: new mp.Vector3(0, 0, -84.2144165),
				freezePosition: !0,
				variations: [
					{
						componentId: 0,
						drawableId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict: "amb@prop_human_seat_bar@male@hands_on_bar@idle_a",
					animName: "idle_c",
				},
			},
			{
				model: "g_f_y_ballas_01",
				position: new mp.Vector3(1560.20813, 6649.74609, 2.61748791),
				rotation: new mp.Vector3(0, 0, -95.7610703),
				freezePosition: !0,
				variations: [
					{
						componentId: 0,
						drawableId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict: "anim@amb@casino@brawl@reacts@bar@",
					animName: "f_bar_01_gawk_loop_03",
				},
			},
			{
				model: "a_f_y_business_04",
				position: new mp.Vector3(1561.81519, 6648.35986, 2.50145664),
				rotation: new mp.Vector3(0, 0, 89.4556274),
				freezePosition: !0,
				variations: [
					{
						componentId: 0,
						drawableId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict: "anim@amb@clubhouse@bar@drink@base",
					animName: "idle_a",
				},
			},
			{
				model: "a_f_y_bevhills_04",
				position: new mp.Vector3(1550.94446, 6620.94482, 1.95577824),
				rotation: new mp.Vector3(0, 0, 81.3665466),
				freezePosition: !0,
				variations: [
					{
						componentId: 0,
						drawableId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict: "anim@amb@beach_party@",
					animName: "seated_female_a_idle_d",
				},
			},
			{
				model: "a_f_y_juggalo_01",
				position: new mp.Vector3(1530.52588, 6623.55664, 2.54418349),
				rotation: new mp.Vector3(0, 0, -53.5772705),
				freezePosition: !0,
				variations: [
					{
						componentId: 0,
						drawableId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict:
						"anim@amb@nightclub_island@dancers@crowddance_groups@groupe@",
					animName: "hi_dance_crowd_11_v2_female^2",
				},
			},
			{
				model: "a_f_y_beach_01",
				position: new mp.Vector3(1547.06226, 6646.88623, 1.78640342),
				rotation: new mp.Vector3(-4.20000172, 2.14018115e-7, 42.9840393),
				freezePosition: !0,
				variations: [
					{
						componentId: 0,
						drawableId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict: "amb@prop_human_seat_sunlounger@female@idle_a",
					animName: "idle_a",
				},
			},
			{
				model: "a_f_y_clubcust_02",
				position: new mp.Vector3(1533.85229, 6627.1875, 2.51726508),
				rotation: new mp.Vector3(0, 0, 49.1267357),
				freezePosition: !0,
				variations: [
					{
						componentId: 0,
						drawableId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict:
						"anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity",
					animName: "hi_dance_facedj_hu_15_v1_female^3",
				},
			},
			{
				model: "a_m_m_salton_03",
				position: new mp.Vector3(1532.85889, 6623.97852, 2.52177405),
				rotation: new mp.Vector3(0, 0, 64.5840988),
				freezePosition: !0,
				variations: [
					{
						componentId: 0,
						drawableId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict: "anim@amb@nightclub@dancers@crowddance_facedj@hi_intensity",
					animName: "hi_dance_facedj_17_v1_male^3",
				},
			},
			{
				model: "a_m_m_beach_01",
				position: new mp.Vector3(1501.23718, 6618.23975, 2.50197721),
				rotation: new mp.Vector3(0, 0, -34.9875374),
				freezePosition: !0,
				variations: [
					{
						componentId: 0,
						drawableId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict: "amb@prop_human_muscle_chin_ups@male@base",
					animName: "base",
				},
			},
			{
				model: "a_m_y_vinewood_02",
				position: new mp.Vector3(1527.04517, 6630.33936, 2.6085403),
				rotation: new mp.Vector3(0, 0, -143.512573),
				freezePosition: !0,
				variations: [
					{
						componentId: 0,
						drawableId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict: "anim@amb@nightclub@djs@solomun@",
					animName: "temp_slmn_set_solomun",
				},
			},
			{
				model: "a_f_y_hippie_01",
				position: new mp.Vector3(1512.75415, 6631.93994, 2.13129926),
				rotation: new mp.Vector3(-4.89999819, 2.14226276e-7, -48.330822),
				freezePosition: !0,
				variations: [
					{
						componentId: 0,
						drawableId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict: "savecouch@",
					animName: "t_sleep_loop_couch",
				},
			},
			{
				model: "a_f_y_tourist_01",
				position: new mp.Vector3(1509.38623, 6631.04199, 2.59243703),
				rotation: new mp.Vector3(0, 0, 3.57143688),
				freezePosition: !0,
				variations: [
					{
						componentId: 0,
						drawableId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict: "anim@amb@business@bgen@bgen_no_work@",
					animName: "sit_phone_idle_01-noworkfemale",
				},
			},
			{
				model: "a_m_m_rurmeth_01",
				position: new mp.Vector3(1561.67151, 6661.37549, 1.65883613),
				rotation: new mp.Vector3(27.9999771, -3.19999886, 24.0067596),
				freezePosition: !0,
				variations: [
					{
						componentId: 0,
						drawableId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict: "amb@world_human_seat_steps@male@hands_in_lap@idle_b",
					animName: "idle_d",
				},
			},
			{
				model: "a_f_y_topless_01",
				position: new mp.Vector3(1486.052, 6633.28955, 1.90834641),
				rotation: new mp.Vector3(0, 0, 19.1409988),
				freezePosition: !0,
				variations: [
					{
						componentId: 0,
						drawableId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict: "amb@world_human_seat_steps@female@hands_by_sides@idle_b",
					animName: "idle_f",
				},
			},
			{
				model: "a_m_y_salton_01",
				position: new mp.Vector3(1553.33386, 6623.53418, 2.37230349),
				rotation: new mp.Vector3(368484743e-24, 309777816e-24, 44.5316658),
				freezePosition: !0,
				variations: [
					{
						componentId: 0,
						drawableId: 0,
						textureId: 0,
					},
				],
				scenario: "PROP_HUMAN_BBQ",
			},
			{
				model: "a_m_y_jetski_01",
				position: new mp.Vector3(1544.37109, 6638.92578, 2.40327525),
				rotation: new mp.Vector3(0, 0, -35.9179497),
				freezePosition: !0,
				variations: [
					{
						componentId: 0,
						drawableId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict: "anim@amb@garage@chassis_repair@",
					animName: "look_around_01_amy_skater_01",
				},
			},
			{
				model: "a_m_y_surfer_01",
				position: new mp.Vector3(1497.38159, 6630.98535, 2.56662226),
				rotation: new mp.Vector3(0, 0, 79.219902),
				freezePosition: !0,
				variations: [
					{
						componentId: 0,
						drawableId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict: "anim@amb@casino@brawl@fights@guard@",
					animName: "argument_loop_mp_m_brawler_02",
				},
			},
			{
				model: "a_m_y_jetski_01",
				position: new mp.Vector3(1543.1947, 6657.40234, -0.322343141),
				rotation: new mp.Vector3(20.8455372, 0, 43.8888435),
				freezePosition: !0,
				variations: [
					{
						componentId: 0,
						drawableId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict: "anim@amb@clubhouse@seating@male@var_a@base@",
					animName: "idle_b",
				},
			},
			{
				model: "s_f_y_shop_low",
				position: new mp.Vector3(1547.43188, 6637.39355, 2.43003607),
				rotation: new mp.Vector3(0, 0, -39.2043915),
				freezePosition: !0,
				variations: [
					{
						componentId: 0,
						drawableId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict: "amb@world_human_picnic@female@idle_a",
					animName: "idle_b",
				},
			},
			{
				model: "a_m_y_breakdance_01",
				position: new mp.Vector3(1503.86548, 6618.18799, 2.43877125),
				rotation: new mp.Vector3(6.25322405e-10, 155300513e-26, 88.2068863),
				freezePosition: !0,
				variations: [
					{
						componentId: 0,
						drawableId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict: "anim@amb@beach_party@",
					animName: "lean_male_a_idle_b",
				},
			},
			{
				model: "s_f_y_baywatch_01",
				position: new mp.Vector3(1496.09009, 6631.26221, 2.54332852),
				rotation: new mp.Vector3(0, 0, -116.400871),
				freezePosition: !0,
				variations: [
					{
						componentId: 0,
						drawableId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict: "anim@amb@beach_party@",
					animName: "lean_female_a_idle_c",
				},
			},
			{
				model: "u_f_y_lauren",
				position: new mp.Vector3(1548.94519, 6651.25049, 2.73291612),
				rotation: new mp.Vector3(-135536557e-13, 1.99999833, 144.816757),
				freezePosition: !0,
				variations: [
					{
						componentId: 0,
						drawableId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict: "timetable@tracy@sleep@",
					animName: "idle_c",
				},
			},
			{
				model: "a_m_y_stwhi_01",
				position: new mp.Vector3(1550.10339, 6634.14551, 2.20641446),
				rotation: new mp.Vector3(0, 0, 31.7974186),
				freezePosition: !0,
				variations: [
					{
						componentId: 0,
						drawableId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict: "amb@world_human_seat_steps@male@hands_in_lap@idle_a",
					animName: "idle_b",
				},
			},
			{
				model: "a_m_y_musclbeac_02",
				position: new mp.Vector3(1530.80627, 6625.62891, 2.54361105),
				rotation: new mp.Vector3(0, 0, -119.756653),
				freezePosition: !0,
				variations: [
					{
						componentId: 0,
						drawableId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict:
						"anim@amb@nightclub_island@dancers@crowddance_facedj@hi_intensity",
					animName: "hi_dance_facedj_hu_15_v1_male^6",
				},
			},
			{
				model: "a_m_y_polynesian_01",
				position: new mp.Vector3(1546.81848, 6621.21143, 1.90268731),
				rotation: new mp.Vector3(0, 0, -126.127991),
				freezePosition: !0,
				variations: [
					{
						componentId: 0,
						drawableId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict: "anim@amb@beach_party@",
					animName: "seated_male_a_idle_d",
				},
			},
			{
				model: "a_c_husky",
				position: new mp.Vector3(1548.23865, 6638.81396, 1.89050555),
				rotation: new mp.Vector3(-2.18919873, -1.06799625e-7, 143.938812),
				freezePosition: !0,
				variations: [
					{
						componentId: 0,
						drawableId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict: "creatures@rottweiler@amb@world_dog_sitting@idle_a",
					animName: "idle_c",
				},
			},
			{
				model: "a_c_dolphin",
				position: new mp.Vector3(1491.36182, 6741.11133, -14.0295181),
				rotation: new mp.Vector3(23.0701275, 9.27988594e-7, 133.551895),
				freezePosition: !1,
				variations: [
					{
						componentId: 0,
						drawableId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict: "creatures@dolphin@move",
					animName: "swim_turn_r",
				},
			},
			{
				model: "a_c_killerwhale",
				position: new mp.Vector3(1487.0011, 6741.30371, -12.3238207),
				rotation: new mp.Vector3(0, -0, -126.236549),
				freezePosition: !1,
				variations: [
					{
						componentId: 0,
						drawableId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict: "creatures@killerwhale@move",
					animName: "idle_turn_l",
				},
			},
			{
				model: "g_f_y_vagos_01",
				position: new mp.Vector3(1533.0675, 6628.58301, 2.51810122),
				rotation: new mp.Vector3(0, -0, 141.438629),
				freezePosition: !0,
				variations: [
					{
						componentId: 0,
						drawableId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict:
						"anim@amb@nightclub@dancers@crowddance_facedj_transitions@from_hi_intensity",
					animName: "trans_dance_facedj_hi_to_li_07_v1_female^2",
				},
			},
			{
				model: "a_c_rhesus",
				position: new mp.Vector3(1487.9965, 6603.1338, 15.312),
				rotation: new mp.Vector3(-9.18587685, 2.16216264e-7, 109.050674),
				freezePosition: !0,
				variations: [
					{
						componentId: 0,
						drawableId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict: "amb@prop_human_seat_sunlounger@male@idle_a",
					animName: "idle_d",
				},
			},
			{
				model: "a_c_seagull",
				position: new mp.Vector3(1536.2782, 6639.65088, 1.106969),
				rotation: new mp.Vector3(-0, -0, -78.4371262),
				freezePosition: !0,
				variations: [
					{
						componentId: 0,
						drawableId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict: "creatures@gull@amb@world_gull_standing@idle_a",
					animName: "idle_b",
				},
			},
			{
				model: "a_c_seagull",
				position: new mp.Vector3(1537.00854, 6640.12598, 1.26923108),
				rotation: new mp.Vector3(-40989421e-13, -508888789e-22, 170.163574),
				freezePosition: !0,
				variations: [
					{
						componentId: 0,
						drawableId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict: "creatures@gull@amb@world_gull_standing@idle_a",
					animName: "idle_a",
				},
			},
		],
		vehicles: [
			{
				model: "supervolito",
				position: new mp.Vector3(1436.7189, 6648.2778, 11.9355),
				heading: 177.6,
				colors: [0, 28],
				freezePosition: !1,
				lights: 2,
				numberPlate: "LENDOS",
				engine: !1,
				dirt: 0,
				doors: {
					5: !0,
				},
				tuning: {
					48: 6,
				},
			},
			{
				model: "tropic",
				position: new mp.Vector3(1485.0243, 6700.1987, 1.1255),
				heading: 149.6,
				colors: [111, 0],
				freezePosition: !0,
				lights: 2,
				numberPlate: "LENDOS",
				engine: !1,
				dirt: 0,
				doors: {
					5: !0,
				},
				tuning: {
					48: 2,
				},
			},
		],
		loadIPL: ["mj_startscreen_summer"],
	},

	{
		id: "1",
		mainMenu: {
			playerPos: new mp.Vector3(417.57, -245.3952, 74.24924),
			time: {
				hour: 23,
				minute: 27,
				second: 0,
			},
			weather: "CLEAR",
			snow: !1,
			ambientMusic: [
				"https://r2.gta5onyx.com/files/music/AWAY.ogg",
				"https://r2.gta5onyx.com/files/music/La_Romana.ogg",
				"https://r2.gta5onyx.com/files/music/Callaita.ogg",
				"https://r2.gta5onyx.com/files/music/COMO_UN_BEBE.ogg",
				"https://r2.gta5onyx.com/files/music/Rrrrico.ogg",
				"https://r2.gta5onyx.com/files/music/SG.ogg",
				"https://r2.gta5onyx.com/files/music/Voodoo.ogg",
				"https://r2.gta5onyx.com/files/music/TheMood.ogg",
				"https://r2.gta5onyx.com/files/music/LaVainaSePrendio.ogg",
			],
			splashScreen: {
				fadeIn: 1500,
				defaultSceneDuration: 5e3,
				transitionDuration: 2e3,
				camScenes: [
					{
						from: {
							pos: new mp.Vector3(441.6356, -267.0901, 71.75332),
							pointAt: new mp.Vector3(431.3993, -258.3128, 70.30997),
							fov: 40,
							dof: {
								nearDof: 2,
								farDof: 5,
								strength: 1,
								shallowMode: !0,
							},
						},
					},
					{
						from: {
							pos: new mp.Vector3(435.7891, -266.0482, 91.25694),
							pointAt: new mp.Vector3(437.6809, -260.9068, 69.79926),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.3,
							},
							fov: 43,
						},
						to: {
							pos: new mp.Vector3(429.3665, -263.575, 91.25694),
							pointAt: new mp.Vector3(431.1938, -258.4684, 69.79926),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.3,
							},
							fov: 43,
						},
						duration: 6e3,
					},
					{
						from: {
							pos: new mp.Vector3(439.5769, -255.0066, 74.89699),
							pointAt: new mp.Vector3(440.4311, -256.7866, 74.89783),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.3,
							},
							fov: 45,
							dof: {
								nearDof: 0,
								farDof: 3,
								strength: 1,
								shallowMode: !0,
							},
						},
					},
					{
						from: {
							pos: new mp.Vector3(422.3689, -263.0855, 71.50049),
							pointAt: new mp.Vector3(426.7594, -263.8123, 71.53094),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.2,
							},
							fov: 33,
							dof: {
								nearDof: 0,
								farDof: 8,
								strength: 1,
								shallowMode: !0,
							},
						},
					},
					{
						from: {
							pos: new mp.Vector3(427.9396, -274.4458, 72.74697),
							pointAt: new mp.Vector3(434.9877, -255.6629, 73.25294),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.3,
							},
							fov: 35,
							dof: {
								nearDof: 5,
								farDof: 30,
								strength: 1,
								shallowMode: !0,
							},
						},
						to: {
							pos: new mp.Vector3(429.9746, -269.0444, 72.74697),
							pointAt: new mp.Vector3(434.9877, -255.6629, 73.25294),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.2,
							},
							fov: 35,
							dof: {
								nearDof: 5,
								farDof: 30,
								strength: 1,
								shallowMode: !0,
							},
						},
						duration: 6e3,
					},
					{
						from: {
							pos: new mp.Vector3(428.5129, -255.9117, 74.9686),
							pointAt: new mp.Vector3(429.5041, -253.3664, 74.94),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.2,
							},
							fov: 40,
							dof: {
								nearDof: 0,
								farDof: 3,
								strength: 1,
								shallowMode: !0,
							},
						},
					},
					{
						from: {
							pos: new mp.Vector3(447.35, -262.55, 70.53816),
							pointAt: new mp.Vector3(444.57, -261.51, 70.56),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.2,
							},
							fov: 30,
							dof: {
								nearDof: 1,
								farDof: 3,
								strength: 1,
								shallowMode: !0,
							},
						},
					},
					{
						from: {
							pos: new mp.Vector3(438.8867, -267.5786, 71.70633),
							pointAt: new mp.Vector3(440.2265, -268.5744, 71.45898),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.4,
							},
							fov: 40,
							dof: {
								nearDof: 0,
								farDof: 2,
								strength: 1,
								shallowMode: !0,
							},
						},
						to: {
							pos: new mp.Vector3(439.4761, -267.371, 71.70633),
							pointAt: new mp.Vector3(440.2265, -268.5744, 71.45898),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.2,
							},
							fov: 38,
							dof: {
								nearDof: 0,
								farDof: 2,
								strength: 1,
								shallowMode: !0,
							},
						},
						duration: 6e3,
					},
					{
						from: {
							pos: new mp.Vector3(438.1888, -263.4052, 70.64851),
							pointAt: new mp.Vector3(442.9548, -266.3503, 70.66),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.2,
							},
							fov: 41,
							dof: {
								nearDof: 0,
								farDof: 3,
								strength: 1,
								shallowMode: !0,
							},
						},
					},
					{
						from: {
							pos: new mp.Vector3(419.4036, -258.7137, 71.18),
							pointAt: new mp.Vector3(420.3923, -255.7682, 71.1),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.2,
							},
							fov: 40,
							dof: {
								nearDof: 0,
								farDof: 4,
								strength: 1,
								shallowMode: !0,
							},
						},
					},
					{
						from: {
							pos: new mp.Vector3(427.0503, -256.578, 71.1397),
							pointAt: new mp.Vector3(425.1963, -255.0862, 71.40678),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.5,
							},
							fov: 35,
							dof: {
								nearDof: 0,
								farDof: 4,
								strength: 1,
								shallowMode: !0,
							},
						},
						to: {
							pos: new mp.Vector3(425.9315, -257.1624, 71.4997),
							pointAt: new mp.Vector3(425.1963, -255.0862, 71.40678),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.2,
							},
							fov: 35,
							dof: {
								nearDof: 0,
								farDof: 4,
								strength: 1,
								shallowMode: !0,
							},
						},
						duration: 6e3,
					},
					{
						from: {
							pos: new mp.Vector3(428.3182, -255.3753, 71.05),
							pointAt: new mp.Vector3(430.4212, -253.6216, 70.94956),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.2,
							},
							fov: 35,
							dof: {
								nearDof: 0,
								farDof: 2.5,
								strength: 1,
								shallowMode: !0,
							},
						},
					},
				],
			},
		},
		peds: [
			{
				model: "ig_sol",
				position: new mp.Vector3(439.874725, -268.82251, 71.2440109),
				rotation: new mp.Vector3(0, 0, 15.6528492),
				freezePosition: !1,
				variations: [
					{
						componentId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict: "anim@amb@nightclub@djs@solomun@",
					animName: "temp_slmn_set_solomun",
				},
			},
			{
				model: "a_f_y_beach_01",
				position: new mp.Vector3(432.150787, -258.405701, 70.188797),
				rotation: new mp.Vector3(0, 0, 158.965271),
				freezePosition: !0,
				variations: [
					{
						componentId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict: "amb@world_human_seat_steps@female@hands_by_sides@idle_b",
					animName: "idle_d",
				},
			},
			{
				model: "a_f_y_business_04",
				position: new mp.Vector3(419.396484, -257.572296, 71.1543427),
				rotation: new mp.Vector3(0, 0, 65.5730667),
				freezePosition: !0,
				variations: [
					{
						componentId: 1,
						textureId: 0,
					},
				],
				animation: {
					animDict: "savecouch@",
					animName: "t_sleep_loop_couch",
				},
			},
			{
				model: "u_f_y_jewelass_01",
				position: new mp.Vector3(439.608948, -257.175537, 70.687767),
				rotation: new mp.Vector3(0, 0, 175.693146),
				freezePosition: !0,
				variations: [
					{
						componentId: 1,
						textureId: 0,
					},
				],
				animation: {
					animDict: "amb@prop_human_seat_chair@female@arms_folded@idle_a",
					animName: "idle_c",
				},
			},
			{
				model: "a_m_y_gay_01",
				position: new mp.Vector3(423.761963, -252.603699, 71.2541656),
				rotation: new mp.Vector3(0, 0, 172.20047),
				freezePosition: !1,
				variations: [
					{
						componentId: 2,
						textureId: 0,
					},
				],
				animation: {
					animDict: "amb@world_human_leaning@male@wall@back@foot_up@idle_a",
					animName: "idle_c",
				},
			},
			{
				model: "a_m_y_jetski_01",
				position: new mp.Vector3(433.298828, -258.914093, 70.2670593),
				rotation: new mp.Vector3(0, 0, 159.84407),
				freezePosition: !0,
				variations: [
					{
						componentId: 3,
						textureId: 0,
					},
				],
				scenario: "world_human_seat_wall",
			},
			{
				model: "u_m_m_willyfist",
				position: new mp.Vector3(439.717438, -256.098236, 74.5611343),
				rotation: new mp.Vector3(0, 0, -28.8628311),
				freezePosition: !0,
				variations: [
					{
						componentId: 4,
						textureId: 0,
					},
				],
				animation: {
					animDict:
						"amb@world_human_leaning@male@wall@back@legs_crossed@idle_a",
					animName: "idle_a",
				},
			},
			{
				model: "u_m_y_dancerave_01",
				position: new mp.Vector3(426.336273, -255.440826, 71.2468033),
				rotation: new mp.Vector3(0, 0, 86.016983),
				freezePosition: !1,
				variations: [
					{
						componentId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict: "anim@amb@nightclub@dancers@podium_dancers@",
					animName: "hi_dance_facedj_17_v2_male^5",
				},
			},
			{
				model: "u_f_y_dancerave_01",
				position: new mp.Vector3(425.25351, -254.83139, 71.2434998),
				rotation: new mp.Vector3(0, 0, -178.066101),
				freezePosition: !1,
				variations: [
					{
						componentId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict: "anim@amb@nightclub@dancers@podium_dancers@",
					animName: "hi_dance_facedj_17_v2_female^2",
				},
			},
			{
				model: "u_f_y_spyactress",
				position: new mp.Vector3(431.423462, -253.043427, 74.5441437),
				rotation: new mp.Vector3(0, 0, 147.89209),
				freezePosition: !0,
				variations: [
					{
						componentId: 2,
						textureId: 0,
					},
				],
				animation: {
					animDict: "anim@amb@nightclub@dancers@club_ambientpeds@",
					animName: "li-mi_amb_club_06_base_female^2",
				},
			},
			{
				model: "u_f_y_dancerave_01",
				position: new mp.Vector3(424.667114, -256.031097, 71.2532349),
				rotation: new mp.Vector3(0, 0, -118.734421),
				freezePosition: !1,
				variations: [
					{
						componentId: 3,
						textureId: 0,
					},
				],
				animation: {
					animDict:
						"anim@amb@nightclub@dancers@crowddance_facedj@low_intesnsity",
					animName: "li_dance_facedj_11_v1_female^3",
				},
			},
			{
				model: "u_m_m_jesus_01",
				position: new mp.Vector3(430.385315, -253.357346, 74.6730042),
				rotation: new mp.Vector3(0, 0, 159.463959),
				freezePosition: !0,
				variations: [
					{
						componentId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict: "amb@world_human_seat_wall@male@hands_in_lap@base",
					animName: "base",
				},
			},
			{
				model: "u_m_m_partytarget",
				position: new mp.Vector3(430.678558, -254.065399, 71.690033),
				rotation: new mp.Vector3(0, 0, 83.1689987),
				freezePosition: !0,
				variations: [
					{
						componentId: 1,
						textureId: 0,
					},
				],
				scenario: "WORLD_HUMAN_STUPOR",
			},
			{
				model: "cs_jimmydisanto",
				position: new mp.Vector3(445.069763, -261.13382, 71.235611),
				rotation: new mp.Vector3(0, 0, 164.597031),
				freezePosition: !1,
				variations: [
					{
						componentId: 5,
						textureId: 0,
					},
				],
				scenario: "WORLD_HUMAN_STUPOR",
			},
			{
				model: "a_f_y_tourist_01",
				position: new mp.Vector3(442.584229, -258.425232, 71.2430878),
				rotation: new mp.Vector3(0, 0, -140.096054),
				freezePosition: !1,
				variations: [
					{
						componentId: 3,
						textureId: 0,
					},
				],
				scenario: "WORLD_HUMAN_SMOKING_POT",
			},
			{
				model: "a_f_y_hipster_02",
				position: new mp.Vector3(439.297089, -264.426544, 71.1949387),
				rotation: new mp.Vector3(0, 0, 79.7905655),
				freezePosition: !0,
				variations: [
					{
						componentId: 3,
						textureId: 0,
					},
				],
				scenario: "WORLD_HUMAN_PICNIC",
			},
			{
				model: "u_f_y_dancerave_01",
				position: new mp.Vector3(443.411011, -259.25296, 71.2518387),
				rotation: new mp.Vector3(0, 0, 26.718441),
				freezePosition: !1,
				variations: [
					{
						componentId: 2,
						textureId: 0,
					},
				],
				scenario: "WORLD_HUMAN_HANG_OUT_STREET",
			},
			{
				model: "u_m_y_dancerave_01",
				position: new mp.Vector3(424.035767, -264.050537, 71.250206),
				rotation: new mp.Vector3(0, 0, -55.8904915),
				freezePosition: !1,
				variations: [
					{
						componentId: 2,
						textureId: 0,
					},
				],
				scenario: "WORLD_HUMAN_STAND_MOBILE",
			},
			{
				model: "a_m_y_vinewood_01",
				position: new mp.Vector3(423.012695, -259.551514, 71.2333832),
				rotation: new mp.Vector3(0, 0, -34.9930573),
				freezePosition: !1,
				variations: [
					{
						componentId: 2,
						textureId: 0,
					},
				],
				scenario: "WORLD_HUMAN_STAND_MOBILE",
			},
			{
				model: "a_m_m_mlcrisis_01",
				position: new mp.Vector3(420.966309, -256.126526, 71.2568207),
				rotation: new mp.Vector3(0, 0, -121.275101),
				freezePosition: !0,
				variations: [
					{
						componentId: 5,
						textureId: 0,
					},
				],
				animation: {
					animDict: "anim@scripted@carmeet@tun_meet_ig2_race@",
					animName: "base",
				},
			},
			{
				model: "a_m_y_stbla_02",
				position: new mp.Vector3(417.077698, -260.188446, 70.6770935),
				rotation: new mp.Vector3(0, 0, -102.026817),
				freezePosition: !0,
				variations: [
					{
						componentId: 2,
						textureId: 0,
					},
				],
				animation: {
					animDict: "amb@prop_human_seat_chair@male@generic_skinny@base",
					animName: "base",
				},
			},
			{
				model: "u_m_y_dancerave_01",
				position: new mp.Vector3(441.412384, -261.795166, 71.2452087),
				rotation: new mp.Vector3(0, 0, -160.691208),
				freezePosition: !1,
				variations: [
					{
						componentId: 3,
						textureId: 0,
					},
				],
				animation: {
					animDict: "anim@amb@nightclub@dancers@black_madonna_entourage@",
					animName: "hi_dance_facedj_09_v2_male^5",
				},
			},
			{
				model: "a_m_y_vinewood_04",
				position: new mp.Vector3(441.567719, -263.092957, 71.2465134),
				rotation: new mp.Vector3(0, 0, 12.887846),
				freezePosition: !1,
				variations: [
					{
						componentId: 3,
						textureId: 0,
					},
				],
				animation: {
					animDict:
						"anim@amb@nightclub@dancers@crowddance_facedj@low_intesnsity",
					animName: "li_dance_facedj_13_v2_male^4",
				},
			},
			{
				model: "a_m_y_business_02",
				position: new mp.Vector3(436.75412, -258.801727, 71.254631),
				rotation: new mp.Vector3(0, 0, 81.7725601),
				freezePosition: !1,
				variations: [
					{
						componentId: 2,
						textureId: 0,
					},
				],
				animation: {
					animDict:
						"anim@amb@nightclub_island@dancers@crowddance_facedj_transitions@",
					animName: "trans_dance_facedj_mi_to_li_09_v1_male^5",
				},
			},
			{
				model: "u_f_y_dancerave_01",
				position: new mp.Vector3(442.691376, -262.228912, 71.2429428),
				rotation: new mp.Vector3(0, 0, 127.189468),
				freezePosition: !1,
				variations: [
					{
						componentId: 3,
						textureId: 0,
					},
				],
				animation: {
					animDict: "anim@amb@nightclub@dancers@crowddance_facedj@",
					animName: "hi_dance_facedj_09_v1_female^3",
				},
			},
			{
				model: "a_f_y_hipster_03",
				position: new mp.Vector3(432.228302, -254.580231, 71.2525864),
				rotation: new mp.Vector3(0, 0, -101.496841),
				freezePosition: !1,
				variations: [
					{
						componentId: 4,
						textureId: 0,
					},
				],
				animation: {
					animDict:
						"anim@amb@nightclub@dancers@club_ambientpeds@low-med_intensity",
					animName: "li-mi_amb_club_09_v1_female^3",
				},
			},
			{
				model: "a_f_y_vinewood_04",
				position: new mp.Vector3(436.243805, -258.326721, 71.2500229),
				rotation: new mp.Vector3(0, 0, 162.069061),
				freezePosition: !1,
				variations: [
					{
						componentId: 4,
						textureId: 0,
					},
				],
				animation: {
					animDict: "anim@amb@nightclub@dancers@crowddance_groups@hi_intensity",
					animName: "hi_dance_crowd_09_v1_female^1",
				},
			},
		],
		deleteObjects: [
			{
				x: 413.3616,
				y: -255.1277,
				z: 70.23516,
				radius: 1,
				model: 2580107545,
			},
			{
				x: 410.4957,
				y: -259.38,
				z: 70.23577,
				radius: 1,
				model: 977744387,
			},
			{
				x: 406.1225,
				y: -255.0734,
				z: 70.64162,
				radius: 1,
				model: 702477265,
			},
			{
				x: 406.1866,
				y: -256.1353,
				z: 70.24013,
				radius: 1,
				model: 2533307946,
			},
			{
				x: 407.1402,
				y: -255.0118,
				z: 70.24013,
				radius: 1,
				model: 2533307946,
			},
			{
				x: 406.0504,
				y: -253.9627,
				z: 70.24013,
				radius: 1,
				model: 2533307946,
			},
			{
				x: 415.6478,
				y: -250.0494,
				z: 70.62975,
				radius: 1,
				model: 4087940966,
			},
			{
				x: 418.9924,
				y: -251.3105,
				z: 70.64227,
				radius: 1,
				model: 4087940966,
			},
			{
				x: 431.9688,
				y: -255.5809,
				z: 70.2565,
				radius: 1,
				model: 3702106121,
			},
			{
				x: 434.5309,
				y: -253.83,
				z: 73.507,
				radius: 1,
				model: 2580107545,
			},
			{
				x: 427.7083,
				y: -251.3617,
				z: 73.925,
				radius: 1,
				model: 4087940966,
			},
			{
				x: 428.4743,
				y: -251.6326,
				z: 73.50294,
				radius: 1,
				model: 2533307946,
			},
			{
				x: 427.0161,
				y: -251.1125,
				z: 73.50294,
				radius: 1,
				model: 2533307946,
			},
		],
		disableStaticEmitters: ["collision_781bnhb", "collision_8cue4t5"],
		loadIPL: ["mj_startscreen_autumn"],
	},
	// intro halloween

	{
		id: "2",
		mainMenu: {
			playerPos: new mp.Vector3(417.57, -245.3952, 74.24924),
			time: {
				hour: 23,
				minute: 27,
				second: 0,
			},
			weather: "CLEAR",
			snow: !1,
			ambientMusic: [
				"https://r2.gta5onyx.com/files/music/Blinding_Lights.ogg",
				"https://r2.gta5onyx.com/files/music/Ghostbusters.ogg",
				"https://r2.gta5onyx.com/files/music/Men_In_Black.ogg",
				"https://r2.gta5onyx.com/files/music/Smooth_Criminal.ogg",
				"https://r2.gta5onyx.com/files/music/Somebodys_Watching_Me.ogg",
				"https://r2.gta5onyx.com/files/music/Spooky_Scary_Skeletons.ogg",
				"https://r2.gta5onyx.com/files/music/Super_Freak.ogg",
				"https://r2.gta5onyx.com/files/music/This_Is_Halloween.ogg",
				"https://r2.gta5onyx.com/files/music/Thriller.ogg",
			],
			splashScreen: {
				fadeIn: 1500,
				defaultSceneDuration: 5e3,
				transitionDuration: 2e3,
				camScenes: [
					{
						from: {
							pos: new mp.Vector3(441.6356, -267.0901, 71.75332),
							pointAt: new mp.Vector3(431.3993, -258.3128, 70.30997),
							fov: 40,
							dof: {
								nearDof: 2,
								farDof: 5,
								strength: 1,
								shallowMode: !0,
							},
						},
					},
					{
						from: {
							pos: new mp.Vector3(435.7891, -266.0482, 91.25694),
							pointAt: new mp.Vector3(437.6809, -260.9068, 69.79926),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.3,
							},
							fov: 43,
						},
						to: {
							pos: new mp.Vector3(429.3665, -263.575, 91.25694),
							pointAt: new mp.Vector3(431.1938, -258.4684, 69.79926),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.3,
							},
							fov: 43,
						},
						duration: 6e3,
					},
					{
						from: {
							pos: new mp.Vector3(439.5769, -255.0066, 74.89699),
							pointAt: new mp.Vector3(440.4311, -256.7866, 74.89783),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.3,
							},
							fov: 45,
							dof: {
								nearDof: 0,
								farDof: 3,
								strength: 1,
								shallowMode: !0,
							},
						},
					},
					{
						from: {
							pos: new mp.Vector3(422.3689, -263.0855, 71.50049),
							pointAt: new mp.Vector3(426.7594, -263.8123, 71.53094),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.2,
							},
							fov: 33,
							dof: {
								nearDof: 0,
								farDof: 8,
								strength: 1,
								shallowMode: !0,
							},
						},
					},
					{
						from: {
							pos: new mp.Vector3(427.9396, -274.4458, 72.74697),
							pointAt: new mp.Vector3(434.9877, -255.6629, 73.25294),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.3,
							},
							fov: 35,
							dof: {
								nearDof: 5,
								farDof: 30,
								strength: 1,
								shallowMode: !0,
							},
						},
						to: {
							pos: new mp.Vector3(429.9746, -269.0444, 72.74697),
							pointAt: new mp.Vector3(434.9877, -255.6629, 73.25294),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.2,
							},
							fov: 35,
							dof: {
								nearDof: 5,
								farDof: 30,
								strength: 1,
								shallowMode: !0,
							},
						},
						duration: 6e3,
					},
					{
						from: {
							pos: new mp.Vector3(428.5129, -255.9117, 74.9686),
							pointAt: new mp.Vector3(429.5041, -253.3664, 74.94),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.2,
							},
							fov: 40,
							dof: {
								nearDof: 0,
								farDof: 3,
								strength: 1,
								shallowMode: !0,
							},
						},
					},
					{
						from: {
							pos: new mp.Vector3(447.35, -262.55, 70.53816),
							pointAt: new mp.Vector3(444.57, -261.51, 70.56),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.2,
							},
							fov: 30,
							dof: {
								nearDof: 1,
								farDof: 3,
								strength: 1,
								shallowMode: !0,
							},
						},
					},
					{
						from: {
							pos: new mp.Vector3(438.8867, -267.5786, 71.70633),
							pointAt: new mp.Vector3(440.2265, -268.5744, 71.45898),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.4,
							},
							fov: 40,
							dof: {
								nearDof: 0,
								farDof: 2,
								strength: 1,
								shallowMode: !0,
							},
						},
						to: {
							pos: new mp.Vector3(439.4761, -267.371, 71.70633),
							pointAt: new mp.Vector3(440.2265, -268.5744, 71.45898),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.2,
							},
							fov: 38,
							dof: {
								nearDof: 0,
								farDof: 2,
								strength: 1,
								shallowMode: !0,
							},
						},
						duration: 6e3,
					},
					{
						from: {
							pos: new mp.Vector3(438.1888, -263.4052, 70.64851),
							pointAt: new mp.Vector3(442.9548, -266.3503, 70.66),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.2,
							},
							fov: 41,
							dof: {
								nearDof: 0,
								farDof: 3,
								strength: 1,
								shallowMode: !0,
							},
						},
					},
					{
						from: {
							pos: new mp.Vector3(419.4036, -258.7137, 71.18),
							pointAt: new mp.Vector3(420.3923, -255.7682, 71.1),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.2,
							},
							fov: 40,
							dof: {
								nearDof: 0,
								farDof: 4,
								strength: 1,
								shallowMode: !0,
							},
						},
					},
					{
						from: {
							pos: new mp.Vector3(427.0503, -256.578, 71.1397),
							pointAt: new mp.Vector3(425.1963, -255.0862, 71.40678),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.5,
							},
							fov: 35,
							dof: {
								nearDof: 0,
								farDof: 4,
								strength: 1,
								shallowMode: !0,
							},
						},
						to: {
							pos: new mp.Vector3(425.9315, -257.1624, 71.4997),
							pointAt: new mp.Vector3(425.1963, -255.0862, 71.40678),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.2,
							},
							fov: 35,
							dof: {
								nearDof: 0,
								farDof: 4,
								strength: 1,
								shallowMode: !0,
							},
						},
						duration: 6e3,
					},
					{
						from: {
							pos: new mp.Vector3(428.3182, -255.3753, 71.05),
							pointAt: new mp.Vector3(430.4212, -253.6216, 70.94956),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.2,
							},
							fov: 35,
							dof: {
								nearDof: 0,
								farDof: 2.5,
								strength: 1,
								shallowMode: !0,
							},
						},
					},
				],
			},
		},
		peds: [
			{
				model: "s_m_m_movspace_01",
				position: new mp.Vector3(439.874725, -268.82251, 71.2440109),
				rotation: new mp.Vector3(0, 0, 15.6528492),
				freezePosition: !1,
				variations: [
					{
						componentId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict: "anim@amb@nightclub@djs@solomun@",
					animName: "temp_slmn_set_solomun",
				},
			},
			{
				model: "u_m_y_zombie_01",
				position: new mp.Vector3(432.150787, -258.405701, 70.188797),
				rotation: new mp.Vector3(0, 0, 158.965271),
				freezePosition: !0,
				variations: [
					{
						componentId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict: "amb@world_human_seat_steps@female@hands_by_sides@idle_b",
					animName: "idle_d",
				},
			},
			{
				model: "cs_orleans",
				position: new mp.Vector3(419.396484, -257.572296, 71.1543427),
				rotation: new mp.Vector3(0, 0, 65.5730667),
				freezePosition: !0,
				variations: [
					{
						componentId: 1,
						textureId: 0,
					},
				],
				animation: {
					animDict: "savecouch@",
					animName: "t_sleep_loop_couch",
				},
			},
			{
				model: "u_m_y_zombie_01",
				position: new mp.Vector3(439.608948, -257.175537, 70.687767),
				rotation: new mp.Vector3(0, 0, 175.693146),
				freezePosition: !0,
				variations: [
					{
						componentId: 1,
						textureId: 0,
					},
				],
				animation: {
					animDict: "amb@prop_human_seat_chair@female@arms_folded@idle_a",
					animName: "idle_c",
				},
			},
			{
				model: "s_m_m_movalien_01",
				position: new mp.Vector3(423.761963, -252.603699, 71.2541656),
				rotation: new mp.Vector3(0, 0, 172.20047),
				freezePosition: !1,
				variations: [
					{
						componentId: 2,
						textureId: 0,
					},
				],
				animation: {
					animDict: "amb@world_human_leaning@male@wall@back@foot_up@idle_a",
					animName: "idle_c",
				},
			},
			{
				model: "u_m_y_zombie_01",
				position: new mp.Vector3(433.298828, -258.914093, 70.2670593),
				rotation: new mp.Vector3(0, 0, 159.84407),
				freezePosition: !0,
				variations: [
					{
						componentId: 3,
						textureId: 0,
					},
				],
				scenario: "world_human_seat_wall",
			},
			{
				model: "s_m_m_movalien_01",
				position: new mp.Vector3(439.717438, -256.098236, 74.5611343),
				rotation: new mp.Vector3(0, 0, -28.8628311),
				freezePosition: !0,
				variations: [
					{
						componentId: 4,
						textureId: 0,
					},
				],
				animation: {
					animDict:
						"amb@world_human_leaning@male@wall@back@legs_crossed@idle_a",
					animName: "idle_a",
				},
			},
			{
				model: "cs_orleans",
				position: new mp.Vector3(426.336273, -255.440826, 71.2468033),
				rotation: new mp.Vector3(0, 0, 86.016983),
				freezePosition: !1,
				variations: [
					{
						componentId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict: "anim@amb@nightclub@dancers@podium_dancers@",
					animName: "hi_dance_facedj_17_v2_male^5",
				},
			},
			{
				model: "s_m_m_movalien_01",
				position: new mp.Vector3(425.25351, -254.83139, 71.2434998),
				rotation: new mp.Vector3(0, 0, -178.066101),
				freezePosition: !1,
				variations: [
					{
						componentId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict: "anim@amb@nightclub@dancers@podium_dancers@",
					animName: "hi_dance_facedj_17_v2_female^2",
				},
			},
			{
				model: "s_m_m_movalien_01",
				position: new mp.Vector3(431.423462, -253.043427, 74.5441437),
				rotation: new mp.Vector3(0, 0, 147.89209),
				freezePosition: !0,
				variations: [
					{
						componentId: 2,
						textureId: 0,
					},
				],
				animation: {
					animDict: "anim@amb@nightclub@dancers@club_ambientpeds@",
					animName: "li-mi_amb_club_06_base_female^2",
				},
			},
			{
				model: "u_m_y_zombie_01",
				position: new mp.Vector3(424.667114, -256.031097, 71.2532349),
				rotation: new mp.Vector3(0, 0, -118.734421),
				freezePosition: !1,
				variations: [
					{
						componentId: 3,
						textureId: 0,
					},
				],
				animation: {
					animDict:
						"anim@amb@nightclub@dancers@crowddance_facedj@low_intesnsity",
					animName: "li_dance_facedj_11_v1_female^3",
				},
			},
			{
				model: "u_m_m_jesus_01",
				position: new mp.Vector3(430.385315, -253.357346, 74.6730042),
				rotation: new mp.Vector3(0, 0, 159.463959),
				freezePosition: !0,
				variations: [
					{
						componentId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict: "amb@world_human_seat_wall@male@hands_in_lap@base",
					animName: "base",
				},
			},
			{
				model: "s_m_m_movalien_01",
				position: new mp.Vector3(430.678558, -254.065399, 71.690033),
				rotation: new mp.Vector3(0, 0, 83.1689987),
				freezePosition: !0,
				variations: [
					{
						componentId: 1,
						textureId: 0,
					},
				],
				scenario: "WORLD_HUMAN_STUPOR",
			},
			{
				model: "s_m_m_movalien_01",
				position: new mp.Vector3(445.069763, -261.13382, 71.235611),
				rotation: new mp.Vector3(0, 0, 164.597031),
				freezePosition: !1,
				variations: [
					{
						componentId: 5,
						textureId: 0,
					},
				],
				scenario: "WORLD_HUMAN_STUPOR",
			},
			{
				model: "u_m_y_zombie_01",
				position: new mp.Vector3(442.584229, -258.425232, 71.2430878),
				rotation: new mp.Vector3(0, 0, -140.096054),
				freezePosition: !1,
				variations: [
					{
						componentId: 3,
						textureId: 0,
					},
				],
				scenario: "WORLD_HUMAN_SMOKING_POT",
			},
			{
				model: "u_m_y_zombie_01",
				position: new mp.Vector3(439.297089, -264.426544, 71.1949387),
				rotation: new mp.Vector3(0, 0, 79.7905655),
				freezePosition: !0,
				variations: [
					{
						componentId: 3,
						textureId: 0,
					},
				],
				scenario: "WORLD_HUMAN_PICNIC",
			},
			{
				model: "s_m_m_movalien_01",
				position: new mp.Vector3(443.411011, -259.25296, 71.2518387),
				rotation: new mp.Vector3(0, 0, 26.718441),
				freezePosition: !1,
				variations: [
					{
						componentId: 2,
						textureId: 0,
					},
				],
				scenario: "WORLD_HUMAN_HANG_OUT_STREET",
			},
			{
				model: "s_m_m_movalien_01",
				position: new mp.Vector3(424.035767, -264.050537, 71.250206),
				rotation: new mp.Vector3(0, 0, -55.8904915),
				freezePosition: !1,
				variations: [
					{
						componentId: 2,
						textureId: 0,
					},
				],
				scenario: "WORLD_HUMAN_STAND_MOBILE",
			},
			{
				model: "u_m_y_zombie_01",
				position: new mp.Vector3(423.012695, -259.551514, 71.2333832),
				rotation: new mp.Vector3(0, 0, -34.9930573),
				freezePosition: !1,
				variations: [
					{
						componentId: 2,
						textureId: 0,
					},
				],
				scenario: "WORLD_HUMAN_STAND_MOBILE",
			},
			{
				model: "u_m_y_zombie_01",
				position: new mp.Vector3(420.966309, -256.126526, 71.2568207),
				rotation: new mp.Vector3(0, 0, -121.275101),
				freezePosition: !0,
				variations: [
					{
						componentId: 5,
						textureId: 0,
					},
				],
				animation: {
					animDict: "anim@scripted@carmeet@tun_meet_ig2_race@",
					animName: "base",
				},
			},
			{
				model: "u_m_y_zombie_01",
				position: new mp.Vector3(417.077698, -260.188446, 70.6770935),
				rotation: new mp.Vector3(0, 0, -102.026817),
				freezePosition: !0,
				variations: [
					{
						componentId: 2,
						textureId: 0,
					},
				],
				animation: {
					animDict: "amb@prop_human_seat_chair@male@generic_skinny@base",
					animName: "base",
				},
			},
			{
				model: "s_m_m_movalien_01",
				position: new mp.Vector3(441.412384, -261.795166, 71.2452087),
				rotation: new mp.Vector3(0, 0, -160.691208),
				freezePosition: !1,
				variations: [
					{
						componentId: 3,
						textureId: 0,
					},
				],
				animation: {
					animDict: "anim@amb@nightclub@dancers@black_madonna_entourage@",
					animName: "hi_dance_facedj_09_v2_male^5",
				},
			},
			{
				model: "a_c_rhesus",
				position: new mp.Vector3(441.567719, -263.092957, 71.2465134),
				rotation: new mp.Vector3(0, 0, 12.887846),
				freezePosition: !1,
				variations: [
					{
						componentId: 3,
						textureId: 0,
					},
				],
				animation: {
					animDict:
						"anim@amb@nightclub@dancers@crowddance_facedj@low_intesnsity",
					animName: "li_dance_facedj_13_v2_male^4",
				},
			},
			{
				model: "u_m_y_rsranger_01",
				position: new mp.Vector3(436.75412, -258.801727, 71.254631),
				rotation: new mp.Vector3(0, 0, 81.7725601),
				freezePosition: !1,
				variations: [
					{
						componentId: 2,
						textureId: 0,
					},
				],
				animation: {
					animDict:
						"anim@amb@nightclub_island@dancers@crowddance_facedj_transitions@",
					animName: "trans_dance_facedj_mi_to_li_09_v1_male^5",
				},
			},
			{
				model: "u_m_y_rsranger_01",
				position: new mp.Vector3(442.691376, -262.228912, 71.2429428),
				rotation: new mp.Vector3(0, 0, 127.189468),
				freezePosition: !1,
				variations: [
					{
						componentId: 3,
						textureId: 0,
					},
				],
				animation: {
					animDict: "anim@amb@nightclub@dancers@crowddance_facedj@",
					animName: "hi_dance_facedj_09_v1_female^3",
				},
			},
			{
				model: "a_c_rhesus",
				position: new mp.Vector3(432.228302, -254.580231, 71.2525864),
				rotation: new mp.Vector3(0, 0, -101.496841),
				freezePosition: !1,
				variations: [
					{
						componentId: 4,
						textureId: 0,
					},
				],
				animation: {
					animDict:
						"anim@amb@nightclub@dancers@club_ambientpeds@low-med_intensity",
					animName: "li-mi_amb_club_09_v1_female^3",
				},
			},
			{
				model: "u_m_y_rsranger_01",
				position: new mp.Vector3(436.243805, -258.326721, 71.2500229),
				rotation: new mp.Vector3(0, 0, 162.069061),
				freezePosition: !1,
				variations: [
					{
						componentId: 4,
						textureId: 0,
					},
				],
				animation: {
					animDict: "anim@amb@nightclub@dancers@crowddance_groups@hi_intensity",
					animName: "hi_dance_crowd_09_v1_female^1",
				},
			},
		],
		deleteObjects: [
			{
				x: 413.3616,
				y: -255.1277,
				z: 70.23516,
				radius: 1,
				model: 2580107545,
			},
			{
				x: 410.4957,
				y: -259.38,
				z: 70.23577,
				radius: 1,
				model: 977744387,
			},
			{
				x: 406.1225,
				y: -255.0734,
				z: 70.64162,
				radius: 1,
				model: 702477265,
			},
			{
				x: 406.1866,
				y: -256.1353,
				z: 70.24013,
				radius: 1,
				model: 2533307946,
			},
			{
				x: 407.1402,
				y: -255.0118,
				z: 70.24013,
				radius: 1,
				model: 2533307946,
			},
			{
				x: 406.0504,
				y: -253.9627,
				z: 70.24013,
				radius: 1,
				model: 2533307946,
			},
			{
				x: 415.6478,
				y: -250.0494,
				z: 70.62975,
				radius: 1,
				model: 4087940966,
			},
			{
				x: 418.9924,
				y: -251.3105,
				z: 70.64227,
				radius: 1,
				model: 4087940966,
			},
			{
				x: 431.9688,
				y: -255.5809,
				z: 70.2565,
				radius: 1,
				model: 3702106121,
			},
			{
				x: 434.5309,
				y: -253.83,
				z: 73.507,
				radius: 1,
				model: 2580107545,
			},
			{
				x: 427.7083,
				y: -251.3617,
				z: 73.925,
				radius: 1,
				model: 4087940966,
			},
			{
				x: 428.4743,
				y: -251.6326,
				z: 73.50294,
				radius: 1,
				model: 2533307946,
			},
			{
				x: 427.0161,
				y: -251.1125,
				z: 73.50294,
				radius: 1,
				model: 2533307946,
			},
		],
		disableStaticEmitters: ["collision_781bnhb", "collision_8cue4t5"],
		loadIPL: ["mj_startscreen_autumn"],
	},

	//intro xmas 2
	{
		id: "3",
		mainMenu: {
			playerPos: new mp.Vector3(3301.14722, 5176.35205, 19.484026),
			time: {
				hour: 21,
				minute: 0,
				second: 0,
			},
			weather: "CLEAR",
			snow: !0,
			ambientMusic: [
				"https://r2.gta5onyx.com/files/music/oneGreaterThanOne.ogg",
				"https://r2.gta5onyx.com/files/music/Sunflower.ogg",
				"https://r2.gta5onyx.com/files/music/HeatWaves.ogg",
				"https://r2.gta5onyx.com/files/music/Cities.ogg",
				"https://r2.gta5onyx.com/files/music/MoyMarmeladniy.ogg",
				"https://r2.gta5onyx.com/files/music/WhereWeComeFrom.ogg",
				"https://r2.gta5onyx.com/files/music/SilkAndCologne.ogg",
				"https://r2.gta5onyx.com/files/music/LilNasXHoliday.ogg",
			],
			splashScreen: {
				fadeIn: 1500,
				defaultSceneDuration: 5e3,
				transitionDuration: 2e3,
				camScenes: [
					{
						from: {
							pos: new mp.Vector3(3301.14722, 5176.35205, 19.484026),
							pointAt: new mp.Vector3(3300.97681, 5175.45215, 19.4872799),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.2,
							},
							fov: 50,
							dof: {
								nearDof: 1,
								farDof: 3,
								strength: 1,
								shallowMode: !0,
							},
						},
					},
					{
						from: {
							pos: new mp.Vector3(3309.06421, 5182.146, 19.9708157),
							pointAt: new mp.Vector3(3308.29077, 5181.62012, 19.9839725),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.2,
							},
							fov: 40,
							dof: {
								nearDof: 0,
								farDof: 5,
								strength: 1,
								shallowMode: !0,
							},
						},
						duration: 4e3,
					},
					{
						from: {
							pos: new mp.Vector3(3306.4397, 5178.74707, 19.5877438),
							pointAt: new mp.Vector3(3305.17603, 5177.90088, 19.6398258),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.4,
							},
							fov: 40,
							dof: {
								nearDof: 1,
								farDof: 4,
								strength: 1,
								shallowMode: !0,
							},
						},
						to: {
							pos: new mp.Vector3(3305.46997, 5179.68311, 20.0977554),
							pointAt: new mp.Vector3(3304.7561, 5177.1709, 19.8562908),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.5,
							},
							fov: 35,
							dof: {
								nearDof: 1,
								farDof: 6,
								strength: 1,
								shallowMode: !0,
							},
						},
						duration: 8e3,
					},
					{
						from: {
							pos: new mp.Vector3(3304, 5180.76416, 19.1540184),
							pointAt: new mp.Vector3(3302.8916, 5180.82861, 19.1959534),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.2,
							},
							fov: 30,
							dof: {
								nearDof: 0,
								farDof: 2,
								strength: 1,
								shallowMode: !0,
							},
						},
						duration: 4e3,
					},
					{
						from: {
							pos: new mp.Vector3(3298.63403, 5174.28076, 23.6242943),
							pointAt: new mp.Vector3(3296.86108, 5177.31299, 23.4286804),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.2,
							},
							fov: 40,
							dof: {
								nearDof: 1,
								farDof: 5,
								strength: 1,
								shallowMode: !0,
							},
						},
						duration: 4e3,
					},
					{
						from: {
							pos: new mp.Vector3(3299.49048, 5180.04736, 18.8240108),
							pointAt: new mp.Vector3(3300.23193, 5178.88965, 18.8189583),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.1,
							},
							fov: 35,
							dof: {
								nearDof: 0,
								farDof: 2,
								strength: 1,
								shallowMode: !0,
							},
						},
						to: {
							pos: new mp.Vector3(3299.49048, 5180.04736, 18.8240108),
							pointAt: new mp.Vector3(3298.98901, 5177.49365, 19.3065968),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.1,
							},
							fov: 35,
							dof: {
								nearDof: 1,
								farDof: 4,
								strength: 1,
								shallowMode: !0,
							},
						},
						duration: 7e3,
					},
					{
						from: {
							pos: new mp.Vector3(3309.93823, 5183.21484, 20.0040379),
							pointAt: new mp.Vector3(3310.96997, 5185.29688, 20.0030098),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.2,
							},
							fov: 35,
							dof: {
								nearDof: 0,
								farDof: 3,
								strength: 1,
								shallowMode: !0,
							},
						},
					},
					{
						from: {
							pos: new mp.Vector3(3301.86865, 5170.89453, 23.3784199),
							pointAt: new mp.Vector3(3301.95947, 5172.65771, 23.4355202),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.3,
							},
							fov: 40,
							dof: {
								nearDof: 0,
								farDof: 4,
								strength: 1,
								shallowMode: !0,
							},
						},
					},
					{
						from: {
							pos: new mp.Vector3(3296.71997, 5176.90771, 19.8940353),
							pointAt: new mp.Vector3(3306.66992, 5176.1416, 19.8362045),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.3,
							},
							fov: 38,
							dof: {
								nearDof: 0,
								farDof: 5,
								strength: 1,
								shallowMode: !0,
							},
						},
						to: {
							pos: new mp.Vector3(3297.15039, 5176.64062, 21.2361584),
							pointAt: new mp.Vector3(3297.68848, 5176.25049, 21.2876053),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.3,
							},
							fov: 38,
							dof: {
								nearDof: 0,
								farDof: 1,
								strength: 1,
								shallowMode: !0,
							},
						},
						duration: 6e3,
					},
					{
						from: {
							pos: new mp.Vector3(3297.15039, 5176.64062, 21.2361584),
							pointAt: new mp.Vector3(3297.68848, 5176.25049, 21.2876053),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.3,
							},
							fov: 38,
							dof: {
								nearDof: 0,
								farDof: 1,
								strength: 1,
								shallowMode: !0,
							},
						},
						duration: 2e3,
					},
					{
						from: {
							pos: new mp.Vector3(3299.86084, 5172.47852, 19.1640186),
							pointAt: new mp.Vector3(3302.76685, 5172.31689, 19.2804966),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.3,
							},
							fov: 38,
							dof: {
								nearDof: 0,
								farDof: 3,
								strength: 1,
								shallowMode: !0,
							},
						},
					},
					{
						from: {
							pos: new mp.Vector3(3304.54443, 5170.37695, 19.5930557),
							pointAt: new mp.Vector3(3307.68433, 5170.93311, 19.7903786),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.2,
							},
							fov: 40,
							dof: {
								nearDof: 0,
								farDof: 8,
								strength: 1,
								shallowMode: !0,
							},
						},
					},
					{
						from: {
							pos: new mp.Vector3(3306.94531, 5177.08398, 21.1910801),
							pointAt: new mp.Vector3(3306.7168, 5178.30762, 21.0238266),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.3,
							},
							fov: 20,
							dof: {
								nearDof: 0,
								farDof: 1,
								strength: 1,
								shallowMode: !0,
							},
						},
						to: {
							pos: new mp.Vector3(3306.94531, 5177.08398, 21.1910801),
							pointAt: new mp.Vector3(3303.40479, 5182.72852, 20.713604),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.3,
							},
							fov: 20,
							dof: {
								nearDof: 1,
								farDof: 10,
								strength: 1,
								shallowMode: !0,
							},
						},
						duration: 4e3,
					},
					{
						from: {
							pos: new mp.Vector3(3306.94531, 5177.08398, 21.1910801),
							pointAt: new mp.Vector3(3303.40479, 5182.72852, 20.713604),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.3,
							},
							fov: 20,
							dof: {
								nearDof: 1,
								farDof: 10,
								strength: 1,
								shallowMode: !0,
							},
						},
						duration: 2e3,
					},
				],
			},
		},
		peds: [
			{
				model: "a_c_cat_01",
				position: new mp.Vector3(3300.7937, 5175.38281, 19.3612022),
				rotation: new mp.Vector3(-605892501e-14, -0, -155.628113),
				freezePosition: !0,
				variations: [
					{
						componentId: 4,
						textureId: 0,
					},
				],
				animation: {
					animDict: "creatures@cat@amb@world_cat_sleeping_ground@base",
					animName: "base",
				},
			},
			{
				model: "g_f_importexport_01",
				position: new mp.Vector3(3300.41357, 5175.35107, 20.0763283),
				rotation: new mp.Vector3(0, -0, -134.862579),
				freezePosition: !0,
				variations: [
					{
						componentId: 4,
						textureId: 0,
					},
				],
				animation: {
					animDict: "anim@amb@business@bgen@bgen_no_work@",
					animName: "sit_phone_idle_01_nowork",
				},
			},
			{
				model: "a_m_y_bevhills_01",
				position: new mp.Vector3(3303.01685, 5172.32129, 19.6163921),
				rotation: new mp.Vector3(0, -0, -160.31604),
				freezePosition: !0,
				variations: [
					{
						componentId: 4,
						textureId: 0,
					},
				],
				scenario: "WORLD_HUMAN_AA_COFFEE",
			},
			{
				model: "a_f_y_tourist_01",
				position: new mp.Vector3(3302.62964, 5171.29248, 19.1639843),
				rotation: new mp.Vector3(0, 0, -43.0577049),
				freezePosition: !0,
				variations: [
					{
						componentId: 4,
						textureId: 0,
					},
				],
				animation: {
					animDict: "amb@prop_human_seat_chair@female@arms_folded@idle_a",
					animName: "idle_b",
				},
			},
			{
				model: "a_f_y_business_04",
				position: new mp.Vector3(3304.68066, 5178.32324, 19.6449108),
				rotation: new mp.Vector3(-0.0433241427, -0.000386908068, -138.585892),
				freezePosition: !0,
				variations: [
					{
						componentId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict: "anim@amb@nightclub@dancers@crowddance_facedj@",
					animName: "mi_dance_facedj_17_v1_female^4",
				},
			},
			{
				model: "u_f_y_spyactress",
				position: new mp.Vector3(3305.90527, 5170.14502, 19.1602097),
				rotation: new mp.Vector3(0, 0, 46.145359),
				freezePosition: !0,
				variations: [
					{
						componentId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict: "amb@world_human_seat_steps@female@hands_by_sides@idle_a",
					animName: "idle_a",
				},
			},
			{
				model: "a_f_y_bevhills_01",
				position: new mp.Vector3(3296.89917, 5176.70654, 23.4442654),
				rotation: new mp.Vector3(0, -0, 62.4663849),
				freezePosition: !0,
				variations: [
					{
						componentId: 1,
						textureId: 0,
					},
				],
				scenario: "WORLD_HUMAN_STAND_MOBILE",
			},
			{
				model: "u_f_y_lauren",
				position: new mp.Vector3(3304.78003, 5176.72412, 19.6582737),
				rotation: new mp.Vector3(0, -0, 17.3477669),
				freezePosition: !0,
				variations: [
					{
						componentId: 1,
						textureId: 0,
					},
				],
				animation: {
					animDict: "anim@amb@nightclub@dancers@crowddance_facedj@hi_intensity",
					animName: "hi_dance_facedj_17_v2_female^3",
				},
			},
			{
				model: "u_f_y_mistress",
				position: new mp.Vector3(3311.14526, 5185.47559, 19.6147366),
				rotation: new mp.Vector3(0, -0, 157.963928),
				freezePosition: !0,
				variations: [
					{
						componentId: 2,
						textureId: 0,
					},
				],
				animation: {
					animDict: "anim@amb@nightclub@dancers@club_ambientpeds@",
					animName: "li-mi_amb_club_06_base_female^2",
				},
			},
			{
				model: "a_f_y_vinewood_04",
				position: new mp.Vector3(3305.75439, 5174.19678, 19.1663857),
				rotation: new mp.Vector3(-1.06623716e-7, -159027747e-23, 168.74086),
				freezePosition: !0,
				variations: [
					{
						componentId: 3,
						textureId: 0,
					},
				],
				animation: {
					animDict: "amb@prop_human_seat_chair@female@legs_crossed@idle_b",
					animName: "idle_d",
				},
			},
			{
				model: "a_f_y_soucent_03",
				position: new mp.Vector3(3298.46582, 5175.23438, 23.1018276),
				rotation: new mp.Vector3(-0.541902244, 8.00448561e-8, 51.308342),
				freezePosition: !0,
				variations: [
					{
						componentId: 4,
						textureId: 0,
					},
				],
				animation: {
					animDict: "amb@world_human_seat_steps@female@hands_by_sides@idle_b",
					animName: "idle_d",
				},
			},
			{
				model: "u_f_y_jewelass_01",
				position: new mp.Vector3(3311.20239, 5184.35986, 19.6157475),
				rotation: new mp.Vector3(0, 0, 32.7526894),
				freezePosition: !0,
				variations: [
					{
						componentId: 4,
						textureId: 0,
					},
				],
				animation: {
					animDict: "missheistdockssetup1ig_10@idle_c",
					animName: "talk_pipe_c_worker2",
				},
			},
			{
				model: "u_f_y_hotposh_01",
				position: new mp.Vector3(3308.02271, 5181.35352, 19.4632721),
				rotation: new mp.Vector3(0, 0, -33.701107),
				freezePosition: !0,
				variations: [
					{
						componentId: 4,
						textureId: 0,
					},
				],
				animation: {
					animDict: "amb@prop_human_seat_bar@female@elbows_on_bar@idle_a",
					animName: "idle_b",
				},
			},
			{
				model: "a_f_y_yoga_01",
				position: new mp.Vector3(3302.13208, 5172.83838, 23.3660946),
				rotation: new mp.Vector3(0, 0, 47.9974709),
				freezePosition: !0,
				variations: [
					{
						componentId: 4,
						textureId: 0,
					},
				],
				animation: {
					animDict: "anim@mp_bedmid@left_var_02",
					animName: "f_sleep_l_loop_bighouse",
				},
			},
			{
				model: "a_m_m_bevhills_02",
				position: new mp.Vector3(3303.18799, 5182.85303, 20.4526691),
				rotation: new mp.Vector3(0, -0, -127.81752),
				freezePosition: !0,
				variations: [
					{
						componentId: 4,
						textureId: 0,
					},
				],
				animation: {
					animDict: "amb@world_human_seat_steps@male@elbows_on_knees@idle_a",
					animName: "idle_a",
				},
			},
			{
				model: "a_m_y_bevhills_02",
				position: new mp.Vector3(3308.97998, 5179.32031, 19.6153851),
				rotation: new mp.Vector3(0, 0, 42.7566147),
				freezePosition: !0,
				variations: [
					{
						componentId: 4,
						textureId: 0,
					},
				],
				animation: {
					animDict:
						"amb@world_human_leaning@female@wall@back@holding_elbow@idle_a",
					animName: "idle_a",
				},
			},
			{
				model: "a_m_y_business_02",
				position: new mp.Vector3(3305.29272, 5177.78516, 19.6450558),
				rotation: new mp.Vector3(0, -0, 141.035919),
				freezePosition: !0,
				variations: [
					{
						componentId: 4,
						textureId: 0,
					},
				],
				scenario: "WORLD_HUMAN_PARTYING",
			},
			{
				model: "a_m_y_jetski_01",
				position: new mp.Vector3(3302.54126, 5173.48242, 23.4469013),
				rotation: new mp.Vector3(-36283343e-13, 407110977e-21, 53.669796),
				freezePosition: !0,
				variations: [
					{
						componentId: 4,
						textureId: 0,
					},
				],
				animation: {
					animDict: "anim@mp_bedmid@left_var_04",
					animName: "f_sleep_l_loop_bighouse",
				},
			},
			{
				model: "a_m_m_skater_01",
				position: new mp.Vector3(3300.58594, 5178.55615, 19.6211929),
				rotation: new mp.Vector3(937666913e-23, -189575822e-30, 72.7882462),
				freezePosition: !0,
				variations: [
					{
						componentId: 4,
						textureId: 0,
					},
				],
				scenario: "WORLD_HUMAN_SUNBATHE",
			},
			{
				model: "a_m_y_latino_01",
				position: new mp.Vector3(3303.98633, 5177.26465, 19.6680241),
				rotation: new mp.Vector3(0, -0, -72.0678253),
				freezePosition: !0,
				variations: [
					{
						componentId: 4,
						textureId: 0,
					},
				],
				animation: {
					animDict: "anim@amb@nightclub@dancers@crowddance_facedj@",
					animName: "hi_dance_facedj_09_v1_male^2",
				},
			},
			{
				model: "a_c_westy",
				position: new mp.Vector3(3302.77856, 5180.86719, 19.1998558),
				rotation: new mp.Vector3(0, -0, -140.973251),
				freezePosition: !0,
				variations: [
					{
						componentId: 4,
						textureId: 0,
					},
				],
				animation: {
					animDict: "creatures@pug@amb@world_dog_sitting@idle_a",
					animName: "idle_b",
				},
			},
		],
		vehicles: [],
		deleteObjects: [],
		disableStaticEmitters: ["collision_781bnhb", "collision_8cue4t5"],
		loadIPL: ["mj_starthouse"],
	},

	//intro xmas 1
	{
		id: "4",
		mainMenu: {
			playerPos: new mp.Vector3(3278.569, 5203.673, 18.43876),
			time: {
				hour: 6,
				minute: 30,
				second: 0,
			},
			weather: "SNOWLIGHT",
			snow: !0,
			ambientMusic: [
				"https://r2.gta5onyx.com/files/music/FrostyTheSnowman.ogg",
				"https://r2.gta5onyx.com/files/music/TheJollyOldManInTheBrightRedSuit.ogg",
				"https://r2.gta5onyx.com/files/music/SantaClausIsComingToTown.ogg",
				"https://r2.gta5onyx.com/files/music/BlueChristmas.ogg",
				"https://r2.gta5onyx.com/files/music/SnowyWhiteSnowAndJingleBells.ogg",
				"https://r2.gta5onyx.com/files/music/TheMistletoeKiss.ogg",
				"https://r2.gta5onyx.com/files/music/SleighRide.ogg",
			],
			splashScreen: {
				fadeIn: 1500,
				defaultSceneDuration: 5e3,
				transitionDuration: 2e3,
				camScenes: [
					{
						from: {
							pos: new mp.Vector3(3343.965, 5168.781, 21.11119),
							pointAt: new mp.Vector3(3333.17, 5165.957, 21.12037),
							fov: 45,
							dof: {
								nearDof: 1,
								farDof: 30,
								strength: 1,
								shallowMode: !0,
							},
						},
					},
					{
						from: {
							pos: new mp.Vector3(3268.336, 5211.413, 18.65537),
							pointAt: new mp.Vector3(3269.43, 5211.533, 18.62723),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.2,
							},
							fov: 50,
							dof: {
								nearDof: 0,
								farDof: 2,
								strength: 1,
								shallowMode: !0,
							},
						},
					},
					{
						from: {
							pos: new mp.Vector3(3268.926, 5192.617, 45.67708),
							pointAt: new mp.Vector3(3306.289, 5159.876, 17.41537),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.3,
							},
							fov: 43,
							dof: {
								nearDof: 1,
								farDof: 40,
								strength: 1,
								shallowMode: !0,
							},
						},
						to: {
							pos: new mp.Vector3(3267.863, 5191.196, 45.67708),
							pointAt: new mp.Vector3(3309.299, 5170.49, 30.03579),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.3,
							},
							fov: 43,
							dof: {
								nearDof: 1,
								farDof: 40,
								strength: 1,
								shallowMode: !0,
							},
						},
						duration: 6e3,
					},
					{
						from: {
							pos: new mp.Vector3(3318.321, 5165.814, 17.56521),
							pointAt: new mp.Vector3(3320.426, 5166.352, 17.79021),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.2,
							},
							fov: 45,
							dof: {
								nearDof: 0,
								farDof: 4,
								strength: 1,
								shallowMode: !0,
							},
						},
					},
					{
						from: {
							pos: new mp.Vector3(3350.077, 5150.195, 20.04964),
							pointAt: new mp.Vector3(3352.283, 5151.631, 20.17905),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.2,
							},
							fov: 42,
							dof: {
								nearDof: 1,
								farDof: 10,
								strength: 1,
								shallowMode: !0,
							},
						},
					},
					{
						from: {
							pos: new mp.Vector3(3334.46, 5165.657, 21.67722),
							pointAt: new mp.Vector3(3334.029, 5162.108, 17.32055),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.3,
							},
							fov: 35,
							dof: {
								nearDof: 0,
								farDof: 2,
								strength: 1,
								shallowMode: !0,
							},
						},
						to: {
							pos: new mp.Vector3(3332.49, 5164.639, 21.67722),
							pointAt: new mp.Vector3(3334.029, 5162.108, 17.32055),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.2,
							},
							fov: 35,
							dof: {
								nearDof: 1,
								farDof: 4,
								strength: 1,
								shallowMode: !0,
							},
						},
						duration: 6e3,
					},
					{
						from: {
							pos: new mp.Vector3(3297.795, 5141.248, 18.55378),
							pointAt: new mp.Vector3(3308.806, 5145.54, 17.30857),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.2,
							},
							fov: 40,
							dof: {
								nearDof: 1,
								farDof: 25,
								strength: 1,
								shallowMode: !0,
							},
						},
					},
					{
						from: {
							pos: new mp.Vector3(3322.894, 5135.708, 26.22259),
							pointAt: new mp.Vector3(3315.276, 5174.919, 17.86705),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.2,
							},
							fov: 30,
							dof: {
								nearDof: 0,
								farDof: 30,
								strength: 1,
								shallowMode: !0,
							},
						},
					},
					{
						from: {
							pos: new mp.Vector3(3320.902, 5170.535, 25.05699),
							pointAt: new mp.Vector3(3323.902, 5173.854, 24.89101),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.4,
							},
							fov: 40,
							dof: {
								nearDof: 0,
								farDof: 7,
								strength: 1,
								shallowMode: !0,
							},
						},
						to: {
							pos: new mp.Vector3(3321.038, 5173.027, 18.01521),
							pointAt: new mp.Vector3(3323.44, 5175.569, 18.47395),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.2,
							},
							fov: 38,
							dof: {
								nearDof: 0,
								farDof: 7,
								strength: 1,
								shallowMode: !0,
							},
						},
						duration: 6e3,
					},
					{
						from: {
							pos: new mp.Vector3(3295.012, 5192.766, 17.71537),
							pointAt: new mp.Vector3(3293.888, 5192.356, 17.76823),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.2,
							},
							fov: 40,
							dof: {
								nearDof: 0,
								farDof: 3,
								strength: 1,
								shallowMode: !0,
							},
						},
					},
					{
						from: {
							pos: new mp.Vector3(3200.353, 5234.18, 24.553),
							pointAt: new mp.Vector3(3203.352, 5230.677, 24.49544),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.2,
							},
							fov: 50,
							dof: {
								nearDof: 0,
								farDof: 8,
								strength: 1,
								shallowMode: !0,
							},
						},
					},
					{
						from: {
							pos: new mp.Vector3(3313.457, 5177.349, 20.06018),
							pointAt: new mp.Vector3(3329.281, 5159.19, 17.49922),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.5,
							},
							fov: 35,
							dof: {
								nearDof: 0,
								farDof: 10,
								strength: 1,
								shallowMode: !0,
							},
						},
						to: {
							pos: new mp.Vector3(3314.486, 5178.216, 20.06018),
							pointAt: new mp.Vector3(3320.559, 5165.96, 17.45631),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.2,
							},
							fov: 35,
							dof: {
								nearDof: 0,
								farDof: 10,
								strength: 1,
								shallowMode: !0,
							},
						},
						duration: 6e3,
					},
				],
			},
		},
		peds: [
			{
				model: "a_m_m_eastsa_02",
				position: new mp.Vector3(3370.22852, 5184.81201, 1.45543039),
				rotation: new mp.Vector3(0, 0, -14.2515755),
				freezePosition: !1,
				variations: [
					{
						componentId: 0,
						textureId: 0,
					},
				],
				scenario: "WORLD_HUMAN_STAND_FISHING",
			},
			{
				model: "ig_talina",
				position: new mp.Vector3(3309.1604, 5170.56934, 23.5167542),
				rotation: new mp.Vector3(0, 0, -131.919983),
				freezePosition: !0,
				variations: [
					{
						componentId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict: "anim@amb@nightclub@dancers@club_ambientpeds@",
					animName: "li-mi_amb_club_06_base_male^3",
				},
			},
			{
				model: "a_m_y_downtown_01",
				position: new mp.Vector3(3323.01367, 5180.98291, 18.4101143),
				rotation: new mp.Vector3(0, 0, -82.6674271),
				freezePosition: !1,
				variations: [
					{
						componentId: 1,
						textureId: 0,
					},
				],
				scenario: "PROP_HUMAN_BBQ",
			},
			{
				model: "a_c_husky",
				position: new mp.Vector3(3319.81567, 5165.6543, 17.7991924),
				rotation: new mp.Vector3(0, 0, 36.8841515),
				freezePosition: !0,
				variations: [
					{
						componentId: 1,
						textureId: 0,
					},
				],
				animation: {
					animDict: "creatures@retriever@amb@world_dog_sitting@idle_a",
					animName: "idle_c",
				},
			},
			{
				model: "a_f_m_soucent_01",
				position: new mp.Vector3(3317.62842, 5183.04688, 19.1395645),
				rotation: new mp.Vector3(0, 0, 125.999306),
				freezePosition: !0,
				variations: [
					{
						componentId: 2,
						textureId: 0,
					},
				],
				animation: {
					animDict: "amb@prop_human_seat_chair@female@arms_folded@base",
					animName: "base",
				},
			},
			{
				model: "ig_brucie2",
				position: new mp.Vector3(3334.50806, 5163.6123, 18.8601246),
				rotation: new mp.Vector3(0, 0, 172.036835),
				freezePosition: !0,
				variations: [
					{
						componentId: 3,
						textureId: 0,
					},
				],
				animation: {
					animDict: "mini@repair",
					animName: "fixing_a_player",
				},
			},
			{
				model: "a_c_rabbit_01",
				position: new mp.Vector3(3269.65747, 5211.47559, 18.4818153),
				rotation: new mp.Vector3(0, 0, 134.136063),
				freezePosition: !1,
				variations: [
					{
						componentId: 4,
						textureId: 0,
					},
				],
				animation: {
					animDict: "creatures@rabbit@amb@world_rabbit_eating@idle_a",
					animName: "idle_c",
				},
			},
			{
				model: "a_c_deer",
				position: new mp.Vector3(3203.88501, 5229.93311, 24.417963),
				rotation: new mp.Vector3(0, 0, 33.6960068),
				freezePosition: !1,
				variations: [
					{
						componentId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict: "creatures@deer@amb@world_deer_grazing@idle_a",
					animName: "idle_b",
				},
			},
			{
				model: "a_c_deer",
				position: new mp.Vector3(3200.8103, 5231.96045, 24.7930107),
				rotation: new mp.Vector3(0, 0, -100.823029),
				freezePosition: !1,
				variations: [
					{
						componentId: 3,
						textureId: 0,
					},
				],
				animation: {
					animDict: "creatures@deer@amb@world_deer_grazing@idle_a",
					animName: "idle_a",
				},
			},
			{
				model: "a_c_crow",
				position: new mp.Vector3(3322.33032, 5136.71094, 25.8094921),
				rotation: new mp.Vector3(0, 0, -93.0428467),
				freezePosition: !0,
				variations: [
					{
						componentId: 2,
						textureId: 0,
					},
				],
				animation: {
					animDict: "creatures@crow@amb@world_crow_feeding@idle_a",
					animName: "idle_c",
				},
			},
			{
				model: "a_c_cat_01",
				position: new mp.Vector3(3313.90186, 5180.23389, 19.244772),
				rotation: new mp.Vector3(0, 0, 89.9555435),
				freezePosition: !0,
				variations: [
					{
						componentId: 3,
						textureId: 0,
					},
				],
				animation: {
					animDict: "creatures@cat@amb@world_cat_sleeping_ground@idle_a",
					animName: "idle_a",
				},
			},
			{
				model: "ig_djtalaurelia",
				position: new mp.Vector3(3312.91431, 5174.03906, 19.6046715),
				rotation: new mp.Vector3(0, 0, -38.0713577),
				freezePosition: !0,
				variations: [
					{
						componentId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict:
						"amb@world_human_leaning@female@wall@back@holding_elbow@idle_a",
					animName: "idle_a",
				},
			},
			{
				model: "ig_natalia",
				position: new mp.Vector3(3352.28442, 5151.26563, 19.5803242),
				rotation: new mp.Vector3(0, 0, -86.9393692),
				freezePosition: !0,
				variations: [
					{
						componentId: 1,
						textureId: 0,
					},
				],
				animation: {
					animDict: "amb@world_human_seat_steps@female@hands_by_sides@idle_a",
					animName: "idle_b",
				},
			},
			{
				model: "ig_chengsr",
				position: new mp.Vector3(3333.19434, 5163.78418, 18.2827778),
				rotation: new mp.Vector3(0, 0, -128.750259),
				freezePosition: !1,
				variations: [
					{
						componentId: 5,
						textureId: 0,
					},
				],
				scenario: "WORLD_HUMAN_SMOKING",
			},
			{
				model: "ig_joeminuteman",
				position: new mp.Vector3(3352.31885, 5150.58545, 19.6126442),
				rotation: new mp.Vector3(0, 0, -93.9699249),
				freezePosition: !0,
				variations: [
					{
						componentId: 3,
						textureId: 0,
					},
				],
				animation: {
					animDict: "amb@world_human_seat_steps@male@elbows_on_knees@idle_a",
					animName: "idle_b",
				},
			},
		],
		vehicles: [
			{
				model: "sadler2",
				position: new mp.Vector3(3333.436, 5160.256, 18.03778),
				rotation: new mp.Vector3(0, 0, -21.69901),
				colors: [111, 111],
				numberPlate: "6TRJ244",
				engine: !1,
				doors: {
					4: !0,
				},
			},
			{
				model: "asea2",
				position: new mp.Vector3(3329.896, 5148.669, 17.79387),
				rotation: new mp.Vector3(0, 0, -49.22009),
				colors: [111, 111],
				numberPlate: "6LNE878",
				engine: !1,
			},
		],
		deleteObjects: [
			{
				x: 3284.033,
				y: 5183.909,
				z: 17.40463,
				radius: 1,
				model: 1430257647,
			},
			{
				x: 3280.056,
				y: 5182.129,
				z: 17.41824,
				radius: 1,
				model: -2084538847,
			},
			{
				x: 3279.057,
				y: 5183.562,
				z: 17.42972,
				radius: 1,
				model: -2084538847,
			},
			{
				x: 3280.868,
				y: 5185.967,
				z: 17.40671,
				radius: 1,
				model: -2084538847,
			},
			{
				x: 3282.968,
				y: 5188.854,
				z: 17.54349,
				radius: 1,
				model: -2084538847,
			},
			{
				x: 3285.258,
				y: 5189.526,
				z: 17.4549,
				radius: 1,
				model: -2084538847,
			},
			{
				x: 3284.424,
				y: 5190.939,
				z: 17.44394,
				radius: 1,
				model: -2084538847,
			},
			{
				x: 3283.412,
				y: 5187.147,
				z: 17.54727,
				radius: 1,
				model: -2084538847,
			},
			{
				x: 3281.382,
				y: 5184.354,
				z: 17.49258,
				radius: 1,
				model: -2084538847,
			},
			{
				x: 3285.369,
				y: 5178.51,
				z: 17.46924,
				radius: 1,
				model: -634939447,
			},
			{
				x: 3287.369,
				y: 5180.144,
				z: 17.55673,
				radius: 1,
				model: -634939447,
			},
			{
				x: 3287.635,
				y: 5181.479,
				z: 17.50372,
				radius: 1,
				model: -634939447,
			},
			{
				x: 3289.756,
				y: 5183.258,
				z: 17.50137,
				radius: 1,
				model: -634939447,
			},
			{
				x: 3290.468,
				y: 5185.189,
				z: 17.44962,
				radius: 1,
				model: -634939447,
			},
			{
				x: 3290.935,
				y: 5191.012,
				z: 17.3992,
				radius: 1,
				model: -1572018818,
			},
			{
				x: 3292.416,
				y: 5192.964,
				z: 17.37476,
				radius: 1,
				model: -476379988,
			},
			{
				x: 3299.876,
				y: 5197.479,
				z: 17.00595,
				radius: 1,
				model: -2129526670,
			},
			{
				x: 3295.948,
				y: 5195.787,
				z: 17.57071,
				radius: 1,
				model: -1992580192,
			},
			{
				x: 3303.843,
				y: 5187.63,
				z: 17.76636,
				radius: 1,
				model: -130812911,
			},
			{
				x: 3318.349,
				y: 5183.484,
				z: 17.42154,
				radius: 1,
				model: 670963709,
			},
			{
				x: 3324.576,
				y: 5175.643,
				z: 17.39679,
				radius: 1,
				model: 667168444,
			},
			{
				x: 3314.65,
				y: 5181.181,
				z: 19.01733,
				radius: 1,
				model: -380698483,
			},
			{
				x: 3313.189,
				y: 5174.06,
				z: 18.60385,
				radius: 1,
				model: -2084538847,
			},
			{
				x: 3311.008,
				y: 5175.305,
				z: 20.53372,
				radius: 1,
				model: 123739945,
			},
			{
				x: 3311.51,
				y: 5177.44,
				z: 18.58679,
				radius: 1,
				model: 1458701228,
			},
			{
				x: 3316.377,
				y: 5183.214,
				z: 18.75513,
				radius: 1,
				model: -199904194,
			},
			{
				x: 3332.147,
				y: 5165.676,
				z: 17.45877,
				radius: 1,
				model: -774156031,
			},
			{
				x: 3337.13,
				y: 5163.469,
				z: 17.2767,
				radius: 1,
				model: -171729071,
			},
			{
				x: 3337.178,
				y: 5161.657,
				z: 17.47769,
				radius: 1,
				model: 212098417,
			},
			{
				x: 3335.966,
				y: 5153.887,
				z: 17.29013,
				radius: 1,
				model: 765541575,
			},
			{
				x: 3334.546,
				y: 5151.686,
				z: 17.23459,
				radius: 1,
				model: 765541575,
			},
			{
				x: 3332.455,
				y: 5149.065,
				z: 17.24597,
				radius: 1,
				model: 1072616162,
			},
			{
				x: 3331.057,
				y: 5147.357,
				z: 17.34763,
				radius: 1,
				model: 765541575,
			},
			{
				x: 3324.384,
				y: 5168.58,
				z: 17.42737,
				radius: 1,
				model: 731682010,
			},
			{
				x: 3333.479,
				y: 5164.159,
				z: 17.31213,
				radius: 1,
				model: -921781850,
			},
			{
				x: 3326.957,
				y: 5187.98,
				z: 17.22168,
				radius: 1,
				model: -1685705098,
			},
			{
				x: 3288.956,
				y: 5190.982,
				z: 17.40176,
				radius: 1,
				model: -1714859751,
			},
			{
				x: 3310.609,
				y: 5159.144,
				z: 17.40176,
				radius: 1,
				model: -157551270,
			},
			{
				x: 3303.46,
				y: 5184.926,
				z: 18.71429,
				radius: 1,
				model: 129608276,
			},
			{
				x: 3301.497,
				y: 5184.78,
				z: 17.92828,
				radius: 1,
				model: 1270590574,
			},
			{
				x: 3306.637,
				y: 5195.023,
				z: 17.42139,
				radius: 1,
				model: -1782242710,
			},
		],
		disableStaticEmitters: ["collision_781bnhb", "collision_8cue4t5"],
		loadIPL: ["mj_startscreen_winter"],
	},
	//intro streetrace
	{
		id: "5",
		mainMenu: {
			playerPos: new mp.Vector3(385.223755, -752.47345, 26.4760361),
			time: {
				hour: 1,
				minute: 10,
				second: 0,
			},
			weather: "CLEAR",
			snow: !1,
			ambientMusic: [
				"https://r2.gta5onyx.com/files/music/DameMais.ogg",
				"https://r2.gta5onyx.com/files/music/EyezOnEm.ogg",
				"https://r2.gta5onyx.com/files/music/Komarovo.ogg",
				"https://r2.gta5onyx.com/files/music/METAMORPHOSIS.ogg",
				"https://r2.gta5onyx.com/files/music/Slay3r.ogg",
				"https://r2.gta5onyx.com/files/music/Split.ogg",
				"https://r2.gta5onyx.com/files/music/THIEF_IN_THE_NIGHT.ogg",
				"https://r2.gta5onyx.com/files/music/Vampire.ogg",
				"https://r2.gta5onyx.com/files/music/SLOWDAZE.ogg",
				"https://r2.gta5onyx.com/files/music/IceCreamMan.ogg",
				"https://r2.gta5onyx.com/files/music/HotlineDEATHWISH.ogg",
			],
			splashScreen: {
				fadeIn: 1500,
				defaultSceneDuration: 7e3,
				transitionDuration: 2e3,
				camScenes: [
					{
						from: {
							pos: new mp.Vector3(377.377, -735.7278, 30.96309),
							pointAt: new mp.Vector3(380.9797, -749.7139, 28.29322),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.4,
							},
							fov: 45,
							dof: {
								nearDof: 1,
								farDof: 30,
								strength: 1,
								shallowMode: !0,
							},
						},
						duration: 1e4,
					},
					{
						from: {
							pos: new mp.Vector3(385.2976, -748.5569, 28.96871),
							pointAt: new mp.Vector3(386.5763, -752.4672, 28.8455),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.4,
							},
							fov: 45,
							dof: {
								nearDof: 0,
								farDof: 7,
								strength: 1,
								shallowMode: !0,
							},
						},
						to: {
							pos: new mp.Vector3(384.0747, -749.8177, 28.96871),
							pointAt: new mp.Vector3(386.5763, -752.4672, 28.8455),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.4,
							},
							fov: 45,
							dof: {
								nearDof: 0,
								farDof: 7,
								strength: 1,
								shallowMode: !0,
							},
						},
						duration: 8e3,
					},
					{
						from: {
							pos: new mp.Vector3(380.3275, -750.2731, 29.09298),
							pointAt: new mp.Vector3(378.9577, -752.2989, 29.1176),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.2,
							},
							fov: 40,
							dof: {
								nearDof: 1,
								farDof: 10,
								strength: 1,
								shallowMode: !0,
							},
						},
					},
					{
						from: {
							pos: new mp.Vector3(378.4597, -763.6951, 29.21956),
							pointAt: new mp.Vector3(377.0826, -765.6047, 29.12883),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.2,
							},
							fov: 45,
							dof: {
								nearDof: 1,
								farDof: 5,
								strength: 1,
								shallowMode: !0,
							},
						},
					},
					{
						from: {
							pos: new mp.Vector3(381.5022, -744.9899, 29.41807),
							pointAt: new mp.Vector3(379.0538, -743.9249, 29.23175),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.6,
							},
							fov: 43,
							dof: {
								nearDof: 0,
								farDof: 12,
								strength: 1,
								shallowMode: !0,
							},
						},
						to: {
							pos: new mp.Vector3(384.4003, -745.272, 29.41807),
							pointAt: new mp.Vector3(375.356, -748.177, 29.32811),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.7,
							},
							fov: 43,
							dof: {
								nearDof: 0,
								farDof: 12,
								strength: 1,
								shallowMode: !0,
							},
						},
						duration: 8e3,
					},
					{
						from: {
							pos: new mp.Vector3(388.1834, -768.0557, 29.25917),
							pointAt: new mp.Vector3(387.0593, -766.274, 29.16228),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.3,
							},
							fov: 45,
							dof: {
								nearDof: 0,
								farDof: 15,
								strength: 1,
								shallowMode: !0,
							},
						},
					},
					{
						from: {
							pos: new mp.Vector3(382.7247, -770.4851, 29.1062),
							pointAt: new mp.Vector3(383.4579, -768.8051, 29.21866),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.3,
							},
							fov: 40,
							dof: {
								nearDof: 0,
								farDof: 6,
								strength: 1,
								shallowMode: !0,
							},
						},
					},
					{
						from: {
							pos: new mp.Vector3(393.2626, -743.986, 28.9729),
							pointAt: new mp.Vector3(392.1345, -742.7717, 28.97658),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.4,
							},
							fov: 40,
							dof: {
								nearDof: 0,
								farDof: 5,
								strength: 1,
								shallowMode: !0,
							},
						},
						to: {
							pos: new mp.Vector3(392.1189, -744.3188, 28.9729),
							pointAt: new mp.Vector3(391.5744, -743.0128, 28.97133),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.4,
							},
							fov: 40,
							dof: {
								nearDof: 0,
								farDof: 5,
								strength: 1,
								shallowMode: !0,
							},
						},
						duration: 8e3,
					},
					{
						from: {
							pos: new mp.Vector3(387.5726, -733.6839, 29.58487),
							pointAt: new mp.Vector3(387.551, -734.8198, 29.62854),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.3,
							},
							fov: 47,
							dof: {
								nearDof: 1,
								farDof: 25,
								strength: 1,
								shallowMode: !0,
							},
						},
					},
					{
						from: {
							pos: new mp.Vector3(386.1906, -774.1548, 39.84564),
							pointAt: new mp.Vector3(386.0655, -773.2357, 39.46035),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.2,
							},
							fov: 42,
							dof: {
								nearDof: 0,
								farDof: 40,
								strength: 1,
								shallowMode: !0,
							},
						},
					},
					{
						from: {
							pos: new mp.Vector3(402.0863, -745.0959, 29.26962),
							pointAt: new mp.Vector3(394.05, -756.7403, 28.99414),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.4,
							},
							fov: 40,
							dof: {
								nearDof: 0,
								farDof: 40,
								strength: 1,
								shallowMode: !0,
							},
						},
						to: {
							pos: new mp.Vector3(402.0863, -745.0959, 29.26962),
							pointAt: new mp.Vector3(390.9113, -754.5637, 28.99414),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.4,
							},
							fov: 38,
							dof: {
								nearDof: 0,
								farDof: 40,
								strength: 1,
								shallowMode: !0,
							},
						},
						duration: 8e3,
					},
					{
						from: {
							pos: new mp.Vector3(375.26, -743.4791, 30.09448),
							pointAt: new mp.Vector3(375.8797, -744.1419, 30.11174),
							shake: {
								type: "HAND_SHAKE",
								amplitude: 0.3,
							},
							fov: 50,
							dof: {
								nearDof: 0,
								farDof: 3,
								strength: 1,
								shallowMode: !0,
							},
						},
					},
				],
			},
		},
		peds: [
			{
				model: "mp_m_waremech_01",
				position: new mp.Vector3(375.833344, -750.473755, 29.3569317),
				rotation: new mp.Vector3(0, 0, -14.1179447),
				freezePosition: !0,
				variations: [
					{
						componentId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict: "anim@amb@warehouse@toolbox@",
					animName: "idle",
				},
			},
			{
				model: "g_m_y_azteca_01",
				position: new mp.Vector3(382.921631, -746.786072, 29.2888088),
				rotation: new mp.Vector3(0, 0, 13.9447088),
				freezePosition: !1,
				variations: [
					{
						componentId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict: "anim@amb@nightclub@dancers@crowddance_facedj@",
					animName: "hi_dance_facedj_09_v1_male^5",
				},
			},
			{
				model: "g_m_y_armgoon_02",
				position: new mp.Vector3(381.211029, -745.451416, 29.2994308),
				rotation: new mp.Vector3(0, 0, -130.78714),
				freezePosition: !1,
				variations: [
					{
						componentId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict: "anim@amb@nightclub_island@dancers@crowddance_facedj@",
					animName: "hi_dance_facedj_09_v1_male^3",
				},
			},
			{
				model: "ig_g",
				position: new mp.Vector3(386.578705, -773.186829, 39.1333656),
				rotation: new mp.Vector3(0, 0, 38.1464691),
				freezePosition: !0,
				variations: [
					{
						componentId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict: "anim@amb@nightclub@dancers@club_ambientpeds@",
					animName: "li-mi_amb_club_06_base_male^3",
				},
			},
			{
				model: "ig_jimmydisanto",
				position: new mp.Vector3(381.563049, -767.375488, 29.124464),
				rotation: new mp.Vector3(0, 0, 89.2119217),
				freezePosition: !0,
				variations: [
					{
						componentId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict: "switch@franklin@bed",
					animName: "bed_reading_loop",
				},
			},
			{
				model: "ig_hao",
				position: new mp.Vector3(375.720337, -761.51416, 29.2975616),
				rotation: new mp.Vector3(0, 0, 109.77182),
				freezePosition: !0,
				variations: [
					{
						componentId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict:
						"anim@scripted@submarine@special_peds@pavel@hs4_pavel_ig1_screens",
					animName: "base_idle",
				},
			},
			{
				model: "ig_stretch",
				position: new mp.Vector3(384.927551, -753.143372, 28.7136803),
				rotation: new mp.Vector3(0, 0, -8.89052868),
				freezePosition: !0,
				variations: [
					{
						componentId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict: "amb@world_human_seat_steps@male@hands_in_lap@idle_b",
					animName: "idle_d",
				},
			},
			{
				model: "ig_sol",
				position: new mp.Vector3(385.874603, -752.231567, 29.2961349),
				rotation: new mp.Vector3(0, 0, 101.471817),
				freezePosition: !1,
				variations: [
					{
						componentId: 0,
						textureId: 0,
					},
				],
				scenario: "WORLD_HUMAN_SMOKING",
			},
			{
				model: "u_m_m_jesus_01",
				position: new mp.Vector3(383.979584, -742.300659, 29.2979431),
				rotation: new mp.Vector3(0, 0, -6.37612915),
				freezePosition: !0,
				variations: [
					{
						componentId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict: "anim@amb@board_room@diagram_blueprints@",
					animName: "base_amy_skater_01",
				},
			},
			{
				model: "ig_kerrymcintosh",
				position: new mp.Vector3(378.332001, -743.662354, 29.2526526),
				rotation: new mp.Vector3(0, 0, -110.376442),
				freezePosition: !0,
				variations: [
					{
						componentId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict: "anim@amb@nightclub@djs@black_madonna@",
					animName: "temp_blkmdna_set_blackmadonna",
				},
			},
			{
				model: "s_f_y_bartender_01",
				position: new mp.Vector3(382.35672, -744.737732, 29.2939701),
				rotation: new mp.Vector3(0, 0, -177.676468),
				freezePosition: !1,
				variations: [
					{
						componentId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict: "anim@amb@nightclub@dancers@crowddance_groups@hi_intensity",
					animName: "hi_dance_crowd_09_v1_female^2",
				},
			},
			{
				model: "s_f_y_clubbar_01",
				position: new mp.Vector3(382.078339, -746.638733, 29.2945805),
				rotation: new mp.Vector3(0, 0, -17.0082245),
				freezePosition: !1,
				variations: [
					{
						componentId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict: "anim@amb@nightclub@dancers@crowddance_facedj@",
					animName: "hi_dance_facedj_09_v1_female^5",
				},
			},
			{
				model: "a_f_y_vinewood_02",
				position: new mp.Vector3(381.468536, -769.003723, 28.8044434),
				rotation: new mp.Vector3(0, 0, 45.0387268),
				freezePosition: !0,
				variations: [
					{
						componentId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict: "amb@prop_human_seat_chair_mp@female@heels@idle_b",
					animName: "idle_e",
				},
			},
			{
				model: "ig_paige",
				position: new mp.Vector3(388.1091, -766.854187, 29.7517872),
				rotation: new mp.Vector3(0, 0, 86.4402313),
				freezePosition: !0,
				variations: [
					{
						componentId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict: "anim@amb@business@bgen@bgen_no_work@",
					animName: "sit_phone_phoneputdown_sleeping-noworkfemale",
				},
			},
			{
				model: "u_f_y_bikerchic",
				position: new mp.Vector3(387.239319, -735.206177, 29.2523479),
				rotation: new mp.Vector3(0, 0, 127.113464),
				freezePosition: !0,
				variations: [
					{
						componentId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict: "misschinese2_crystalmazemcs1_ig",
					animName: "bar_peds_action_janet",
				},
			},
			{
				model: "g_f_y_families_01",
				position: new mp.Vector3(376.845032, -765.207275, 29.0629921),
				rotation: new mp.Vector3(0, 0, 14.0541124),
				freezePosition: !0,
				variations: [
					{
						componentId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict: "amb@world_human_seat_steps@female@hands_by_sides@idle_a",
					animName: "idle_b",
				},
			},
			{
				model: "ig_russiandrunk",
				position: new mp.Vector3(379.013336, -752.542603, 29.2972641),
				rotation: new mp.Vector3(0, 0, 77.968338),
				freezePosition: !0,
				variations: [
					{
						componentId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict: "mini@repair",
					animName: "fixing_a_player",
				},
			},
			{
				model: "u_m_y_sbike",
				position: new mp.Vector3(389.367645, -739.203064, 29.2988548),
				rotation: new mp.Vector3(0, 0, 107.620529),
				freezePosition: !0,
				variations: [
					{
						componentId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict: "amb@world_human_leaning@male@wall@back@foot_up@idle_a",
					animName: "idle_a",
				},
			},
			{
				model: "u_m_y_party_01",
				position: new mp.Vector3(391.176788, -760.971252, 28.8080997),
				rotation: new mp.Vector3(0, 0, 82.8496628),
				freezePosition: !0,
				variations: [
					{
						componentId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict: "amb@prop_human_seat_chair@female@arms_folded@idle_a",
					animName: "idle_a",
				},
			},
			{
				model: "ig_tylerdix",
				position: new mp.Vector3(375.871948, -744.391785, 29.9363499),
				rotation: new mp.Vector3(0, 0, 161.554749),
				freezePosition: !0,
				variations: [
					{
						componentId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict: "misstattoo_parlour@shop_ig_4",
					animName: "customer_loop",
				},
			},
			{
				model: "g_f_y_ballas_01",
				position: new mp.Vector3(375.792847, -745.591858, 29.923439),
				rotation: new mp.Vector3(0, 0, 9.8265543),
				freezePosition: !0,
				variations: [
					{
						componentId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict: "random@shop_tattoo",
					animName: "_idle_c",
				},
			},
			{
				model: "g_f_y_vagos_01",
				position: new mp.Vector3(377.042969, -737.39917, 30.4323769),
				rotation: new mp.Vector3(0, 0, -144.140076),
				freezePosition: !0,
				variations: [
					{
						componentId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict: "amb@world_human_seat_steps@female@hands_by_sides@idle_b",
					animName: "idle_f",
				},
			},
			{
				model: "ig_talcc",
				position: new mp.Vector3(379.111053, -768.750488, 28.8235931),
				rotation: new mp.Vector3(0, 0, -84.8498764),
				freezePosition: !0,
				variations: [
					{
						componentId: 0,
						textureId: 0,
					},
				],
				animation: {
					animDict: "amb@prop_human_seat_chair@male@left_elbow_on_knee@idle_a",
					animName: "idle_c",
				},
			},
		],
		vehicles: [
			{
				model: "g63",
				position: new mp.Vector3(384.219, -739.7361, 28.8383),
				rotation: new mp.Vector3(0, 0, -4.45112),
				colors: [12, 42],
				freezePosition: !1,
				lights: 2,
				numberPlate: "LENDOS",
				engine: !1,
				dirt: 20,
				modkit: 1079,
				doors: {
					5: !0,
				},
				tuning: {
					0: 8,
					1: 14,
					2: 11,
					3: 15,
					4: 9,
					5: 8,
					6: 19,
					7: 10,
					8: 6,
					10: 2,
					37: 16,
					42: 5,
					44: 0,
					47: 3,
					48: 58,
				},
			},
			{
				model: "gt63s",
				position: new mp.Vector3(385.1269, -753.7559, 28.93059),
				rotation: new mp.Vector3(0, 0, 92.47385),
				colors: [0, 42],
				freezePosition: !0,
				lights: 2,
				numberPlate: "KILL4",
				engine: !0,
				dirt: 35,
				modkit: 1088,
				doors: {
					1: !0,
				},
				tuning: {
					0: 14,
					1: 14,
					2: 17,
					3: 8,
					4: 7,
					5: 3,
					6: 1,
					7: 5,
					8: 0,
					9: 4,
					10: 1,
					37: 1,
					42: 1,
					43: 1,
					44: 1,
					47: 2,
					48: 61,
				},
			},
			{
				model: "camaro2",
				position: new mp.Vector3(376.6736, -766.9799, 28.45859),
				rotation: new mp.Vector3(0, 0, -10.07295),
				colors: [42, 28],
				freezePosition: !0,
				lights: 2,
				numberPlate: "B4MBLB",
				engine: !1,
				dirt: 0,
				modkit: 1033,
				tuning: {
					0: 2,
					1: 5,
					2: 1,
					3: 2,
					4: 1,
					5: 1,
					6: 5,
					7: 11,
					8: 2,
					9: 1,
					42: 2,
					44: 0,
					46: 2,
					47: 2,
					48: 9,
				},
			},
			{
				model: "e63s",
				position: new mp.Vector3(387.8112, -767.0849, 28.85085),
				rotation: new mp.Vector3(0, 0, 5.276103),
				colors: [0, 35],
				freezePosition: !0,
				lights: 2,
				numberPlate: "ECL4S5",
				engine: !1,
				dirt: 35,
				modkit: 1060,
				tuning: {
					0: 8,
					1: 8,
					2: 4,
					3: 1,
					4: 2,
					5: 1,
					7: 1,
					8: 2,
					9: 4,
					27: 2,
					32: 0,
					33: 6,
					37: 1,
					44: 0,
					46: 2,
					47: 2,
					48: 51,
				},
			},
			{
				model: "m3e46",
				position: new mp.Vector3(376.5809, -751.9976, 28.6635),
				rotation: new mp.Vector3(0, 0, -100.9058),
				colors: [63, 28],
				freezePosition: !0,
				lights: 2,
				numberPlate: "MSTWNDT",
				engine: !0,
				dirt: 60,
				modkit: 1110,
				doors: {
					4: !0,
				},
				tuning: {
					0: 9,
					1: 0,
					2: 3,
					4: 1,
					5: 1,
					6: 1,
					7: 4,
					8: 1,
					9: 1,
					10: 1,
					42: 1,
					43: 2,
					44: 1,
					47: 0,
					48: 32,
				},
			},
			{
				model: "supragr",
				position: new mp.Vector3(391.7046, -741.0031, 28.66117),
				rotation: new mp.Vector3(0, 0, 165.3623),
				colors: [111, 0],
				freezePosition: !1,
				lights: 2,
				numberPlate: "A80THBST",
				engine: !1,
				dirt: 30,
				modkit: 1169,
				tuning: {
					0: 1,
					1: 0,
					2: 0,
					4: 0,
					7: 0,
					15: 3,
					23: 245,
					48: 10,
				},
			},
			{
				model: "cayenne2",
				position: new mp.Vector3(384.3304, -766.7307, 28.69851),
				rotation: new mp.Vector3(0, 0, 175.3848),
				colors: [22, 28],
				freezePosition: !1,
				lights: 2,
				numberPlate: "R1MU5",
				engine: !1,
				dirt: 20,
				modkit: 1038,
				tuning: {
					0: 4,
					1: 2,
					2: 3,
					3: 2,
					4: 2,
					5: 2,
					6: 3,
					7: 2,
					8: 9,
					9: 0,
					10: 3,
					15: 3,
					42: 3,
					44: 1,
					47: 2,
					48: 32,
				},
			},
			{
				model: "nisgtr",
				position: new mp.Vector3(380.4236, -740.4861, 28.60998),
				rotation: new mp.Vector3(0, 0, -173.6153),
				colors: [35, 0],
				freezePosition: !1,
				lights: 2,
				numberPlate: "P0UL4L",
				engine: !1,
				dirt: 30,
				modkit: 1133,
				tuning: {
					0: 3,
					1: 2,
					2: 1,
					3: 2,
					15: 3,
					48: 4,
				},
			},
			{
				model: "m850",
				position: new mp.Vector3(387.5463, -740.5361, 28.83366),
				rotation: new mp.Vector3(0, 0, -174.0692),
				colors: [61, 0],
				freezePosition: !1,
				lights: 2,
				numberPlate: "K008KB",
				engine: !1,
				dirt: 15,
				modkit: 1117,
				tuning: {
					0: 3,
					3: 0,
					15: 3,
				},
			},
			{
				model: "s15",
				position: new mp.Vector3(391.2956, -766.3629, 28.87113),
				rotation: new mp.Vector3(0, 0, 7.494022),
				colors: [111, 28],
				freezePosition: !1,
				lights: 2,
				numberPlate: "51IV4",
				engine: !1,
				dirt: 30,
				modkit: 1158,
				tuning: {
					0: 5,
					1: 2,
					2: 1,
					3: 1,
					6: 0,
					7: 0,
					15: 3,
					42: 0,
					47: 0,
					48: 9,
				},
			},
			{
				model: "taycan",
				position: new mp.Vector3(387.3287, -750.9032, 28.9779),
				rotation: new mp.Vector3(0, 0, 88.14371),
				colors: [111, 28],
				freezePosition: !1,
				lights: 2,
				numberPlate: "TM45K",
				engine: !1,
				dirt: 25,
				modkit: 1171,
				tuning: {
					0: 2,
					1: 10,
					2: 10,
					3: 14,
					7: 3,
					9: 3,
					15: 3,
					42: 3,
					47: 3,
					48: 42,
				},
			},
			{
				model: "z800",
				position: new mp.Vector3(389.923, -739.1774, 28.80474),
				rotation: new mp.Vector3(0, 0, -2.280946),
				colors: [0, 28],
				freezePosition: !1,
				lights: 2,
				numberPlate: "TTHEM00N",
				engine: !1,
				dirt: 60,
				modkit: 1199,
				tuning: {
					0: 1,
					1: 0,
					2: 0,
					4: 0,
					5: 4,
					6: 0,
					8: 0,
					45: 0,
					47: 0,
					48: 45,
				},
			},
			{
				model: "police4",
				position: new mp.Vector3(401.657, -745.0707, 28.78043),
				rotation: new mp.Vector3(0, 0, 177.3311),
				colors: [10, 28],
				freezePosition: !0,
				lights: 2,
				numberPlate: "TS4SG56K",
				engine: !1,
				dirt: 80,
			},
			{
				model: "veyron",
				position: new mp.Vector3(366.7477, -762.5488, 28.74479),
				rotation: new mp.Vector3(0, 0, 150.0305),
				colors: [159, 28],
				freezePosition: !0,
				lights: 2,
				numberPlate: "H4NDS0ME",
				engine: !1,
				dirt: 10,
				modkit: 1183,
				tuning: {
					1: 9,
					3: 2,
					4: 34,
					5: 2,
					6: 11,
					8: 3,
					10: 30,
					27: 2,
					28: 0,
					29: 1,
					33: 2,
					37: 3,
					40: 3,
					42: 11,
					44: 5,
					45: 4,
					46: 4,
					47: 4,
					48: 19,
				},
			},
			{
				model: "brutale",
				position: new mp.Vector3(370.5275, -763.7045, 28.8109),
				rotation: new mp.Vector3(0, 0, 77.93977),
				colors: [28, 42],
				freezePosition: !0,
				lights: 2,
				numberPlate: "W1NN3R",
				engine: !1,
				dirt: 30,
				modkit: 1031,
			},
			{
				model: "g63",
				position: new mp.Vector3(365.3607, -768.5478, 28.84283),
				rotation: new mp.Vector3(0, 0, -114.1652),
				colors: [111, 42],
				numberPlate: "JENGAS",
				engine: !1,
				dirt: 15,
				modkit: 1079,
				freezePosition: !0,
				lights: 2,
				doors: {
					0: !0,
				},
				tuning: {
					0: 3,
					1: 11,
					2: 8,
					3: 12,
					4: 6,
					6: 13,
					7: 6,
					8: 2,
					10: 2,
					31: 0,
					32: 1,
					33: 3,
					37: 11,
					42: 2,
					44: 0,
					47: 3,
					48: 54,
				},
			},
		],
		deleteObjects: [
			{
				x: 394.1849,
				y: -739.028,
				z: 28.30836,
				radius: 1,
				model: 666561306,
			},
			{
				x: 394.0705,
				y: -737.3533,
				z: 28.74813,
				radius: 1,
				model: -1738103333,
			},
			{
				x: 394.1179,
				y: -735.2967,
				z: 28.27756,
				radius: 1,
				model: -1853453107,
			},
		],
		disableStaticEmitters: ["collision_781bnhb", "collision_8cue4t5"],
		loadIPL: ["mj_startscreen_spring"],
	},
	//intro club
];
