import { LangString, currentLang } from "../../modules/lang";
import React, { Component } from "react";
import { CustomEvent } from "../../modules/custom.event";
import "./style.less";
import { CEF } from "../../modules/CEF";
import { observer } from "mobx-react";
// biome-ignore lint/style/useImportType: <explanation>
import LoadScreenJoinStore from "../../stores/LoadScreenJoin";
import { alertsEnable, setInit } from "../../App";

import enterButton from "./enterButton.svg";

const disclaimerTime = 9000;

@observer
export class LoadScreenJoin extends Component<
	{
		LoadScreenJoinStore: LoadScreenJoinStore;
	},
	{}
> {
	store: LoadScreenJoinStore;

	constructor(props: any) {
		super(props);
		this.store = this.props.LoadScreenJoinStore;
		this.store.setState({ allowEnter: true });
		// setTimeout((): void => {
		// 	this.store.setState({ loadingScreenStart: true });
		// 	setTimeout((): void => {
		// 		this.store.setState({ allowEnter: true });
		// 	}, 1500);
		// }, disclaimerTime);
	}

	componentDidMount(): void {
		setTimeout((): void => {
			setInit();
		}, 1000);
		CustomEvent.triggerClient("fractionCfg:cefReady");
		// document.addEventListener("keyup", this.handleKeyUp, false);
		// setTimeout((): void => {
		// 	/* if (alertsEnable.startVoice) */ CEF.playSound(
		// 		`${currentLang}.enteronyx`,
		// 	);
		// }, 300);
	}

	// componentWillUnmount = (): void => {
	// 	document.removeEventListener("keyup", this.handleKeyUp, false);
	// };

	// handleKeyUp = (e: KeyboardEvent): void => {
	// 	if (e.keyCode !== 13) return;
	// 	if (!this.store.allowEnter) return;
	// 	if (!this.store.introScene) return;
	// 	CEF.stopSound();
	// 	CustomEvent.triggerClient("fractionCfg:cefReady");
	// 	if (!alertsEnable.enableIntro) {
	// 		CustomEvent.triggerClient("loadingscreen:load");
	// 		setTimeout((): void => {
	// 			setInit();
	// 		}, 1000);
	// 		return;
	// 	}
	// 	this.store.setState({ introScene: false, showVideo: true }, (): void => {
	// 		setTimeout((): void => {
	// 			this.store.setState({ videoRun: true, loadingScreenStart: false });
	// 			setTimeout((): void => {
	// 				CustomEvent.triggerClient("loadingscreen:load");
	// 			}, 2000);
	// 		}, 1000);
	// 	});
	// };

	render(): JSX.Element {
		return <></>;
	}
}
