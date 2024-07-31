import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StartAttendanceScanner from './components/AttendanceScanner/StartAttendanceScanner';
import EndAttendanceScanner from './components/AttendanceScanner/EndAttendanceScanner';
import AdminPage from './components/AdminPage/AdminPage';
import './App.css'; // Add your global styles if needed

const App = () => {
  return (
    <Router>
      <div className="App">

        <Routes>
          <Route path="/EventStart" element={<StartAttendanceScanner />} />
          <Route path="/EventEnd" element={<EndAttendanceScanner />} />
          <Route path="/Admin" element={<AdminPage />} />
          <Route path="/" element={<h1>Welcome to the Attendance App</h1>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
