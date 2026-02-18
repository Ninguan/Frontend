import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Library for decoding JWT
import apiClient from 'config/axiosSetup';
import config from 'config/config'; // Replace with your config path

const LoginPage = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 1. Send login request
            const response = await apiClient.post(`${config.apiUrl}/CrmAuth/login`, credentials);
            const token = response.data.token;

            // 2. Save token to LocalStorage
            localStorage.setItem('jwtToken', token);

            // 3. Set Authorization header by default
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // 4. Decode token to get facilityId
            const decodedToken = jwtDecode(token);
            const facilityId = decodedToken.FacilityId; // Make sure this matches your JWT claims

            // 5. Save facilityId to LocalStorage (or use React Context)
            localStorage.setItem('facilityId', facilityId);

            // 6. Navigate to the homepage (or another desired page)
            navigate('/');
        } catch (err) {
            setError('Invalid username or password');
        }
    };

    return (
        <div className="login-container">
            <h3>Login</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        name="username"
                        value={credentials.username}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button type="submit">Login</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
        </div>
    );
};

export default LoginPage;
