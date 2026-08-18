import { LangString } from "../../modules/lang";
import "./style.less";
import React, {Component} from "react";

import aim from "./images/svg/aim.svg";
import watch from "./images/svg/watch.svg";
import IslandBattleStore from "../../stores/IslandBattle";
import {observer} from "mobx-react";


@observer export class HudIslandBattle extends Component<{
    store: IslandBattleStore
}, {}> {

    store: IslandBattleStore = this.props.store

    constructor(props: any) {
        super(props);
    }

    render() {

       return <div className="hudIslandBattle">

           {
               this.store.result.map((el, key) => {
                   return <div className="hudIslandBattle-block">
                       {el.points} <img src={aim} alt=""/> - {el.name}
                   </div>
               })
           }

           <span>{LangString("components.HudBlock.hudIslandBattle.e1cd2b27778ec308411bbd14f90143cc")}</span>

           <div className="hudIslandBattle__time">
               {this.store.time} {LangString("components.HudBlock.hudIslandBattle.bc808bfda0c1f9b458f3eb0ec5f354a5")} <img src={watch} alt=""/>
           </div>

       </div>

    }

}