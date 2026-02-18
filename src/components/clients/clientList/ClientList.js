import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import config from 'config/config';  // Import the config for the API URL
import './client-list.css';
import apiClient from 'config/axiosSetup';
const ClientList = () => {
    const [clients, setClients] = useState([]);
    const [facilityId, setFacilityId] = useState(null);
    useEffect(() => {
        const storedFacilityId = localStorage.getItem('facilityId');
        if (storedFacilityId) {
            setFacilityId(storedFacilityId);
            fetchClients(storedFacilityId);
        }
    }, []);

    const fetchClients = async () => {
        try {
            const response = await apiClient.get(`${config.apiUrl}/CrmClient`);
            setClients(response.data);
        } catch (error) {
            console.error("Error fetching clients:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await apiClient.delete(`${config.apiUrl}/CrmClient/${id}`);
            fetchClients(facilityId); // Refresh the list after deletion
        } catch (error) {
            console.error("Error deleting client", error);
        }
    };

    return (
        <div className="client-list-container">
            <div className="add-client-btn-container">
                <Link to="/clients/edit" className="add-client-btn">Add Client</Link>
            </div>
            <div className="client-list">
                {/* Header Row */}
                <div className="client-list-header">
                    <div className="header-cell">Name</div>
                    <div className="header-cell">Phone</div>
                    <div className="header-cell">Email</div>
                    <div className="header-cell">Instagram</div>
                    <div className="header-cell">Actions</div>
                </div>
                
                {/* Clients Rows */}
                {clients.map(client => (
                    <div className="client-row" key={client.id}>
                        <div className="client-cell">{client.name}</div>
                        <div className="client-cell">{client.phone}</div>
                        <div className="client-cell">{client.email}</div>
                        <div className="client-cell">{client.instagram}</div>
                        <div className="client-cell">
                            <Link to={`/clients/edit`} state={{ clientToEdit: client }} className="edit-link">Edit</Link>
                            {/* <button onClick={() => handleDelete(client.id)} className="delete-btn">Delete</button> */}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ClientList;