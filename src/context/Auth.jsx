import { createContext, useState, useContext, useEffect } from "react";
import { getCurrentUser } from "../services/apiUsers";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(
		localStorage.getItem("token")
	);
	const [currentUser, setCurrentUser] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(false);

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			setIsAuthenticated(true);
			fetchUserData();
		} else {
			setIsAuthenticated(false);
			setCurrentUser(null);
		}
	}, []);

	const fetchUserData = async () => {
		try {
			setIsLoading(true);
			setError(false);
			const userData = await getCurrentUser();
			setCurrentUser(userData);
		} catch (error) {
			console.error("Failed to fetch user data", error);
			setIsAuthenticated(false);
			setCurrentUser(null);
			setError(true);
			localStorage.removeItem("token");
		} finally {
			setIsLoading(false);
		}
	};

	const loginContext = (token) => {
		localStorage.setItem("token", token);
		setIsAuthenticated(true);
		fetchUserData();
	};

	const logoutContext = () => {
		localStorage.removeItem("token");
		setIsAuthenticated(false);
		setCurrentUser(null);
	};

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated,
				currentUser,
				loginContext,
				logoutContext,
				isLoading,
				error,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
