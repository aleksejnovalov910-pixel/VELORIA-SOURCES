import { LangString } from "../../modules/lang";
import React, {Component} from "react";
import "./style.less";
import {DialogNodeDto} from "../../../shared/dialogs/dtos/DialogNodeDto";
import {CustomEvent} from "../../modules/custom.event";

interface DialoguesState {
    characterName: string,
    node: DialogNodeDto,
    currentReplyIndex: number
}

const VK_SPACE_CODE = 32;

export class Dialogues extends Component<{}, DialoguesState> {
    constructor(props: any) {
        super(props);

        this.state = {
            characterName: "Тест",
            node: {
                id: 0,
                npcReplies: [
                    {text: LangString("components.Dialogues.Dialogues.bebe4de03f1046c70fb779424cf1778b")},
                    {text: LangString("components.Dialogues.Dialogues.7c7bd44b45a11b2342fd3a9305490bf5")},
                ],
                answers: [LangString("components.Dialogues.Dialogues.8d2d05dfe32392f9247d5a553859242b")]
            },
            currentReplyIndex: 0
        };

        CustomEvent.register("dialogs::setDialog", (
            characterName: string,
            dialogNode: DialogNodeDto
        ) => {
            this.setState({
                characterName,
                node: dialogNode,
                currentReplyIndex: 0
            })
        });

        CustomEvent.register("dialogs::setNode", (
            node: DialogNodeDto
        ) => {
            this.setState({
                node,
                currentReplyIndex: 0
            })
        });
    }

    private keyPressHandler = (ev: KeyboardEvent) => {
        if (ev.keyCode !== VK_SPACE_CODE) {
            return;
        }

        if (this.state.currentReplyIndex >= this.state.node.npcReplies.length - 1) {
            return;
        }

        this.setState({
            currentReplyIndex: this.state.currentReplyIndex + 1
        });
    }

    componentDidMount() {
        addEventListener("keypress", this.keyPressHandler);
    }

    componentWillUnmount() {
        removeEventListener("keypress", this.keyPressHandler);
    }

    render() {
        return <div className="dialogues">


            {this.state.currentReplyIndex < this.state.node.npcReplies.length - 1 ?
                null

                : <div className="dialogues-buttons">
                    {this.state.node.answers.map((answer, index) =>
                        <div onClick={() => {
                            CustomEvent.triggerServer("dialogs:answer", this.state.node.id, index);
                        }}>
                            <span>{index + 1}.</span>
                            {answer}
                        </div>
                    )}
                </div>
            }


            <div className="dialogues__topName">
                <span>{LangString("components.Dialogues.Dialogues.51d216534f85d209c9055fdb8f4df4fd")}</span>
                {this.state.characterName}
            </div>


            <div className="dialogues__name">
                {this.state.characterName} {LangString("components.Dialogues.Dialogues.94bd9d40a67046658142693f857914a6")}
            </div>

            <div className="dialogues__message">
                {this.state.node.npcReplies[this.state.currentReplyIndex].text}
            </div>


            <div
                className={`dialogues__prompt ${this.state.currentReplyIndex < this.state.node.npcReplies.length - 1 ? "" : "dialogues__opacity"}`}>
                {LangString("components.Dialogues.Dialogues.99912710444cf0d603cf8b7842b51973")} <div>{LangString("components.Dialogues.Dialogues.af21287dc2b2d4ac5f42ab64b7bb68b8")}</div> {LangString("components.Dialogues.Dialogues.f386cf7c26a18fdceb15dfe56920ad20")}
            </div>


        </div>
    }
}