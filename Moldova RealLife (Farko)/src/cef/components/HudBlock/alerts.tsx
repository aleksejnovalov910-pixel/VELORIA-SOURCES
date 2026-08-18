import "./alert.scss";
// biome-ignore lint/style/useImportType: <explanation>
import React, { Component } from "react";

import { CustomEvent } from "../../modules/custom.event";
import type { CustomEventHandler } from "../../../shared/custom.event";
import { CEF } from "../../modules/CEF";
import successIcon from "./img/success.svg";
import errorIcon from "./img/error.svg";
import infoIcon from "./img/info.svg";
import warningIcon from "./img/warning.svg";



export class HudAlertsClass extends Component<
	// biome-ignore lint/complexity/noBannedTypes: <explanation>
	{},
	{
		ids: number;
		style: React.CSSProperties;
		alerts: {
			ids: number;
			text: string;
			title: string;
			img: string;
			time: number;
			timeCurrent: number;
			type: "alert" | "info" | "warning" | "success" | "error";
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			progress: any;
		}[];
		requests: {
			id: number;
			text: string;
			time: number;
			timeCurrent: number;
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			progress: any;
		}[];
	}
> {
	ev: CustomEventHandler;
	ev1: CustomEventHandler;
	ev2: CustomEventHandler;
	hasPlayedSound: boolean;

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	constructor(props: any) {
		super(props);

		this.state = {
			style: {},
			ids: 0,
			alerts: [
				// {
				// 	ids: 1,
				// 	text: "Lorem ipsum dolor sit amet",
				// 	title: "string",
				// 	img: "string",
				// 	time: 600000,
				// 	timeCurrent: 30000,
				// 	type: "info",
				// 	progress: null,
				// },
				// {
				// 	ids: 3,
				// 	text: "This is some error",
				// 	title: "string",
				// 	img: "string",
				// 	time: 600000,
				// 	timeCurrent: 15000,
				// 	type: "error",
				// 	progress: null,
				// },
				// {
				// 	ids: 4,
				// 	text: "This is some warningkfdjh jg sdlkjg sdlkjfhg sdkljfhg sdkljfhg skdljhfg kljsdfhg kjsdhfg kljshdfg kjsdhfg kjshdfg kljhsdfgkljhsdfgklhg",
				// 	title: "string",
				// 	img: "string",
				// 	time: 600000,
				// 	timeCurrent: 12000,
				// 	type: "warning",
				// 	progress: null,
				// },
				// {
				// 	ids: 5,
				// 	text: "This is some success",
				// 	title: "string",
				// 	img: "string",
				// 	time: 600000,
				// 	timeCurrent: 10000,
				// 	type: "success",
				// 	progress: null,
				// },
			],
			requests: [
				// {
				// 	id: 1,
				// 	text: "This is some trade",
				// 	time: 600000,
				// 	timeCurrent: 44000,
				// 	progress: null,
				// },
			],
		};
		this.hasPlayedSound = false;
		this.ev = CustomEvent.register(
			"cef:alert:setAlert",
			(
				type: "alert" | "info" | "warning" | "success" | "error",
				text: string,
				img: string,
				time = 5000,
				title?: string,
			) => {
				if (!CEF.id || CEF.gui.currentGui === "personage") return;

				const alerts = [...this.state.alerts];
				const old = alerts.find(
					(q) =>
						q.text === text &&
						q.title === title &&
						q.type === type &&
						q.img === img,
				);
				if (old) {
					old.time = Math.max(old.time, time);
					old.timeCurrent = 0;
				} else {
					alerts.push({
						type,
						text,
						img,
						time,
						title,
						ids: this.state.ids,
						timeCurrent: 0,
						progress: null,
					});
				}
				if (!this.hasPlayedSound) {
					CEF.playSound("notifications", 0.7);
					this.hasPlayedSound = true;
				}
				this.setState({ ids: this.state.ids + 1, alerts });
			},
		);
		setInterval(() => {
			this.hasPlayedSound = false;
		}, 500);
		
		CustomEvent.register(
			"cef:alert:setSafezoneInfo",
			(width: number, height: number, left: number, bottom: number) => {
				this.setState({
					style: {
						bottom: `${bottom + height + 20}px`,
						left: `${left}px`,
						width: `${width}px`,
						display: "flex",
						position: "absolute",
					},
				});
			},
		);

		this.ev1 = CustomEvent.register(
			"dialog:accept",
			(id: number, type: "big" | "small", text: string, time = 5000) => {
				if (type !== "small") return;
				const requests = [...this.state.requests];
				requests.push({ id, text, time, timeCurrent: 0, progress: null });
				this.setState({ requests });
			},
		);

		setInterval(() => {
			const alerts = [...this.state.alerts];
			alerts.map((alert, ids) => {
				alert.timeCurrent += 100;
				alert.timeCurrent = Math.min(alert.timeCurrent, alert.time);
				if (alert.timeCurrent >= alert.time) {
					alerts.splice(ids, 1);
				}
			});

			const requests = [...this.state.requests];
			requests.map((request, ids) => {
				request.timeCurrent += 100;
				request.timeCurrent = Math.min(request.timeCurrent, request.time);
				if (request.timeCurrent >= request.time) {
					requests.splice(ids, 1);
					CustomEvent.triggerClient("dialog:accept:status", request.id, false);
				}
			});
			this.setState({ alerts, requests });
		}, 100);
	}

	// insertBreaks = (text: string, interval = 35) => {
	// 	const result = [];
	// 	for (let i = 0; i < text.length; i += interval) {
	// 		result.push(text.slice(i, i + interval), <br key={i} />);
	// 	}
	// 	return result;
	// };

	insertBreaks = (text: string, interval: number = 35) => {
		let result = [];
		let i = 0;
	  
		while (i < text.length) {
		  let sliceEnd = Math.min(i + interval, text.length);
		  
		  // Cauta ultimul spațiu înainte de limita
		  while (sliceEnd > i && text[sliceEnd] !== " ") {
			sliceEnd--;
		  }
		  
		  // Daca nu a gasit spațiu, rupe forțat
		  if (sliceEnd === i) sliceEnd = Math.min(i + interval, text.length);
	  
		  result.push(text.slice(i, sliceEnd), <br key={i} />);
		  i = sliceEnd + 1; // Trecem peste spațiu
		}
	  
		return result;
	};

	componentWillUnmount() {
		if (this.ev) this.ev.destroy();
		if (this.ev1) this.ev1.destroy();
		if (this.ev2) this.ev2.destroy();
	}

	getNotificationColor(type: string) {
		switch (type) {
			case "info":
				return "#ffffff";

			case "success":
				return "#A1FF43";

			case "error":
				return "#FF3134";

			case "warning":
				return "#FF9D00";

			default:
				return "#ffffff";
		}
	}

	getNameByType(type: string) {
		switch (type) {
			case "success":
				return "success";

			case "error":
				return "error";

			case "warning":
				return "warning";

			case "info":
				return "information";

			case "alert":
				return "alert";

			default:
				return "information";
		}
	}

	typeToIconShadow(type: string) {
		switch (type) {
			case "success":
				return "drop-shadow(0px 0.125rem 1.625rem rgba(161, 255, 67, 0.30))";

			case "error":
				return "drop-shadow(0px 0.125rem 1.625rem rgba(255, 49, 52, 0.30))";

			case "warning":
				return "drop-shadow(0px 0.125rem 1.625rem rgba(255, 157, 0, 0.30))";

			case "info":
				return "drop-shadow(0px 0.125rem 1.625rem rgba(255, 255, 255, 0.30))";
		}
	}

	typeToBackground(type: string) {
		switch (type) {
			case "success":
				return "radial-gradient(153.76% 203.87% at 87.05% -57.5%, rgba(161, 255, 67, 0.08) 0%, rgba(161, 255, 67, 0.00) 100%), #151518";

			case "error":
				return "radial-gradient(153.76% 203.87% at 87.05% -57.5%, rgba(255, 49, 52, 0.08) 0%, rgba(255, 49, 52, 0.00) 100%), #151518";

			case "warning":
				return "radial-gradient(153.76% 203.87% at 87.05% -57.5%, rgba(255, 157, 0, 0.08) 0%, rgba(255, 157, 0, 0.00) 100%), #151518";

			case "info":
				return "radial-gradient(153.76% 203.87% at 87.05% -57.5%, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.00) 100%), #151518";
		}
	}

	render() {
		return (
			<div className="notificationsWraper" style={this.state.style}>
				{this.state.alerts.map((alert) => {
					return (
						<div className="notification" key={alert.ids} style={{ background: `${this.typeToBackground(alert.type)}` }}>
							<div className="notification-img">
								{alert.type === "success" ? (
									<img src={successIcon} alt="" style={{ filter: `${this.typeToIconShadow(alert.type)}` }} />
								) : alert.type === "warning" ? (
									<img src={warningIcon} alt="" style={{ filter: `${this.typeToIconShadow(alert.type)}` }} />
								) : alert.type === "error" ? (
									<img src={errorIcon} alt="" style={{ filter: `${this.typeToIconShadow(alert.type)}` }} />
								) : alert.type === "info" ? (
									<img src={infoIcon} alt="" style={{ filter: `${this.typeToIconShadow(alert.type)}` }} />
								) : null}
							</div>
							<div className="notification-content">
								<h1
									style={{ color: `${this.getNotificationColor(alert.type)}` }}
								>
									{this.getNameByType(alert.type)}
								</h1>
								<h2>{this.insertBreaks(alert.text)}</h2>
								<div className="notification-timer" />
							</div>
							<div
								className="notification-loading"
								style={{
									background: `conic-gradient(#ffffff ${
										360 * (alert.timeCurrent / alert.time)
									}deg, #504b49 ${360 * (alert.timeCurrent / alert.time)}deg)`,
								}}
							>
								<div className="notification-circle" />
							</div>
						</div>
					);
				})}

				{this.state.requests.map((request) => {
					return (
						<div className="notification" key={request.id}>
							<div className="notification-img">
								{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
								<h1
									className="yes"
									onClick={(e) => {
										e.preventDefault();
										const requests = [...this.state.requests];
										const ids = requests.findIndex((q) => q.id === request.id);
										CustomEvent.triggerClient(
											"dialog:accept:status",
											request.id,
											true,
										);
										requests.splice(ids, 1);
										this.setState({ requests });
									}}
								>
									✔
								</h1>
								{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
								<h2
									className="no"
									onClick={(e) => {
										e.preventDefault();
										const requests = [...this.state.requests];
										const ids = requests.findIndex((q) => q.id === request.id);
										CustomEvent.triggerClient(
											"dialog:accept:status",
											request.id,
											false,
										);
										requests.splice(ids, 1);
										this.setState({ requests });
									}}
								>
									✖
								</h2>
							</div>
							<div className="notification-content trade">
								<h1 className="notification-title">Trade offer</h1>
								<h2 className="notification-description">{request.text}</h2>
								<div className="notification-timer" />
							</div>
							<div
								className="notification-loading trade"
								style={{
									background: `conic-gradient(#ffffff ${
										360 * (request.timeCurrent / request.time)
									}deg, #504b49 ${360 * (request.timeCurrent / request.time)}deg)`,
								}}
							>
								<div className="notification-circle" />
							</div>
						</div>
					);
				})}
			</div>
		);
	}
}
