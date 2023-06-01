import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Calendar from '../utils/Calendar';
import './auth_components/Login.css'
import { v4 as uuidv4 } from 'uuid';

export default function SignUp() {
  const UID = uuidv4();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [availableDates, setAvailableDates] = React.useState([]);
  const [unavailableDates, setUnavailableDates] = React.useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  const theme = createTheme();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/Appointment");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try{
        const url = "http://localhost/appointment_api/unavailable_dates.php";
        const response = await axios.get(url);
        if(Array.isArray(response.data)){
          setUnavailableDates(response.data.map(dateObj => dateObj.unavailable_date));
        }
      }catch(e){
        alert(e);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try{
        const url = "http://localhost/appointment_api/available_dates.php";
        const response = await axios.get(url);
        if(Array.isArray(response.data)){
          const timeSlots = response.data.map(dateObj => ({
            date: dateObj.available_date,
            start_time: dateObj.start_time,
            end_time: dateObj.end_time
          }));
          setAvailableDates(response.data.map(dateObj => dateObj.available_date));
          setAvailableTimeSlots(timeSlots);
        }
      }catch(e){
        alert(e);
      }
    }
    fetchData();
  }, []);

  const handleTimeSlotClick = timeSlot => {
    setSelectedTimeSlot(timeSlot);
  };

  const SignUp = async () => {
    const url = 'http://localhost/appointment_api/SignIn.php';

    let fData = new FormData();
    fData.append('UID', UID);
    fData.append('email', email);
    fData.append('password', password);
    fData.append('confirmPassword', confirmPassword);

    try {
      const response = await axios.post(url, fData);
      if (response.data.message === 'Success') {
        alert('User has been registered!');
        navigate('/');
      } else{
        alert(response.data.message);
      }
    } catch (e) {
      alert(e);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="login-container">
        <div className="column-left">
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
        <div className="column-right">
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
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                APPOINTMENT SYSTEM
              </Typography>
              <TextField
                onChange={(e) => setEmail(e.target.value)}
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
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <TextField
                onChange={(e) => setConfirmPassword(e.target.value)}
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <Button
                onClick={SignUp}
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                SignUp
              </Button>
              <Button onClick={() => navigate('/')} variant="text">
                Already have an account? Login
              </Button>
            </Box>
          </Container>
        </div>
      </div>
    </ThemeProvider>
  );
}
