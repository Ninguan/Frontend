import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from 'config/axiosSetup';
import config from 'config/config';
import './consents-list.css';

const ConsentsList = () => {
    const [consents, setConsents] = useState([]);
    
    const facilityId = localStorage.getItem('facilityId');

    useEffect(() => {
        if (facilityId) {
            fetchConsents();
        }
    }, [facilityId]);

    const fetchConsents = async () => {
        try {
            const response = await apiClient.get(`${config.apiUrl}/CrmConsent`);
            setConsents(response.data);
        } catch (error) {
            console.error("Error fetching consents:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this consent?")) return;
        
        try {
            await apiClient.delete(`${config.apiUrl}/CrmConsent/${id}`);
            setConsents(consents.filter(consent => consent.id !== id)); // Remove from UI
        } catch (error) {
            console.error("Error deleting consent", error);
        }
    };

    return (
        <div className="consents-list-container">
            <div className="header-container">
                <h2>Consents</h2>
                <Link to="/consents/new" className="btn">Create New Consent</Link>
            </div>
            <div className="consents-list">
                <div className="list-header">
                    <div className="header-cell">Text</div>
                    <div className="header-cell">Required</div>
                    <div className="header-cell">PDF</div>
                    <div className="header-cell">Actions</div>
                </div>
                
                {consents.map(consent => (
                    <div className="consent-row" key={consent.id}>
                        <div className="consent-cell">{consent.text}</div>
                        <div className="consent-cell">{consent.required ? "Yes" : "No"}</div>
                        <div className="consent-cell">
                            {consent.pdfUrl ? (
                                <a href={consent.pdfUrl} target="_blank" rel="noopener noreferrer">View PDF</a>
                            ) : "No PDF"}
                        </div>
                        <div className="consent-cell">
                            <Link to={`/consents/edit/${consent.id}`} className="edit-link">Edit</Link>
                            <button onClick={() => handleDelete(consent.id)} className="delete-btn">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ConsentsList;
