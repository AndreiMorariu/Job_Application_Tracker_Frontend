import { useMemo } from "react";
import CssBaseline from "@mui/material/CssBaseline";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import AppLayout from "./pages/AppLayout";
import Dashboard from "./pages/Dashboard";
import Statistics from "./pages/Statistics";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoutes from "./components/ProtectedRoutes";

import { ThemeProvider, createTheme } from "@mui/material/styles";

import { ColorModeProvider, useColorMode } from "./context/Theme";
import { AuthProvider } from "./context/Auth";

const queryClient = new QueryClient();

function App() {
	return (
		<ColorModeProvider>
			<MainApp />
		</ColorModeProvider>
	);
}

function MainApp() {
	const { mode } = useColorMode();

	const theme = useMemo(
		() =>
			createTheme({
				palette: {
					mode,
				},
			}),
		[mode]
	);

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<QueryClientProvider client={queryClient}>
				<ReactQueryDevtools initialIsOpen={false} />
				<BrowserRouter>
					<AuthProvider>
						<Routes>
							<Route path="/" element={<ProtectedRoutes />}>
								<Route element={<AppLayout />}>
									<Route index element={<Navigate replace to="dashboard" />} />
									<Route path="dashboard" element={<Dashboard />} />
									<Route path="statistics" element={<Statistics />} />
								</Route>
							</Route>
							<Route path="/login" element={<Login />} />
							<Route path="/register" element={<Register />} />
						</Routes>
					</AuthProvider>
				</BrowserRouter>
			</QueryClientProvider>
		</ThemeProvider>
	);
}

export default App;
