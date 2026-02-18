import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import apiClient from 'config/axiosSetup';
import config from 'config/config'; // Import the config for the API URL
import './membership-form.css';

const MembershipForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [membershipData, setMembershipData] = useState({
        name: '',
        price: '',
        duration: '',
        enteranceIsLimited: false,
        enteranceLimitations: ''
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (location.state && location.state.membershipToEdit) {
            setMembershipData(location.state.membershipToEdit);
            setIsEditing(true);
        } else {
            setMembershipData({
                name: '',
                price: '',
                duration: '',
                enteranceIsLimited: false,
                enteranceLimitations: ''
            });
            setIsEditing(false);
        }
    }, [location]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === 'enteranceIsLimited') {
            setMembershipData((prevData) => ({
                ...prevData,
                enteranceIsLimited: checked,
                enteranceLimitations: checked ? prevData.enteranceLimitations : '' // Clear limitations if unchecked
            }));
        } else {
            setMembershipData({
                ...membershipData,
                [name]: type === 'checkbox' ? checked : value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { id, ...membershipPayload } = membershipData; // Remove id for new record

        if (isEditing) {
            try {
                await apiClient.put(`${config.apiUrl}/CrmMembership/${membershipData.id}`, membershipData);
                navigate('/memberships');
            } catch (error) {
                console.error('Error updating membership:', error.response?.data || error.message);
            }
        } else {
            try {
                await apiClient.post(`${config.apiUrl}/CrmMembership`, membershipPayload);
                navigate('/memberships');
            } catch (error) {
                console.error('Error creating membership:', error.response?.data || error.message);
            }
        }
    };

    return (
        <div className="membership-form-container">
            <h3>{isEditing ? 'Edit Membership' : 'Create Membership'}</h3>
            <form onSubmit={handleSubmit} className="membership-form">
                <div className="form-row">
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={membershipData.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-row">
                    <label>Price:</label>
                    <input
                        type="number"
                        name="price"
                        value={membershipData.price}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-row">
                    <label>Duration (days):</label>
                    <input
                        type="number"
                        name="duration"
                        value={membershipData.duration}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-row">
                    <label>Entrance Limited:</label>
                    <input
                        type="checkbox"
                        name="enteranceIsLimited"
                        checked={membershipData.enteranceIsLimited}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-row">
                    <label>Entrance Limitations:</label>
                    <input
                        type="number"
                        name="enteranceLimitations"
                        value={membershipData.enteranceLimitations}
                        onChange={handleInputChange}
                        disabled={!membershipData.enteranceIsLimited}
                        required={membershipData.enteranceIsLimited}
                    />
                </div>
                <button type="submit" className="submit-btn">
                    {isEditing ? 'Update Membership' : 'Create Membership'}
                </button>
            </form>
        </div>
    );
};

export default MembershipForm;
