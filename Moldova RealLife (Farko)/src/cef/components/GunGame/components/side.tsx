import React from "react";
import { LangString } from "../../../modules/lang";
import { weapon_list } from "../../../../shared/inventory";

type CreateSideProps = {
    refKillsForEnd: React.RefObject<HTMLInputElement>;
    useArmour: boolean;
    rebornAfterDeath: boolean;
    createType: "deathmatch" | "gungame" | "teamfight";
    selectedGun: number;
    DM_WEAPONS: any[];
    icons: Record<string, string>;
    iconsItems: Record<string, string>;
    onSetUseArmour: (toggle: boolean) => void;
    onSetRebornAfterDeath: (toggle: boolean) => void;
    onChangeSelectedGun: (toggle: boolean) => void;
    onCreateMatch: () => void;
}

const CreateSide: React.FC<CreateSideProps> = ({
    refKillsForEnd,
    useArmour,
    rebornAfterDeath,
    createType,
    selectedGun,
    DM_WEAPONS,
    icons,
    iconsItems,
    onSetUseArmour,
    onSetRebornAfterDeath,
    onChangeSelectedGun,
    onCreateMatch
}) => {
    return (
        <div className="create-gungame">
            <div className="top">
                <div className="create-gungame-number">
                    <p>
                        {LangString(
                            "components.GunGame.GunGame.e9e2ea205b3f13e47a1051b6e6f54527",
                        )}{" "}
                        {LangString(
                            "components.GunGame.GunGame.e17368335dcb9a10a250a2d7182921d2",
                        )}
                    </p>
                    <input
                        type="number"
                        ref={refKillsForEnd}
                        defaultValue={5}
                    />
                </div>

                <div className="create-gungame-element">
                    <p>
                        {LangString(
                            "components.GunGame.GunGame.5e7d3a3c5c4d2acb3e0c409d5f24f13a",
                        )}
                    </p>
                    <div className="controls">
                        <button
                            onClick={() => onSetUseArmour(false)}
                            className={`button-gray ${!useArmour ? "selected" : ""}`}
                        >
                            {LangString(
                                "components.GunGame.GunGame.55480c9f84d2055a96b00402440c1253",
                            )}
                        </button>
                        <button
                            onClick={() => onSetUseArmour(true)}
                            className={`button-gray ${useArmour ? "selected" : ""}`}
                        >
                            {LangString(
                                "components.GunGame.GunGame.de29caae8b49aea06431ab04802c7616",
                            )}
                        </button>
                    </div>
                </div>

                <div className="create-gungame-element">
                    <p>
                        {LangString(
                            "components.GunGame.GunGame.ce3d3eba76548fde641a709cb93c9704",
                        )}
                    </p>
                    <div className="controls">
                        <button
                            onClick={() => onSetRebornAfterDeath(false)}
                            className={`button-gray ${!rebornAfterDeath ? "selected" : ""}`}
                        >
                            No
                        </button>
                        <button
                            onClick={() => onSetRebornAfterDeath(true)}
                            className={`button-gray ${rebornAfterDeath ? "selected" : ""}`}
                        >
                            Yes
                        </button>
                    </div>
                </div>

                {createType === "deathmatch" && (
                    <div className="locations weapons">
                        <div className="location">
                            <div className="controls">
                                <div
                                    className="arrow-left arrow-gg"
                                    onClick={() => onChangeSelectedGun(false)}
                                >
                                    <img src={icons['arrow-left']} alt="arrow-left" />
                                </div>
                                <img
                                    className="img-location"
                                    style={{
                                        maxHeight: '55px',
                                        maxWidth: '140px',
                                    }}
                                    src={
                                        iconsItems[
                                        `Item_${weapon_list.find((w) => w.hash == DM_WEAPONS[selectedGun].weapon)?.weapon}`
                                        ]
                                    }
                                    alt=""
                                />
                                <div
                                    className="arrow-right arrow-gg"
                                    onClick={() => onChangeSelectedGun(true)}
                                >
                                    <img src={icons['arrow-right']} alt="arrow-right" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <button type="button" className="button-create"
                onClick={onCreateMatch}>
                {LangString(
                    "components.GunGame.GunGame.41ecd61b43605b1c2fd1d50212134e30",
                )}
            </button>
        </div>
    );
};

export default CreateSide;