import { CustomEvent } from "./custom.event";
import { guiNames } from "../../shared/gui";
import { FILE_STORAGE_URL } from "../../shared/file.storage";

const sounds = Object.fromEntries(
	Object.entries(
		import.meta.glob("../assets/sounds/*.ogg", { eager: true }),
	).map(([key, value]) => {
		const name = key.match(/\/([^/]+)\.ogg$/)[1];
		return [name, value.default];
	}),
);

const soundswv = Object.fromEntries(
	Object.entries(
		import.meta.glob("../assets/sounds/*.wav", { eager: true }),
	).map(([key, value]) => {
		const name = key.match(/\/([^/]+)\.wav$/)[1];
		return [name, value.default];
	}),
);
import {
	WEB_DATA_PORT_EXTERNAL,
	WEB_DATA_PORT_INTERNAL,
} from "../../shared/web";
import { CharacterCreatorDress, DressCefItem } from "../../shared/character";

const soundsmps3 = Object.fromEntries(
	Object.entries(
		import.meta.glob("../assets/sounds/*.mp3", { eager: true }),
	).map(([key, value]) => {
		const name = key.match(/\/([^/]+)\.mp3$/)[1];
		return [name, value.default];
	}),
);
import { Howl } from "howler";
import { ICrosshairSettings } from "../../shared/crosshair";
import { ClothData, GloveClothData } from "../../shared/cloth";
import { fractionCfg } from "./fractions";
import { DEFAULT_SELECTED_LANG } from "../../shared/lang/default";

let fraction = 0;
let rank = 0;
let tag = "";

let family = 0,
	familyRank = 0;

setTimeout(() => {
	CustomEvent.register("user:fraction", (val: number) => {
		fraction = val;
	});
	CustomEvent.register("user:rank", (val: number) => {
		rank = val;
	});
	CustomEvent.register("user:tag", (val: string) => {
		tag = val;
	});
    CustomEvent.register('signatureKey', (val: string, announce: boolean, ip: string) => {
        signatureKey = val
        testServer = announce
        serverIp = ip;
        loadDress();
    })
	CustomEvent.register("passport:image:take", (imgUrl: string, x: number, y: number) => {
		CEF.savePassportPhoto(imgUrl, x, y);
	});
	CustomEvent.register("user:family", (val: number, rank: number) => {
		family = val;
		familyRank = rank;
	});
}, 3000);
let signatureKey: string = "";
let serverIp: string = "127.0.0.1";
let testServer = true;

let money = 0;
let bank = 0;
let chips = 0;

export let dressCfg: {
	id: number;
	name: string;
	category: number;
	male: number;
	data: ClothData[] | GloveClothData[];
}[] = [];

const loadDress = () => {
	CEF.getDressData().then((data) => {
		dressCfg = data;
	});
};

CustomEvent.register("dressData:remove", (id: number) => {
	dressCfg.map((item, index) => {
		if (item.id === id) dressCfg.splice(index, 1);
	});
});
CustomEvent.register("dressData:new", (datas: string) => {
	if (!datas) return;
	const data: {
		id: number;
		name: string;
		category: number;
		male: number;
		data: {
			component: number;
			drawable: number;
			texture: number;
			name?: string;
		}[][];
	}[] = JSON.parse(datas);
	data.map((item) => {
		let ind = dressCfg.findIndex((q) => q.id === item.id);
		if (ind > -1) {
			dressCfg[ind] = { ...dressCfg[ind], ...item };
		} else {
			dressCfg.push(item);
		}
	});
});

let globalhownsound: Howl;
export const CEF = {
	triggerChatCommand: (...args: string[]) => {
		mp.trigger("chatCommand", ...args);
	},
	/** Hol dir einen Geschäftskatalog */
	getCatalog: (
		id: number,
	): Promise<
		{
			item: number;
			price: number;
			count: number;
			max_count: number;
		}[]
	> => {
		return new Promise((resolve) => {
			let xmlHttp = new XMLHttpRequest();
			xmlHttp.open(
				"GET",
				`http://${serverIp}:${WEB_DATA_PORT_EXTERNAL}/business/catalog?id=${id}`,
				false,
			); // false for synchronous request
			xmlHttp.send(null);
			return resolve(JSON.parse(xmlHttp.responseText));
		});
	},
	/** Besorge dir einen Katalog mit Kleidung, um einen Charakter zu erstellen */
	getDressPersonage: (male: number): Promise<CharacterCreatorDress[]> => {
		return new Promise((resolve) => {
			let xmlHttp = new XMLHttpRequest();
			xmlHttp.open(
				"GET",
				`http://${serverIp}:${WEB_DATA_PORT_EXTERNAL}/personage/dress?male=${male}`,
				false,
			); // false for synchronous request
			xmlHttp.send(null);
			return resolve(JSON.parse(xmlHttp.responseText));
		});
	},
	/** Hol dir den Bekleidungskatalog */
	getDressData: (): Promise<DressCefItem[]> => {
		return new Promise((resolve) => {
			let xmlHttp = new XMLHttpRequest();
			xmlHttp.open(
				"GET",
				`http://${serverIp}:${WEB_DATA_PORT_EXTERNAL}/dress/data`,
				false,
			); // false for synchronous request
			xmlHttp.send(null);
			return resolve(JSON.parse(xmlHttp.responseText));
		});
	},
	/** Отправка введённого обычного промокода, который сгенерировал админ */
	enterPromocode: (code: string) => {
		if (!code) return;
		if (typeof code !== "string") return;
		CustomEvent.triggerServer("promocode:use", code.toLowerCase());
	},
	/** Отправка промокода медиа, то есть стримера. Этот промокод он сможет ввести только раз */
	enterPromocodeMedia: (code: string) => {
		if (!code) return;
		if (typeof code !== "string") return;
		CustomEvent.triggerServer("promocode:use:media", code.toLowerCase());
	},
	stopSound: () => {
		if (globalhownsound && globalhownsound.playing()) {
			const sound = globalhownsound;
			sound.unload();
			//let int = setInterval(() => {
			//    sound.volume(Math.max(0, sound.volume() - 0.01));
			//    if(sound.volume() <= 0){
			//        clearInterval(int);
			//        sound.unload();
			//    }
			//}, 100)
		}
	},
	playSound: (url: string, volume = 0.08, global = true) => {
		let soundList: { [path: string]: string } = sounds as any,
			soundswvList: { [path: string]: string } = soundswv as any;

		let urls = soundList[url] || soundswvList[url] || soundsmps3[url] || url;
		if (global) {
			CEF.stopSound();
		}
		let item = new Howl({
			src: [urls],
			autoplay: true,
			loop: false,
			volume,
		});
		if (global) globalhownsound = item;
		return item;
	},
	getSignatureURL(id: number, type: string): Promise<string> {
		const promise: Promise<string> = new Promise((resolve) => {
			CustomEvent.callServer("server::signature:get", id, type).then((res) => {
				resolve(res);
			})
		})

		return promise;
	},
	getBusinessURL(id: string | number) {
		return `https://${FILE_STORAGE_URL}/files/business/${testServer ? "test_" : ""}${id}.png`;
	},
	getHomeURL(interrior: number) {
		return `https://${FILE_STORAGE_URL}/files/homes/${interrior}.png`;
	},	
	getVehicleURL(model: string) {
		return `https://${FILE_STORAGE_URL}/files/vehicles/${model?.toLowerCase()}.png`;
	},
	getAnimsURL(animName: string) {
		return `https://${FILE_STORAGE_URL}/files/anims/${animName}.gif`;
	},

	saveSignature(signature: string, document: string): Promise<boolean> {
		return new Promise((resolve) => {
			CustomEvent.callServer("server::signature:save", JSON.stringify({
				sign: signature,
				document: document,
			})).then((res: any) => {
				resolve(res)
			})
		});
	},
    get signature(){
        return signatureKey
    },
	setGPS: (x: number, y: number, z?: number) => {
		CustomEvent.triggerClient("gps:set", x, y, z);
	},
	id: location.host.includes(":5173") ? 1 : 0,
	admin: false,
	setId: (id: number) => {
		CEF.id = id;
	},
	savePassportPhoto(imgUrl: string, x: number, y: number): Promise<boolean> {
		return new Promise((resolve) => {
			const canvas = document.createElement("canvas");
			const fileServerIp = '194.107.126.146';
			const fileServerPort = 4000;
			document.body.appendChild(canvas);
			canvas.style.display = 'none';
			let context = canvas.getContext("2d");
	
			const image = new Image();
			image.onerror = function (err) {
				console.warn('Error loading image:', err);
				resolve(false);
			};
			image.onload = function () {
				try {
					const width = x;
					const height = y;
					canvas.width = width;
					canvas.height = height;
	
					context.drawImage(image, 0, 0, width, height);
					const imageData = context.getImageData(0, 0, width, height);
					const imageDataFiltered = imageData;
					context.putImageData(imageDataFiltered, 0, 0);
	
					const base64 = canvas.toDataURL("image/png");
	
					const byteString = atob(base64.split(',')[1]);
					const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
					const ab = new ArrayBuffer(byteString.length);
					const ia = new Uint8Array(ab);
					for (let i = 0; i < byteString.length; i++) {
						ia[i] = byteString.charCodeAt(i);
					}
					const blob = new Blob([ab], { type: mimeString });
	
					const file = new File([blob], `${CEF.id}_passport.png`, { type: "image/png" });
	
					let req = new XMLHttpRequest();
					let formData = new FormData();
					formData.append("photo", file);
	
					req.open(
						"POST",
						`http://${fileServerIp}:${fileServerPort}/passport/load?lang=${DEFAULT_SELECTED_LANG}&id=${CEF.id}`,
					);
					req.send(formData);
	
					req.onload = function () {
						if (req.status != 200) {
							console.warn(`Server error: ${req.status} - ${req.statusText}`);
							resolve(false);
						} else {
							console.log('Passport photo successfully saved');
							resolve(true);
						}
					};
	
					req.onerror = function () {
						console.warn('Network error when sending request');
						resolve(false);
					};
	
					canvas.remove();
				} catch (e) {
					console.warn('Error processing image:', e);
					resolve(false);
				}
			};
			image.crossOrigin = "Anonymous";
			image.src = imgUrl;
		});
	  },
	  getPassportImageURL(document: string) {
		return `https://${FILE_STORAGE_URL}/files/passport/${document}.png`;
	},
	setAdmin: (status: boolean) => {
		CEF.admin = status;
	},
	formatTime: (time: number) => {
		let minutes = Math.floor(time / 60);
		let seconds = time % 60;
		let minutes_str = String(minutes);
		let seconds_str = String(seconds);
		if (minutes < 10) minutes_str = `0${minutes}`;
		if (seconds < 10) seconds_str = `0${seconds}`;
		return `${minutes_str}:${seconds_str}`;
	},
	user: {
		name: <string>null,
		get fraction() {
			return fraction;
		},
		set fraction(val) {
			fraction = val;
		},
		get fractionCfg() {
			return CEF.user.fraction
				? fractionCfg.getFraction(CEF.user.fraction)
				: null;
		},
		get rank() {
			return rank;
		},
		set rank(val) {
			rank = val;
		},
		get tag() {
			return tag;
		},
		get isLeader() {
			if (!CEF.user.fraction) return false;
			return fractionCfg.getLeaderRank(this.fraction) === this.rank;
		},
		get isSubLeader() {
			if (!CEF.user.fraction) return false;
			return fractionCfg.getSubLeaderRank(this.fraction) <= this.rank;
		},
		get money() {
			return money;
		},
		get chips() {
			return chips;
		},
		get bank() {
			return bank;
		},
		set money(val) {
			money = val;
		},
		set chips(val) {
			chips = val;
		},
		set bank(val) {
			bank = val;
		},
		get family() {
			return family;
		},
		set family(val) {
			family = val;
		},
		get familyRank() {
			return familyRank;
		},
		set familyRank(val) {
			familyRank = val;
		},
		getIsMale: async () => {
			return await CustomEvent.callClient("cef:getIsMale");
		},
	},
	alert: {
		setSafezoneInfo: (
			width: number,
			height: number,
			left: number,
			bottom: number,
		) =>
			CustomEvent.trigger(
				"cef:alert:setSafezoneInfo",
				width,
				height,
				left,
				bottom,
			),
		setAlert: (
			type: "alert" | "info" | "warning" | "success" | "error",
			text: string,
			img?: string,
			time = 5000,
		) => CustomEvent.trigger("cef:alert:setAlert", type, text, img, time),
		setHelp: (text: string) => CustomEvent.trigger("cef:alert:setHelp", text),
		setHelpKey: (key: string, text: string) =>
			CustomEvent.trigger("cef:alert:setHelpKey", key, text),
		removeHelpKey: () => CustomEvent.trigger("cef:alert:removeHelpKey"),
	},
	gui: {
		saveLogin: (login: string) => {
			CustomEvent.triggerClient("auth:saveLogin", login);
		},
		currentGui: <guiNames>null,
		setGui: (gui: guiNames) => {
			CEF.gui.currentGui = gui;
			CustomEvent.trigger("setGui", gui);
		},
		setCursor: (status: boolean) => {
			mp.trigger("cef:setCursor", status);
		},
		enableCusrsor: () => {
			mp.trigger("enableCursor");
		},
		disableCusrsor: () => {
			mp.trigger("disableCursor");
		},
		close: () => {
			CustomEvent.triggerClient("gui::closeCurrent");
		},
	},
	hud: {
		setCasinoInt: (inCasino: boolean) => {},
		setCustomZone: (zoneName: string, zoneColor: string) => {},
		setWeapon: (weapon: boolean) => {},
		setBullets: (b1: number, b2: number) => {},
		setMoney: (money: number) => {},
		setChips: (money: number) => {},
		setMoneyBank: (money: number) => {},
		setMicrophone: (microphone: boolean) => {},
		setRadio: (radio: boolean) => {},
		lockMicrophone: (microphoneLock: number) => {},
		setHasWatch: (hasWatch: boolean) => {},
		setTime: (time: string) => {},
		setDate: (date: string) => {},
		setTemp: (temp: number) => {},
		setCompass: (compass: string) => {},
		setStat: (
			statTime: string,
			online: number,
			player_id: number,
			admin: boolean,
			afk: boolean = false,
			admin_hidden: boolean = false,
			mask: boolean = false,
		) => {},
		setZone: (zone: string, street: string) => {},
		showHud: (show: boolean) => {},
		toggleDeathTimer: (setTextText: boolean) => {},
		setDeathTime: (deathTime: number) => {},
		setTextText: (text: string) => {},
		setTextTime: (number: number) => {},
		raceData: (
			position: number,
			lap: number,
			lapMax: number,
			racers: number,
		) => {},
		disableRace: () => {},
		setInfoLinePos: (left: number, bottom: number) => {},
		updateHelpToggle: (toggle: boolean) => {},
	},
	speedometer: {
		setSpeed: (val: number) => {},
		setFuel: (val: number) => {},
		setEngine: (val: boolean) => {},
		setLockCar: (val: boolean) => {},
		setLights: (val: boolean) => {},
		setSpeedometer: (val: boolean) => {},
	},
	get test() {
		return location.host.includes(":5173");
	},
	get testGui() {
		return location.href.includes("?test=");
	},
	copy,
	focusInput: false,
};

function fallbackCopyTextToClipboard(text: string) {
	let textArea = document.createElement("textarea");
	textArea.value = text;

	// Avoid scrolling to bottom
	textArea.style.top = "0";
	textArea.style.left = "0";
	textArea.style.position = "fixed";

	document.body.appendChild(textArea);
	textArea.focus();
	textArea.select();

	try {
		let successful = document.execCommand("copy");
		let msg = successful ? "successful" : "unsuccessful";
		console.log(`Fallback: Copying text command was ${msg}`);
	} catch (err) {
		console.error("Fallback: Oops, unable to copy", err);
	}

	document.body.removeChild(textArea);
}
function copy(text: string) {
	if (!navigator.clipboard) {
		fallbackCopyTextToClipboard(text);
		return;
	}
	navigator.clipboard.writeText(text).then(
		function () {
			console.log("Async: Copying to clipboard was successful!");
		},
		function (err) {
			console.error("Async: Could not copy text: ", err);
		},
	);
}

CustomEvent.register("cef:copytext", (text: string) => {
	CEF.copy(text);
});

let focusCount = 0;

document.addEventListener("focusin", (e) => {
	if ((e.target as any).type === "submit") return;
	focusCount++;
});
document.addEventListener("focusout", (e) => {
	if ((e.target as any).type === "submit") return;
	focusCount--;
});

setInterval(() => {
	(window as any).scroll(0, 0);
	const newFocusStatus = !!focusCount;
	if (newFocusStatus !== CEF.focusInput) {
		CEF.focusInput = newFocusStatus;
		CustomEvent.triggerClient("inputOnFocus", CEF.focusInput);
	}
}, 200);

// @ts-ignore
globalThis.CEF = CEF;
