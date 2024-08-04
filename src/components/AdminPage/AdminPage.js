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

    const handleToggle = useCallback(async () => {
        const newToggleState = !toggleState;
        setToggleState(newToggleState);

        const docRef = doc(db, 'settings', 'attendanceControl');
        if (newToggleState) {
            await setDoc(docRef, { toggleState: true, timestamp: serverTimestamp() }, { merge: true });
            setTimer(15); // Set timer for 15 seconds (for development)
        } else {
            await setDoc(docRef, { toggleState: false, timestamp: null }, { merge: true });
            setTimer(null);
        }
    }, [toggleState]);

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
                        await handleToggle(); // Turn off the toggle if the time has passed
                    }
                }
            }
        };

        fetchToggleState();
    }, [handleToggle]);

    useEffect(() => {
        if (timer !== null && timer > 0) {
            const interval = setInterval(() => {
                setTimer((prevTimer) => {
                    if (prevTimer <= 1) {
                        clearInterval(interval);
                        handleToggle(); // Turn off the toggle automatically
                        return 0;
                    }
                    return prevTimer - 1;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [timer, handleToggle]);

    return (
        <div className="admin-page">
            <h1>Admin Page</h1>
            <label className="switch">
                <input type="checkbox" checked={toggleState} onChange={handleToggle} />
                <span className="slider"></span>
            </label>
            <p>{toggleState ? "Updates are allowed" : "Updates are blocked"}</p>
            {toggleState && timer !== null && <p>Auto-turn off in: {timer}s</p>}
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default AdminPage;
