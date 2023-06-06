import React, { useEffect, useState } from 'react';
import axios from "axios";
import Header from "../utils/Header";
import { Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Modal, Box, FormControl, Button, Typography, TextareaAutosize } from '@mui/material';
import './Components/ViewAppointment.css';

import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import useAuth from '../hooks/useAuth';

const ViewAppointment = () => {
    const navigate = useNavigate();
    const isLoggedIn = useAuth(); 
    const [appointments, setAppointments] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [cancelReason, setCancelReason] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);


    useEffect(() => {
        const token = localStorage.getItem("token");
    
        if (token) {
            const decodedToken = jwtDecode(token);
            const currentTime = Math.floor(Date.now() / 1000); // get the current time
            if (currentTime > decodedToken.exp) {
                localStorage.removeItem("token");
                alert("Token expired, please login again");
                navigate('/');
            }
        } else if (!isLoggedIn) {
            navigate('/');
        }
    }, [isLoggedIn, navigate]);

    useEffect(() => {
        const fetchData = async () => {
            const UID = localStorage.getItem("UID");
            try {
                const url = "http://localhost/appointment_api/read_appointments.php";

                let fData = new FormData();
                fData.append("UID", UID);

                const response = await axios.post(url, fData);
                if (Array.isArray(response.data)) {
                    setAppointments(response.data);
                }
            } catch (e) {
                alert(e);
            }
        };
        fetchData();
    }, [appointments]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setPage(0);
    };

    const handleOpenModal = (appointment) => {
        setSelectedAppointment(appointment);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleOpenViewModal = (appointment) => {
        setSelectedAppointment(appointment);
        setViewModalOpen(true);
    };

    const handleCloseViewModal = () => {
        setViewModalOpen(false);
    };

    const handleCancelAppointment = async () => {
        try {
            const url = "http://localhost/appointment_api_admin/cancel_status.php";
            let fData = new FormData();
            fData.append("id", selectedAppointment.appointment_id);
            fData.append("reason", cancelReason);

            const response = await axios.post(url, fData);

            if (response.data.message === "Success") {
                alert("Appointment cancelled successfully!");
            } else {
                alert("Error cancelling appointment!");
            }
            handleCloseModal();
        } catch (e) {
            alert(e);
        }
    };

    const filteredAppointments = appointments.filter(appointment =>
        appointment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.personnel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.selectedDate.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.selected_time.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.status.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, filteredAppointments.length - page * rowsPerPage);

    return (
        <div>
            <Header />
            <div className='main-cont'>
                <div className='search'>
                    <TextField
                        label="Search"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        fullWidth
                    />
                </div>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ backgroundColor: 'lightblue', textAlign: 'center', fontWeight: 'bold' }}>Name</TableCell>
                                <TableCell style={{ backgroundColor: 'lightblue', textAlign: 'center', fontWeight: 'bold' }}>Department</TableCell>
                                <TableCell style={{ backgroundColor: 'lightblue', textAlign: 'center', fontWeight: 'bold' }}>Selected Date</TableCell>
                                <TableCell style={{ backgroundColor: 'lightblue', textAlign: 'center', fontWeight: 'bold' }}>Selected Time</TableCell>
                                <TableCell style={{ backgroundColor: 'lightblue', textAlign: 'center', fontWeight: 'bold' }}>Status</TableCell>
                                <TableCell style={{ backgroundColor: 'lightblue', textAlign: 'center', fontWeight: 'bold' }}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(rowsPerPage > 0
                                ? filteredAppointments.slice(
                                    page * rowsPerPage,
                                    page * rowsPerPage + rowsPerPage
                                )
                                : filteredAppointments
                            ).map((appointment) => (
                                <TableRow key={appointment.id}>
                                    <TableCell style={{ textAlign: 'center' }}>{appointment.name}</TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>{appointment.department}</TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>{appointment.selectedDate}</TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>{appointment.selected_time}</TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>{appointment.status}</TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>
                                        <Button onClick={() => handleOpenViewModal(appointment)}>View</Button>
                                        {appointment.status === "Approved" || appointment.status === "Rescheduled" || appointment.status === "Cancelled" ? "" : <Button onClick={() => handleOpenModal(appointment)}>Cancel</Button>}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 53 * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 7]}
                    component="div"
                    count={filteredAppointments.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </div>
            <Modal open={openModal} onClose={handleCloseModal}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography variant="h6" component="h2" gutterBottom>
                        Cancel Appointment
                    </Typography>
                    <FormControl fullWidth>
                        <TextareaAutosize
                            id="cancel-reason"
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            minRows={3}
                            placeholder="Enter cancellation reason"
                            style={{ width: '100%', resize: 'none', marginBottom: '5%' }}
                        />
                        <Button variant="contained" onClick={handleCancelAppointment}>Submit</Button>
                    </FormControl>
                </Box>
            </Modal>
            <Modal open={viewModalOpen} onClose={handleCloseViewModal}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography variant="h6" component="h2" gutterBottom>
                        View Appointment
                    </Typography>
                    {selectedAppointment && (
                        <div>
                            <Typography variant="subtitle1" gutterBottom>
                                Name: {selectedAppointment.name}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                Department: {selectedAppointment.department}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                Selected Date: {selectedAppointment.selectedDate}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                Selected Time: {selectedAppointment.selected_time}
                            </Typography>
                            
                            <Typography variant="subtitle1" gutterBottom>
                                Reason: {selectedAppointment.reason}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                Status: {selectedAppointment.status}
                            </Typography>
                            {/* Display other appointment data as needed */}
                        </div>
                    )}
                </Box>
            </Modal>
        </div>
    );
};

export default ViewAppointment;
