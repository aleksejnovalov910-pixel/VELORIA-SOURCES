import { LangString } from "../../modules/lang";
import React, { Component, createRef, JSX } from "react";
//import "./inventory.less";
import jacketOrangeIcon from "./img/clothes/jacket-orange.svg";
import bagpackIcon from "./img/clothes/bagpack.svg";
import backPackBig from "./img/backPackBig.png";
import worldIcon from "./img/worldIcon.png";
import hotbaricon from "./img/hotbarIcon.png";
import lockedIcon from "./img/lockedIcon.png";
import "./inventory2.scss";
import {
	CONTAINERS_DATA,
	convertInventoryItemArrayToObject,
	convertInventoryItemObjectToArray,
	type ExchangeData,
	ExchangeReadyStatus,
	getItemDesc,
	getItemName,
	getItemWeight,
	type InventoryChoiseItemData,
	type InventoryDataCef,
	type InventoryEquipList,
	type InventoryItemCef,
	inventoryShared,
	type InventoryWeaponPlayerData,
	ITEM_TYPE,
	OWNER_TYPES,
	PLAYER_INVENTORY_MAX_LEVEL,
} from "../../../shared/inventory";
import { CEF } from "../../modules/CEF";
const svg = Object.fromEntries(
	Object.entries(import.meta.glob("./images/svg/*.svg", { eager: true })).map(
		([key, value]) => {
			const name = key.match(/\/([^/]+)\.svg$/)[1];
			//@ts-ignore
			return [name, value.default];
		},
	),
);

const iconsItems = Object.fromEntries(
	Object.entries(
		import.meta.glob("../../../shared/icons/*.png", { eager: true }),
	).map(([key, value]) => {
		const name = key.match(/\/([^/]+)\.png$/)[1];
		//@ts-ignore
		return [name, value.default];
	}),
);
import { system } from "../../modules/system";
import { systemUtil } from "../../../shared/system";
import { CustomEvent } from "../../modules/custom.event";
import type { CustomEventHandler } from "../../../shared/custom.event";
import { DraggableCore } from "react-draggable";
import ellipse from "./../Dialog/assets/ellipse.svg";
import { createStyles, Slider, withStyles } from "@material-ui/core";
import {
	DONATE_MONEY_NAMES,
	getDonateItemConfig,
} from "../../../shared/economy";

const generateTestInventory = (count = 15) => {
	const items = inventoryShared.items.map((item, index) => {
		return convertInventoryItemObjectToArray({
			id: index + 1,
			item_id: item.item_id,
			count: item.default_count || 1,
			serial: "test",
			extra: "{}",
		});
	});
	const res: InventoryItemCef[] = [];
	for (let id = 0; id < count; id++) {
		res.push(systemUtil.randomArrayElement(items));
	}
	return res;
};

interface InventoryMainData extends InventoryEquipList {
	equip: InventoryEquipList;
	weapons: InventoryWeaponPlayerData;
	blocks: InventoryDataCef[];
	hotkeys: [
		number | null,
		number | null,
		number | null,
		number | null,
		number | null,
	];
	open: boolean;
	addModal?: boolean;
	containerType: OWNER_TYPES;
	containerNumber: number;
	current?: [OWNER_TYPES, number];
	inv_level?: number;
	isExchangeOpened?: boolean;
	exchangeData?: ExchangeData;
	mouseOnItem: { x: number; y: number; itemName: string };
}

interface ItemDrawProps {
	inventory: InventoryClass;
	item: InventoryItemCef;
	owner_type: OWNER_TYPES;
	owner_id: number;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	keyName: any;
	isDraggable?: { x: number; y: number };
	ishotkey?: boolean;
}

interface ItemDrawState {
	rightClick?: boolean;
	left?: number;
	top?: number;
	position?: [number, number];
	clickPress?: boolean;
	split?: number;
}

class ItemDraw extends Component<ItemDrawProps, ItemDrawState> {
	div: React.RefObject<HTMLDivElement>;

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	constructor(props: any) {
		super(props);
		this.div = createRef();
		this.state = {
			position: [0, 0],
			split: 0,
		};
	}

	get item() {
		return convertInventoryItemArrayToObject(this.props.item);
	}

	get itemCfg() {
		return inventoryShared.get(this.item.item_id);
	}

	get weaponCfg() {
		const cfg = this.itemCfg;
		return cfg.type === ITEM_TYPE.WEAPON
			? inventoryShared.getWeaponConfigByItemId(this.item.item_id)
			: null;
	}

	get owner_type() {
		return this.props.owner_type;
	}

	get owner_id() {
		return this.props.owner_id;
	}

	get blocks() {
		return this.props.inventory.state.blocks;
	}

	get inventory() {
		return this.props.inventory;
	}

	transfer(target_type: OWNER_TYPES, target_id: number) {
		if (target_type === OWNER_TYPES.WORLD) return this.dropItem();
		if (
			this.owner_type === OWNER_TYPES.WORLD &&
			(target_type !== OWNER_TYPES.PLAYER || target_id !== CEF.id)
		)
			return;
		this.setState({ rightClick: false }, () => {
			this.choiceItem({ task: "transfer", target_type, target_id });
			CEF.playSound("up-inventory", 0.05);
		});
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	useItem(e: React.MouseEvent<any, MouseEvent>) {
		const inv = !this.weaponCfg
			? CONTAINERS_DATA.find((c) => c.item_id === this.item.item_id)
			: null;
		if (!inv && this.owner_type !== OWNER_TYPES.PLAYER)
			return this.transfer(OWNER_TYPES.PLAYER, CEF.id);
		if (!inv && this.owner_id !== CEF.id)
			return this.transfer(OWNER_TYPES.PLAYER, CEF.id);
		if (!this.canUse) return;
		if (inv)
			this.inventory.showBlocks(inv.owner_type, this.id, e.pageX, e.pageY);
		this.setState({ rightClick: false }, () => {
			if (!inv) this.choiceItem({ task: "useItem" });
			CEF.playSound("up-inventory", 0.05);
		});
	}
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	weaponMods(e: React.MouseEvent<any, MouseEvent>) {
		const inv = CONTAINERS_DATA.find((c) => c.item_id === this.item.item_id);
		if (!inv) return this.useItem(e);
		this.inventory.showBlocks(inv.owner_type, this.id, e.pageX, e.pageY);
		this.setState({ rightClick: false }, () => {
			CEF.playSound("up-inventory", 0.05);
		});
	}

	split(amount: number) {
		// if(!this.isMyInventory) return;
		if (this.item.count < 2 || amount < 1 || amount > this.item.count - 1)
			return;
		// TODO добавить выбор количества, перменная amount - это количество, сколько будет перекинуто в новый пердмет

		if (this.item.count - amount < 1) return;
		this.setState({ rightClick: false, split: 0 }, () => {
			this.choiceItem({ task: "split", target_id: amount });
			CEF.playSound("up-inventory", 0.05);
		});
	}

	dropItem() {
		if (this.owner_type === OWNER_TYPES.WORLD) return;
		this.setState({ rightClick: false }, () => {
			this.choiceItem({ task: "drop" });
			CEF.playSound("drop-inventory", 0.05);
		});
	}

	addToExchange() {
		const itemConfig = inventoryShared.get(this.item.item_id);
		if (itemConfig.blockMove) {
			return;
		}

		CustomEvent.triggerServer("inventory::exchange::add", this.props.item[0]);
	}

	selectToDisplay() {
		if (this.itemCfg.type === ITEM_TYPE.BAGS)
			CustomEvent.triggerServer("inventory:bag:selectDisplay", this.item.id);
	}

	private choiceItem(data: Partial<InventoryChoiseItemData>) {
		this.setState({ rightClick: false }, () => {
			CustomEvent.triggerServer("inventory:choiceItem", {
				item: {
					id: this.item.id,
				},
				owner_type: this.owner_type,
				owner_id: this.owner_id,
				...data,
			});
		});
	}

	get canUse() {
		const cfg = this.itemCfg;
		const inv = CONTAINERS_DATA.find((c) => c.item_id === this.item.item_id);
		if (inv) return true;
		return cfg.use && this.isMyInventory;
	}

	get isMyInventory() {
		return this.owner_type === OWNER_TYPES.PLAYER && this.owner_id === CEF.id;
	}

	get hotkeys() {
		return this.props.inventory.state.hotkeys;
	}

	get id() {
		return this.item.id;
	}

	get hotkeySlot() {
		return this.hotkeys.findIndex((q) => q === this.id);
	}

	get drawEquipHotkeyChoice() {
		const items: JSX.Element[] = [];
		if (this.hotkeys.find((q) => q === this.id)) {
			items.push(
				<li
					key={"equip_hotkey_li_unload"}
					onClick={(e) => {
						e.preventDefault();
						this.choiceItem({
							task: "unload_hotkey",
							owner_id: this.hotkeySlot,
						});
					}}
					onKeyDown={(e) => {
						e.preventDefault();
						this.choiceItem({
							task: "unload_hotkey",
							owner_id: this.hotkeySlot,
						});
					}}
				>
					<p tabIndex={-1} className="p-14px fw500 dark">
						{LangString(
							"components.Inventory.index_new.146ee2f7858225ffc22cd671a4e35ded",
						)}{" "}
						{this.hotkeySlot + 1}
					</p>
				</li>,
			);
		} else {
			for (let id = 0; id < 5; id++) {
				items.push(
					<li
						onClick={(e) => {
							e.preventDefault();
							this.choiceItem({ task: "load_hotkey", owner_id: id });
						}}
						onKeyDown={(e) => {
							e.preventDefault();
							this.choiceItem({ task: "load_hotkey", owner_id: id });
						}}
						key={`equip_hotkey_li_${id}`}
					>
						<p tabIndex={-1} className="p-14px fw500 dark">
							{LangString(
								"components.Inventory.index_new.f44822dddda3e4f024201e7101568b72",
							)}{" "}
							{id + 1}{" "}
							{LangString(
								"components.Inventory.index_new.790e448886c728ca3c33a6a0979dec77",
							)}
						</p>
					</li>,
				);
			}
		}

		return items;
	}
	modalResponse = (key: number) => {
		const split = this.state.split;
		this.setState({ ...this.state, split: 0 });
		if (key !== 0) return;
		// if(!this.isMyInventory) return;
		if (this.item.count < 2) return;
		this.split(split);
	};
	modal = () => {
		if (!this.state.split) return;
		return (
			<div
				tabIndex={-1}
				className="dialog_main_wrap"
				style={{ zIndex: 20000, position: "absolute" }}
			>
				<div
					tabIndex={-1}
					className={"dialog_main"}
					style={{ position: "fixed", left: 0, top: 0 }}
				>
					<div tabIndex={-1} className="dialog_blur" />
					<div tabIndex={-1} className="dialog_grid" />
					{/* biome-ignore lint/a11y/useAltText: <explanation> */}
					<img tabIndex={-1} className="dialog_ellipse" src={ellipse} />
					<div tabIndex={-1} className="dialog_box">
						<h1>
							{LangString(
								"components.Inventory.index_new.06bb7a64bbfb18bfd5d89a3bb214dec9",
							)}
						</h1>
						<p>
							{LangString(
								"components.Inventory.index_new.17bda8603ae02ee2ca65f676ae3ad6cd",
							)}
						</p>
						<div tabIndex={-1} className="dialog_info">
							{this.addSlider(
								this.state.split,
								this.item.count - 1,
								(value: number) => {
									this.setState({ ...this.state, split: value });
								},
							)}
						</div>
						<h5>
							{this.state.split}/{this.item.count - this.state.split}
						</h5>
						<div tabIndex={-1} className="dialog_button">
							<div
								tabIndex={-1}
								className="dialog_key"
								onClick={() => this.modalResponse(0)}
								onKeyDown={() => this.modalResponse(0)}
							>
								{LangString(
									"components.Inventory.index_new.44ed1f05ba67cc28636f31f40338561d",
								)}
							</div>
							<div
								tabIndex={-1}
								className="dialog_key"
								onClick={() => this.modalResponse(1)}
								onKeyDown={() => this.modalResponse(1)}
							>
								{LangString(
									"components.Inventory.index_new.d7e58648a9b54448d34cf9062c4a17f8",
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	};

	private listenerKeyDown = (e: any): void => {
        if (e.keyCode === 9) {
			e.preventDefault();
			// CustomEvent.triggerServer("inventory:close");
			// CEF.gui.setGui(null);
        }
    }



	componentDidMount() {

        document.addEventListener("keydown", this.listenerKeyDown);
    
    }

	addSlider = (value: number, max: number, onChange: (val: number) => void) => {
		return (
			<div tabIndex={-1} style={{ width: "80%" }}>
				<NewSliderStyles
					min={1}
					max={max}
					step={1}
					value={value}
					valueLabelDisplay="off"
					getAriaValueText={(value: number) => {
						return `${value}%`;
					}}
					onChange={(_: any, val: number) => onChange(val)}
				/>
			</div>
		);
	};

	get drawTooltip() {
		const pos = this.positionTooltip;
		const cfg = this.itemCfg;
		const canUse = this.canUse;
		const obj = document.getElementById(
			`item_continer_draggable_${this.props.owner_type}_${this.props.owner_id}`,
		);
		let posX = 0;
		let posY = 0;
		if (obj && this.props.isDraggable) {
			posX = obj.offsetLeft - obj.offsetWidth / 2;
			posY = obj.offsetTop - obj.offsetHeight;
			pos.left -= posX;
			pos.top -= posY;
		}

		const desc = !this.props.ishotkey ? getItemDesc(cfg.item_id) : null;

		return (
			<div tabIndex={-1} className="mini-modal-menu-inventory-body">
				<div
					tabIndex={-1}
					className="mini-modal-menu-inventory-background"
					onClick={(e) => {
						e.preventDefault();
						this.setState({ rightClick: false });
					}}
					onKeyDown={(e) => {
						e.preventDefault();
						this.setState({ rightClick: false });
					}}
					onContextMenu={(e) => {
						e.preventDefault();
						this.setState({ rightClick: false });
					}}
				/>
				{/*@ts-ignore*/}
				<div
					tabIndex={-1}
					className="mini-modal-menu-inventory"
					style={{
						...pos,
						transform:
							window.innerHeight / 2 > pos.top ? "" : "translateY(-22vw)",
					}}
					onClick={(e) => {
						e.preventDefault();
					}}
					onKeyDown={(e) => {
						e.preventDefault();
					}}
				>
					<div tabIndex={-1} className="descr-wrap">
						<div tabIndex={-1} className="itemName">
							{getItemName(this.item)}
						</div>
						<div tabIndex={-1} className="space-backpack">
							{/*<p tabIndex={-1} className="p-12px fw500 dark-04">x{this.item.count}</p>*/}
							<div tabIndex={-1} className="weight-backpack">
								<p tabIndex={-1} className="p-12px fw500 dark-04">
									{(
										getItemWeight(this.item.item_id, this.item.count) / 1000
									).toFixed(3)}{" "}
									{LangString(
										"components.Inventory.index_new.739004ccdc4044a3ff718ef7e040f939",
									)}
								</p>
							</div>
						</div>
						{desc ? (
							<div tabIndex={-1} className="text-wrap">
								<p
									tabIndex={-1}
									className="p-14px fw400 dark lh120"
									style={{ whiteSpace: "pre-line" }}
								>
									{desc}
								</p>
							</div>
						) : (
							<></>
						)}
					</div>
					<ul className="mini-modal-menu-wrap br4">
						{/**/}
						{this.owner_type === OWNER_TYPES.WORLD ? (
							<>
								<li
									onClick={(e) => {
										e.preventDefault();
										this.transfer(OWNER_TYPES.PLAYER, CEF.id);
									}}
									onKeyDown={(e) => {
										e.preventDefault();
										this.transfer(OWNER_TYPES.PLAYER, CEF.id);
									}}
								>
									<p tabIndex={-1} className="p-14px fw500 dark">
										{LangString(
											"components.Inventory.index_new.aeb02289cf740735e740b1dd611c1eac",
										)}
									</p>
								</li>
								{this.itemCfg.canSplit && this.item.count > 1 && (
									<li
										onClick={(e) => {
											e.preventDefault();
											if (this.item.count < 2) return;
											this.setState({
												...this.state,
												rightClick: false,
												split: 1,
											});
										}}
										onKeyDown={(e) => {
											e.preventDefault();
											if (this.item.count < 2) return;
											this.setState({
												...this.state,
												rightClick: false,
												split: 1,
											});
										}}
									>
										<p tabIndex={-1} className="p-14px fw500 dark">
											{LangString(
												"components.Inventory.index_new.5ec3a7b7ac14fabd456a668cea53b7c6",
											)}
										</p>
									</li>
								)}
							</>
						) : (
							<>
								{this.inventory.state.isExchangeOpened && (
									<li
										onClick={(e) => {
											e.preventDefault();
											this.addToExchange();
										}}
										onKeyDown={(e) => {
											e.preventDefault();
											this.addToExchange();
										}}
									>
										<p tabIndex={-1} className="p-14px fw500 dark">
											{LangString(
												"components.Inventory.index_new.212af58646412a0b348506bbec7630ff",
											)}
										</p>
									</li>
								)}
								<li
									onClick={(e) => {
										e.preventDefault();
										this.dropItem();
									}}
									onKeyDown={(e) => {
										e.preventDefault();
										this.dropItem();
									}}
								>
									<p tabIndex={-1} className="p-14px fw500 dark">
										{LangString(
											"components.Inventory.index_new.b7d400cf04e15dd3095c3f16eab2eac4",
										)}
									</p>
								</li>
								{this.itemCfg.type === ITEM_TYPE.BAGS &&
									CONTAINERS_DATA.find((d) => d.item_id === this.item.item_id)
										?.bag_sync && (
										<li
											onClick={(e) => {
												e.preventDefault();
												this.selectToDisplay();
											}}
											onKeyDown={(e) => {
												e.preventDefault();
												this.selectToDisplay();
											}}
										>
											<p tabIndex={-1} className="p-14px fw500 dark">
												{LangString(
													"components.Inventory.index_new.e4ca3588a1e1ce91d7c3356b59186ede",
												)}
											</p>
										</li>
									)}
								{canUse ? (
									<li
										onClick={(e) => {
											e.preventDefault();
											if (!canUse) return;
											this.useItem(e);
										}}
										onKeyDown={(e) => {
											e.preventDefault();
											if (!canUse) return;
											//@ts-ignore
											this.useItem(e);
										}}
									>
										<p tabIndex={-1} className="p-14px fw500 dark">
											{this.inventory.state.weapons &&
											this.inventory.state.weapons.id === this.id
												? LangString(
														"components.Inventory.index_new.69f00569c1ee458dc599abf492599458",
													)
												: this.itemCfg.inHand
													? LangString(
															"components.Inventory.index_new.bd02271417d0a2e9ef6b55456b148ba6",
														)
													: LangString(
															"components.Inventory.index_new.27654810e285a5caa1a68fd1a82268ec",
														)}
										</p>
									</li>
								) : (
									<></>
								)}
								{canUse &&
								this.itemCfg.type === ITEM_TYPE.WEAPON &&
								this.weaponCfg &&
								this.weaponCfg.addons ? (
									<li
										onClick={(e) => {
											e.preventDefault();
											if (!canUse) return;
											this.weaponMods(e);
										}}
										onKeyDown={(e) => {
											e.preventDefault();
											if (!canUse) return;
											//@ts-ignore
											this.weaponMods(e);
										}}
									>
										<p tabIndex={-1} className="p-14px fw500 dark">
											{LangString(
												"components.Inventory.index_new.9a97095deb05114a1ea65212b7e8b6c6",
											)}
										</p>
									</li>
								) : (
									<></>
								)}
								{this.itemCfg.canSplit && this.item.count > 1 ? (
									<li
										onClick={(e) => {
											e.preventDefault();
											if (this.item.count < 2) return;
											this.setState({
												...this.state,
												rightClick: false,
												split: 1,
											});
											//                            this.split()
										}}
										onKeyDown={(e) => {
											e.preventDefault();
											if (this.item.count < 2) return;
											this.setState({
												...this.state,
												rightClick: false,
												split: 1,
											});
											//                            this.split()
										}}
									>
										<p tabIndex={-1} className="p-14px fw500 dark">
											{LangString(
												"components.Inventory.index_new.aa5110ca58e58cfde6f17531f3c2520e",
											)}
										</p>
									</li>
								) : (
									<></>
								)}

								{this.blocks
									.filter(
										(q) =>
											q.owner_type !== OWNER_TYPES.WORLD &&
											!(
												q.owner_type === this.owner_type &&
												q.owner_id === this.owner_id
											),
									)
									.map((target) => {
										return (
											<li
												onClick={(e) => {
													e.preventDefault();
													this.transfer(target.owner_type, target.owner_id);
												}}
												onKeyDown={(e) => {
													e.preventDefault();
													this.transfer(target.owner_type, target.owner_id);
												}}
												key={`item_choice_${target.owner_type}_${target.owner_id}`}
											>
												{target.owner_type === OWNER_TYPES.PLAYER &&
												target.owner_id === CEF.id ? (
													<p tabIndex={-1} className="p-14px fw500 dark">
														{LangString(
															"components.Inventory.index_new.9ee8953630de6633efc116035c1312e9",
														)}
													</p>
												) : (
													<p tabIndex={-1} className="p-14px fw500 dark">
														{target.owner_type === OWNER_TYPES.PLAYER
															? LangString(
																	"components.Inventory.index_new.16f6057e990fff45ca656c1a86d170e3",
																)
															: [
																		OWNER_TYPES.VEHICLE,
																		OWNER_TYPES.VEHICLE_TEMP,
																	].includes(target.owner_type)
																? LangString(
																		"components.Inventory.index_new.67d9dab0bcfaf650e33bf3d4105a2a48",
																	)
																: LangString(
																		"components.Inventory.index_new.9a728b834feb93a2f4e2b95379c7fa50",
																	)}{" "}
														{target.name} {target.desc}
													</p>
												)}
											</li>
										);
									})}

								{this.isMyInventory ? this.drawEquipHotkeyChoice : <></>}
							</>
						)}

						{/*<li className="lock">*/}
						{/*    <img tabIndex=-1 src={svg["pat-pass"]} width="24" height="24" alt="" />*/}
						{/*    <p tabIndex={-1} className="p-14px fw500 dark">Передать игроку ID 230423</p>*/}
						{/*</li>*/}
					</ul>
				</div>
			</div>
		);
	}

	get positionTooltip() {
		return {
			left: this.state.left + 10,
			top: this.state.top + 10,
		};
	}
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	startDrag = (data: any) => {
		this.setState({ ...this.state, position: [0.0, 0.0] });
		//        this.inventory.currentItem( this.props.owner_type, this.props.owner_id );
	};
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	stopDrag = (e: any, data: any) => {
		// e.preventDefault();
		this.setState({ ...this.state, position: [0.0, 0.0] });
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		switch (this.inventory.state.containerType as any) {
			case -1:
				break;
			case OWNER_TYPES.HOTKEY: {
				if (this.props.ishotkey) break;
				this.choiceItem({
					task: "load_hotkey",
					owner_id: this.inventory.state.containerNumber,
				});
				// в хоткей
				break;
			}
			case OWNER_TYPES.CLOTHES: {
				this.useItem(e);
				break;
			}
			default: {
				if (
					this.inventory.state.containerType === this.owner_type &&
					this.inventory.state.containerNumber === this.owner_id
				)
					return;
				this.transfer(
					this.inventory.state.containerType,
					this.inventory.state.containerNumber,
				);
				break;
			}
		}
		this.inventory.currentItem(-1, -1);
	};
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	onDrag = (e: MouseEvent, data: any) => {
		if (
			this.props.owner_type !== this.inventory.state.current[0] &&
			this.props.owner_id !== this.inventory.state.current[1]
		)
			this.inventory.currentItem(this.props.owner_type, this.props.owner_id);
		this.setState({
			...this.state,
			rightClick: false,
			position: [
				(e.clientX / document.documentElement.clientWidth) * 100,
				(e.clientY / document.documentElement.clientHeight) * 100,
			],
		});
	};
	render() {
		if (!this.item) return <></>;
		const obj = document.getElementById(
			`item_continer_draggable_${this.props.owner_type}_${this.props.owner_id}`,
		);
		let posX = 0;
		let posY = 0;
		if (obj && this.props.isDraggable) {
			posX = obj.offsetLeft - obj.offsetWidth / 2;
			posY = obj.offsetTop - obj.offsetHeight;
		}
		return (
			<>
				{this.modal()}

				<DraggableCore
					disabled={this.state.rightClick}
					key={`${this.props.owner_type}_${this.props.owner_id}_${this.item.id}_${this.props.keyName}`}
					grid={[0.5, 0.5]}
					// biome-ignore lint/complexity/noBannedTypes: <explanation>
					onStart={(e: MouseEvent, data: Object) => this.startDrag(data)}
					// biome-ignore lint/complexity/noBannedTypes: <explanation>
					onDrag={(e: MouseEvent, data: Object) => this.onDrag(e, data)}
					// biome-ignore lint/complexity/noBannedTypes: <explanation>
					onStop={(e: MouseEvent, data: Object) => this.stopDrag(e, data)}
				>
					<div tabIndex={-1}>
						{this.state.rightClick ? this.drawTooltip : <></>}
						<div
							tabIndex={-1}
							className="slot"
							style={{
								position:
									this.state.position[1] !== 0.0 &&
									this.state.position[0] !== 0.0
										? "static"
										: "relative",
								zIndex:
									this.state.position[1] !== 0.0 &&
									this.state.position[0] !== 0.0
										? 10006
										: 10004,
								pointerEvents:
									this.state.position[1] !== 0.0 &&
									this.state.position[0] !== 0.0
										? "none"
										: "auto",
							}}
						>
							<div
								tabIndex={-1}
								className="item"
								onContextMenu={(e) => {
									e.preventDefault();
									console.log(e.pageY);
									this.setState({
										rightClick: true,
										left: e.pageX,
										top: e.pageY,
									});
								}}
								ref={this.div}
								key={`${this.props.owner_type}_${this.props.owner_id}_${this.item.id}_${this.props.keyName}`}
								onClick={(e) => {
									e.preventDefault();
									if (!this.state.clickPress) {
										this.setState({ clickPress: true }, () => {
											setTimeout(() => {
												this.setState({ clickPress: false });
											}, 550);
										});
										return;
									}
									this.useItem(e);
								}}
								onKeyDown={(e) => {
									e.preventDefault();
									if (!this.state.clickPress) {
										this.setState({ clickPress: true }, () => {
											setTimeout(() => {
												this.setState({ clickPress: false });
											}, 550);
										});
										return;
									}
									//@ts-ignore
									this.useItem(e);
								}}
								//DRUG STYLES
								style={{
									width: "80px",
									height: "80px",
									border: "solid 1px rgba(250, 250, 250, 0.49)",
									transition: "none",
									top:
										this.state.position[1] !== 0.0 &&
										this.state.position[0] !== 0.0
											? `calc( ${this.props.isDraggable !== undefined ? "-2.08vw" : "-2.08vw"} + ${this.state.position[1]}vh - ${posY}px)`
											: "auto",
									zIndex:
										this.state.position[1] !== 0.0 &&
										this.state.position[0] !== 0.0
											? 10006
											: 10004,
									left:
										this.state.position[1] !== 0.0 &&
										this.state.position[0] !== 0.0
											? `calc( ${this.props.isDraggable !== undefined ? "-2.08vw" : "-2.08vw"} + ${this.state.position[0]}vw - ${posX}px)`
											: "auto",
									position: "absolute",
								}}
							>
								<div tabIndex={-1} className="weapon-item">
									<div tabIndex={-1} className="img-wrap">
										<img
											tabIndex={-1}
											src={iconsItems[`Item_${this.item.item_id}`]}
											alt=""
											draggable="false"
										/>
									</div>
									{!this.props.ishotkey ? (
										<i tabIndex={-1} className="count p-14px fw700 upper">
											{this.item.count}
										</i>
									) : (
										<></>
									)}
								</div>
							</div>
						</div>
					</div>
				</DraggableCore>
			</>
		);
	}
}

// biome-ignore lint/complexity/noBannedTypes: <explanation>
export class InventoryClass extends Component<{}, InventoryMainData> {
	openExchangeEv: CustomEventHandler;
	updateExchangeEv: CustomEventHandler;
	openInventoryEv: CustomEventHandler;
	updateInventoryEv: CustomEventHandler;
	dressEv: CustomEventHandler;

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	constructor(props: any) {
		super(props);
		// @ts-ignore
		this.state = {
			hotkeys: [null, null, null, null, null],
			equip: {
				bracelet: 0,
				watch: 0,
				ear: 0,
				glasses: 0,
				hat: 0,
				accessorie: 0,
				accessorie2: 0,
				foot: 0,
				leg: 0,
				torso: 0,
				mask: 0,
				armor: 0,
				gloves: 0,
			},
			containerType: -1,
			containerNumber: -1,
			current: [-1, -1],
			addModal: false,
		};

		this.openExchangeEv = CustomEvent.register(
			"inventory:exchange",
			(
				myInventory: InventoryDataCef,
				exchange: ExchangeData,
				equip: InventoryEquipList,
				weapons: InventoryWeaponPlayerData,
				hotkeys: [number, number, number, number, number],
				inv_level: number,
			) => {
				this.openExchangeMenu(
					myInventory,
					exchange,
					equip,
					weapons,
					hotkeys,
					inv_level,
				);
			},
		);

		this.updateExchangeEv = CustomEvent.register(
			"inventory:exchange:update",
			(exchangeData: ExchangeData) => {
				this.setState({
					exchangeData,
				});
			},
		);

		this.openInventoryEv = CustomEvent.register(
			"inventory:open",
			(
				blocks: InventoryDataCef[],
				equip: InventoryEquipList,
				weapons: InventoryWeaponPlayerData,
				hotkeys: [number, number, number, number, number],
				inv_level: number,
			) => {
				this.openInventory(blocks, equip, weapons, hotkeys, inv_level);
			},
		);
		this.dressEv = CustomEvent.register(
			"dress:data",
			(equip: InventoryEquipList) => {
				this.setState({ equip });
			},
		);

		CustomEvent.register(
			"inventory:updateSelfBlock",
			(myInventoryBlock: InventoryDataCef) => {
				const blocks = this.state.blocks || [];
				const existingMyBlockIdx = blocks.findIndex(
					(block) =>
						block.owner_type === OWNER_TYPES.PLAYER &&
						block.owner_id === CEF.id,
				);
				if (existingMyBlockIdx !== -1) {
					blocks.splice(existingMyBlockIdx, 1);
				}

				blocks.push(myInventoryBlock);

				this.setState({
					blocks,
				});
			},
		);

		this.updateInventoryEv = CustomEvent.register(
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
			) => {
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				const blocksDataOpen: any[] = (this.state.blocks || [])
					.filter((q) => q.show)
					.map((q) => [q.owner_type, q.owner_id, q.left, q.top, q.drag]);
				const updatedBlocks = this.state.blocks || [];
				blocks.map((block) => {
					const fnd = updatedBlocks.findIndex(
						(q) =>
							q.owner_type === block.owner_type &&
							q.owner_id === block.owner_id,
					);
					if (fnd > -1) {
						if (
							block.owner_type === OWNER_TYPES.PLAYER &&
							block.owner_id === CEF.id
						) {
							updatedBlocks[fnd].items = block.items;
							// updatedBlocks[fnd].weight = block.weight;
							updatedBlocks[fnd].weight_max = block.weight_max;
						} else {
							updatedBlocks[fnd] = block;
						}
					} else updatedBlocks.push(block);
				});
				updatedBlocks.map((block, index) => {
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
				this.setState(
					{ blocks: updatedBlocks, weapons, hotkeys, inv_level },
					() => {
						this.setState({
							blocks: this.state.blocks.map((q) => {
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
						});
					},
				);
			},
		);
	}

	showBlocks(
		owner_type: OWNER_TYPES,
		owner_id: number,
		left: number,
		top: number,
	) {
		const blocks = [...this.state.blocks];
		const item = blocks.findIndex(
			(q) => q.owner_type === owner_type && q.owner_id === owner_id,
		);
		if (item > -1) {
			blocks[item].show = true;
			blocks[item].left = left;
			blocks[item].top = top;
			this.setState({ blocks });
			this.updateDragPos(owner_type, owner_id, { x: 0, y: 0 });
			this.currentItem(-1, -1);
		}
	}

	openExchangeMenu(
		myInventory: InventoryDataCef,
		exchangeData: ExchangeData,
		equip: InventoryEquipList,
		weapons: InventoryWeaponPlayerData,
		hotkeys: [number, number, number, number, number],
		inv_level: number,
	) {
		this.setState({
			open: true,
			isExchangeOpened: true,
			equip,
			weapons,
			hotkeys,
			inv_level,
			exchangeData,
			blocks: [myInventory],
		});
	}

	openInventory(
		blocks: InventoryDataCef[],
		equip: InventoryEquipList,
		weapons: InventoryWeaponPlayerData,
		hotkeys: [number, number, number, number, number],
		inv_level: number,
	) {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const blocksDataOpen: any[] = (this.state.blocks || [])
			.filter((q) => q.show)
			.map((q) => [q.owner_type, q.owner_id, q.left, q.top, q.drag]);
		this.setState(
			{ open: true, equip, blocks, weapons, hotkeys, inv_level },
			() => {
				this.setState({
					blocks: this.state.blocks.map((q) => {
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
				});
			},
		);
	}

	componentWillMount() {
		if (CEF.test) {
			this.renderTestBlock();
			setTimeout(() => {
				this.open = true;
			}, 100);
		}
	}

	componentWillUnmount() {
		if (this.openInventoryEv) this.openInventoryEv.destroy();
		if (this.updateInventoryEv) this.updateInventoryEv.destroy();
		if (this.dressEv) this.dressEv.destroy();
		if (this.updateExchangeEv) this.updateExchangeEv.destroy();
		if (this.openExchangeEv) this.openExchangeEv.destroy();
	}

	set open(open) {
		this.setState({ open });
	}

	get open() {
		return this.state.open;
	}

	getHotkeyItemSlot(slot: number) {
		if (!this.state.hotkeys) return null;
		const id = this.state.hotkeys[slot];
		if (!id) return null;
		return this.myInventory.items.find((q) => q[0] === id);
	}

	renderTestBlock(count = 10) {
		const data: InventoryDataCef[] = [];
		const myItems = [
			convertInventoryItemObjectToArray({
				item_id: 861,
				id: 121,
				count: 1,
				serial: "123123",
				extra: null,
			}),
			convertInventoryItemObjectToArray({
				item_id: 500,
				id: 120,
				count: 1,
				serial: "123123",
				extra: null,
			}),
			...generateTestInventory(system.getRandomInt(1, 2)),
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
			// items: [],
			weight_max: 80000,
			name: LangString(
				"components.Inventory.index_new.6e8a49635a29e0beb37948749b4b9468",
			),
			desc: "",
		});
		data.push({
			owner_id: 0,
			owner_type: OWNER_TYPES.WORLD,
			items: generateTestInventory(system.getRandomInt(10, 30)),
			// items: [],
			weight_max: 80000,
			name: LangString(
				"components.Inventory.index_new.a17c93a09e8ecb30a12db5c660d64505",
			),
			desc: "",
		});
		for (let q = 0; q < count; q++) {
			const id = system.getRandomInt(1000, 10000);
			const items = generateTestInventory(system.getRandomInt(20, 30));
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
		for (let q = 0; q < 5; q++) {
			if (system.getRandomInt(1, 100) < 50) {
				hotkeys.push(null);
			} else {
				const item = system.randomArrayElement(myItems);
				hotkeys.push(item[0]);
			}
		}
		this.setState({
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
					playerName: LangString(
						"components.Inventory.index_new.db96a89ab78c225f6a13a8c01d89019c",
					),
					money: 0,
					items: generateTestInventory(system.getRandomInt(1, 5)),
					readyStatus: ExchangeReadyStatus.NOT_READY,
				},
				targetData: {
					playerName: LangString(
						"components.Inventory.index_new.04d979cd9cba56894a47adcece670160",
					),
					money: 0,
					items: generateTestInventory(system.getRandomInt(6, 8)),
					readyStatus: ExchangeReadyStatus.NOT_READY,
				},
			},
			isExchangeOpened: false, //cef test
		});
		// this.setState({blocks: data, hotkeys});
	}

	get myInventory() {
		const items = this.state.blocks.find(
			(block) =>
				block.owner_type === OWNER_TYPES.PLAYER && block.owner_id === CEF.id,
		);
		let weight = 0;
		items.items.map((itemCef) => {
			const item = convertInventoryItemArrayToObject(itemCef);
			weight += getItemWeight(item.item_id, item.count);
		});

		return { ...items, weight };
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	drawEmptyItem(key?: any, slot?: number) {
		const className = `${this.isDragToHotkey() && slot !== undefined ? "slot" : ""} slot`;

		return (
			<div
				tabIndex={-1}
				className={className}
				key={key}
				style={{ zIndex: 10004 }}
				onMouseEnter={() =>
					slot !== undefined
						? this.enterContainer(OWNER_TYPES.HOTKEY, slot)
						: null
				}
				onMouseLeave={() =>
					slot !== undefined ? this.enterContainer(-1, -1) : null
				}
			/>
		);
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	drawEmptyString(count = 7, key?: any) {
		const items: JSX.Element[] = [];
		for (let q = 0; q < count; q++) {
			items.push(this.drawEmptyItem(`${key}_${q}`));
		}
		return items;
	}
	isDragToHotkey = () => {
		return (
			this.state.current[0] === OWNER_TYPES.PLAYER &&
			CEF.id === this.state.current[1]
		);
	};
	currentItem = (owner_type: OWNER_TYPES, owner_id: number) => {
		this.setState({ ...this.state, current: [owner_type, owner_id] });
	};
	enterContainer = (owner_type: OWNER_TYPES, owner_id?: number) => {
		this.setState({
			...this.state,
			containerType: owner_type,
			containerNumber: owner_id ? owner_id : 0,
		});
	};
	drawInventoryContainerItems(
		owner_type: OWNER_TYPES,
		owner_id: number,
		items: InventoryItemCef[],
		line: 7 | 5,
		mini: boolean,
		isDraggable?: { x: number; y: number },
	) {
		let count = items.length;
		while (count >= line) count -= line;
		return (
			<div
				className="inventory-slots"
				onMouseEnter={() => this.enterContainer(owner_type, owner_id)}
				onMouseLeave={() => this.enterContainer(-1, -1)}
			>
				{items.map((item, key) => {
					return (
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						<div key={key}>
							<ItemDraw
								inventory={this}
								item={item}
								owner_type={owner_type}
								owner_id={owner_id}
								keyName={key}
								isDraggable={isDraggable ? isDraggable : null}
							/>
						</div>
					);
				})}
				{count
					? this.drawEmptyString(line - count)
					: this.drawEmptyString(line)}
				{owner_type === OWNER_TYPES.PLAYER && CEF.id === owner_id ? (
					<>
						{items.length < line * 4 ? this.drawEmptyString(line) : <></>}
						{items.length < line * 3 ? this.drawEmptyString(line) : <></>}
						{items.length < line * 2 ? this.drawEmptyString(line) : <></>}
						{items.length < line * 1 ? this.drawEmptyString(line) : <></>}
					</>
				) : (
					<></>
				)}
			</div>
		);
	}

	drawExchangeItems(items: InventoryItemCef[], blockInteractions: boolean) {
		const MAX_ITEMS_IN_EXCHANGE = 10;

		const itemsToDraw = items.concat();
		const fillAmount = MAX_ITEMS_IN_EXCHANGE - items.length;
		for (let i = 0; i < fillAmount; i++) itemsToDraw.push(null);

		return itemsToDraw.map((item, key) => {
			if (item === null) {
				// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
				return <div className="slot" tabIndex={-1} key={key} />;
			}

			let doubleClickTime: number = null;
			const itemId = item[0];
			return (
				<div
					tabIndex={-1}
					// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					key={key}
					className={blockInteractions ? "slot" : "slot"}
					onMouseEnter={(e) => {
						const dom = e.currentTarget.getBoundingClientRect();

						this.setState({
							mouseOnItem: {
								y: dom.top,
								x: dom.left,
								itemName: getItemName(convertInventoryItemArrayToObject(item)),
							},
						});
					}}
					onMouseLeave={() => {
						this.setState({ mouseOnItem: null });
					}}
					onClick={
						blockInteractions
							? () => {}
							: () => {
									if (
										doubleClickTime === null ||
										system.timestampMS > doubleClickTime
									) {
										doubleClickTime = system.timestampMS + 700;
										return;
									}

									doubleClickTime = null;
									CustomEvent.triggerServer(
										"inventory::exchange::delete",
										itemId,
									);
								}
					}
					onKeyDown={
						blockInteractions
							? () => {}
							: () => {
									if (
										doubleClickTime === null ||
										system.timestampMS > doubleClickTime
									) {
										doubleClickTime = system.timestampMS + 700;
										return;
									}

									doubleClickTime = null;
									CustomEvent.triggerServer(
										"inventory::exchange::delete",
										itemId,
									);
								}
					}
				>
					{" "}
					<div className="item">
						<img tabIndex={-1} src={iconsItems[`Item_${item[1]}`]} alt="" />
						<span tabIndex={-1}>{item[2]}</span>
					</div>
				</div>
			);
		});
	}

	drawInventoryContainer(
		owner_type: OWNER_TYPES,
		owner_id: number,
		name: string,
		desc: string,
		items: InventoryItemCef[],
		max_weight: number,
		line: 7 | 5,
		close = false,
		draggable?: { left: number; top: number },
		drag?: { x: number; y: number },
	) {
		if (owner_type === OWNER_TYPES.WORLD && items.length === 0) {
			return (
				<div
					onMouseEnter={() => this.enterContainer(owner_type, owner_id)}
					onMouseLeave={() => this.enterContainer(-1, -1)}
					style={{ marginTop: "8px" }}
					className="storage-block"
				>
					<div className="storage-top" style={{ marginBottom: "8px" }}>
						<div className="storage-title element-title">
							<div className="element-img">
								<img src={worldIcon} alt="" />
								<h1>
									{LangString(
										"components.Inventory.index_new.e4f0da67b26cf896a55eccdae9c24a92",
									)}
								</h1>
							</div>
							<p>
								{LangString(
									"components.Inventory.index_new.ef38cc64b1f0a284ef6c270ac4b14883",
								)}
							</p>
						</div>
					</div>
					<div className="inventory-slots">{this.drawEmptyString(5)}</div>
				</div>
			);
		}

		let weight = 0;
		items.map((itemCef) => {
			const item = convertInventoryItemArrayToObject(itemCef);
			weight += getItemWeight(item.item_id, item.count);
		});
		return (
			<div
				onMouseEnter={() => this.enterContainer(owner_type, owner_id)}
				onMouseLeave={() => this.enterContainer(-1, -1)}
				style={
					draggable
						? {
								position: "absolute",
								zIndex: 10005,
								transform: "translate(-50%, -100%)",
								left: draggable.left,
								top: draggable.top,
							}
						: {}
				}
				className="storage-block"
				key={`item_continer_${owner_type}_${owner_id}`}
				id={`item_continer_${draggable ? "draggable" : ""}_${owner_type}_${owner_id}`}
			>
				<div className="storage-top">
					{owner_type === OWNER_TYPES.WORLD ? (
						<>
							<div className="storage-title element-title">
								<div className="element-img">
									<img src={worldIcon} alt="" />
									<h1>
										{LangString(
											"components.Inventory.index_new.e4f0da67b26cf896a55eccdae9c24a92",
										)}
									</h1>
								</div>
								<p>
									{LangString(
										"components.Inventory.index_new.ef38cc64b1f0a284ef6c270ac4b14883",
									)}
								</p>
							</div>
						</>
					) : draggable ? (
						<>
							<div className="storage-title element-title">
								<h1>{name}</h1>
								<p>{desc}</p>
							</div>
						</>
					) : (
						<>
							<div className="storage-title element-title">
								<h1>{name}</h1>
								<p>{desc}</p>
							</div>
							{draggable ? (
								<></>
							) : (
								<div className="inventory-weight">
									<div className="bar-box">
										<div
											className="bar"
											style={{
												width: `${(weight / max_weight) * 100}%`,
											}}
										/>
									</div>
									<div className="kg">
										<p>
											{weight / 1000} / <span>{max_weight / 1000} kg</span>
										</p>
									</div>
								</div>
							)}
						</>
					)}
				</div>
				{!close ? (
					this.drawInventoryContainerItems(
						owner_type,
						owner_id,
						items,
						5,
						owner_type === OWNER_TYPES.WORLD,
						draggable ? drag : null,
					)
				) : (
					<></>
				)}
			</div>
		);
	}

	updateBlock(data: InventoryDataCef) {
		this.setState({ blocks: [...this.state.blocks, data] });
	}

	removeBlock(owner_type: OWNER_TYPES, owner_id: number) {
		const blocks = [...this.state.blocks];
		blocks.splice(
			blocks.findIndex(
				(q) => q.owner_type === owner_type && q.owner_id === owner_id,
			),
			1,
		);
		this.setState({ blocks });
	}

	closeInventory() {
		CustomEvent.triggerServer("inventory:close");
		CEF.gui.setGui(null);
	}

	updateDragPos = (
		owner_type: OWNER_TYPES,
		owner_id: number,
		data: { x: number; y: number },
	) => {
		if (this.state.current[0] !== -1) return;
		const blocks = [...this.state.blocks];
		const index = blocks.findIndex(
			(q) => q.owner_type === owner_type && q.owner_id === owner_id,
		);
		if (index > -1) {
			blocks[index].drag = {
				x: (blocks[index].drag ? blocks[index].drag.x : 0) + data.x,
				y: (blocks[index].drag ? blocks[index].drag.y : 0) + data.y,
			};
			this.setState({ blocks });
		}
	};

	setExchangeMyMoney(value: number) {
		const exchangeData = this.state.exchangeData;
		exchangeData.myData.money = value;

		this.setState({
			exchangeData,
		});
	}

	_exchangeInputTimer: number = null;
	handleExchangeInput(value: string) {
		const parsedValue = Number.parseInt(value);
		if (Number.isNaN(parsedValue)) {
			this.setExchangeMyMoney(0);
		} else {
			this.setExchangeMyMoney(parsedValue);
		}

		if (!this._exchangeInputTimer) {
			//@ts-ignore
			this._exchangeInputTimer = setTimeout(() => {
				CustomEvent.triggerServer(
					"inventory::exchange::moneyChange",
					this.state.exchangeData.myData.money,
				);
				this._exchangeInputTimer = null;
			}, 1000);
		}
	}

	getExchangeReadyButtonClass(): string {
		const exchangeData = this.state.exchangeData;
		if (
			exchangeData.myData.readyStatus === ExchangeReadyStatus.NOT_READY ||
			exchangeData.targetData.readyStatus === ExchangeReadyStatus.NOT_READY
		) {
			return "exchange-forReady";
		}
		return "exchange-forConfirm";
	}

	getExchangeReadyButtonImg(): string {
		const exchangeData = this.state.exchangeData;
		if (exchangeData.myData.readyStatus > exchangeData.targetData.readyStatus) {
			return "loading";
		}
		return "mark";
	}

	render() {
		const help_offst = document.getElementById("inventory-main-wrap")
			? document.getElementById("inventory-main-wrap").offsetLeft
			: -1;
		//        if( document.getElementById(`inventory-main-wrap`))
		//            console.log( `${document.getElementById(`inventory-main-wrap`).offsetLeft}` );
		if (!this.open) return <></>;
		const filteredBlocks = this.state.blocks.filter(
			(q) =>
				!(q.owner_type === OWNER_TYPES.PLAYER && q.owner_id === CEF.id) &&
				!q.show &&
				!CONTAINERS_DATA.some((s) => s.owner_type === q.owner_type),
		);

		// Проверяем, есть ли среди отфильтрованных контейнеров что-то кроме WORLD
		const hasOtherContainers = filteredBlocks.some(
			(b) => b.owner_type !== OWNER_TYPES.WORLD,
		);
		console.log(this.state.blocks.length);
		//this.myInventory.items
		return (
			<div className="inventory-container-box">
				{this.state.addModal ? (
					<div
						className={`modal-increasing-capacity-inventory-wrapper ${this.state.addModal ? "visible" : ""}`}
					>
						<button
							type="button"
							className="close-button"
							onClick={(e) => {
								e.preventDefault();
								this.setState({ addModal: false });
							}}
						>
							<img
								tabIndex={-1}
								src={svg.close}
								width="24"
								height="24"
								alt=""
							/>
						</button>
						<div className="image">
							<img src={backPackBig} alt="" />
						</div>
						<div className="desc">
							<p className="p-18px fw400 lh180">
								{getDonateItemConfig(7).desc}
							</p>
							<button
								type="button"
								className="br4"
								disabled={
									this.state.inv_level &&
									this.state.inv_level >= PLAYER_INVENTORY_MAX_LEVEL
								}
								onClick={(e) => {
									e.preventDefault();
									this.setState({ addModal: false }, () => {
										CustomEvent.triggerServer("mainmenu:buyShop", 7);
									});
								}}
							>
								<p tabIndex={-1} className="p-16px fw800 upper">
									{system.numberFormat(getDonateItemConfig(7).price)}{" "}
									{DONATE_MONEY_NAMES[2]}
								</p>
							</button>
						</div>
					</div>
				) : (
					<></>
				)}
				<div
					className={`all-inventory ${this.state.addModal ? "invisible" : ""}`}
				>
					<>
						<div className="top">
							<div className="title">
								<h1>
									<span>inventory</span>
								</h1>
								<p>A place to store your personal belongings and items</p>
							</div>
						</div>
						<div className="content">
							{!this.state.isExchangeOpened ? (
								<div className="clothes">
									<div className="clothes-title element-title">
										<div className="element-img">
											<img src={jacketOrangeIcon} alt="" />
											<h1>Clothes</h1>
										</div>
										<p>Lorem ipsum dolor sit amet!</p>
									</div>
									<div
										className="clothes-items-all"
										onMouseEnter={() =>
											this.enterContainer(OWNER_TYPES.CLOTHES, CEF.id)
										}
										onMouseLeave={() => this.enterContainer(-1, -1)}
									>
										<div className="clothes-items">
											{this.drawEquipmentItem("armor", 960, "body-armor")}
											{this.drawEquipmentItem("gloves", 949, "gloves")}
											{this.drawEquipmentItem("hat", 954, "hat")}
											{this.drawEquipmentItem("glasses", 955, "glasses")}
											{this.drawEquipmentItem("ear", 956, "earrings")}
											{this.drawEquipmentItem("accessorie", 958, "tie")}
											{this.drawEquipmentItem("mask", 950, "mask")}
											{this.drawEquipmentItem("torso", 951, "clothes")}
											{this.drawEquipmentItem("bracelet", 959, "bracelet")}
											{this.drawEquipmentItem("leg", 952, "pants")}
											{this.drawEquipmentItem("watch", 957, "watch")}
											{this.drawEquipmentItem("foot", 953, "shoes")}
										</div>
										<div className="weapons-items">
											{this.state.weapons ? (
												<>
													<div className="weapon-item">
														<ItemDraw
															keyName={`weapon_${0}`}
															owner_type={OWNER_TYPES.PLAYER}
															owner_id={CEF.id}
															item={this.myInventory.items.find(
																(q) => q[0] === this.state.weapons.id,
															)}
															inventory={this}
															ishotkey={true}
														/>
													</div>

													<div
														className="weapons-item"
														onClick={(e) => {
															e.preventDefault();
															CustomEvent.triggerServer(
																"inventory:reload:weapon",
															);
															this.closeInventory();
														}}
														onKeyDown={(e) => {
															e.preventDefault();
															CustomEvent.triggerServer(
																"inventory:reload:weapon",
															);
															this.closeInventory();
														}}
													>
														<div className="weapons-items">
															<div className="weapon-item">
																<img
																	src={
																		iconsItems[
																			`Item_${inventoryShared.getWeaponConfigByItemId(this.state.weapons.item_id).ammo_box}`
																		]
																	}
																	alt=""
																	draggable="false"
																/>
															</div>
															{this.state.weapons.ammo}
														</div>
													</div>
												</>
											) : (
												<>
													<div tabIndex={-1} className="weapon-item">
														<img tabIndex={-1} src={svg.gun} alt="" />
													</div>
													<div tabIndex={-1} className="weapon-item">
														<img tabIndex={-1} src={svg.magazine} alt="" />
													</div>
												</>
											)}
										</div>
									</div>
								</div>
							) : (
								<></>
							)}
							<div className="inventory">
								<div className="inventory-top">
									<div className="inventory-title element-title">
										<div className="element-img">
											<img src={bagpackIcon} alt="" />
											<h1>Inventory</h1>
										</div>
										<p>Lorem ipsum dolor sit amet!</p>
									</div>
									<div className="inventory-weight">
										<div className="bar-box">
											<div
												className="bar"
												style={{
													width: `${
														(this.myInventory.weight /
															this.myInventory.weight_max) *
														100
													}%`,
												}}
											/>
										</div>
										<div className="kg">
											<p>
												{this.myInventory.weight / 1000} /{" "}
												<span>{this.myInventory.weight_max / 1000} kg</span>
											</p>
										</div>
										{!(
											this.state.inv_level &&
											this.state.inv_level >= PLAYER_INVENTORY_MAX_LEVEL
										) ? (
											<button
												type="button"
												onClick={(e) => {
													e.preventDefault();
													this.setState({ addModal: true });
												}}
												onKeyDown={(e) => {
													e.preventDefault();
													this.setState({ addModal: true });
												}}
											>
												+
											</button>
										) : (
											<></>
										)}
									</div>
								</div>

								{this.drawInventoryContainerItems(
									OWNER_TYPES.PLAYER,
									CEF.id,
									this.myInventory.items,
									5,
									false,
								)}
								<div style={{ marginTop: "19px", height: "350px", overflow: "scroll"}}>
									{!this.state.isExchangeOpened &&
									this.state.blocks?.length &&
									this.state.blocks.some((q) => q.show) ? (
										this.state.blocks
											.filter(
												(q) =>
													!(
														q.owner_type === OWNER_TYPES.PLAYER &&
														q.owner_id === CEF.id
													) && q.show,
											)
											.map((block) => (
												<React.Fragment
													key={`${block.owner_type}-${block.owner_id}`}
												>
													{this.drawInventoryContainer(
														block.owner_type,
														block.owner_id,
														block.name,
														block.desc,
														block.items,
														block.weight_max,
														5,
														block.closed,
														block.show ? null : null,
														block.drag,
													)}
												</React.Fragment>
											))
									) : (
										<>
											<div className="inventory-top">
												<div className="inventory-title element-title">
													<div className="element-img">
														<img src={bagpackIcon} alt="" />
														<h1>Backpack</h1>
													</div>
													<p>Lorem ipsum dolor sit amet!</p>
												</div>
											</div>
											<div className="inventory-disable-container">
												<div className="inventory-slots">
													{this.drawEmptyString(10)}
												</div>
												<div className="inventory-overlay">
													<img src={lockedIcon} alt="" />
													<span>You don't have a backpack</span>
												</div>
											</div>
										</>
									)}
								</div>
							</div>
							<div className="storage">
								<div
									className="storage-blocks"
									style={{
										height: this.state.isExchangeOpened ? "800px" : "480px",
									}}
								>
									{!this.state.isExchangeOpened &&
										this.state.blocks?.length &&
										this.state.blocks
											.filter(
												(q) =>
													!(
														q.owner_type === OWNER_TYPES.PLAYER &&
														q.owner_id === CEF.id
													) &&
													!q.show &&
													!CONTAINERS_DATA.some(
														(s) => s.owner_type === q.owner_type,
													) &&
													!(
														q.owner_type === OWNER_TYPES.WORLD &&
														hasOtherContainers
													),
											)
											.map((block, index) =>
												this.drawInventoryContainer(
													block.owner_type,
													block.owner_id,
													block.name,
													block.desc,
													block.items,
													block.weight_max,
													7,
													block.closed,
													block.show
														? { left: block.left, top: block.top }
														: null,
												),
											)}

									{this.state.isExchangeOpened && (
										<div className="exchange-blocks">
											<div className="exchange-top">
												<div className="exchange-title element-title">
													<div className="element-img">
														<h1>You're giving away:</h1>
													</div>
												</div>
											</div>

											<div className="inventory-slots">
												{this.drawExchangeItems(
													this.state.exchangeData.myData.items,
													this.state.exchangeData.myData.readyStatus !==
														ExchangeReadyStatus.NOT_READY,
												)}
											</div>

											<div className="exchange-left-input">
												<p>Specify the additional payment (if necessary)</p>
												<div className="exchange-input">
													<img src={svg.coin} alt="" />
													<input
														type="number"
														placeholder="Введите сумму"
														disabled={
															this.state.exchangeData.myData.readyStatus !==
															ExchangeReadyStatus.NOT_READY
														}
														onChange={(event) =>
															this.handleExchangeInput(
																event.currentTarget.value,
															)
														}
														value={this.state.exchangeData.myData.money}
													/>
												</div>
											</div>

											<div className="exchange-top">
												<div className="exchange-title element-title">
													<div className="element-img">
														<h1>
															You will receive from{" "}
															{this.state.exchangeData.targetData.playerName}
														</h1>
													</div>
												</div>
											</div>
											<div className="inventory-slots">
												{this.drawExchangeItems(
													this.state.exchangeData.targetData.items,
													true,
												)}
											</div>

											<div className="exchange-left-input">
												<div className="exchange-input">
													<img src={svg.coin} alt="" />
													<input
														type="number"
														placeholder="0"
														disabled={true}
														value={this.state.exchangeData.targetData.money}
													/>
												</div>
											</div>

											<div className="exchange-buttons">
												<div
													className={`button accept ${this.getExchangeReadyButtonClass()}`}
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
													<span>Accept</span>
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
													<span>Reject</span>
												</div>
											</div>
										</div>
									)}
								</div>
								<div className="hotkeys">
									{!this.state.isExchangeOpened && this.state.hotkeys ? (
										<>
											<div className="hotkeys-top">
												<div className="hotkeys-title element-title">
													<div className="element-img">
														<img src={hotbaricon} height="14px" alt="" />
														<h1>Hotbar</h1>
													</div>
													<p>Quick access items</p>
												</div>
											</div>
											<div className="hotkeys-slots">
												{this.state.hotkeys.map((id, slot) => {
													if (!id)
														return this.drawEmptyItem(`hotkey_${slot}`, slot);
													const item = this.getHotkeyItemSlot(slot);
													if (!item)
														return this.drawEmptyItem(`hotkey_${slot}`, slot);
													return (
														<div
															key={`hotkey_${
																// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
																slot
															}`}
															onMouseEnter={() =>
																this.enterContainer(OWNER_TYPES.HOTKEY, slot)
															}
															onMouseLeave={() => this.enterContainer(-1, -1)}
														>
															<ItemDraw
																keyName={`hotkey_${slot}`}
																owner_type={OWNER_TYPES.PLAYER}
																owner_id={CEF.id}
																item={item}
																inventory={this}
																ishotkey={true}
															/>
														</div>
													);
												})}
											</div>
											<div className="hotkeys-buttons">
												<div className="hotkeys-buttons-button">1</div>
												<div className="hotkeys-buttons-button">2</div>
												<div className="hotkeys-buttons-button">3</div>
												<div className="hotkeys-buttons-button">4</div>
												<div className="hotkeys-buttons-button">5</div>
											</div>
										</>
									) : (
										<></>
									)}
								</div>
							</div>
						</div>
					</>
				</div>
			</div>
		);
	}

	drawEquipmentItem(item: keyof InventoryEquipList, id: number, icon: string) {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const equip = !!(this.state.equip as any)[item as any];
		return (
			<div
				tabIndex={-1}
				className="clothes-item"
				onClick={(e) => {
					e.preventDefault();
					if (!equip) return;
					CustomEvent.triggerServer("inventory:unequip_item", id);
				}}
				onKeyDown={(e) => {
					e.preventDefault();
					if (!equip) return;
					CustomEvent.triggerServer("inventory:unequip_item", id);
				}}
			>
				<img
					tabIndex={-1}
					src={equip ? iconsItems[`Item_${id}`] : svg[icon]}
					alt=""
				/>
			</div>
		);
	}
}

const SliderStyles = createStyles({
	colorPrimary: {
		color: "#000000",
	},
	root: {
		marginTop: 5,
		color: "#C4C4C4",
		height: 16,
	},
	markLabel: {
		color: "#FFFFFFaa",
		fontSize: "0.7vw",
	},
	markLabelActive: {
		color: "#FFFFFFee",
	},
	thumb: {
		height: 16,
		width: 16,
		borderRadius: 8,
		backgroundColor: "#F04D26",
		marginTop: -7, //-3,
		"&:focus, &:hover": {
			boxShadow: "0px 0px 30px #F04D26",
		},
	},
	track: {
		backgroundColor: "#F04D26",
		boxShadow: "0px 0px 3px #F04D26",
	},
});
const NewSliderStyles = withStyles(SliderStyles)(Slider);
