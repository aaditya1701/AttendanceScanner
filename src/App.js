import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import StartAttendanceScanner from './components/AttendanceScanner/StartAttendanceScanner';
import EndAttendanceScanner from './components/AttendanceScanner/EndAttendanceScanner';
import AdminPage from './components/AdminPage/AdminPage';
import AdminLogin from './components/AdminLogin/AdminLogin';
import StartEventQr from './components/EventQr/StartEventQr'; // Import StartEventQr
import EndEventQr from './components/EventQr/EndEventQr'; // Import EndEventQr
import './App.css'; // Add your global styles if needed

const App = () => {
  const isAdminLoggedIn = localStorage.getItem('adminLoggedIn');

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/EventStart" element={<StartAttendanceScanner />} />
          <Route path="/EventEnd" element={<EndAttendanceScanner />} />
          <Route path="/Admin" element={isAdminLoggedIn ? <AdminPage /> : <Navigate to="/AdminLogin" />} />
          <Route path="/StartEventQr" element={isAdminLoggedIn ? <StartEventQr /> : <Navigate to="/AdminLogin" />} />
          <Route path="/EndEventQr" element={isAdminLoggedIn ? <EndEventQr /> : <Navigate to="/AdminLogin" />} />
          <Route path="/AdminLogin" element={<AdminLogin />} />
          <Route path="/" element={<h1>Welcome to the Attendance App</h1>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;