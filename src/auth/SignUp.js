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

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [unavailableDates, setUnavailableDates] = React.useState([]);

  const theme = createTheme();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/Appointment");
    }
  }, [navigate]);

  useEffect(() => {
    // Fetch or set the unavailable dates from your data source
    const data = [
      // '2023-05-24',
      // '2023-05-28',
      // '2023-05-29',
    ];
    setUnavailableDates(data);
  }, []);

  const SignUp = async () => {
    const url = 'http://localhost/appointment_api/SignIn.php';

    let fData = new FormData();
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
          unavailableDates={unavailableDates}
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
