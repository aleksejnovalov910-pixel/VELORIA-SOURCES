import { LangString } from "../../../../modules/lang";
import React, {Component} from "react";
import "./style.less";
import {component} from "../../BattlePass";
import {CustomEvent} from "../../../../modules/custom.event";

export class NavigationBar extends Component<{
    component: component
}, {
}> {

    constructor(props: any) {
        super(props);
    }

    setComponent(component: component) {
        CustomEvent.trigger("battlePass:setComponent", component)
    }

    render() {
        return <div className={"navBar"}>
            <div className={`${this.props.component === "main" ? "navBar-active" : null}`}
            onClick={() => this.setComponent("main")}>{LangString("components.BattlePass.components.NavigationBar.NavigationBar.73a11317351e1741fdecde8573a5e213")}</div>
            <div className={`${this.props.component === "tasks" ? "navBar-active" : null}`}
                 onClick={() => this.setComponent("tasks")}>{LangString("components.BattlePass.components.NavigationBar.NavigationBar.7ba4f96bc70cb66876178a9e09019516")}</div>
            <div className={`${this.props.component === "rating" ? "navBar-active" : null}`}
                 onClick={() => this.setComponent("rating")}>{LangString("components.BattlePass.components.NavigationBar.NavigationBar.08e0b889be58f3997ecea9c01b46cccd")}</div>
            <div className={`${this.props.component === "storage" ? "navBar-active" : null}`}
                 onClick={() => this.setComponent("storage")}>{LangString("components.BattlePass.components.NavigationBar.NavigationBar.46d2eda4d8652edd3d62633b8812dac9")}</div>
        </div>
    }
}