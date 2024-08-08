import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import qrCode from '../../assets/Event-Start.png';
import './EventQr.css';

const StartEventQr = () => {
    const [timer, setTimer] = useState(900);
    // const [captcha, setCaptcha] = useState('');
    const [imageUrl] = useState(qrCode); // Replace with actual image path

    useEffect(() => {
        // Generate a random captcha
        // const generateCaptcha = () => {
        //     const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        //     let captchaStr = '';
        //     for (let i = 0; i < 6; i++) {
        //         captchaStr += chars.charAt(Math.floor(Math.random() * chars.length));
        //     }
        //     return captchaStr;
        // };

        const updateToggleState = async () => {
            const docRef = doc(db, 'settings', 'attendanceControl');
            await setDoc(docRef, { toggleState: true, timestamp: serverTimestamp(), }, { merge: true });
        };

        // const fetchCaptcha = async () => {
        //     const docRef = doc(db, 'settings', 'attendanceControl');
        //     const docSnap = await getDoc(docRef);
        //     if (docSnap.exists()) {
        //         const data = docSnap.data();
        //         // setCaptcha(data.captcha || ''); // Fetch and set captcha from Firestore
        //     }
        // };

        updateToggleState();
        // fetchCaptcha();

        const interval = setInterval(() => {
            setTimer(prevTimer => {
                if (prevTimer <= 1) {
                    clearInterval(interval);
                    updateToggleStateToNull(); // Set toggleState to null when timer ends
                    return 0;
                }
                return prevTimer - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const updateToggleStateToNull = async () => {
        const docRef = doc(db, 'settings', 'attendanceControl');
        await setDoc(docRef, { toggleState: null }, { merge: true });
    };

    return (
        <div className="event-qr-page">
            <h1 align='center'>Event Start</h1>
            <div className='qrContainer'>
                <div className='leftDiv'>
                    <img src={imageUrl} alt="Event QR" className='qr' />
                </div>
                <div className='rightDiv'>
                    <p>
                        {/* Captcha: {captcha}  <br></br> */}
                        Time Remaining: {Math.floor(timer / 60) + " min " + timer % 60 + " sec"}</p>
                </div>
            </div>
        </div>
    );
};

export default StartEventQr;
