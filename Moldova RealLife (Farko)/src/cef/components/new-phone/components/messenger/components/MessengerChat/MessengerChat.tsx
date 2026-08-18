import { LangString } from "../../../../../../modules/lang";
import React, { Component, useEffect, useRef } from "react";
const png = Object.fromEntries(
	Object.entries(import.meta.glob("../../assets/*.png", { eager: true })).map(
		([key, value]) => {
			const name = key.match(/\/([^/]+)\.png$/)[1];
			return [name, value.default];
		},
	),
);
const svg = Object.fromEntries(
	Object.entries(import.meta.glob("../../assets/*.svg", { eager: true })).map(
		([key, value]) => {
			const name = key.match(/\/([^/]+)\.svg$/)[1];
			return [name, value.default];
		},
	),
);
const photo = Object.fromEntries(
	Object.entries(import.meta.glob("../../assets/*.png", { eager: true })).map(
		([key, value]) => {
			const name = key.match(/\/([^/]+)\.png$/)[1];
			return [name, value.default];
		},
	),
);
import { Chat } from "../../interfaces/chat.interface";
import "./style.less";
import classNames from "classnames";
import { CEF } from "../../../../../../modules/CEF";
import { CustomEvent } from "../../../../../../modules/custom.event";
import { IPhoneMessengerMessageDTO } from "../../../../../../../shared/phone";
import { systemUtil } from "../../../../../../../shared/system";
import { CustomEventHandler } from "../../../../../../../shared/custom.event";
import ReactTooltip from "react-tooltip";

interface Message {
	senderNumber: number;
	message: string;
	time: string;
	type?: string;
	gpsCoords?: [number, number];
}

export class MessengerChat extends Component<
	{
		returnBack: Function;
		myNumber: number;
		myPhoneId: number;
		targetNumber: number;
		targetName: string;
	},
	{
		messages: Message[];
		inputValue: string;
		messengerHide: boolean;
	}
> {
	ev1: CustomEventHandler;

	constructor(props: any) {
		super(props);
		this.state = {
			inputValue: "",
			messages: CEF.test
				? [
						{ senderNumber: 223, message: "hi", time: "22:48" },
						{ senderNumber: 233, message: "hi privet", time: "22:48" },
						{ senderNumber: 223, message: "hi", time: "22:48" },
						{
							senderNumber: 233,
							message: "hi privet",
							time: "22:48",
							type: "gps",
						},
						{ senderNumber: 223, message: "hi", time: "22:48" },
						{ senderNumber: 233, message: "hi privet", time: "22:48" },
						{ senderNumber: 223, message: "hi", time: "22:48" },
						{
							senderNumber: 233,
							message: "hi privet",
							time: "22:48",
							type: "gps",
						},
						{ senderNumber: 223, message: "hi", time: "22:48" },
						{ senderNumber: 233, message: "hi privet", time: "22:48" },
						{ senderNumber: 223, message: "hi", time: "22:48" },
						{ senderNumber: 223, message: "hi", time: "22:48" },
						{ senderNumber: 223, message: "hi", time: "22:48" },
						{ senderNumber: 223, message: "hi", time: "22:48" },
						{
							senderNumber: 233,
							message: "hi privet",
							time: "22:48",
							type: "gps",
						},
					]
				: [],
			messengerHide: true,
		};

		this.ev1 = CustomEvent.register(
			"phone:messenger:insert",
			(message: IPhoneMessengerMessageDTO) => {
				this.setState({
					messages: [
						...this.state.messages,
						{
							message: message.text,
							senderNumber: message.sender,
							time: systemUtil.timeStampStringTime(message.time),
							type: message.gps[0] && message.gps[1] ? "gps" : null,
							gpsCoords: message.gps,
						},
					],
				});
			},
		);

		CustomEvent.callServer(
			"phone:messenger:getMessages",
			this.props.myPhoneId,
			this.props.myNumber,
			this.props.targetNumber,
		).then((data: IPhoneMessengerMessageDTO[]) => {
			this.setState({
				messages: data
					.sort((a, b) => a.time - b.time)
					.map((el) => {
						return {
							message: el.text,
							senderNumber: el.sender,
							time: systemUtil.timeStampStringTime(el.time),
							type: el.gps[0] && el.gps[1] ? "gps" : null,
							gpsCoords: el.gps,
						};
					}),
			});
		});
	}

	componentWillUnmount() {
		this.ev1?.destroy;
	}

	componentDidMount() {
		/* let messenger = document.getElementById("messenger");
         setTimeout(() => messenger.scrollTop = messenger.scrollHeight, 100)*/
	}

	scroll() {
		setTimeout(() => {
			let messenger = document.getElementById("messenger");
			messenger.scrollTop = messenger.scrollHeight;
			this.setState({ messengerHide: false });
		}, 700);
	}

	checkEnd(key: number) {
		if (key === this.state.messages.length) return this.scroll();
	}

	onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({
			inputValue: systemUtil.filterInput(e.currentTarget.value),
		});
	};

	onEnterPressed = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key == "Enter") {
			CustomEvent.triggerServer(
				"phone:messenger:sendMessage",
				this.props.myPhoneId,
				this.props.myNumber,
				this.props.targetNumber,
				this.state.inputValue,
			);
			this.setState({ inputValue: "" });
		}
	};

	onSendGpsPressed = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
		CustomEvent.triggerServer(
			"phone:messenger:sendGpsMessage",
			this.props.myPhoneId,
			this.props.myNumber,
			this.props.targetNumber,
		);
	};

	onAcceptGpsPressed = (message: Message) => {
		CustomEvent.triggerServer("phone:messenger:acceptGps", message.gpsCoords);
	};

	render() {
		return (
			<div className="np-chat-component" onKeyDown={this.onEnterPressed}>
				<div className="np-messenger-chatpage">
					<div className="np-messenger-chatpage-title-wrap">
						<div className="np-messenger-chatpage-title">
							<img
								src={svg["arrow-left"]}
								alt=""
								className="np-messenger__back"
								onClick={() => this.props.returnBack()}
							/>
							<img
								src={photo["empty"]}
								className="np-messenger-chatpage-title__photo"
								alt=""
							/>
							<span>{this.props.targetName ?? this.props.targetNumber}</span>
							<img
								src={svg["gps"]}
								data-tip={LangString(
									"components.new-phone.components.messenger.components.MessengerChat.MessengerChat.87f2fe9371abb7c062e0f2cd599c0ab7",
								)}
								alt=""
								onClick={this.onSendGpsPressed}
								className="np-messenger-chatpage-title__gps"
							/>
						</div>
					</div>
					<div className="np-messenger-chatpage-body">
						<div
							className={classNames("np-messenger-chatpage-body-scroll", {
								"np-messenger-chatpage-body-scroll__hide":
									this.state.messengerHide,
							})}
							id="messenger"
						>
							<div className="np-messenger-chatpage-body__margin" />

							<div className="np-messenger-chatpage-body__date">
								{LangString(
									"components.new-phone.components.messenger.components.MessengerChat.MessengerChat.efa9bd36e8ec88aa1ed6f9d3ad9dea86",
								)}
							</div>

							{this.state.messages.map((el, key) => {
								return (
									<>
										{el.type === "gps" ? (
											<div
												key={key}
												className={classNames(
													"np-messenger-chatpage-body__block np-messenger-chatpage-body__block-padding",
													{
														"np-messenger-chatpage-body__block-left":
															el.senderNumber !== this.props.myNumber,
													},
												)}
											>
												<div
													className="np-messenger-chatpage-body__block-map"
													onClick={() => this.onAcceptGpsPressed(el)}
												>
													<img src={png["map"]} alt="" />
													{el.senderNumber === this.props.myNumber ? (
														<div>
															{LangString(
																"components.new-phone.components.messenger.components.MessengerChat.MessengerChat.08edd27ee9a578a8f429bf4ac2c29d3f",
															)}{" "}
															<p>
																{LangString(
																	"components.new-phone.components.messenger.components.MessengerChat.MessengerChat.2cccd15dfded2d729f4091c524a059ab",
																)}
															</p>
														</div>
													) : (
														<div>
															{this.props.targetName ?? this.props.targetNumber}{" "}
															{LangString(
																"components.new-phone.components.messenger.components.MessengerChat.MessengerChat.792515dccbf9519a32b699a2bbbedd40",
															)}{" "}
															<p>
																{LangString(
																	"components.new-phone.components.messenger.components.MessengerChat.MessengerChat.9d6b0dfc6e39d493107e73d6bb6b9c3b",
																)}
															</p>
														</div>
													)}
												</div>
												<span>{el.time}</span>
											</div>
										) : (
											<div
												key={key}
												className={classNames(
													"np-messenger-chatpage-body__block",
													{
														"np-messenger-chatpage-body__block-left":
															el.senderNumber !== this.props.myNumber,
													},
												)}
											>
												{el.message}
												<span>{el.time}</span>
											</div>
										)}

										{this.checkEnd(key + 1)}
									</>
								);
							})}
						</div>
					</div>
					<div className="np-messenger-chatpage-input">
						<input
							type="text"
							placeholder={LangString(
								"components.new-phone.components.messenger.components.MessengerChat.MessengerChat.db16aaa412ec93f85ba6934bf9f3336f",
							)}
							value={this.state.inputValue}
							onChange={this.onInputChange}
						/>
						<img src={svg["clip"]} alt="" />
					</div>
				</div>
				<ReactTooltip
					place={"left"}
					effect={"solid"}
					backgroundColor={"#007AFF"}
				/>
			</div>
		);
	}
}
