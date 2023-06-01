import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const ViewAppointmentModal = ({ selectedAppointment, onClose }) => {
    return (
        <Modal
            open={selectedAppointment !== null}
            onClose={onClose}
            aria-labelledby="view-appointment-modal"
            aria-describedby="view-appointment-modal-description"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
            }}>
                <Typography variant="h6" id="view-appointment-modal" component="div">
                    <h2>View Appointment</h2>
                </Typography>
                {selectedAppointment && (
                    <div>
                        <Typography variant="body1" id="view-appointment-modal-description">
                            Name: {selectedAppointment.name}
                        </Typography>
                        <Typography variant="body1" id="view-appointment-modal-description">
                            Purpose: {selectedAppointment.purpose}
                        </Typography>
                        <Typography variant="body1" id="view-appointment-modal-description">
                            Department: {selectedAppointment.department}
                        </Typography>
                        <Typography variant="body1" id="view-appointment-modal-description">
                            Personnel: {selectedAppointment.personnel}
                        </Typography>
                        <Typography variant="body1" id="view-appointment-modal-description">
                            Selected Date: {selectedAppointment.selectedDate}
                        </Typography>
                        <Typography variant="body1" id="view-appointment-modal-description">
                            Selected Time: {selectedAppointment.selected_time}
                        </Typography>
                        {selectedAppointment.status === "Cancelled" 
                        || selectedAppointment.status === "Rescheduled" ? 
                        <Typography variant="body1" id="view-appointment-modal-description">
                            Reason: {selectedAppointment.reason}
                        </Typography> : ""}
                        <Typography variant="body1" id="view-appointment-modal-description">
                            Status: {selectedAppointment.status}
                        </Typography>
                    </div>
                )}
            </Box>
        </Modal>
    );
};

export default ViewAppointmentModal;
