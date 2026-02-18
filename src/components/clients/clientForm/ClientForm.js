import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import apiClient from 'config/axiosSetup';
import config from 'config/config'; // Import the config for the API URL
import './client-form.css';

const ClientForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams(); // Get the client ID from the URL params if editing

    const [clientData, setClientData] = useState({
        name: '',
        phone: '',
        email: '',
        instagram: ''
    });
    const [memberships, setMemberships] = useState([]); // Store memberships for the client
    const [allMemberships, setAllMemberships] = useState([]); // Store all available memberships
    const [newMembership, setNewMembership] = useState({ membershipId: '', startDate: '' }); // New membership form data
    const [isEditing, setIsEditing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control "Add Membership" modal visibility
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false); // State to control "Details" modal visibility
    const [selectedMembership, setSelectedMembership] = useState(null); // Selected membership for details

    useEffect(() => {
        if (location.state && location.state.clientToEdit) {
            setClientData(location.state.clientToEdit);
            setIsEditing(true);
            fetchClientMemberships(location.state.clientToEdit.id); // Fetch memberships if editing
        } else {
            setClientData({
                name: '',
                phone: '',
                email: '',
                instagram: ''
            });
            setIsEditing(false);
        }

        fetchAllMemberships(); // Fetch all memberships
    }, [location]);

    const fetchClientMemberships = async (clientId) => {
        try {
            const response = await apiClient.get(`${config.apiUrl}/CrmClient/${clientId}/memberships`);
            setMemberships(response.data);
        } catch (error) {
            console.error('Error fetching client memberships:', error);
        }
    };

    const fetchAllMemberships = async () => {
        try {
            const response = await apiClient.get(`${config.apiUrl}/CrmMembership`);
            setAllMemberships(response.data);
        } catch (error) {
            console.error('Error fetching all memberships:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setClientData({
            ...clientData,
            [name]: value
        });
    };

    const handleNewMembershipChange = (e) => {
        const { name, value } = e.target;
        setNewMembership({
            ...newMembership,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isEditing) {
            try {
                await apiClient.put(`${config.apiUrl}/CrmClient/${clientData.id}`, clientData);
                navigate('/clients'); // Redirect back to the client list
            } catch (error) {
                console.error('Error updating client:', error);
            }
        } else {
            try {
                await apiClient.post(`${config.apiUrl}/CrmClient/`, clientData);
                navigate('/clients'); // Redirect back to the client list
            } catch (error) {
                console.error('Error creating client:', error);
            }
        }
    };

    const handleAddMembership = async (e) => {
        e.preventDefault();
        try {
            await apiClient.post(`${config.apiUrl}/CrmClient/${clientData.id}/memberships`, newMembership);
            fetchClientMemberships(clientData.id); // Refresh memberships after adding
            setNewMembership({ membershipId: '', startDate: '' }); // Reset form
            setIsModalOpen(false); // Close modal
        } catch (error) {
            console.error('Error adding client membership:', error);
        }
    };

    const handleMembershipDetails = (membership) => {
        setSelectedMembership(membership); // Set the selected membership
        setIsDetailsModalOpen(true); // Open the details modal
    };

    return (
        <div className="client-form-container">
            <h3>{isEditing ? 'Edit Client' : 'Create Client'}</h3>
            <form onSubmit={handleSubmit} className="client-form">
                <div className="form-row">
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={clientData.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-row">
                    <label>Phone:</label>
                    <input
                        type="text"
                        name="phone"
                        value={clientData.phone}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-row">
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={clientData.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-row">
                    <label>Instagram:</label>
                    <input
                        type="text"
                        name="instagram"
                        value={clientData.instagram}
                        onChange={handleInputChange}
                    />
                </div>
                <button type="submit" className="submit-btn">
                    {isEditing ? 'Update Client' : 'Create Client'}
                </button>
            </form>

            {isEditing && (
                <div className="client-memberships">
                    <div className="membership-header">
                        <h4>Client Memberships</h4>
                        <button onClick={() => setIsModalOpen(true)} className="add-membership-btn">
                            Add Membership
                        </button>
                    </div>
                    <ul>
                        {memberships.map((membership) => {
                            const isExpired = new Date(membership.endDate) < new Date(); // Check if the membership is expired
                            return (
                                <li
                                    key={membership.membershipId}
                                    className={`membership-item ${isExpired ? 'expired' : 'valid'}`}
                                >
                                    <strong>{membership.membershipName}</strong> - 
                                    End Date: {new Intl.DateTimeFormat('en-GB').format(new Date(membership.endDate))}
                                    <button
                                        onClick={() => handleMembershipDetails(membership)}
                                        className={`details-btn ${isExpired ? 'expired-btn' : 'valid-btn'}`}
                                    >
                                        Membership Details
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h4>Add Membership</h4>
                        <form onSubmit={handleAddMembership}>
                            <div className="form-row">
                                <label>Select Membership:</label>
                                <select
                                    name="membershipId"
                                    value={newMembership.membershipId}
                                    onChange={handleNewMembershipChange}
                                    required
                                >
                                    <option value="">Select a membership</option>
                                    {allMemberships.map((membership) => (
                                        <option key={membership.id} value={membership.id}>
                                            {membership.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-row">
                                <label>Start Date:</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={newMembership.startDate || ''}
                                    onChange={(e) => setNewMembership({ ...newMembership, startDate: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="submit" className="submit-btn">Add Membership</button>
                                <button onClick={() => setIsModalOpen(false)} className="cancel-btn">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isDetailsModalOpen && selectedMembership && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h4>Membership Details</h4>
                        <p><strong>Membership Name:</strong> {selectedMembership.membershipName}</p>
                        <p><strong>Start Date:</strong> {new Date(selectedMembership.startDate).toLocaleDateString()}</p>
                        <p><strong>End Date:</strong> {new Date(selectedMembership.endDate).toLocaleDateString()}</p>
                        <button onClick={() => setIsDetailsModalOpen(false)} className="cancel-btn">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientForm;
