import Cookies from 'js-cookie';
import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import './AttendanceScanner.css';

const StartAttendanceScanner = () => {
    const [email, setEmail] = useState('');
    const [captcha, setCaptcha] = useState('');
    const [dbCaptcha, setDbCaptcha] = useState('');
    const [error, setError] = useState(null);
    const [toggleState, setToggleState] = useState(false);

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, 'settings', 'attendanceControl'), (doc) => {
            const data = doc.data();
            setToggleState(data.toggleState);
            setDbCaptcha(data.captcha);
        });

        return () => unsubscribe();
    }, []);

    const handleChange = (event) => {
        setEmail(event.target.value);
    };

    const handleCaptchaChange = (event) => {
        setCaptcha(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null); // Clear previous error messages

        if (!toggleState) {
            setError('Time limit exceded');
            return;
        }

        if (captcha !== dbCaptcha) {
            setError('CAPTCHA is incorrect.');
            return;
        }

        if (Cookies.get('startAttendanceMarked')) {
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
                    startFlag: true
                });

                Cookies.set('startAttendanceMarked', 'true', { expires: 1 });
                alert('Attendance marked successfully!');
            } else {
                setError('Email not found.');
            }
        } catch (error) {
            console.log('Error updating attendance: ' + error.message);
        }
    };

    return (
        <div>
            <h1 align="center">Bad Talks</h1>
            <h2>Event Start</h2>
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
                    <label htmlFor="captcha">CAPTCHA:</label>
                    <input
                        type="text"
                        id="captcha"
                        value={captcha}
                        onChange={handleCaptchaChange}
                        required
                    />
                </div>
                <button type="submit">Submit</button>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
};

export default StartAttendanceScanner;
