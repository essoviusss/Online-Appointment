import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Calendar from '../utils/Calendar';
import Header from '../utils/Header';
import TextField from '@mui/material/TextField';
import Textarea from '@mui/joy/Textarea';
import Button from '@mui/material/Button';
import { v4 as uuidv4 } from 'uuid';
import './Components/Appointment.css';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import useAuth from '../hooks/useAuth';

export default function Appointment() {
  const navigate = useNavigate();
  const isLoggedIn = useAuth(); 
  const [selectedDate, setSelectedDate] = useState('');
  const [availableDates, setAvailableDates] = useState([]);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [departments, setDepartments] = useState([]);

  // Appointment data
  const UID = uuidv4();
  const [fullName, setFullName] = useState('');
  const [department, setDepartment] = useState('');
  const [personnel, setPersonnel] = useState('');
  const [purpose, setPurpose] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');

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
    const url = 'http://localhost/appointment_api/available_dates.php';
    axios
      .get(url)
      .then(response => {
        if (Array.isArray(response.data)) {
          const timeSlots = response.data.map(dateObj => ({
            date: dateObj.available_date,
            start_time: dateObj.start_time,
            end_time: dateObj.end_time
          }));
          setAvailableDates(response.data.map(dateObj => dateObj.available_date));
          setAvailableTimeSlots(timeSlots);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    const url = 'http://localhost/appointment_api/unavailable_dates.php';
    axios
      .get(url)
      .then(response => {
        if (Array.isArray(response.data)) {
          setUnavailableDates(response.data.map(dateObj => dateObj.unavailable_date));
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleTimeSlotClick = timeSlot => {
    setSelectedTimeSlot(timeSlot);
  };

  const submitAppointment = async () => {
    if(fullName === "" || department === "" || personnel === "" || purpose === "" || selectedDate === "" ||selectedTime === ""){
      alert("Please Input all the Fields!");
    }else{
      try {
        const url = 'http://localhost/appointment_api/submit_appointment.php';
        const user_id = localStorage.getItem('UID');
  
        let fData = new FormData();
        fData.append('UID', UID);
        fData.append('user_id', user_id);
        fData.append('fullName', fullName);
        fData.append('department', department);
        fData.append('personnel', personnel);
        fData.append('purpose', purpose);
        fData.append('selectedDate', selectedDate);
        fData.append('selectedTime', selectedTime);
  
        const response = await axios.post(url, fData);
        if (response.data.message === 'success') {
          alert('You have submitted your appointment!');
          navigate("/ViewAppointment");
        } else {
          alert(response.data);
        }
      } catch (e) {
        alert(e);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const url = 'http://localhost/appointment_api/read_departments.php';
      const response = await axios.get(url);
      if (Array.isArray(response.data)) {
        setDepartments(response.data);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="global_container">
      <Header />
      <div className="appointment_container">
        <div className="form_container">
          <div className="form_field">
            <TextField
              onChange={e => setFullName(e.target.value)}
              id="outlined-basic"
              label="Full Name"
              variant="outlined"
              fullWidth
            />
          </div>
          <div className="form_field">
            <TextField
              onChange={e => setPersonnel(e.target.value)}
              id="outlined-basic"
              label="Personnel"
              variant="outlined"
              fullWidth
            />
          </div>
        </div>
        <div className='below-cont'>
            <div className="form_field2">
              <TextField
                value={selectedDate}
                id="outlined-basic"
                label="Selected Date"
                variant="outlined"
                fullWidth
                InputProps={{
                  readOnly: true
                }}
              />
            </div>
            <div className="form_field2">
              <TextField
                value={selectedTime}
                id="outlined-basic"
                label="Selected Time"
                variant="outlined"
                fullWidth
                InputProps={{
                  readOnly: true
                }}
              />
            </div>
          <div className="form_field1">
            <FormControl fullWidth>
              <InputLabel id="department-label">Department</InputLabel>
              <Select
                labelId="department-label"
                id="department-select"
                value={department}
                label="Department"
                onChange={e => setDepartment(e.target.value)}
              >
                {departments.map((department, index) => (
                  <MenuItem key={index} value={department}>{department}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
        <div className='below-cont1'>
          <div className="form_field3">
            <Calendar
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              setSelectedTime={setSelectedTime}
              availableDates={availableDates}
              unavailableDates={unavailableDates}
              availableTimeSlots={availableTimeSlots}
              handleTimeSlotClick={handleTimeSlotClick}
              selectedTimeSlot={selectedTimeSlot}
              className="custom-calendar"
            />
          </div>
          <div className="form_field3">
            <Textarea
              onChange={e => setPurpose(e.target.value)}
              placeholder="Purpose…"
              minRows={11.9}
              maxRows={11.9}
            />
          </div>
        </div>
        <div className='below-cont2'>
          <div className="form_field4">
            <Button onClick={submitAppointment} variant="contained" fullWidth>
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
