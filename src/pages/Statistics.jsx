import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import Card from "../components/Card";
import { getUserApplications } from "../services/apiApplications";
import { Chart } from "react-google-charts";

import { useAuth } from "../context/Auth";

import { groupByMonthYear } from "../utils/helperFunctions"
import { chartOptions } from "../utils/constants"

function useWindowSize() {
	const [windowSize, setWindowSize] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	});

	useEffect(() => {
		function handleResize() {
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		}

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return windowSize;
}

function Statistics() {
	const { currentUser } = useAuth();
	const { width } = useWindowSize();

	const { data: applications } = useQuery({
		queryKey: ["applications"],
		queryFn: () => getUserApplications(currentUser.id),
	});

	const locations = applications
		? Object.groupBy(applications, ({ location }) => location)
		: {};

	const statuses = applications
		? Object.groupBy(applications, ({ status }) => status)
		: {};

	const positions = applications
		? Object.groupBy(applications, ({ position }) => position)
		: {};

	const companies = applications
		? Object.groupBy(applications, ({ company }) => company)
		: {};

	const successfulApplicationsNumber = applications
		? applications.filter(
				(application) =>
					application.status === "Hired" ||
					application.status === "Offer Extended" ||
					application.status === "Offer Accepted"
		  ).length
		: 0;

	const responseApplicationsNumber = applications
		? applications.filter((application) => application.status !== "Applied")
				.length
		: 0;

	const rejectedApplicationsNumber = applications
		? applications.filter((application) => application.status === "Rejected")
				.length
		: 0;

	const totalApplications = applications?.length || 0;

	const successRate = totalApplications
		? Math.floor((successfulApplicationsNumber / totalApplications) * 100)
		: 0;

	const responseRate = totalApplications
		? Math.floor((responseApplicationsNumber / totalApplications) * 100)
		: 0;

	const rejectionRate = totalApplications
		? Math.floor((rejectedApplicationsNumber / totalApplications) * 100)
		: 0;

	const totalCompanies = Object.keys(companies).length;

	const applicationsByMonthYear = applications
		? groupByMonthYear(applications)
		: {};

	const totalMonths = Object.keys(applicationsByMonthYear).length;
	const averageApplicationsPerMonth = totalMonths
		? (totalApplications / totalMonths).toFixed(2)
		: 0;

	const applicationsByStatusData = Object.keys(statuses).map((status) => [
		status,
		statuses[status].length,
	]);

	const applicationsByLocationData = Object.keys(locations).map((location) => [
		location,
		locations[location]?.length,
	]);

	const applicationsByCompanyData = Object.keys(companies).map((company) => [
		company,
		companies[company]?.length,
	]);

	const applicationsByPositionData = Object.keys(positions).map((position) => [
		position,
		positions[position]?.length,
	]);

	return (
		<Box>
			<Box>
				<Typography
					variant="h4"
					component="h2"
					sx={{ marginTop: "4rem", marginBottom: "4rem" }}
				>
					Summary
				</Typography>
				<Box
					sx={{
						marginTop: "1rem",
						display: "grid",
						gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
						gap: "2rem",
					}}
				>
					<Card title="Total Applications" value={totalApplications} />
					<Card title="Success Rate" value={successRate} />
					<Card title="Response Rate" value={responseRate} />
					<Card
						title="Average Applications per Month"
						value={averageApplicationsPerMonth}
					/>
					<Card title="Total Companies Applied To" value={totalCompanies} />
					<Card title="Rejection Rate" value={rejectionRate} />
				</Box>
			</Box>
			<Box>
				<Typography
					variant="h4"
					component="h2"
					sx={{ marginTop: "4rem", marginBottom: "4rem" }}
				>
					More Information
				</Typography>
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
						gap: "2rem",
					}}
				>
					<Box
						sx={{
							height: "400px",
							width: "100%",
						}}
					>
						<Chart
							chartType="PieChart"
							data={[["Application", "Status"], ...applicationsByStatusData]}
							options={{ title: "Application By Status", ...chartOptions }}
							height="100%"
							width="100%"
							key={`status-chart-${width}`}
						/>
					</Box>
					<Box sx={{ height: "400px", width: "100%" }}>
						<Chart
							chartType="PieChart"
							data={[
								["Application", "Location"],
								...applicationsByLocationData,
							]}
							options={{ title: "Application By Location", ...chartOptions }}
							height="100%"
							width="100%"
							key={`location-chart-${width}`}
						/>
					</Box>
					<Box sx={{ height: "400px", width: "100%" }}>
						<Chart
							chartType="PieChart"
							data={[["Application", "Company"], ...applicationsByCompanyData]}
							options={{ title: "Application By Company", ...chartOptions }}
							height="100%"
							width="100%"
							key={`company-chart-${width}`}
						/>
					</Box>
					<Box sx={{ height: "400px", width: "100%" }}>
						<Chart
							chartType="PieChart"
							data={[
								["Application", "Position"],
								...applicationsByPositionData,
							]}
							options={{ title: "Application By Position", ...chartOptions }}
							height="100%"
							width="100%"
							key={`position-chart-${width}`}
						/>
					</Box>
				</Box>
			</Box>
		</Box>
	);
}

export default Statistics;
