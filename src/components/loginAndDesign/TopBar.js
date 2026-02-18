import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const TopBar = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('jwtToken'); // Clear the JWT token
        delete axios.defaults.headers.common['Authorization']; // Remove default auth header
        navigate('/login'); // Redirect to login page
    };

    return (
        <nav style={navStyle}>
            <ul style={ulStyle}>
                <li style={liStyle}>
                    <Link to="/clients" style={linkStyle}>Clients List</Link>
                </li>
                <li style={liStyle}>
                    <Link to="/workouts" style={linkStyle}>Workouts List</Link>
                </li>
                <li style={liStyle}>
                    <Link to="/memberships" style={linkStyle}>Memberships List</Link>
                </li>
                <li style={liStyle}>
                    <Link to="/trainers" style={linkStyle}>Trainers List</Link>
                </li>
                <li style={liStyle}>
                    <Link to="/calendar" style={linkStyle}>Workout Calendar</Link>
                </li>
                <li style={liStyle}>
                    <Link to="/consents" style={linkStyle}>Consents</Link>
                </li>
                <li style={liStyle}>
                    <button onClick={handleLogout} style={logoutButtonStyle}>Logout</button>
                </li>
            </ul>
        </nav>
    );
};

// Basic CSS for the nav bar
const navStyle = {
    backgroundColor: '#333',
    padding: '10px',
};

const ulStyle = {
    listStyleType: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    justifyContent: 'space-around',
};

const liStyle = {
    display: 'inline',
    padding: '10px',
    color: 'white',
};

const linkStyle = {
    color: '#FFA500', // Orange color for the links
    textDecoration: 'none', // Remove underline from links
};

const logoutButtonStyle = {
    backgroundColor: '#FF4500', // Red-orange color for logout button
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
};

export default TopBar;
