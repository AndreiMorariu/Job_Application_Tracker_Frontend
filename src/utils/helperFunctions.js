export function formatDate(date) {
	const d = new Date(date);
	const month = `${d.getMonth() + 1}`.padStart(2, "0");
	const day = `${d.getDate()}`.padStart(2, "0");
	const year = d.getFullYear();
	return [year, month, day].join("-");
}

export function groupByMonthYear(applications) {
	return applications.reduce((acc, application) => {
		const date = new Date(application.date);
		const monthYear = `${date.getFullYear()}-${String(
			date.getMonth() + 1
		).padStart(2, "0")}`;

		if (!acc[monthYear]) {
			acc[monthYear] = [];
		}
		acc[monthYear].push(application);
		return acc;
	}, {});
}
