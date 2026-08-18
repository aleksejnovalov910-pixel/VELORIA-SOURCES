import { LangString } from "../../modules/lang";
import React, { Component } from "react";

import car_question_1 from "./img/car/car_question-1.png";
import car_question_2 from "./img/car/car_question-2.png";
import car_question_3 from "./img/car/car_question-3.png";
import car_question_4 from "./img/car/car_question-4.png";
import car_question_5 from "./img/car/car_question-5.png";
import car_question_6 from "./img/car/car_question-6.png";
import car_question_7 from "./img/car/car_question-7.png";
import car_question_8 from "./img/car/car_question-8.png";
import car_question_9 from "./img/car/car_question-9.png";
import car_question_10 from "./img/car/car_question-10.png";
import car_question_11 from "./img/car/car_question-11.png";
import car_question_12 from "./img/car/car_question-12.png";
import car_question_13 from "./img/car/car_question-13.png";
import car_question_14 from "./img/car/car_question-14.png";
import car_question_15 from "./img/car/car_question-15.png";
import car_question_16 from "./img/car/car_question-16.png";
import car_question_17 from "./img/car/car_question-17.png";

import moto_question_1 from "./img/moto/moto_question-1.png";
import moto_question_2 from "./img/moto/moto_question-2.png";
import moto_question_3 from "./img/moto/moto_question-3.png";
import moto_question_4 from "./img/moto/moto_question-4.png";
import moto_question_5 from "./img/moto/moto_question-5.png";
import moto_question_6 from "./img/moto/moto_question-6.png";
import moto_question_7 from "./img/moto/moto_question-7.png";
import moto_question_8 from "./img/moto/moto_question-8.png";
import moto_question_9 from "./img/moto/moto_question-9.png";
import moto_question_10 from "./img/moto/moto_question-10.png";


import truck_question_1 from "./img/truck/truck_question-1.png";
import truck_question_2 from "./img/truck/truck_question-2.png";
import truck_question_3 from "./img/truck/truck_question-3.png";
import truck_question_4 from "./img/truck/truck_question-4.png";
import truck_question_5 from "./img/truck/truck_question-5.png";


interface QuestionsProps {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	list: any[];
	num: number;
	// biome-ignore lint/complexity/noBannedTypes: <explanation>
	confirm(ans: number, callback: Function): void;
	licenseName: string;
}

interface QuestionsState {
	ans: number | null;
	isNew: boolean;
	licenseName: string;
}

const questionIcons: Record<string, Record<number, string>> = {
	car: {
		1: car_question_1,
		2: car_question_2,
		3: car_question_3,
		4: car_question_4,
		5: car_question_5,
		6: car_question_6,
		7: car_question_7,
		8: car_question_8,
		9: car_question_9,
		10: car_question_10,
		11: car_question_11,
		12: car_question_12,
		13: car_question_13,
		14: car_question_14,
		15: car_question_15,
		16: car_question_16,
		17: car_question_17,
	},
	moto: {
		1: moto_question_1,
		2: moto_question_2,
		3: moto_question_3,
		4: moto_question_4,
		5: moto_question_5,
		6: moto_question_6,
		7: moto_question_7,
		8: moto_question_8,
		9: moto_question_9,
		10: moto_question_10,
	},
	truck: {
		1: truck_question_1,
		2: truck_question_2,
		3: truck_question_3,
		4: truck_question_4,
		5: truck_question_5,
	}

};

class Questions extends Component<QuestionsProps, QuestionsState> {
	constructor(props: QuestionsProps) {
		super(props);

		this.state = {
			ans: null, // Храним индекс выбранного ответа
			isNew: false,
			licenseName: 'car'
		};
	}

	ansClick = (idx: number) => {
		this.setState((prevState) => ({
			ans: prevState.ans === idx + 1 ? null : idx + 1, // Снятие выбора при повторном клике
			isNew: false,
		}));
	};

	render() {
		const i = this.props.num - 1;
		const list = this.props.list;

		return (
			<div className="driving-school-questions">
				<div className="driving-school-question-progress">
					<h1>Intrebare</h1>
					<h2>
						{i + 1}/{list.length}
					</h2>
				</div>
				<h5 style={{ fontSize: "1.8vh" }}>{list[i].text}</h5>
				{list[i].img ? <img src={questionIcons[this.props.licenseName][i + 1]} alt="Question background" /> : null}
				{list[i].ans.map((data: string, idx: number) => (
					<div
						key={data}
						onClick={() => this.ansClick(idx)}
						onKeyDown={() => this.ansClick(idx)}
						className="question"
					>
						<div className="checkbox">
							{this.state.ans === idx + 1 && <h1>✔</h1>}
						</div>
						{data}
					</div>
				))}
				<button style={{ width: "90vh" }} type="button" onClick={() =>
					this.props.confirm(this.state.ans, () =>
						this.setState({ isNew: true, ans: null })
					)
				}
					onKeyDown={() =>
						this.props.confirm(this.state.ans, () =>
							this.setState({ isNew: true, ans: null })
						)
					}>{i + 1 !== list.length
						? LangString(
							"components.DrivingSchool.Questions.9f39c2156a874f840326c4dff68a46cf"
						)
						: LangString(
							"components.DrivingSchool.Questions.cdea35992a1c1f9d797810a1451ebcdf"
						)}</button>

			</div>
		);
	}
}

export default Questions;

