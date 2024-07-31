import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { collection, query, where, getDocs, updateDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import './AttendanceScanner.css';

const EndAttendanceScanner = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const [toggleState, setToggleState] = useState(false);
    const [toggleTimestamp, setToggleTimestamp] = useState(null);

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, 'settings', 'attendanceControl'), (doc) => {
            const data = doc.data();
            setToggleState(data.toggleState);
            setToggleTimestamp(data.timestamp ? data.timestamp.toDate() : null);
        });

        return () => unsubscribe();
    }, []);

    const handleChange = (event) => {
        setEmail(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!toggleState) {
            setError('Updates are blocked by the admin.');
            return;
        }

        const currentTime = new Date();
        const timeDiff = (currentTime - toggleTimestamp) / 1000; // Time in seconds

        if (timeDiff > 15) { // 15 seconds for development
            setError('The toggle state has expired.');
            return;
        }

        if (Cookies.get('endAttendanceMarked')) {
            setError('Attendance already marked.');
            return;
        }

        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', email));

        try {
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                await updateDoc(doc(db, 'users', userDoc.id), {
                    endFlag: true
                });

                Cookies.set('endAttendanceMarked', 'true', { expires: 1 });
                alert('Attendance marked successfully!');
            } else {
                setError('Email not found.');
            }
        } catch (error) {
            setError('Error updating attendance: ' + error.message);
        }
    };

    return (
        <div>
            <h1>Event End</h1>
            <form onSubmit={handleSubmit} className="attendance-form">
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Submit</button>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
};

export default EndAttendanceScanner;
