import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Typography, Box } from "@mui/material";

import Spinner from "../components/Spinner";
import ApplicationsList from "../components/ApplicationsList";

import { useAuth } from "../context/Auth";

function Dashboard() {
	const { currentUser, isLoading, error } = useAuth();

	const username = currentUser?.email.slice(0, currentUser?.email.indexOf("@"));

	useEffect(() => {
		if (error) {
			toast.error("Error fetching user's information");
		}
	}, [error]);

	return (
		<Box>
			<Box>
				<Toaster position="top-center" reverseOrder={false} />
				{isLoading ? (
					<Spinner />
				) : (
					<Typography variant="h4" component="h2" sx={{ marginTop: "2rem" }}>
						Welcome back, <span style={{ fontWeight: 700 }}>{username}</span>!
					</Typography>
				)}
			</Box>
			<Box marginTop="3rem">
				<ApplicationsList />
			</Box>
		</Box>
	);
}

export default Dashboard;
