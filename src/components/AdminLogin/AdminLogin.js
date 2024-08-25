import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import './AdminLogin.css';

const AdminLogin = () => {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const docRef = doc(db, 'settings', 'credentials');
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.userId === userId && data.password === password) {
                        localStorage.setItem('adminLoggedIn', 'true');
                        navigate('/admin');                        
                }
                else {
                    setError('Invalid credentials');
                }
            } else {
                setError('Credentials not found');
            }
        } catch (error) {
            setError('Error connecting to the database');
        }
    };

    return (
        <div className="admin-login">
            <form onSubmit={handleLogin}>
                <h1>Admin Login</h1>
                <div>
                    <label htmlFor="userId">User ID:</label>
                    <input
                        type="text"
                        id="userId"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
};

export default AdminLogin;
