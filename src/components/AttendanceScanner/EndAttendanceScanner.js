import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import './AttendanceScanner.css';

const EndAttendanceScanner = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);

    const handleChange = (event) => {
        setEmail(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

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
