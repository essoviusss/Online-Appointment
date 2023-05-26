import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Login from './auth/Login';
import Sidebar from './pages/Sidebar';
import SignUp from './auth/SignUp';
import Appointment from './pages/Appointment';
import Calendar from './utils/Calendar';
import ViewAppointment from './pages/ViewAppointment';

// Custom private route component
function PrivateRoute({ element: Element, ...rest }) {
  const token = localStorage.getItem('token'); 

  if (!token) {
    // If no token, navigate to the login page
    return <Navigate to="/" />;
  }

  // If token exists, render the component
  return <Element {...rest} />;
}

function MainContent() {
  const location = useLocation();

  // Render the corresponding components based on the location
  if (location.pathname === '/' || location.pathname === '/SignUp') {
    return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/SignUp" element={<SignUp />} />
      </Routes>
    );
  }

  return (
    <div className="App" style={{ display: 'flex' }}>
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="main-content" style={{ flex: 1 }}>
        <Routes>
          <Route path="/Appointment" element={<PrivateRoute element={Appointment} />} />
          <Route path="/ViewAppointment" element={<PrivateRoute element={ViewAppointment} />} />
          <Route path="/Calendar" element={<PrivateRoute element={Calendar} />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <MainContent />
    </Router>
  );
}

export default App;
