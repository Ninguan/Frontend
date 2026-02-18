import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import apiClient from 'config/axiosSetup';
import config from 'config/config';
import './consent-form.css';

const ConsentEditForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const facilityId = localStorage.getItem('facilityId');

    const [consentData, setConsentData] = useState({
        text: '',
        required: false,
        pdfUrl: '',
        file: null,
    });

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConsentDetails = async () => {
            try {
                if (id) {
                    const response = await apiClient.get(`${config.apiUrl}/CrmConsent/${id}`);
                    setConsentData({
                        text: response.data.text || '',
                        required: response.data.required || false,
                        pdfUrl: response.data.pdfUrl || '',
                    });
                    setIsEditing(true);
                } else {
                    setConsentData({
                        text: '',
                        required: false,
                        pdfUrl: '',
                    });
                    setIsEditing(false);
                }
            } catch (error) {
                console.error("Error fetching consent details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchConsentDetails();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setConsentData({
            ...consentData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleFileChange = (e) => {
        setConsentData({
            ...consentData,
            file: e.target.files[0],
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("text", consentData.text);
        formData.append("required", consentData.required);
        if (consentData.file) {
            formData.append("file", consentData.file);
        }

        try {
            if (isEditing) {
                await apiClient.put(`${config.apiUrl}/CrmConsent/${id}`, formData, {
                    headers: { FacilityId: facilityId, 'Content-Type': 'multipart/form-data' },
                });
            } else {
                await apiClient.post(`${config.apiUrl}/CrmConsent`, formData, {
                    headers: { FacilityId: facilityId, 'Content-Type': 'multipart/form-data' },
                });
            }
            navigate('/consents');
        } catch (error) {
            console.error("Error saving consent:", error);
        }
    };

    if (loading) {
        return <p>Loading consent details...</p>;
    }

    return (
        <div className="consent-form-container">
            <h3>{isEditing ? 'Edit Consent' : 'Create Consent'}</h3>
            <form onSubmit={handleSubmit} className="consent-form">
                <div className="form-row">
                    <label>Consent Text:</label>
                    <textarea
                        name="text"
                        value={consentData.text}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-row">
                    <label>Current PDF:</label>
                    {consentData.pdfUrl ? (
                        <a 
                            href={consentData.pdfUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="pdf-link"
                        >
                            📄 View Current PDF
                        </a>
                    ) : (
                        <span>No PDF uploaded</span>
                    )}
                </div>

                <div className="form-row checkbox-row">
                    <label>Required:</label>
                    <input
                        type="checkbox"
                        name="required"
                        checked={consentData.required}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-row">
                    <label>Upload PDF:</label>
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                    />
                </div>

                <button type="submit" className="submit-btn">
                    {isEditing ? 'Update Consent' : 'Create Consent'}
                </button>
            </form>
        </div>
    );
};

export default ConsentEditForm;
