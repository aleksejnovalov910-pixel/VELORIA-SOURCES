import React, { Component } from "react";
import { QUESTS_DATA } from "../../../shared/quests";
import { CustomEvent } from "../../modules/custom.event";
import type { StorageAlertData } from "../../../shared/alertsSettings";
import type {
	QuestDto,
	QuestStepDto,
} from "../../../shared/advancedQuests/dtos";



export class HudQuestClass extends Component<
	{
		alertsData: StorageAlertData;
	},
	{
		data?: [number, [boolean, number][], boolean];
		advancedQuests: QuestDto[];
		inpubg?: boolean;
		display: boolean;
	}
> {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	constructor(props: any) {
		super(props);

		this.state = {
			display: true,
			advancedQuests: [],
		};

		CustomEvent.register("quest:data", (data: string) => {
			this.setState({ data: JSON.parse(data) });
		});

		CustomEvent.register("advancedQuests::updateQuest", (data: QuestDto) => {
			const quest = this.state.advancedQuests.find(
				(quest) => quest.questName === data.questName,
			);
			if (quest) {
				quest.steps = data.steps;
			} else {
				this.state.advancedQuests.push(data);
			}

			this.setState({ advancedQuests: this.state.advancedQuests });
		});

		CustomEvent.register("advancedQuests::deleteQuest", (questName: string) => {
			const questIdx = this.state.advancedQuests.findIndex(
				(quest) => quest.questName === questName,
			);
			if (questIdx === -1) {
				return;
			}

			this.state.advancedQuests.splice(questIdx, 1);
			this.setState({
				advancedQuests: this.state.advancedQuests,
			});
		});

		CustomEvent.register("hud:pubg", () => {
			this.setState({ inpubg: true });
		});
		CustomEvent.register("hud:pubghide", () => {
			this.setState({ inpubg: false });
		});
		// CustomEvent.register('alerts:enable', (data: StorageAlertData) => {
		//     this.setState({display: !!data.questLines});
		// })
	}
	get questData() {
		if (!this.state.data) return null;
		return QUESTS_DATA.find((q) => q.id === this.state.data[0]);
	}
	get firstUnfinishedTask() {
		return this.state.data[1].findIndex((q) => !q[0]);
	}

	getStepsToRender(quest: QuestDto): QuestStepDto[] {
		const steps: QuestStepDto[] = [];

		for (const step of quest.steps) {
			if (step.completed && step.notShowIfCompleted) {
				continue;
			}

			steps.push(step);

			if (!step.completed) {
				break;
			}
		}

		return steps;
	}

	render() {
		if (this.state.inpubg) return <></>;
		if (!this.questData) return <></>;
		if (this.props.alertsData.questLines) return <></>;
		return (
			<div className="section-quest">
				{this.questData && (
					<>
						<div className="section-quest_header">
							<h6>{this.questData.name}</h6>
						</div>

						{this.questData.tasks.map((task, taskid) => {
							const isActive = this.firstUnfinishedTask === taskid;
							return (
								<div
									key={task.type}
									className={`section-quest_item ${isActive ? "active" : ""}`}
								>
									<div className="section-quest_item-info">
										{task.nameTask}
										{task.descTask && (
											<p className="section-quest_item-description">{task.descTask}</p>
										)}
									</div>
									<div className="section-quest_item-status" />
								</div>
							);
						})}
					</>
				)}

				{this.state.advancedQuests?.map((quest) => {
					return (
						<>
							<div key={quest.questName} className="advanced-quest_name">
								<h4>{quest.questName}</h4>
							</div>
							<div className="advanced-quest_progress" key={quest.questName}>
								{this.getStepsToRender(quest).map((step) => {
									return (
										<div
											key={step.name}
											className={`advanced-quest_task ${step.completed ? "" : "active"}`}
										>
											<div className="advanced-quest_task-info">
												<h4>{step.name}</h4>

												{!step.completed &&
													step.count != null &&
													step.countGoal != null && (
														<div className="hud-quest-count-wrap">
															<p>
																{step.count} / {step.countGoal}
															</p>
														</div>
													)}
											</div>
										</div>
									);
								})}
							</div>
						</>
					);
				})}
			</div>
		);
	}
}
