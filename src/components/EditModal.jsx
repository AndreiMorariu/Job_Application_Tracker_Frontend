import { useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import { TextField, InputLabel, MenuItem, Select } from "@mui/material";

import toast, { Toaster } from "react-hot-toast";

import { updateApplication } from "../services/apiApplications";

import { useAuth } from "../context/Auth";

import { formatDate } from "../utils/helperFunctions";
import { applicationStatuses, formStyle } from "../utils/constants";

function EditModal({
	company,
	position,
	status,
	date,
	location,
	link,
	id,
	onClose,
}) {
	const { currentUser } = useAuth();

	const [formData, setFormData] = useState({
		company,
		position,
		status,
		date: formatDate(date),
		location,
		link,
		userId: currentUser.id,
	});
	const [open, setOpen] = useState(true);
	const queryClient = useQueryClient();

	const handleClose = () => {
		setOpen(false);
		onClose();
	};

	const editPostMutation = useMutation({
		mutationFn: () => updateApplication(formData, id),
		onSuccess: () => {
			queryClient.invalidateQueries(["applications"]);
			toast.success("Application edited");
		},
		onError: () => {
			toast.error("Could not edit the application");
		},
	});

	const handleSubmit = (event) => {
		event.preventDefault();
		editPostMutation.mutate();
		handleClose();
	};

	return (
		<Box>
			<Toaster position="top-center" reverseOrder={false} />
			<Modal
				aria-labelledby="transition-modal-title"
				aria-describedby="transition-modal-description"
				open={open}
				onClose={handleClose}
				closeAfterTransition
				slots={{ backdrop: Backdrop }}
				slotProps={{
					backdrop: {
						timeout: 500,
					},
				}}
			>
				<Fade in={open}>
					<Box sx={formStyle} component="form" onSubmit={handleSubmit}>
						<Box marginBottom="1rem">
							<Typography
								id="transition-modal-title"
								variant="h6"
								component="h2"
								marginBottom="1rem"
							>
								Edit application
							</Typography>
							<TextField
								fullWidth
								required
								type="test"
								id="company"
								label="company"
								variant="outlined"
								autoComplete="off"
								value={formData.company}
								onChange={(e) => {
									setFormData({ ...formData, company: e.target.value });
								}}
							/>
						</Box>
						<Box marginBottom="1rem">
							<TextField
								fullWidth
								required
								type="text"
								id="position"
								label="position"
								variant="outlined"
								autoComplete="off"
								value={formData.position}
								onChange={(e) => {
									setFormData({ ...formData, position: e.target.value });
								}}
							/>
						</Box>
						<Box marginBottom="1rem">
							<TextField
								fullWidth
								required
								type="text"
								id="location"
								label="location"
								variant="outlined"
								autoComplete="off"
								value={formData.location}
								onChange={(e) => {
									setFormData({ ...formData, location: e.target.value });
								}}
							/>
						</Box>
						<Box marginBottom="1rem">
							<TextField
								fullWidth
								required
								type="text"
								id="link"
								label="link"
								variant="outlined"
								autoComplete="off"
								value={formData.link}
								onChange={(e) => {
									setFormData({ ...formData, link: e.target.value });
								}}
							/>
						</Box>
						<Box marginBottom="1rem">
							<TextField
								fullWidth
								required
								type="date"
								id="date"
								label="Date"
								variant="outlined"
								autoComplete="off"
								value={formData.date}
								onChange={(e) => {
									setFormData({
										...formData,
										date: e.target.value,
									});
								}}
							/>
						</Box>
						<Box marginBottom="1rem">
							<InputLabel>Status</InputLabel>
							<Select
								required
								value={formData.status}
								onChange={(e) => {
									setFormData({ ...formData, status: e.target.value });
								}}
								fullWidth
							>
								{applicationStatuses.map((status, i) => (
									<MenuItem key={i} value={status}>
										{status}
									</MenuItem>
								))}
							</Select>
						</Box>
						<Button
							variant="contained"
							sx={{ marginLeft: "auto", display: "block" }}
							type="submit"
						>
							Edit
						</Button>
					</Box>
				</Fade>
			</Modal>
		</Box>
	);
}

export default EditModal;
