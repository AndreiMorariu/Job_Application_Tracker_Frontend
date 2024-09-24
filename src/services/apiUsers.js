const BASE_URL =
	"https://applicationtrackerapi-fwhxgaefbza8d7fb.italynorth-01.azurewebsites.net/users";

export async function SignUp(email, password) {
	const response = await fetch(`${BASE_URL}/register`, {
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Content-Type": "application/json",
		},
		method: "POST",
		body: JSON.stringify({ email, password }),
	});

	if (!response.ok) {
		const data = await response.json();
		throw new Error(data.detail);
	}
}

export async function resendConfirmationEmail(email) {
	const response = await fetch(`${BASE_URL}/resend-confirmation-email`, {
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Content-Type": "application/json",
		},
		method: "POST",
		body: JSON.stringify(email),
	});

	if (!response.ok) {
		const data = await response.json();
		throw new Error(data.detail);
	}
}

export async function SignIn(email, password) {
	const response = await fetch(
		"https://applicationtrackerapi-fwhxgaefbza8d7fb.italynorth-01.azurewebsites.net/identity/login",
		{
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Content-Type": "application/json",
			},
			method: "POST",
			body: JSON.stringify({
				email: email,
				password: password,
				twoFactorCode: "",
				twoFactorRecoveryCode: "",
			}),
		}
	);

	if (!response.ok)
		throw new Error("Invalid credentials or email not verified");

	const data = await response.json();
	const token = data.accessToken;
	localStorage.setItem("token", token);
	return data;
}

export async function getCurrentUser() {
	const token = localStorage.getItem("token");

	const response = await fetch(`${BASE_URL}/current`, {
		headers: {
			Authorization: `Bearer ${token}`,
			"Access-Control-Allow-Origin": "*",
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const data = await response.json();
		throw new Error(data.detail);
	}

	const user = await response.json();
	return user;
}

export async function logOut() {
	const token = localStorage.getItem("token");

	const response = await fetch(`${BASE_URL}/logout`, {
		headers: {
			Authorization: `Bearer ${token}`,
			"Access-Control-Allow-Origin": "*",
			"Content-Type": "application/json",
		},
		method: "POST",
	});

	if (!response.ok) throw new Error("Error while logging out");

	localStorage.removeItem("token");
}
