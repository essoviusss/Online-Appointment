import React, { useState } from 'react';
import './Calendar_components/Calendar.css';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';

export default function Calendar(
  { 
    selectedDate, 
    setSelectedDate,
    setSelectedTime, 
    unavailableDates = [], 
    availableDates = [], 
    availableTimeSlots = [], 
    className = '', 
  }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedDateModal, setSelectedDateModal] = useState(null);
  const [selectedStartTime, setSelectedStartTime] = useState(null);
  const [selectedEndTime, setSelectedEndTime] = useState(null);
  const [confirmTime, setConfirmTime] = useState(null);

  const token = localStorage.getItem("token");

  const handleDateClick = (date) => {
    if (isDateAvailable(date)) {
      const dateString = `${date.getFullYear()}-${('0' + (date.getMonth()+1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
      if (dateString === selectedDate) {
        setSelectedDate('');
        setSelectedStartTime(null);
        setSelectedEndTime(null);
      } else {
        setSelectedDate(dateString);
        showTimeModal(date);
      }
    }
  };
  
  

  const isDateAvailable = (date) => {
    const dateString = `${date.getFullYear()}-${('0' + (date.getMonth()+1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
    return availableDates.includes(dateString);
  };

  const isDateUnavailable = (date) => {
    const dateString = `${date.getFullYear()}-${('0' + (date.getMonth()+1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
    return unavailableDates.includes(dateString);
  };

  const changeMonth = (offset) => {
    let newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
    setCurrentDate(newDate);
  };

  const showTimeModal = (date) => {
    const dateString = `${date.getFullYear()}-${('0' + (date.getMonth()+1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
    setSelectedDateModal(dateString);

    // Find the selected date's time slot
    const selectedTimeSlot = availableTimeSlots.find(timeSlot => timeSlot.date === dateString);
    if (selectedTimeSlot) {
      setSelectedStartTime(selectedTimeSlot.start_time);
      setSelectedEndTime(selectedTimeSlot.end_time);
    }

    setShowModal(true);
  };

  const TimeModal = () => {
    const handleClose = () => {
      setShowModal(false);
      setSelectedDate('');
    };
  
    const handleTimeChange = (time) => {
      if (time) setConfirmTime(time);
    };
  
    const handleConfirmTime = () => {
      if (confirmTime) {
        const selectedTime = confirmTime.toISOString();
        const phTime = new Date(selectedTime).toLocaleTimeString('en-PH', { timeZone: 'Asia/Manila', hour: '2-digit', minute: '2-digit' }); 
        setSelectedTime(phTime);
        setSelectedDate(selectedDateModal);
      }
      setShowModal(false);
      setConfirmTime(null);
    };
  
    return (
      <Dialog open={showModal} onClose={handleClose}>
        <DialogTitle>Available Time Slot</DialogTitle>
        <DialogContent>
          {selectedStartTime && selectedEndTime ? (
            token ? (
              <DialogContentText>
                {selectedStartTime} - {selectedEndTime}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['TimePicker']}>
                    <TimePicker
                      label="Select Time"
                      value={confirmTime ? dayjs(confirmTime) : null}
                      onAccept={handleTimeChange}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </DialogContentText>
            ) : (
              <div>
                {selectedStartTime} - {selectedEndTime}
                <DialogContentText></DialogContentText>
                <DialogContentText>Login to select time!</DialogContentText>
              </div>
            )
          ) : (
            <DialogContentText>No available time slot for {selectedDateModal}</DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          {token && <Button onClick={handleConfirmTime}>Confirm</Button>}
        </DialogActions>
      </Dialog>
    );
  };

  const renderCalendar = () => {
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const month = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const days = new Array(42).fill(null);

    for (let i = 0; i < daysInMonth; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1);
      days[i + firstDayOfMonth] = date;
    }

    // eslint-disable-next-line
    const daysInPreviousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
    for (let i = 0; i < firstDayOfMonth; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i - firstDayOfMonth);
      days[i] = date;
    }

    for (let i = firstDayOfMonth + daysInMonth; i < 42; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i - firstDayOfMonth + 1);
      days[i] = date;
    }

    return (
      <div className={`calendar ${className}`}>
        <div className="calendar-header">
          <button onClick={() => changeMonth(-1)}>Prev</button>
          <span>{month} {year}</span>
          <button onClick={() => changeMonth(1)}>Next</button>
        </div>
        <div className="calendar-body">
          {dayNames.map((name, index) => (
            <div key={index} className="calendar-dayname">{name}</div>
          ))}
          {days.map((date, index) => {
            const dateString = `${date.getFullYear()}-${('0' + (date.getMonth()+1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
            const dayClasses = ['calendar-day'];
            if (date.getMonth() !== currentDate.getMonth()) {
              dayClasses.push('other-month');
              if (date.getDay() === 0 || date.getDay() === 6) {
                dayClasses.push('other-month-weekend');
              }
            } else {
              if (date.getDay() === 0 || date.getDay() === 6) {
                dayClasses.push('weekend');
              }
            }
            if (dateString === selectedDate) {
              dayClasses.push('selected');
            }
            if (isDateAvailable(date)) {
              dayClasses.push('available');
            }
            if (isDateUnavailable(date)) {
              dayClasses.push('unavailable');
            }
            return (
              <div
                key={index}
                className={dayClasses.join(' ')}
                onClick={() => handleDateClick(date)}
              >
                {date.getDate()}
              </div>
            );
          })}
        </div>
        {showModal && <TimeModal />}
      </div>
    );
  };

  return renderCalendar();
}
