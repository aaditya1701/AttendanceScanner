import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import './AdminPage.css';

const AdminPage = () => {
    const [toggleState, setToggleState] = useState(false);
    const [timer, setTimer] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in
        const loggedIn = localStorage.getItem('adminLoggedIn');
        if (!loggedIn) {
            navigate('/AdminLogin');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('adminLoggedIn');
        navigate('/AdminLogin');
    };

    useEffect(() => {
        const fetchToggleState = async () => {
            const docRef = doc(db, 'settings', 'attendanceControl');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setToggleState(data.toggleState || false);
                if (data.timestamp) {
                    const now = new Date();
                    const timestamp = data.timestamp.toDate(); // Convert Firestore Timestamp to JavaScript Date
                    const elapsedSeconds = Math.floor((now - timestamp) / 1000);
                    if (elapsedSeconds < 15) {
                        setTimer(15 - elapsedSeconds);
                    } else {
                        setToggleState(false); // Turn off the toggle automatically if time has passed
                        setTimer(null);
                    }
                }
            }
        };

        fetchToggleState();
    }, []);

    return (
        <div className="admin-page">
            <h1>Admin Page</h1>
            <button onClick={() => navigate('/StartEventQr')}>Start Event QR</button>
            <button onClick={() => navigate('/EndEventQr')}>End Event QR</button>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default AdminPage;
