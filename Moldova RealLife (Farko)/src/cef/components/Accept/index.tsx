import { LangString } from "../../modules/lang";
import React, { Component } from "react";
// @ts-ignore
import { CustomEvent } from "../../modules/custom.event";

const images = Object.fromEntries(
	Object.entries(import.meta.glob("./images/*.png", { eager: true })).map(
		([key, value]) => {
			const name = key.match(/\/([^/]+)\.png$/)[1];
			return [name, value.default];
		},
	),
);
import { AlertType } from "../../../shared/alert";

export class AcceptBlock extends Component<
	{},
	{ list: [number, JSX.Element][] }
> {
	new(id: number, text: string, type: AlertType, img: string, time = 5000) {
		text = unescape(text);
		let resBlock = (
			<div key={id} className={`hud-alert ${type} ${img ? "" : "alert-easy"}`}>
				<i>{img ? <img src={images[img]} alt="" /> : ""}</i>
				<p style={{ paddingLeft: `${!img ? "14px" : "0"}` }}>
					<strong>
						{LangString(
							"components.Accept.index.dab9f5e46f32e02ddb7b56f5a5699f12",
						)}
					</strong>
					{text}
					<br />
					<button
						className="cancel"
						onClick={(e) => {
							e.preventDefault();
							this.click(id, false);
						}}
					>
						{LangString(
							"components.Accept.index.242d4fcadf7d9be5e58d34319d8901ac",
						)}
					</button>{" "}
					<button
						className="accept"
						onClick={(e) => {
							e.preventDefault();
							this.click(id, true);
						}}
					>
						{LangString(
							"components.Accept.index.963400f13b572fcf297599c909c6e102",
						)}
					</button>
				</p>
			</div>
		);
		let oldList = [...this.state.list];
		oldList.push([id, resBlock]);
		this.setState({ list: oldList });
		setTimeout(() => {
			this.click(id, false);
		}, time);
	}
	click(id: number, status: boolean) {
		let oldListnew = [...this.state.list];
		let ind = oldListnew.findIndex((q) => q[0] === id);
		if (ind == -1) return;
		oldListnew.splice(ind, 1);
		this.setState({ list: oldListnew });
		CustomEvent.triggerClient("cef:alert:accept:result", id, status);
	}
	constructor(props: any) {
		super(props);
		this.state = {
			list: [],
		};

		CustomEvent.register(
			"cef:alert:accept",
			(id: number, text, type, img, time = 5000) => {
				this.new(id, text, type, img, time);
			},
		);
	}

	render() {
		return (
			<>
				<div className="accept-wrapper">
					{this.state.list.map((item) => {
						return item[1];
					})}
				</div>
			</>
		);
	}
}
