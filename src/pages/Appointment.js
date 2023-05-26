import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Calendar from '../utils/Calendar';
import Header from '../utils/Header';
import TextField from '@mui/material/TextField';
import Textarea from '@mui/joy/Textarea';
import Button from '@mui/material/Button';
import { v4 as uuidv4 } from 'uuid';

export default function Appointment() {
  const [selectedDate, setSelectedDate] = useState(null);
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
          setUnavailableDates(response.data);
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
    try {
      const url = 'http://localhost/appointment_api/submit_appointment.php';

      let fData = new FormData();
      fData.append('UID', UID);
      fData.append('fullName', fullName);
      fData.append('department', department);
      fData.append('personnel', personnel);
      fData.append('purpose', purpose);
      fData.append('selectedDate', selectedDate);
      fData.append('selectedTime', selectedTime);

      const response = await axios.post(url, fData);
      if (response.data.message === 'success') {
        alert('You have submitted your appointment!');
      } else {
        alert(response.data);
      }
    } catch (e) {
      alert(e);
    }
  };

  useEffect(() =>{
    const fetchData = async () =>{
        const url = "http://localhost/appointment_api/read_departments.php";
        const response = await axios.get(url);
        if(Array.isArray(response.data)){
            setDepartments(response.data);
        }
    }
    fetchData();
  },[])

  return (
    <div className="global_container">
      <Header />
      <div className="appointment_container">
        <div className="child1">
          <TextField
            onChange={e => setFullName(e.target.value)}
            id="outlined-basic"
            label="Full Name"
            variant="outlined"
          />
        </div>
        <div className="child2">
            <select value={department} onChange={(e) => setDepartment(e.target.value)}>
                <option>--Select Department--</option>
                {departments.map((department, index) => (
                <option key={index}>{department}</option>
                ))}
            </select>
        </div>
        <div className="child3">
          <TextField
            onChange={e => setPersonnel(e.target.value)}
            id="outlined-basic"
            label="Personnel"
            variant="outlined"
          />
        </div>
        <div className="child4">
          <Textarea
            onChange={e => setPurpose(e.target.value)}
            placeholder="Type in here…"
            defaultValue="Try to put text longer than 4 lines."
            minRows={2}
            maxRows={4}
          />
        </div>
        <div className="child5">
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
            className="custom-calendar"
            />
        </div>
        <div className="submitBtn">
          <Button onClick={submitAppointment} variant="contained">
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
