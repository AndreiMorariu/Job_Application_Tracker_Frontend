import { useState } from "react";
import { Link } from "react-router-dom";
import {
	Box,
	Drawer,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BarChartIcon from "@mui/icons-material/BarChart";

const menuItems = [
	{ text: "Dashboard", icon: <DashboardIcon />, path: "dashboard" },
	{ text: "Statistics", icon: <BarChartIcon />, path: "statistics" },
];

function TemporaryDrawer() {
	const [open, setOpen] = useState(false);

	const toggleDrawer = (newOpen) => () => {
		setOpen(newOpen);
	};

	const DrawerList = (
		<Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
			<List>
				{menuItems.map(({ text, icon, action, path }) =>
					path ? (
						<Link
							to={path}
							key={text}
							style={{ textDecoration: "none", color: "inherit" }}
						>
							<ListItem onClick={action ? action : null}>
								<ListItemButton>
									<ListItemIcon>{icon}</ListItemIcon>
									<ListItemText primary={text} />
								</ListItemButton>
							</ListItem>
						</Link>
					) : (
						<ListItem key={text} onClick={action ? action : null}>
							<ListItemButton>
								<ListItemIcon>{icon}</ListItemIcon>
								<ListItemText primary={text} />
							</ListItemButton>
						</ListItem>
					)
				)}
			</List>
		</Box>
	);

	return (
		<Box component="div" display="flex">
			<MenuIcon
				onClick={toggleDrawer(true)}
				sx={{ color: "#fff", cursor: "pointer" }}
			/>
			<Drawer open={open} onClose={toggleDrawer(false)}>
				{DrawerList}
			</Drawer>
		</Box>
	);
}

export default TemporaryDrawer;
