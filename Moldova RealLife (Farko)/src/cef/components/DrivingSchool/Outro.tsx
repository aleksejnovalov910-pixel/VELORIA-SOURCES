import { LangString } from "../../modules/lang";
import React, { Component } from "react";
import { CustomEvent } from "../../modules/custom.event";
import { CEF } from "../../modules/CEF";
import acceptImg from './img/accept.png'
import rejectImg from './img/reject.png'
import { maxMiss } from "./index";

interface OutroProps {
  miss: number;
  lic: string;
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
class Outro extends Component<OutroProps, any> {
  constructor(props: OutroProps) {
    super(props);
    console.log(this.props);
  }

  goOut() {
    CEF.gui.setGui(null);
    CustomEvent.triggerServer("client:autoschool:theory", false);
  }

  goPractise() {
    CEF.gui.setGui(null);
    // добавить this.props.lic
    CustomEvent.triggerServer("client:autoschool:theory", true);
  }

  render() {
    return (
      <>
        {this.props.miss <= maxMiss ?
          <div className="accept-reject">
            <img src={acceptImg} alt="" />
            <h1>{LangString("components.DrivingSchool.Outro.05c56ac7e50174755eafe01d8378122e")}</h1>

            <p>Ai trecut teoria, acum incepe practica. Ai gresit {this.props.miss} raspunsuri.</p>


            <button type="button" onClick={() => this.goPractise()}>{LangString("components.DrivingSchool.Outro.5abff8b5d3c5b701d1819cecab6b4caf")}</button>

          </div> :
          <div className="accept-reject">
            <img src={rejectImg} alt="" />
            <h1>
              din pacate, nu ai trecut testul.<br />Incearca din nou!
            </h1>
            <button type="button" onClick={() => this.goOut()}>{LangString("components.DrivingSchool.Outro.9a98a5973cb8fb95ea1f7ff8a3368fa5")}</button>
          </div>
          // <>
          //   <img src={err} style={{ width: "6vh", marginBottom: "4vh" }} />
          //   <h1>{LangString("components.DrivingSchool.Outro.9798aaf52d9d8139179f3d2acb1ca8b3")}</h1>
          //   <p style={{ marginTop: "3vh" }}>{LangString("components.DrivingSchool.Outro.957ffba0441c02c1eacd8f878cd6e0cb")}</p>
          //   <p>{LangString("components.DrivingSchool.Outro.270afa37c4408bfe68eecb840ee57fb4")} {this.props.miss} {LangString("components.DrivingSchool.Outro.c48ec20df221063871ace92847e9a18f")}</p>
          //   <img src={fail} style={{ width: "20vh", marginTop: "3vh", borderRadius: "5vh", border: "2px solid #f6f6f6" }}></img>
          //   <div style={{ marginTop: "3vh" }} className="autoschool_key" onClick={() => this.goOut()}>{LangString("components.DrivingSchool.Outro.9a98a5973cb8fb95ea1f7ff8a3368fa5")}</div>
          // </>
        }
      </>
    );
  }
}

export default Outro;
