// biome-ignore lint/style/useImportType: <explanation>
import React, { useState } from "react";
import corner from "../../img/corner.png";
import registrationImg from "../../img/registration.png";
import logo1 from "../../img/logo-1.png";
import loginImg from "../../img/Login.png";
import emailImg from "../../img/Email.png";
import keyImg from "../../img/Key.png";
import showImg from "../../img/show.png";
import noshowImg from "../../img/noshow.png";
import { CustomEvent } from "../../../../modules/custom.event";
import { CEF } from "../../../../modules/CEF";

type Props = {
	toggleVisibility: (tabId: number) => void;
};

export function Registration({ toggleVisibility }: Props) {
	const [showPassword, setShowPassword] = useState(false);
	const [showRepeatPassword, setRepeatShowPassword] = useState(false);
	const [registerUsername, setRegisterUsername] = useState("");
	const [registerEmail, setRegisterEmail] = useState("");
	const [registerPassword, setRegisterPassword] = useState("");
	const [registerRepeatPassword, setRegisterRepeatPassword] = useState("");
	const [disableButton, setdisableButton] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const [errors, setErrors] = useState({
		username: "",
		email: "",
		password: "",
		repeatPassword: "",
	});

	const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
	const toggleRepeatPasswordVisibility = () => setRepeatShowPassword((prev) => !prev);

	const validateFields = () => {
		let valid = true;
		const newErrors = { username: "", email: "", password: "", repeatPassword: "" };

		const username = registerUsername.trim();
		const email = registerEmail.trim();
		const password = registerPassword.trim();
		const repeatPassword = registerRepeatPassword.trim();

		// 🔹 Verificare login
		if (!username) {
			newErrors.username = "Introdu un nume de utilizator!";
			valid = false;
		} else if (/\s/.test(username)) {
			newErrors.username = "Login invalid: nu sunt permise spatii!";
			valid = false;
		} else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
			newErrors.username = "Login invalid: doar litere, cifre si _ sunt permise!";
			valid = false;
		} else if (username.length < 3 || username.length > 20) {
			newErrors.username = "Loginul trebuie sa aiba intre 3 si 20 caractere!";
			valid = false;
		}

		// 🔹 Verificare email
		if (!email) {
			newErrors.email = "Introdu un email!";
			valid = false;
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			newErrors.email = "Email invalid!";
			valid = false;
		}

		// 🔹 Verificare parola
		if (!password) {
			newErrors.password = "Introdu parola!";
			valid = false;
		} else if (password.length < 5) {
			newErrors.password = "Parola trebuie sa contina minim 5 caractere!";
			valid = false;
		} else if (password.includes(" ")) {
			newErrors.password = "Parola nu poate contine spatii!";
			valid = false;
		}

		// 🔹 Verificare repetare parola
		if (!repeatPassword) {
			newErrors.repeatPassword = "Repeta parola!";
			valid = false;
		} else if (password !== repeatPassword) {
			newErrors.repeatPassword = "Parolele nu se potrivesc!";
			valid = false;
		}

		setErrors(newErrors);
		return valid;
	};

	const handleRegisterClick = async () => {
		if (!validateFields()) {
			setErrorMessage("Corecteaza erorile marcate mai jos!");
			CEF.playSound("errorClick");
			return;
		}

		setErrorMessage("");
		setdisableButton(true);

		const username = registerUsername.replace(/\s+/g, "");
		const email = registerEmail.trim();
		const password = registerPassword.trim();

		await CustomEvent.callServer("server:user:account:register", username, password, email)
			.then((res: { status: boolean; text: string }) => {
				if (!res.status) {
					setErrorMessage(res.text);
					setdisableButton(false);
					CEF.playSound("errorClick");
				} else {
					CEF.playSound("okLogin");
					toggleVisibility(6);
					CEF.gui.saveLogin(username);
				}
			})
			.catch((err) => {
				console.error(err);
				setErrorMessage("A aparut o eroare la inregistrare.");
				setdisableButton(false);
				CEF.playSound("errorClick");
			});
	};

	const inputStyle = (hasError: boolean) => ({
		border: "2px solid transparent",
		boxShadow: hasError ? "0 0 6px rgba(255, 0, 0, 0.35)" : "none",
	});

	return (
		<div className="stage">
			<div className="page-container">
				<div className="corners">
					<img className="corner-top-right" src={corner} />
				</div>
				<img className="auth-stage-logo" src={logo1} alt="" />
				<h1 className="auth-stage-title">Înregistrare</h1>
				<p className="auth-stage-description">
					Pentru a trece la pasul urmator, va trebui sa creati un cont.
				</p>

				{errorMessage && (
					<div style={{ color: "red", marginBottom: "15px", textAlign: "center" }}>
						{errorMessage}
					</div>
				)}
				{/* Username */}
				<div className="input-box login">
					<img src={loginImg} alt="" />
					<div className="input">
						<input
							type="text"
							name="registerUsername"
							placeholder="Login"
							onChange={(e) => setRegisterUsername(e.target.value)}
							value={registerUsername}
						/>
						<label htmlFor="register-username">
							{errors.username ? (
								<span style={{ color: "red", fontWeight: "500" }}>{errors.username}</span>
							) : (
								"Introduceti numele de utilizator"
							)}
						</label>
					</div>
				</div>

				{/* Email */}
				<div className="input-box">
					<img src={emailImg} alt="" />
					<div className="input">
						<input
							type="email"
							name="registerEmail"
							placeholder="Email"
							onChange={(e) => setRegisterEmail(e.target.value)}
							value={registerEmail}
						/>
						<label htmlFor="register-email">
							{errors.email ? (
								<span style={{ color: "red", fontWeight: "500" }}>{errors.email}</span>
							) : (
								"Introduceti adresa de email"
							)}
						</label>
					</div>
				</div>

				{/* Password */}
				<div className="input-box">
					<img src={keyImg} alt="" />
					<div className="input">
						<input
							type={showPassword ? "text" : "password"}
							name="registerPassword"
							placeholder="Parola"
							onChange={(e) => setRegisterPassword(e.target.value)}
							value={registerPassword}
						/>
						<label htmlFor="register-password">
							{errors.password ? (
								<span style={{ color: "red", fontWeight: "500" }}>{errors.password}</span>
							) : (
								"Introduceti parola"
							)}
						</label>
					</div>
					<img
						src={!showPassword ? showImg : noshowImg}
						alt="Toggle password visibility"
						onClick={togglePasswordVisibility}
						style={{ cursor: "pointer" }}
					/>
				</div>

				{/* Repeat Password */}
				<div className="input-box">
					<img src={keyImg} alt="" />
					<div className="input">
						<input
							type={showRepeatPassword ? "text" : "password"}
							name="registerRepeatPassword"
							placeholder="Repeta parola"
							onChange={(e) => setRegisterRepeatPassword(e.target.value)}
							value={registerRepeatPassword}
						/>
						<label htmlFor="register-repeat-password">
							{errors.repeatPassword ? (
								<span style={{ color: "red", fontWeight: "500" }}>{errors.repeatPassword}</span>
							) : (
								"Repetati parola"
							)}
						</label>
					</div>
					<img
						src={!showRepeatPassword ? showImg : noshowImg}
						alt="Toggle password visibility"
						onClick={toggleRepeatPasswordVisibility}
						style={{ cursor: "pointer" }}
					/>
				</div>


				<button
					className="button"
					type="button"
					onClick={handleRegisterClick}
					disabled={disableButton}
					style={{
						backgroundColor: disableButton ? "#ccc" : "#007BFF",
						cursor: disableButton ? "not-allowed" : "pointer",
					}}
				>
					Înregistreaza-te
				</button>

				<p style={{ marginTop: "25px" }}>
					Daca aveti deja un cont, va puteti{" "}
					<i onClick={() => toggleVisibility(2)} className="login-page-button">
						autentifica
					</i>
				</p>

				
				<div className="corners">
					<img className="corner-bottom-left" src={corner} />
				</div>
			</div>
		</div>
	);
}
