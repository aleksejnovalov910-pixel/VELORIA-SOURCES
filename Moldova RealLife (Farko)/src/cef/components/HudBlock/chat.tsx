import "./chat.scss";
// biome-ignore lint/style/useImportType: <explanation>
import React, { Component, createRef } from "react";

import { CustomEvent } from "../../modules/custom.event";
import type { CustomEventHandler } from "../../../shared/custom.event";
import { CEF } from "../../modules/CEF";
import type { StorageAlertData } from "../../../shared/alertsSettings";
import ChatSend from "./images/svg/ChatSend";

export class HudChatClass extends Component<
	{
		alertsData: StorageAlertData;
	},
	{
		inpubg?: boolean;
		input: string;
		history: string[];
		historyIndex: number;
		messages: [string, string, string, string][];
		currentTime: string;
		active: boolean;
		enable: boolean;
		show: boolean;
		showHud: boolean;
		fullshowtimer: number;
	}
> {
	ev: CustomEventHandler;
	ev2: CustomEventHandler;
	ev3: CustomEventHandler;
	commands: [string, string, string, string][] = [
		// '/me ', '/do ', '/try '
		["me", "/me", "Опишите состояние", "Message"],
		["do", "/do", "Опишите состояние", "Message"],
		["try", "/try", "Опишите предмет случайности", "Message"],
		["b", "OOC чат", "Напишите сообщение", "Message"],
	];
	messagesBlock: React.RefObject<HTMLDivElement>;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	int: any;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	constructor(props: any) {
		super(props);

		this.state = {
			fullshowtimer: 0,
			input: "",
			messages: [],
			history: [],
			historyIndex: 0,
			currentTime: "00:00",
			active: false, //false
			show: true,
			showHud: false, //false
			enable: true,
		};

		CustomEvent.register("cef:hud:showHud", (show: boolean) => {
			this.setState({ showHud: show }, () => {
				if (show && this.messagesBlock && this.messagesBlock.current)
					this.messagesBlock.current.scrollTo({
						top: this.messagesBlock.current.scrollHeight,
					});
			});
		});

		// CustomEvent.register('alerts:enable', (alertsData: StorageAlertData) => {
		//     this.setState({alertsData});
		// })

		this.messagesBlock = createRef();

		if (!window.chatAPI) {
			Object.defineProperty(window, "chatAPI", {
				writable: true,
			});
			window.chatAPI = {};
		}
		CustomEvent.register("outputChatBox", (text: string) => {
			window.chatAPI.push(text);
		});
		CustomEvent.register(
			"hud:data",
			(
				date: string,
				time1: string,
				time2: string,
				online: number,
				isAdmin: boolean,
			) => {
				this.setState({ currentTime: time1 });
			},
		);

		CustomEvent.register("alerts:enable", (alerts: StorageAlertData) => {
			this.setState({ enable: alerts.enableChat });
		});

		setInterval(() => {
			if (!this.state.fullshowtimer) return;
			this.setState({ fullshowtimer: this.state.fullshowtimer - 1 });
		}, 1000);

		window.chatAPI.push = this.insertMessage.bind(this);
		window.chatAPI.clear = this.clearChat.bind(this);
		window.chatAPI.show = this.showChat.bind(this);
		window.chatAPI.activate = this.activeInput.bind(this);
		window.chatAPI.send = this.sendMessage.bind(this);
		window.chatAPI.value = this.valueInput.bind(this);
		if (CEF.test) {
			let q = 0;
			this.int = setInterval(() => {
				q++;
				this.insertMessage(
					`Случайное сообщение которое СлучайноесообщениекотороеСлучайноесообщениекотороеСлучайноесообщениекотороСлучайноесообщениекоторое  ${q}`,
					"Дядя Петя",
				);
			}, 300);
		}

		CustomEvent.register("cef:chat:message", (message: string) => {
			this.insertMessage(message);
		});

		CustomEvent.register("hud:pubg", () => {
			this.setState({ inpubg: true });
		});
		CustomEvent.register("hud:pubghide", () => {
			this.setState({ inpubg: false });
		});
	}
	valueInput(input: string) {
		this.setState({
			input,
		});
	}
	clearChat() {
		this.setState({ messages: [] });
	}
	showChat(show: boolean) {
		this.setState({ show });
	}

	sendMessage() {
		let value = this.state.input;
		value = value.trim();
		if (value.length >= 350) return;
		if (value.length > 0) {
			// this.addHistoryMessage(value);
			if (value[0] === "/") {
				value = value.substr(1);
				if (value.length > 0) {
					const args = value.split(" ");
					if (args.length >= 1) {
						CEF.triggerChatCommand(...args);
					}
					this.setState({ history: [`/${value}`, ...this.state.history] });
				}
			} else {
				mp.trigger("chatMessage", value);
				this.setState({ history: [value, ...this.state.history] });
			}
		}
		this.valueInput("");
	}

	activeInput(active: boolean) {
		mp.trigger("setChatActiveInput", !!active);
		mp.trigger("cef:setCursor", active);
		if (this.state.active !== active) {
			mp.invoke("focus", active);
		}
		// this.props.setChatActive(active);
		this.setState({
			active,
		});
	}
	insertMessage(text: string, who?: string) {
		const messages = [...this.state.messages];
		const needScrool =
			this.messagesBlock?.current &&
			this.messagesBlock.current.scrollHeight ===
				this.messagesBlock.current.scrollTop +
					this.messagesBlock.current.clientHeight;
		const tag = "IC"; // Todo
		messages.push([this.state.currentTime, who, text, tag]);
		this.setState({ messages, fullshowtimer: 20 }, () => {
			if (needScrool)
				this.messagesBlock.current.scrollTo({
					top: this.messagesBlock.current.scrollHeight,
				});
		});
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	handleKeyDown(event: any) {
		if (!this.state.showHud) return;
		if (
			CEF.gui.currentGui &&
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			CEF.gui.currentGui !== ("hud" as any) &&
			CEF.gui.currentGui !== "init"
		)
			return;
		if (
			!CEF.focusInput &&
			!this.state.active &&
			this.state.showHud &&
			event.keyCode === 84
		) {
			event.preventDefault();
			this.activeInput(true);
			return;
		}
		if (!this.state.active) return;
		if ([27].includes(event.keyCode) && this.state.active) {
			event.preventDefault();
			this.valueInput("");
			this.activeInput(false);
		}
		if ([13].includes(event.keyCode) && this.state.active) {
			event.preventDefault();
			this.sendMessage();
			this.activeInput(false);
		}
	}

	componentDidMount() {
		document.addEventListener("keydown", (ev) => {
			this.handleKeyDown(ev);
		});
	}
	componentWillUnmount() {
		document.removeEventListener("keydown", (ev) => {
			this.handleKeyDown(ev);
		});
		if (this.int) clearInterval(this.int);
	}

	get currentCommand() {
		return this.getStringCommand(this.state.input);
	}
	getStringCommand(str: string) {
		if (!str) return null;
		let com: string = null;
		this.commands.map((data) => {
			if (str.indexOf(`/${data[0]} `) === 0) {
				com = data[0];
			}
		});
		return com;
	}
	formatMessage(str: string, p0: string) {
		str = unescape(str);
		str = str.replace(/\n/g, " ");
		const entityMap: { [x: string]: string } = {
			"&": "&amp;",
			"<": "&lt;",
			">": "&gt;",
			'"': "&quot;",
			"'": "&#39;",
			"/": "&#x2F;",
			"`": "&#x60;",
			"=": "&#x3D;",
			Ä: "&Auml;",
			ä: "&auml;",
			Ö: "&Ouml;",
			ö: "&ouml;",
			Ü: "&Uuml;",
			ü: "&uuml;",
			ß: "&szlig;",
			"¡": "&iexcl;",
			Á: "&Aacute;",
			É: "&Eacute;",
			Í: "&Iacute;",
			Ó: "&#211;", // Ensuring unique mapping
			Ú: "&Uacute;",
			á: "&aacute;",
			é: "&eacute;",
			í: "&iacute;",
			ó: "&#243;", // Ensuring unique mapping
			ú: "&uacute;",
			Ñ: "&Ntilde;",
			ñ: "&ntilde;",
			ą: "&#261;",
			ę: "&#281;",
			ć: "&#263;",
			ź: "&#378;",
			ż: "&#380;",
			ł: "&#322;",
			Ą: "&#260;",
			Ę: "&#280;",
			Ć: "&#262;",
			Ź: "&#377;",
			Ż: "&#379;",
			Ł: "&#321;",
			Ś: "&#346;",
			ś: "&#347;",
			Ń: "&#323;",
			ń: "&#324;",
			// Serbian Latin characters
			Č: "&#268;",
			č: "&#269;",
			Ž: "&#381;",
			ž: "&#382;",
			Đ: "&#272;",
			đ: "&#273;",
			Š: "&#352;",
			š: "&#353;",
			// Add more characters if necessary
		};

		let textResult = String(str)
			.replace(
				/[&<>"'`=\/ÁÉÍÓÚáéíóúÑñÜü¡ÄäÖößąęćźżłóĄĘĆŹŻŁÓŚńŃśČčĆćŽžĐđŠš가-힣]/gi,
				(s) => {
					return entityMap[s] || s; // Use the mapped entity if available, else keep the character
				},
			)
			.split("")
			.reduce((str, s) => {
				return (
					str +
					(/[\wáéíóúüñÁÉÍÓÚÜÑäöüÄÖÜąęćźżłóĄĘĆŹŻŁÓŚńŃśČčĆćŽžĐđŠš가-힣\!\@\#\$\%\^\&\*\(\)\{\}\,\.\_\+\№\;\:\?\\\<\>\`\-\¡\´]/gi.test(
						s,
					)
						? s
						: " ")
				);
			}, "");

		// Match color codes with !{#code} or !{code}
		const matchColors = /!\{#?\w*\}/gi;
		let match = textResult.match(matchColors);
		if (match !== null) {
			for (let i = 0; i < match.length; i++) {
				const clr = match[i].replace("!{", "").replace("}", "");
				textResult = textResult.replace(
					match[i],
					`<span style="color: ${clr.startsWith("#") ? clr : `#${clr}`}">`,
				);
			}

			for (let i = 0; i < match.length; i++) {
				textResult += "</span>";
			}
		}

		// Find the timestamp part, assuming it's always at the start and in the format [hh:mm:ss]
		const timestampMatch = textResult.match(/^\[\d{2}:\d{2}:\d{2}\]/);
		if (timestampMatch !== null) {
			const timestamp = timestampMatch[0];
			textResult = textResult.replace(
				timestamp,
				`${timestamp} <div class="hud-chat-history-item-message-tag hud-chat-history-item-message-tag-${tag}">${tag}</div>`,
			);
		}

		return textResult;
	}
	get currentCommandDesc() {
		if (!this.state.input) return "Enter your text";
		let com = "Enter your text";
		this.commands.map((data) => {
			if (this.state.input.indexOf(`/${data[0]} `) === 0) {
				com = data[2];
			}
		});
		return com;
	}
	clearCommand(callBack?: (str?: string) => void) {
		let str = this.state.input;
		this.commands.map((data) => {
			if (str.indexOf(`/${data[0]} `) === 0) {
				str = str.replace(`/${data[0]} `, "");
			}
		});
		this.setState({ input: str }, () => {
			if (callBack) callBack(str);
		});
	}
	setCommand(command: string) {
		this.clearCommand((res) => {
			this.setState({ input: `/${command} ${res}` });
		});
	}

	render() {
		if (!this.state.show) return <></>;
		if (!this.state.showHud) return <></>;
		if (!this.state.enable) return <></>;
		return (
			<div
				className="chat-container-box"
				style={{
					opacity:
						this.state.fullshowtimer ||
						this.state.active ||
						!this.props.alertsData ||
						!this.props.alertsData.opacityChat
							? 1
							: 0.1,
				}}
				tabIndex={-1}
			>
				<div className="chatbox">
					<div className="chat-messages" ref={this.messagesBlock} tabIndex={-1}>
						{this.state.messages.map((message, id) => {
							return (
								<div
									className="message"
									key={`message_chat_${
										// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
										id
									}`}
								>
									{/* <p className="time">{message[0] || ""}</p> */}
									<div className="name">
										{message[1] ? `${message[1]}:` : ""}
									</div>
									<div
										className="text"
										// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
										dangerouslySetInnerHTML={{
											__html: this.formatMessage(message[2], message[3]),
										}}
									/>
								</div>
							);
						})}
					</div>
					{this.state.active ? (
						<>
							<div className="chat-input">
								<input
									type="text"
									placeholder={`${this.currentCommandDesc} . . .`}
									value={this.state.input}
									onChange={(e) => {
										e.preventDefault();
										this.setState({
											input: e.currentTarget.value,
											historyIndex: -1,
										});
									}}
									onKeyDown={(e) => {
										if (e.keyCode !== 38 && e.keyCode !== 40) return;
										const target =
											e.keyCode === 38
												? this.state.historyIndex + 1
												: this.state.historyIndex - 1;
										if (!this.state.history[target]) return;
										this.setState({
											input: this.state.history[target],
											historyIndex: target,
										});
										e.preventDefault();
									}}
									ref={(input) => {
										if (input) {
											input.focus();
										}
									}}
								/>
								<button
									type="button"
									onClick={(e) => {
										e.preventDefault();
										this.sendMessage();
									}}
								>
									⮞
								</button>
							</div>
						</>
					) : (
						<></>
					)}
				</div>
			</div>
		);
	}
}
