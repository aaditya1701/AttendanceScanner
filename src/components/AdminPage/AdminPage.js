import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { doc, getDoc, setDoc, serverTimestamp, collection, query, getDocs } from 'firebase/firestore';
import './AdminPage.css';

const AdminPage = () => {
    const [toggleState, setToggleState] = useState(false);
    const [timer, setTimer] = useState(null);
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const loggedIn = localStorage.getItem('adminLoggedIn');
        if (!loggedIn) {
            navigate('/AdminLogin');
        }
    }, [navigate]);

    useEffect(() => {
        const fetchUsers = async () => {
            const usersCollection = collection(db, 'users');
            const usersQuery = query(usersCollection);
            const querySnapshot = await getDocs(usersQuery);
            const usersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsers(usersList);
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        const fetchToggleState = async () => {
            const docRef = doc(db, 'settings', 'attendanceControl');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setToggleState(data.toggleState || false);
                if (data.timestamp) {
                    const now = new Date();
                    const timestamp = data.timestamp.toDate();
                    const elapsedSeconds = Math.floor((now - timestamp) / 1000);
                    if (elapsedSeconds < 15) {
                        setTimer(15 - elapsedSeconds);
                    } else {
                        setToggleState(false);
                        setTimer(null);
                    }
                }
            }
        };

        fetchToggleState();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('adminLoggedIn');
        navigate('/AdminLogin');
    };

    const handleToggleChange = async () => {
        const newToggleState = !toggleState;
        setToggleState(newToggleState);

        const docRef = doc(db, 'settings', 'attendanceControl');
        await setDoc(docRef, {
            toggleState: newToggleState,
            timestamp: newToggleState ? serverTimestamp() : null,
        });
        if (newToggleState) {
            navigate('/StartEventQr');
        } else {
            setTimer(null);
        }
    };

    const handleSwitchChange = async (userId, newValue) => {
        const userRef = doc(db, 'users', userId);
        await setDoc(userRef, {
            startFlag: newValue,
            endFlag: newValue
        }, { merge: true });

        // Update the local state to reflect changes
        setUsers(prevUsers =>
            prevUsers.map(user =>
                user.id === userId ? { ...user, startFlag: newValue, endFlag: newValue } : user
            )
        );
    };

    const filteredUsers = users.filter(user => {
        const lowercasedQuery = searchQuery.toLowerCase();
        const userName = user.name ? user.name.toLowerCase() : (user.firstName + " " + user.lastName).toLowerCase();
        const userEmail = user.email ? user.email.toLowerCase() : '';
        return (
            userName.includes(lowercasedQuery) ||
            userEmail.includes(lowercasedQuery)
        );
    });

    return (
        <div className="admin-page">
            <h1>Admin Dashboard</h1>
            <div className="button-group">
                <button onClick={() => navigate('/StartEventQr')}>Start Event QR</button>
                <button onClick={() => navigate('/EndEventQr')}>End Event QR</button>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>

            <div className="search">
                <input
                    type="text"
                    placeholder="Search by name or email"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="user-table">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>College</th>
                            <th>Year</th>
                            <th>Attendance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id}>
                                <td>{user.name || user.firstName + " " + user.lastName || 'N/A'}</td>
                                <td>{user.email || 'N/A'}</td>
                                <td>{user.collegeName || 'N/A'}</td>
                                <td>{user.year || 'N/A'}</td>
                                <td>
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            checked={user.startFlag && user.endFlag}
                                            onChange={async (e) => {
                                                await handleSwitchChange(user.id, e.target.checked);
                                            }}
                                        />
                                        <span className="slider"></span>
                                    </label>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPage;
