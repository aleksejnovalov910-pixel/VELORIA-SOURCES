import { LangString } from "../../modules/lang";
import React, { Component } from "react";
import "./style.scss";
import exit from "./img/exit.svg"

const images = Object.fromEntries(
	Object.entries(
		import.meta.glob("./img/*.png", { eager: true }),
	).map(([key, value]: [string, { default: string }]) => {
		const name = key.match(/\/([^/]+)\.png$/)[1];
		return [name, value.default];
	}),
);

export class FinishInitQuests extends Component<{}, {}> {
    private containerRef: React.RefObject<HTMLDivElement>;
    constructor(props: any) {
        super(props);

        this.containerRef = React.createRef();
        this.adjustZoom = this.adjustZoom.bind(this);
    }

    componentDidMount() {
        this.adjustZoom();
        window.addEventListener("resize", this.adjustZoom);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.adjustZoom);
    }


    adjustZoom() {
        const container = this.containerRef.current;
        if (container) {
            const zoomCountOne = window.innerWidth / 1920;
            const zoomCountTwo = window.innerHeight / 1080;

            if (zoomCountOne < zoomCountTwo) {
                container.style.zoom = zoomCountOne.toString();
            } else {
                container.style.zoom = zoomCountTwo.toString();
            }
        }
    }
render() {
    return (
        <div className="finishInitQuests-container">
            <div className="finishInitQuests-box" ref={this.containerRef}>
                <div className="finish-quest-exit">
                    <p>Exit</p>
                    <div className="exit-img">
                        <img src={exit} alt="Iesire" />
                    </div>
                </div>
                <div className="quest-box">
                    <div className="left">
                        <h1>
                            {LangString("components.FinishInitQuests.FinishInitQuests.dc93d452f933a11dcae5c72e25d5e0f2")} <span>{LangString("components.FinishInitQuests.FinishInitQuests.5a215f43dfb2ccbff36d6d0e55b2e475")}</span>
                        </h1>
                        <p>
                            {LangString("components.FinishInitQuests.FinishInitQuests.27d5b52d2f2f9cdff5f38cdf86c9a6a4")}
                        </p>
                    </div>
                    <div className="right">
                        <div className="levels">

                            <div
                                className="level"
                                style={{
                                    backgroundImage: `url(${images["Rectangle"]})`,
                                }}
                            >
                                <img
                                    style={{
                                        marginBottom: "-4px",
                                    }}
                                    src={images["mafia"]}
                                    alt="Mafia"
                                />
                                <div className="details">
                                    <h1>Mafia</h1>
                                    <p>
Jefuieste cea mai mare banca, cazinou, cere taxa de protectie businessmanilor, creeaza-ti propriul brand de vin                                    </p>
                                </div>
                            </div>

                            <div
                                className="level"
                                style={{
                                    backgroundImage: `url(${images["Rectangle-middle"]})`,
                                }}
                            >
                                <img
                                    style={{
                                        marginBottom: "-10px",
                                    }}
                                    src={images["ghetto"]}
                                    alt="Ghetto"
                                />
                                <div className="details">
                                    <h1>Ghetto</h1>
                                    <p>
Jefuieste portul militar si bancile mici, planteaza substante ilegale si vinde-le pe piata neagra                                    </p>
                                </div>
                            </div>

                            <div
                                className="level"
                                style={{
                                    backgroundImage: `url(${images["Rectangle-middle"]})`,
                                }}
                            >
                                <img
                                    style={{
                                        marginBottom: "-10px",
                                    }}
                                    src={images["sheriff"]}
                                    alt="Sheriff"
                                />
                                <div
                                    className="details"
                                    style={{
                                        marginLeft: "-30px",
                                    }}
                                >
                                    <h1>Politia Paleto</h1>
                                    <p>
                                        Gardienii ordinii in afara orasului, parteneri ai Departamentului de Politie Los Santos
                                    </p>
                                </div>
                            </div>

                            <div
                                className="level"
                                style={{
                                    backgroundImage: `url(${images["Rectangle-middle"]})`,
                                }}
                            >
                                <img
                                    style={{
                                        marginBottom: "-15px",
                                    }}
                                    src={images["police"]}
                                    alt="Politie"
                                />
                                <div className="details">
                                    <h1>Politie</h1>
                                    <p>
                                        Gardienii ordinii in oras, parteneri ai Departamentului de Politie Paleto
                                    </p>
                                </div>
                            </div>

                            <div
                                className="level families"
                                style={{
                                    backgroundImage: `url(${images["Rectangle-bottom"]})`,
                                }}
                            >
                                <img
                                    style={{
                                        marginBottom: "10px",
                                    }}
                                    src={images["families"]}
                                    alt="Familii"
                                />
                                <div className="details">
                                    <h1>Familii</h1>
                                    <p>
                                        Alatura-te sau creeaza-ti propria familie. Locuieste in vile, jefuieste magazine si joaca in stilul tau
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="entertainment">
                            <div className="top">
                                <h1>Distractie</h1>
                                <p>
                                    Curse, dueluri, vanatoare, realizari, pista de drift si multe altele
                                </p>
                            </div>
                            <img src={images["entertainment"]} alt="Distractie" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
}
//     render() {

//         return (
//             <div className="finishInitQuests-container">
//                 <div className="finishInitQuests-box" ref={this.containerRef}>
//                     <div className="finish-quest-exit">
//                         <p>Exit</p>
//                         <div className="exit-img">
//                             <img src={exit} alt="Exit" />
//                         </div>
//                     </div>
//                     <div className="quest-box">
//                         <div className="left">
//                             <h1>
//                                 {LangString("components.FinishInitQuests.FinishInitQuests.dc93d452f933a11dcae5c72e25d5e0f2")} <span>{LangString("components.FinishInitQuests.FinishInitQuests.5a215f43dfb2ccbff36d6d0e55b2e475")}</span>
//                             </h1>
//                             <p>
//                             {LangString("components.FinishInitQuests.FinishInitQuests.27d5b52d2f2f9cdff5f38cdf86c9a6a4")}
//                             </p>
//                         </div>
//                         <div className="right">
//                             <div className="levels">


//                                 <div
//                                     className="level"
//                                     style={{
//                                         backgroundImage: `url(${images["Rectangle"]})`,
//                                     }}
//                                 >
//                                     <img
//                                         style={{
//                                             marginBottom: "-4px",
//                                         }}
//                                         src={images["mafia"]}
//                                         alt="Mafia"
//                                     />
//                                     <div className="details">
//                                         <h1>Mafias</h1>
//                                         <p>
//                                             Rob the largest bank, casino, roof businesses, create your own
//                                             brand of wine
//                                         </p>
//                                     </div>
//                                 </div>
//                                 <div
//                                     className="level"
//                                     style={{
//                                         backgroundImage: `url(${images["Rectangle-middle"]})`,
//                                     }}
//                                 >
//                                     <img
//                                         style={{
//                                             marginBottom: "-10px",
//                                         }}
//                                         src={images["ghetto"]}
//                                         alt="Ghetto"
//                                     />
//                                     <div className="details">
//                                         <h1>Ghetto</h1>
//                                         <p>
//                                             Fight for territories, loot the military port and small banks
//                                         </p>
//                                     </div>
//                                 </div>
//                                 <div
//                                     className="level"
//                                     style={{
//                                         backgroundImage: `url(${images["Rectangle-middle"]})`,
//                                     }}
//                                 >
//                                     <img
//                                         style={{
//                                             marginBottom: "-10px",
//                                         }}
//                                         src={images["sheriff"]}
//                                         alt="Sheriff"
//                                     />
//                                     <div
//                                         className="details"
//                                         style={{
//                                             marginLeft: "-30px",
//                                         }}
//                                     >
//                                         <h1>Sheriff</h1>
//                                         <p>
//                                             Guardians of order outside the city, partners of Los Santos
//                                             Police Department
//                                         </p>
//                                     </div>
//                                 </div>
//                                 <div
//                                     className="level"
//                                     style={{
//                                         backgroundImage: `url(${images["Rectangle-middle"]})`,
//                                     }}
//                                 >
//                                     <img
//                                         style={{
//                                             marginBottom: "-15px",
//                                         }}
//                                         src={images["police"]}
//                                         alt="Police"
//                                     />
//                                     <div className="details">
//                                         <h1>Police</h1>
//                                         <p>
//                                             Guardians of order outside the city, partners of Los Santos
//                                             Police Department
//                                         </p>
//                                     </div>
//                                 </div>
//                                 <div
//                                     className="level families"
//                                     style={{
//                                         backgroundImage: `url(${images["Rectangle-bottom"]})`,
//                                     }}
//                                 >
//                                     <img
//                                         style={{
//                                             marginBottom: "10px",
//                                         }}
//                                         src={images["families"]}
//                                         alt="Families"
//                                     />
//                                     <div className="details">
//                                         <h1>Families</h1>
//                                         <p>
//                                             Join or create your own. Live in mansions, rob shops and play
//                                             your game
//                                         </p>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="entertainment">
//                                 <div className="top">
//                                     <h1>Entertainment</h1>
//                                     <p>
//                                         Battle Royal, racing, dueling, hunting, achievements, drift
//                                         track, boombox dancing and much more
//                                     </p>
//                                 </div>
//                                 <img src={images["entertainment"]} alt="Entertainment" />
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         )
//     }
// }