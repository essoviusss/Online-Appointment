import React, { useEffect, useState } from 'react';
import axios from "axios";
import Header from "../utils/Header";
import { Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import ViewAppointmentModal from './ViewAppointment_Components/ViewAppointmentModal';

const ViewAppointment = () => {
    const [appointments, setAppointments] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedAppointment, setSelectedAppointment] = useState(null);

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
    }, []);

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
    };

    const handleCloseModal = () => {
        setSelectedAppointment(null);
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
            <div>
                <TextField
                    label="Search"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    style={{ marginBottom: 10 }}
                />
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
                                <Button onClick={() => handleOpenModal(appointment)}>View</Button>
                                <Button>Edit</Button>
                                <Button>Cancel</Button>
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
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredAppointments.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </div>
            <ViewAppointmentModal
                selectedAppointment={selectedAppointment}
                onClose={handleCloseModal}
            />
        </div>
    );
};

export default ViewAppointment;
