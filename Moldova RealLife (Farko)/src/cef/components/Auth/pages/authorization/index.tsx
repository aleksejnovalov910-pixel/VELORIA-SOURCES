// biome-ignore lint/style/useImportType: <explanation>
import React from "react";
import { useState } from "react";
import corner from "../../img/corner.png";
import authorizationImage from "../../img/authorization.png";
import logo1 from "../../img/logo-1.png";
import loginImg from "../../img/Login.png";
import emailImg from "../../img/Email.png";
import keyImg from "../../img/Key.png";
import showImg from "../../img/show.png";
import noshowImg from "../../img/noshow.png";
import { CustomEvent } from "../../../../modules/custom.event";
import type { personageLoginData } from "../../../../../shared/login.state";
import { CEF } from "../../../../modules/CEF";

type Props = {
	toggleVisibility: (tabId: number) => void;
	showResetPassword: boolean;
	setCharacters: (characters: personageLoginData[]) => void;
	setshowResetPassword: (show: boolean) => void;
};

export function Authorization({
	toggleVisibility,
	showResetPassword,
	setCharacters,
	setshowResetPassword,
}: Props) {
	// Управление видимостью пароля
	const [showPassword, setShowPassword] = useState(false);
	const togglePasswordVisibility = () => {
		setShowPassword((prevState) => !prevState);
	};

	// Максимальная длина символов
	const maxChar = 30;

	// Состояние инпутов
	const [inputStates, setInputStates] = useState<
		Record<string, { value: string; isMaxLength: boolean }>
	>({});
	const [authotizationUsername, setauthotizationUsername] = useState("");
	const [authotizationPassword, setauthotizationPassword] = useState("");
	const [restoreEmail, setrestoreEmail] = useState("");
	const [restoreCode, setrestoreCode] = useState("");
	const [disableButton, setdisableButton] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [restoreStep, setRestoreStep] = useState(0);
	const [restorePassword, setrestorePassword] = useState("");

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		if (name === "authotizationUsername") {
			setauthotizationUsername(value);
		} else if (name === "authotizationPassword") {
			setauthotizationPassword(value);
		} else if (name === "restoreEmail") {
			setrestoreEmail(value);
		} else if (name === "restoreCode") {
			setrestoreCode(value);
		} else if (name === "restorePassword") {
			setrestorePassword(value);
		}

		setInputStates((prevState) => ({
			...prevState,
			[name]: {
				value: value,
				isMaxLength: value.length >= maxChar,
			},
		}));
	};

	// Функция входа
	const handleLoginIn = async () => {
		console.log("handleLoginIn");
		setdisableButton(true);
		CustomEvent.callServer(
			"server:user:account:login",
			authotizationUsername,
			authotizationPassword,
		).then(
			(res: {
				status: boolean;
				text?: string;
				personages?: personageLoginData[];
				donate: number;
			}) => {
				console.log(res);
				if (!res.status) {
					setErrorMessage(res.text);
					setdisableButton(false);
					CEF.playSound("errorClick");
				} else {
					CEF.playSound("okLogin");
					toggleVisibility(4);
					setCharacters(res.personages);
					CEF.gui.saveLogin(authotizationUsername);
					CustomEvent.triggerClient("loadingscreen:load");
					CustomEvent.triggerClient("fractionCfg:cefReady");
				}
			},
		);
	};

	const handleRestorePassword = async () => {
		const res = await CustomEvent.callServer("account:verifyRestore", restoreEmail, restoreCode);
		if (res) {
			setErrorMessage(res);
		} else {
			setshowResetPassword(false);
		}
	};

	// Функция сброса пароля
	const handleReset = () => {
		CustomEvent.callServer("account:restorePassword", restoreEmail);
		setRestoreStep(1);
	};

	return (
		<div className="page-container">
			<div className="corners">
				{/* biome-ignore lint/a11y/useAltText: <explanation> ||| <img className="auth-stage-logo" src={logo1} alt="" />*/}
				<img className="corner-top-right" src={corner} />
			</div>
			<img className="auth-stage-logo" src={logo1} alt="" />

			{!showResetPassword ? (
				<>
					<h1 className="auth-stage-title">Autorizare</h1>
					<p className="auth-stage-description">
						Pentru a trece la pasul urmator, autentificati-va în contul
						dumneavoastra sau creati unul nou.
					</p>
					{errorMessage && (
						<div
							style={{
								color: "red",
								marginBottom: "15px",
								textAlign: "center",
							}}
						>
							{errorMessage}
						</div>
					)}
				</>
			) : (
				<>
					<h1 className="auth-stage-title">Reseteaza Parola</h1>
					<p className="auth-stage-description">
						Puteti recupera parola daca ati uitat-o.
					</p>
				</>
			)}

			{!showResetPassword ? (
				<div className="input-box">
					<img src={loginImg} alt="" />
					<div className="input">
						<input
							type="text"
							id="authotization-username"
							name="authotizationUsername"
							placeholder="Login"
							maxLength={maxChar}
							onChange={handleInputChange}
							value={authotizationUsername}
						/>
						{inputStates.authotizationUsername?.isMaxLength ? (
							// biome-ignore lint/a11y/noLabelWithoutControl: <explanation>
							<label style={{ color: "red" }}>
								S-a atins limita maximă de caractere!
							</label>
						) : (
							<label htmlFor="authotization-username">Autentificare</label>
						)}
					</div>
				</div>
			) : <>
				{restoreStep === 0 && (
					<div className="input-box">
						<img src={emailImg} alt="" />
						<div className="input">
							<input
								type="email"
								id="restore-email"
								name="restoreEmail"
								placeholder="Email"
								maxLength={maxChar}
								onChange={handleInputChange}
								value={restoreEmail}
							/>
							{inputStates.restoreEmail?.isMaxLength ? (
								// biome-ignore lint/a11y/noLabelWithoutControl: <explanation>
								<label style={{ color: "red" }}>
									Ati atins limita maxima de caractere!
								</label>
							) : (
								<label htmlFor="restore-email">Introduceti adresa de email</label>
							)}
						</div>
					</div>
				)}

				{restoreStep === 1 && (
					<div className="input-box">
						<img src={keyImg} alt="" />
						<div className="input">
							<input
								type="text"
								id="restore-code"
								name="restoreCode"
								placeholder="Code"
								maxLength={maxChar}
								onChange={handleInputChange}
								value={restoreCode}
							/>
							{inputStates.restoreCode?.isMaxLength ? (
								// biome-ignore lint/a11y/noLabelWithoutControl: <explanation>
								<label style={{ color: "red" }}>
									Error!
								</label>
							) : (
								<label htmlFor="restore-email">Introduceti codul de recuperare</label>
							)}
						</div>
					</div>
				)}

			</>}

			{!showResetPassword && (
				<div className="input-box">
					<img src={keyImg} alt="" />
					<div className="input">
						<input
							type={showPassword ? "text" : "password"}
							id="authotization-password"
							name="authotizationPassword"
							placeholder="Password"
							maxLength={maxChar}
							onChange={handleInputChange}
							value={authotizationPassword}
						/>
						{inputStates.authotizationPassword?.isMaxLength ? (
							// biome-ignore lint/a11y/noLabelWithoutControl: <explanation>
							<label style={{ color: "red" }}>
								Ati atins limita maximă de caractere!
							</label>
						) : (
							<label htmlFor="authotization-password">Introduceti parola</label>
						)}
					</div>
					{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
					<img
						src={!showPassword ? showImg : noshowImg}
						alt="Toggle password visibility"
						onClick={togglePasswordVisibility}
						style={{ cursor: "pointer" }}
					/>
				</div>
			)}

			{!showResetPassword ? (
				<>
					<button
						className="button"
						type="button"
						style={{
							backgroundColor: disableButton ? "#ccc" : "#007BFF",
							cursor: disableButton ? "not-allowed" : "pointer",
						}}
						onClick={handleLoginIn}
						disabled={disableButton}
					>
						Autentificare
					</button>
					<button
						className="create-acc"
						type="button"
						style={{ marginTop: "15px" }}
						onClick={() => toggleVisibility(1)}
					>
						Creati un cont nou
					</button>
					<p style={{ marginTop: "25px" }}>
						Daca ati uitat parola? o puteti{" "}
						{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
						<i onClick={() => toggleVisibility(3)} className="restore-pass-i">
							restabili
						</i>{" "}
					</p>
				</>
			) : (
				<>
					{restoreStep === 0 && (
						<button className="button" type="button" onClick={handleReset}>
							Trimite con de recuperare
						</button>
					)}
					{restoreStep === 1 && (
						<button className="button" type="button" onClick={handleRestorePassword}>
							Restabiliti parola
						</button>
					)}
					<button
						className="restore-cancel"
						type="button"
						style={{ marginTop: "15px" }}
						onClick={() => toggleVisibility(2)}
					>
						Anuleaza
					</button>
				</>
			)}

			{/* biome-ignore lint/a11y/useAltText: <explanation> ||| <img className="registration-img" src={authorizationImage} />*/}
			
			<div className="corners">
				{/* biome-ignore lint/a11y/useAltText: <explanation> */}
				<img className="corner-bottom-left" src={corner} />
			</div>
		</div>
	);
}
