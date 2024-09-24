import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import useMediaQuery from "@mui/material/useMediaQuery";
import { TextField, Box, Button, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import toast, { Toaster } from "react-hot-toast";

import { SignUp, resendConfirmationEmail } from "../services/apiUsers";

function Register() {
	const [email, setEmail] = useState("");
	const [userData, setUserData] = useState({
		email: "",
		password: "",
	});
	const [isResetEmailVisible, setIsResetEmailVisible] = useState(false);
	const [resendAttempts, setResendAttempts] = useState(0);
	const [cooldown, setCooldown] = useState(0);
	const [canResend, setCanResend] = useState(false);

	const theme = useTheme();
	const isSmallScreen = useMediaQuery(theme.breakpoints.down("lg"));

	async function handleSubmit(e) {
		e.preventDefault();
		try {
			setIsResetEmailVisible(true);
			await SignUp(userData.email, userData.password);
			toast.success("A confirmation email has been sent");
			setResendAttempts(0);
			setCanResend(false);
			startCooldown();
			setEmail(userData.email);
		} catch (error) {
			toast.error(error.message);
			setIsResetEmailVisible(false);
		} finally {
			setUserData({ email: "", password: "" });
		}
	}

	async function handleResendEmail(e) {
		e.preventDefault();
		if (resendAttempts < 3 && canResend) {
			try {
				await resendConfirmationEmail(email);
				toast.success("Confirmation email resent");
				setResendAttempts((prev) => prev + 1);
				setCanResend(false);
				startCooldown();
			} catch (error) {
				toast.error(error.message);
			} finally {
				setUserData({ email: "", password: "" });
			}
		} else {
			toast.error("Maximum resend attempts reached or cooldown active");
		}
	}

	function startCooldown() {
		setCooldown(30);
		const interval = setInterval(() => {
			setCooldown((prev) => {
				if (prev <= 1) {
					clearInterval(interval);
					setCanResend(true);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);
	}

	useEffect(() => {
		return () => {
			toast.dismiss();
		};
	}, []);

	return (
		<Box
			display="flex"
			alignItems="center"
			justifyContent="center"
			height="100dvh"
		>
			<Toaster position="top-center" reverseOrder={false} />
			<Box
				width="50%"
				height="100%"
				sx={{
					backgroundImage: "url('login.svg')",
					backgroundRepeat: "no-repeat",
					backgroundPosition: "center",
				}}
				display={isSmallScreen ? "none" : "block"}
			/>
			<Box
				width={isSmallScreen ? "100%" : "50%"}
				height="100%"
				display="flex"
				flexDirection="column"
				alignItems="center"
				justifyContent="center"
			>
				<Box marginBottom="2rem">
					<Typography variant="h3" component="p" textAlign="center">
						Welcome
					</Typography>
					<Typography variant="subtitle1" component="p" textAlign="center">
						Create your account to continue
					</Typography>
				</Box>
				<Box onSubmit={handleSubmit} width="50%" component="form">
					<Box marginBottom="1rem">
						<TextField
							fullWidth
							required
							type="email"
							id="email"
							label="email"
							variant="outlined"
							autoComplete="off"
							value={userData.email}
							onChange={(e) =>
								setUserData({ ...userData, email: e.target.value })
							}
						/>
					</Box>
					<Box marginBottom="1rem">
						<TextField
							fullWidth
							required
							type="password"
							id="password"
							label="password"
							variant="outlined"
							autoComplete="off"
							value={userData.password}
							onChange={(e) =>
								setUserData({ ...userData, password: e.target.value })
							}
							inputProps={{ minLength: 6 }}
						/>
					</Box>
					<Button variant="contained" type="submit" fullWidth>
						Create Account
					</Button>
				</Box>

				<Box marginTop="1rem" textAlign="center">
					<Typography
						variant="subtitle1"
						component="span"
						marginRight="0.5rem"
						textAlign="left"
					>
						Already have an account?
						<Link
							to="../login"
							style={{ color: "#1769aa", marginLeft: "10px" }}
						>
							Login
						</Link>
					</Typography>
				</Box>
				{isResetEmailVisible && (
					<Box marginTop="1rem" textAlign="center">
						<Typography
							variant="subtitle1"
							component="span"
							marginRight="0.5rem"
							textAlign="left"
						>
							Didn&apos;t receive email?
						</Typography>
						<Button
							variant="text"
							size="small"
							onClick={handleResendEmail}
							disabled={!canResend || resendAttempts >= 3}
						>
							{canResend
								? resendAttempts < 3
									? "Resend email"
									: "Max attempts reached"
								: `Resend available in ${cooldown}s`}
						</Button>
					</Box>
				)}
			</Box>
		</Box>
	);
}

export default Register;
