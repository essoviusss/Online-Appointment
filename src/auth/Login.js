import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from '@mui/material/Modal';
import Link from '@mui/material/Link';


import './auth_components/Login.css'
import Calendar from '../utils/Calendar';

const theme = createTheme();

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [availableDates, setAvailableDates] = React.useState([]);
  const [unavailableDates, setUnavailableDates] = React.useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/Appointment");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = "http://localhost/appointment_api/unavailable_dates.php";
        const response = await axios.get(url);
        if (Array.isArray(response.data)) {
          setUnavailableDates(response.data.map(dateObj => dateObj.unavailable_date));
        }
      } catch (e) {
        alert(e);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = "http://localhost/appointment_api/available_dates.php";
        const response = await axios.get(url);
        if (Array.isArray(response.data)) {
          const timeSlots = response.data.map(dateObj => ({
            date: dateObj.available_date,
            start_time: dateObj.start_time,
            end_time: dateObj.end_time
          }));
          setAvailableDates(response.data.map(dateObj => dateObj.available_date));
          setAvailableTimeSlots(timeSlots);
        }
      } catch (e) {
        alert(e);
      }
    }
    fetchData();
  }, []);

  const handleTimeSlotClick = timeSlot => {
    setSelectedTimeSlot(timeSlot);
  };

  const signIn = async () => {
    const url = "http://localhost/appointment_api/login.php";

    let fData = new FormData();
    fData.append("email", email);
    fData.append("password", password);

    try {
      const response = await axios.post(url, fData);

      if (response.data.message !== "Success") {
        alert("Login failed:", response.data.message);
        return;
      }

      // Save the JWT token in the local storage
      const jwtToken = await response.data.token;
      const UID = await response.data.UID;

      if (response.data.message === "Success") {
        alert("Login Successful");
        localStorage.setItem("token", jwtToken);
        localStorage.setItem("UID", UID);
        console.log(UID);
        navigate("/Appointment", { replace: true });
      } else {
        alert("User does not exist");
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error);
    }
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setPasswordResetSuccess(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className='login-container'>
        <div className='column-left'>
          <Calendar
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
            availableDates={availableDates}
            unavailableDates={unavailableDates}
            availableTimeSlots={availableTimeSlots}
            handleTimeSlotClick={handleTimeSlotClick}
            selectedTimeSlot={selectedTimeSlot}
          />
        </div>
        <div className='column-right'>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                
              }}
            >
              <img
              src="/images/logo.png"
              alt="logo"
              style={{ height: '70px', marginRight: '8px', marginBottom: '20px' }}
              />
              <Typography component="h1" variant="h5">
                ONLINE APPOINTMENT SYSTEM
              </Typography>
              <TextField
                onChange={e => setEmail(e.target.value)}
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                onChange={e => setPassword(e.target.value)}
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <div className='fp-cont'>
                <div className='fp'>
                  <Button onClick={openModal} variant="text">
                    Forgot Password
                  </Button>
                </div>
              </div>
              <Button
                onClick={signIn}
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 2, mb: 2 }}
              >
                Login
              </Button>
              <Button onClick={() => navigate("/SignUp")} variant="text">Don't have an account? SignUp</Button>
            </Box>
          </Container>
        </div>
      </div>
      <Modal
        open={showModal}
        onClose={closeModal}
        aria-labelledby="forgot-password-modal"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2">
            Forgot Password
          </Typography>
          {passwordResetSuccess ? (
            <Typography variant="body1" component="p">
              Password reset email sent successfully! Please check your inbox.
            </Typography>
          ) : (
            <Typography variant="body1" component="p" fullWidth>
              Please contact support for password reset.
              <Link href="mailto:depedregionaloffice01@gmail.com" underline="always" color="primary">
                depedregionaloffice01@gmail.com
              </Link>
            </Typography>
          )}
        </Box>
      </Modal>
    </ThemeProvider>
  );
}
