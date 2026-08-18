import React from 'react';
import { LangString } from "../../../modules/lang";
import backIcon from "../assets/backIcon.svg";
import deleteImage from "../assets/delete.svg";
import acceptImage from "../assets/accept.svg";

type PasswordProps = {
    selectedSessionName: string;
    refPassInput: React.RefObject<HTMLInputElement>;
    onBack: () => void;
    onChangePasswordInput: () => void;
    onAddSymbol: (value: number) => void;
    onDeleteLastSymbol: () => void;
    onEnterPassword: () => void;
}

const Password: React.FC<PasswordProps> = ({
    selectedSessionName,
    refPassInput,
    onBack,
    onChangePasswordInput,
    onAddSymbol,
    onDeleteLastSymbol,
    onEnterPassword
}) => {
    return (
        <div className="gunGame-password">
            <div
                className="exit"
                onClick={onBack}
            >
                <div className="exit__icon">
                    <img src={backIcon} alt="#" />
                </div>
                <div className="exit__title">
                    {LangString(
                        "components.GunGame.GunGame.e7709464d4d6056418a4b607af7372bb",
                    )}
                </div>
            </div>

            <div className="gunGame-password__title">
                {LangString(
                    "components.GunGame.GunGame.860482dbc749e896a8e8a227902e152f",
                )}
                <div>{selectedSessionName}</div>
            </div>

            <div className={"gunGame-password-content"}>
                <div className="gunGame-password-content-row">
                    <input
                        spellCheck="false"
                        type="password"
                        ref={refPassInput}
                        onChange={onChangePasswordInput}
                    />
                    <div className="gunGame-password-content-row__placeholder">
                        {LangString(
                            "components.GunGame.GunGame.d6487ee2231f341792f6d761f0d40494",
                        )}
                    </div>
                </div>

                <div className="gunGame-password-content-buttons">
                    <div onClick={() => onAddSymbol(1)}>1</div>
                    <div onClick={() => onAddSymbol(2)}>2</div>
                    <div onClick={() => onAddSymbol(3)}>3</div>
                    <div onClick={() => onAddSymbol(4)}>4</div>
                    <div onClick={() => onAddSymbol(5)}>5</div>
                    <div onClick={() => onAddSymbol(6)}>6</div>
                    <div onClick={() => onAddSymbol(7)}>7</div>
                    <div onClick={() => onAddSymbol(8)}>8</div>
                    <div onClick={() => onAddSymbol(9)}>9</div>
                    <div onClick={onDeleteLastSymbol}>
                        <img src={deleteImage} alt="" />
                    </div>
                    <div onClick={() => onAddSymbol(0)}>0</div>
                    <div onClick={onEnterPassword}>
                        <img src={acceptImage} alt="" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Password;