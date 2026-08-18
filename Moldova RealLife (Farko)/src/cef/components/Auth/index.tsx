import React, { useState } from "react";
import "./style/style.scss";
import { CustomEvent } from "../../modules/custom.event";
import "./fonts/Gilroy-ExtraBold.otf";
import "./fonts/Gilroy-Light.otf";
import "./fonts/d_kallisto.otf";
import type { personageLoginData } from "../../../shared/login.state";
import {
    Authorization,
    Registration,
    PathSelector,
} from "./pages";

export function Auth() {
    const [isVisible, setVisible] = useState(true);
    const [showRegistration, setshowRegistration] = useState(false);
    const [showAuthorization, setshowAuthorization] = useState(true);
    const [showResetPassword, setshowResetPassword] = useState(false);
    const [showPathSelector, setshowPathSelector] = useState(false);

    const emptyCharacters = [
        {
            id: 1,
            name: "",
            level: 0,
            gender: "Male",
            faction: 0,
            rank: 0,
            bank: "$0",
            cash: "$0",
            playTime: 0,
            pay: false,
            bought: false,
        },
        {
            id: 2,
            name: "",
            gender: "Male",
            level: 0,
            faction: 0,
            rank: 0,
            bank: "$0",
            cash: "$0",
            playTime: 0,
            pay: false,
            bought: false,
        },
        {
            id: 3,
            name: "",
            level: 0,
            gender: "Male",
            faction: 0,
            rank: 0,
            bank: "$0",
            cash: "$0",
            playTime: 0,
            pay: true,
            bought: false,
        },
    ];
    const [characters, setCharacters] = useState(emptyCharacters);

    const transformCharacterData = async (data: personageLoginData[]) => {
        while (data.length < 3) {
            data.push({
                id: 0,
                name: "",
                level: 0,
                money: 0,
                bank: 0,
                playTime: 0,
                fraction: 0,
                rank: 0,
                gender: 0,
                haveSkin: false,
            });
        }

        return data.map((char, index) => ({
            id: char.id,
            name: char.name,
            level: char.level,
            faction: char.fraction,
            cash: `$${char.money.toLocaleString()}`,
            rank: char.rank,
            bank: `$${char.bank.toLocaleString()}`,
            playTime: char.playTime,
            pay: index === 2 || index === 1,
            gender: char.gender === 0 ? "Male" : "Female",
            bought: char.haveSkin,
        }));
    };

    const toggleVisibility = (argument: number) => {
        switch (argument) {
            case 1:
                setshowRegistration(true);
                setshowAuthorization(false);
                setshowResetPassword(false);
                break;
            case 2:
                setshowRegistration(false);
                setshowAuthorization(true);
                setshowResetPassword(false);
                break;
            case 3:
                setshowRegistration(false);
                setshowAuthorization(true);
                setshowResetPassword(true);
                break;
            case 5:
                setshowRegistration(false);
                setshowAuthorization(false);
                setshowResetPassword(false);
                setVisible(false);
                setshowPathSelector(false);
                break;
            case 6:
                setshowRegistration(false);
                setshowAuthorization(false);
                setshowResetPassword(false);
                setshowPathSelector(true);
                break;
            default:
                setshowRegistration(false);
                setshowAuthorization(true);
                setshowResetPassword(false);
                setVisible(false);
                setshowPathSelector(false);
                break;
        }
    };
    // const handleSetCharacters = async (serverCharacters: personageLoginData[]) => {
    //     const transformedCharacters = await transformCharacterData(serverCharacters);
    //     setCharacters(transformedCharacters);

    //     const firstChar = transformedCharacters[0]; // doar primul caracter, pentru că ai doar unul

    //     if (!firstChar || !firstChar.bought) {
    //         // Nu exista caracter sau nu are skin -> mergem direct la creator
    //         toggleVisibility(1); // pagina creatorului de caracter
    //         return;
    //     }

    //     // Caracter complet -> mergem la PathSelector (linia quest)
    //     setshowPathSelector(true);
    //     setVisible(true);
    // };


    // Cel mai important: aici decizi ce pas urmeaza dupa login
    const handleSetCharacters = async (
        serverCharacters: personageLoginData[],
    ) => {
        const transformedCharacters = await transformCharacterData(serverCharacters);
        setCharacters(transformedCharacters);

        const hasAnyCharacter = transformedCharacters.some(char => char && char.bought);

        if (hasAnyCharacter) {
            // Playerul are deja un caracter - intra direct in joc!
            setshowPathSelector(false);
            setVisible(false);

            // Selecteaza automat primul caracter creat
            const firstChar = transformedCharacters.find(char => char.bought);
            if (firstChar) {
                await CustomEvent.callServer("cef:user:select", firstChar.id);
            }
        } else {
            // Nu exista niciun caracter - mergi direct la personalizare!
            setshowPathSelector(true);
            setVisible(true);
        }
    };

    const selectLine = async (line: number) => {
        await CustomEvent.callServer("cef:user:create", false, line);
        setshowPathSelector(false);
        setVisible(false);
    };
    return (
        isVisible && (
            <div className="auth-container-box">
                {showRegistration && (
                    <Registration toggleVisibility={toggleVisibility} />
                )}
                {showAuthorization && (
                    <Authorization
                        toggleVisibility={toggleVisibility}
                        showResetPassword={showResetPassword}
                        setCharacters={handleSetCharacters}
                        setshowResetPassword={setshowResetPassword}
                    />
                )}
                {showPathSelector && <PathSelector selectLine={selectLine} />}
            </div>
        )
    );
}
