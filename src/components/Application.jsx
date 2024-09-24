import { useState } from "react";
import { Box, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import toast, { Toaster } from "react-hot-toast";

import { deleteApplication } from "../services/apiApplications";

import { useMutation, useQueryClient } from "@tanstack/react-query";

const formatDate = (date) => {
	const d = new Date(date);
	const month = `${d.getMonth() + 1}`.padStart(2, "0");
	const day = `${d.getDate()}`.padStart(2, "0");
	const year = d.getFullYear();
	return [year, month, day].join("-");
};

function Application({
	company,
	position,
	status,
	date,
	location,
	link,
	onOpen,
	index,
	id,
}) {
	return (
		<Box
			display="flex"
			alignItems="center"
			justifyContent="space-between"
			marginTop="1rem"
		>
			<Toaster position="top-center" reverseOrder={false} />

			<Box display="flex" flexDirection="column">
				<Typography variant="subtitle1" component="p" fontWeight="700">
					{company}
				</Typography>
				<Typography variant="subtitle1" component="p" marginBottom="1rem">
					{`${position} (${location})`}
				</Typography>
				<Typography variant="subtitle2" component="p">
					Applied on {formatDate(date)}
				</Typography>
			</Box>
			<Box display="flex" flexDirection="column">
				<Typography variant="subtitle2" component="p" marginBottom="2.5rem">
					{status}
				</Typography>
				<MenuComponent link={link} onOpen={onOpen} index={index} id={id} />
			</Box>
		</Box>
	);
}

export default Application;

function MenuComponent({ link, onOpen, index, id }) {
	const [anchorEl, setAnchorEl] = useState(null);

	const queryClient = useQueryClient();

	const open = Boolean(anchorEl);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const deleteApplicationMutation = useMutation({
		mutationFn: () => deleteApplication(id),
		onSuccess: () => {
			queryClient.invalidateQueries(["applications"]);
		},
	});

	function handleDelete() {
		deleteApplicationMutation.mutate();
		toast.success("Application deleted");
		handleClose();
	}

	return (
		<Box sx={{ marginLeft: "auto" }}>
			<Button
				aria-controls={open ? "basic-menu" : undefined}
				aria-haspopup="true"
				aria-expanded={open ? "true" : undefined}
				onClick={handleClick}
			>
				<MenuIcon />
			</Button>
			<Menu
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
					"aria-labelledby": "basic-button",
				}}
			>
				<MenuItem onClick={handleClose}>
					<a
						href={link}
						style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
						target="_blank"
					>
						<OpenInNewIcon />
						Link
					</a>
				</MenuItem>
				<MenuItem
					onClick={() => {
						handleClose();
						onOpen(index);
					}}
					sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
				>
					<EditIcon />
					Edit
				</MenuItem>
				<MenuItem
					onClick={handleDelete}
					sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
				>
					<DeleteIcon />
					Delete
				</MenuItem>
			</Menu>
		</Box>
	);
}
