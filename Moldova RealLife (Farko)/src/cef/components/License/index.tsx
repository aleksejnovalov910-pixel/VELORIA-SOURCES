import { LangString } from "../../modules/lang";
// @ts-nocheck
import React, {Component} from "react";

import close from "../../../assets/images/svg/close.svg";
import carImg from "../../../assets/images/menu/car.svg";
import boatImg from "../../../assets/images/menu/boat.svg";
import flyImg from "../../../assets/images/menu/fly.svg";
import gunImg from "../../../assets/images/menu/gun.svg";
import lawImg from "../../../assets/images/menu/justice.svg";
import taxiImg from "../../../assets/images/menu/taxi.svg";
import bizImg from "../../../assets/images/menu/business.svg";
import fishImg from "../../../assets/images/menu/fish.svg";
import medImg from "../../../assets/images/menu/heart-care.svg";
import animalImg from "../../../assets/images/menu/hunter.svg";
import {CEF} from "../../modules/CEF";

interface LicenseState {
    name: string;
    a_lic: number;
    b_lic: number;
    c_lic: number;
    air_lic: number;
    ship_lic: number;
    gun_lic: number;
    taxi_lic: number;
    law_lic: number;
    med_lic: number;
    biz_lic: number;
    animal_lic: number;
    fish_lic: number;
}

class License extends Component<any, LicenseState> {
    constructor(props: any) {
        super(props);

        this.state = {
            name: "Aboba",
            a_lic: 1,
            b_lic: 1,
            c_lic: 1,
            air_lic: 0,
            ship_lic: 0,
            gun_lic: 0,
            taxi_lic: 0,
            law_lic: 0,
            med_lic: 0,
            biz_lic: 0,
            animal_lic: 0,
            fish_lic: 0,
        };

        const e = mp.events.register("cef:license:init", (data) => {
            this.setState({ ...data });
            e.destroy();
        });
    }

    componentDidMount() {
        CEF.gui.setCursor(true);
    }

    render() {
        const {
            name,
            a_lic,
            b_lic,
            c_lic,
            air_lic,
            ship_lic,
            gun_lic,
            taxi_lic,
            law_lic,
            med_lic,
            biz_lic,
            animal_lic,
            fish_lic,
        } = this.state;
        return (
            <>
                <i className="dark-bottom"></i>
                <div className="section-middle-block">
                    <div className="licenses-wrapper">
                        <button className="closebutton" onClick={() => CEF.gui.setGui(null)}>
                            <img src={close} alt="" />
                        </button>
                        <p className="lic-title">{LangString("components.License.index.8ee07c3c64105844125f2a23b3007d29")} {name}</p>
                        <div className="lic-grid">
                            <div>
                                <img src={carImg} alt="" />
                                <p>
                                    {LangString("components.License.index.14aeeeb49589da524f99b6ae826f16a2")}
                  <br />
                                    <strong>{LangString("components.License.index.e8deae473dfc55a18bc7a40692898c4d")}</strong>
                                </p>
                                <ul className="lic-type">
                                    <li className={a_lic ? "on" : ""}>
                                        A
                  </li>
                                    <li className={b_lic ? "on" : ""}>
                                        B
                  </li>
                                    <li className={c_lic ? "on" : ""}>
                                        C
                  </li>
                                </ul>
                                <br />
                                {/* <ul>
                  <li className={car_lic[current_type] ? 'on' : ''}>
                    {car_lic[current_type] ? 'И' : 'Не и'}меется
                  </li>
                </ul> */}
                                {/* <small style={{ opacity: car_lic[current_type] ? 1 : 0 }}>
                  Действительна
                  <br />
                  <span>{car_lic[current_type]} ч.</span>
                </small> */}
                            </div>
                            <div>
                                <img src={flyImg} alt="" />
                                <p>
                                    {LangString("components.License.index.afc7ff15415fdbd4f1419f1e2ed62b84")}
                  <br />
                                    <strong>{LangString("components.License.index.e653f95d195ec1d0129aa9174027cc02")}</strong>
                                </p>
                                <ul>
                                    <li className={air_lic ? "on" : ""}>{air_lic ? "И" : LangString("components.License.index.4e7a6fda26d347d8da78f6afd4a13fe2")}{LangString("components.License.index.21a350f10f201e034776edd47604d27e")}</li>
                                </ul>
                                {/* <small>
                  Действительна
                  <br />
                  <span>300 часов</span>
                </small> */}
                            </div>
                            <div>
                                <img src={boatImg} alt="" />
                                <p>
                                    {LangString("components.License.index.6d0ce8d2ab6e76e10b2e65b8ad654f8c")}
                  <br />
                                    <strong>{LangString("components.License.index.6fef8e85e271a7d1da7eaa9b68b514b2")}</strong>
                                </p>
                                <ul>
                                    <li className={ship_lic ? "on" : ""}>{ship_lic ? "И" : LangString("components.License.index.dded5b5a425ef95c97b2bc354cfa9620")}{LangString("components.License.index.3ed43b8082875e7ffac1c857e61de83a")}</li>
                                </ul>
                                {/* <small>
                  Действительна
                  <br />
                  <span>300 часов</span>
                </small> */}
                            </div>
                            <div>
                                <img src={gunImg} alt="" />
                                <p>
                                    {LangString("components.License.index.076bd87920598b532365b9cf52653480")}
                  <br />
                                    <strong>{LangString("components.License.index.a3bcaea3f27bf143997018cc5281d802")}</strong>
                                </p>
                                <ul>
                                    <li className={gun_lic ? "on" : ""}>{gun_lic ? "И" : LangString("components.License.index.954e0bdf59735501a49bb93f929cb1c1")}{LangString("components.License.index.66916e9d93ef0364ab22a90946652d9f")}</li>
                                </ul>
                            </div>
                            <div>
                                <img src={taxiImg} alt="" />
                                <p>
                                    {LangString("components.License.index.91e88756097b32df209b506ac617ddf3")}
                  <br />
                                    <strong>{LangString("components.License.index.d3c19b6f297152dc3c4e60d499fb5e04")}</strong>
                                </p>
                                <ul>
                                    <li className={taxi_lic ? "on" : ""}>{taxi_lic ? "И" : LangString("components.License.index.428adcf0ea6dd4b124004c267be4eb1b")}{LangString("components.License.index.8df10ec220cb8ffd1887d1e7ae5bc35e")}</li>
                                </ul>
                            </div>
                            <div>
                                <img src={lawImg} alt="" />
                                <p>
                                    {LangString("components.License.index.b9de1e6fcf40dfdaff2c9d4ef073243f")}
                  <br />
                                    <strong>{LangString("components.License.index.3cfaa7d24860c8274a15d510caf29d43")}</strong>
                                </p>
                                <ul>
                                    <li className={law_lic ? "on" : ""}>{law_lic ? "И" : LangString("components.License.index.0d266c253ea85fe901367f163ccd3c3b")}{LangString("components.License.index.9797da4337e555950535b7b9bc2da5df")}</li>
                                </ul>
                            </div>
                            <div>
                                <img src={medImg} alt="" />
                                <p>
                                    {LangString("components.License.index.2bde646ef4a67bd7bae16a93a3843d21")}
                  <br />
                                    <strong>{LangString("components.License.index.23fb5ac2687b06d03f476a678dbc6e3c")}</strong>
                                </p>
                                <ul>
                                    <li className={med_lic ? "on" : ""}>{med_lic ? "И" : LangString("components.License.index.f0430253978e984d4ea8a45119c4fd70")}{LangString("components.License.index.c1fe39ec9748697ce0e39a73b59f97d4")}</li>
                                </ul>
                            </div>
                            <div>
                                <img src={bizImg} alt="" />
                                <p>
                                    {LangString("components.License.index.f2999ae5f61fc8564382b4a915957d45")}
                  <br />
                                    <strong>{LangString("components.License.index.64da550297bcd3602599c5763b447b05")}</strong>
                                </p>
                                <ul>
                                    <li className={biz_lic ? "on" : ""}>{biz_lic ? "И" : LangString("components.License.index.fcfddd45e825eb8f1674ea0395451609")}{LangString("components.License.index.c1292bb6076e8d6e440af4b2a23f6edb")}</li>
                                </ul>
                            </div>
                            <div>
                                <img src={animalImg} alt="" />
                                <p>
                                    {LangString("components.License.index.fc65815d6826317d52e4678dcfebe39e")}
                  <br />
                                    <strong>{LangString("components.License.index.855b43f8b0c3b146db6fedb743c2cc9b")}</strong>
                                </p>
                                <ul>
                                    <li className={animal_lic ? "on" : ""}>{animal_lic ? "И" : LangString("components.License.index.ee203fe5be4d9a19fcf3b13ff3ec5b4a")}{LangString("components.License.index.bb951f56efbda303db71a0c1ac315aa0")}</li>
                                </ul>
                            </div>
                            <div>
                                <img src={fishImg} alt="" />
                                <p>
                                    {LangString("components.License.index.b3a4074311968e4f6c14bdab63d639fa")}
                  <br />
                                    <strong>{LangString("components.License.index.043f290ce9a3e662340c7fc258c0f7a4")}</strong>
                                </p>
                                <ul>
                                    <li className={fish_lic ? "on" : ""}>{fish_lic ? "И" : LangString("components.License.index.934e5ecbf3011fa4af76db2c8cb194b4")}{LangString("components.License.index.f6dd96d4fae0b82ac6b62c70401b6f6e")}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default License;
