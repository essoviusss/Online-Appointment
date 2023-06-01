import React from 'react';
import { Modal, Box, TextField, Button } from '@mui/material';

const CancelAppointmentModal = ({ open, onClose, cancelReason, setCancelReason, handleCancelAppointment }) => {
  return (
    <Modal open={open} onClose={onClose}>
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
        <h2>Cancel Appointment</h2>
        <TextField
          label="Cancellation Reason"
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
          multiline
          rows={4}
          fullWidth
          sx={{ marginBottom: '20px' }}
        />
        <Button variant="contained" onClick={handleCancelAppointment}>Submit</Button>
      </Box>
    </Modal>
  );
};

export default CancelAppointmentModal;
