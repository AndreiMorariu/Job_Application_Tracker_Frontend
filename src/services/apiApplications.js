const BASE_URL =
	"https://applicationtrackerapi-fwhxgaefbza8d7fb.italynorth-01.azurewebsites.net/applications";

export async function getUserApplications(id) {
	const token = localStorage.getItem("token");

	const response = await fetch(`${BASE_URL}/?userId=${id}`, {
		headers: {
			Authorization: `Bearer ${token}`,
			"Access-Control-Allow-Origin": "*",
			"Content-Type": "application/json",
		},
		method: "GET",
	});

	if (!response.ok) throw new Error("Error fetching applications");

	const data = await response.json();

	return data;
}

export async function createApplication(application) {
	const token = localStorage.getItem("token");

	if (!application.link.startsWith("http"))
		application.link = `https://${application.link}`;

	const response = await fetch(BASE_URL, {
		headers: {
			Authorization: `Bearer ${token}`,
			"Access-Control-Allow-Origin": "*",
			"Content-Type": "application/json",
		},
		method: "POST",
		body: JSON.stringify(application),
	});

	if (!response.ok) throw new Error("Error while creating the application");
}

export async function deleteApplication(id) {
	const token = localStorage.getItem("token");

	const response = await fetch(`${BASE_URL}/${id}`, {
		headers: {
			Authorization: `Bearer ${token}`,
			"Access-Control-Allow-Origin": "*",
			"Content-Type": "application/json",
		},
		method: "DELETE",
	});

	if (!response.ok) throw new Error("Error deleting applications");
}

export async function updateApplication(application, id) {
	const token = localStorage.getItem("token");

	if (!application.link.startsWith("http"))
		application.link = `https://${application.link}`;

	const response = await fetch(`${BASE_URL}/${id}`, {
		headers: {
			Authorization: `Bearer ${token}`,
			"Access-Control-Allow-Origin": "*",
			"Content-Type": "application/json",
		},
		method: "PUT",
		body: JSON.stringify(application),
	});

	if (!response.ok) throw new Error("Error editing the application");
}
