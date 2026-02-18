import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from 'config/axiosSetup';
import config from 'config/config';
import './membership-list.css';

const MembershipList = () => {
    const [memberships, setMemberships] = useState([]);

    // 1. Read facilityId from localStorage
    const facilityId = localStorage.getItem('facilityId');

    useEffect(() => {
        if (facilityId) {
            fetchMemberships();
        }
    }, [facilityId]);

    const fetchMemberships = async () => {
        try {
            const response = await apiClient.get(`${config.apiUrl}/CrmMembership`);
            setMemberships(response.data);
        } catch (error) {
            console.error("Error fetching memberships:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await apiClient.delete(`${config.apiUrl}/CrmMembership/${id}`);
            // Refresh the membership list after deletion
            if (facilityId) {
                fetchMemberships();
            }
        } catch (error) {
            console.error('Error deleting membership:', error);
        }
    };

    return (
        <div className="membership-list-container">
            <div className="add-membership-btn-container">
                <Link to="/memberships/edit" className="add-membership-btn">Add Membership</Link>
            </div>
            <div className="membership-list">
                <div className="membership-list-header">
                    <div className="header-cell">Name</div>
                    <div className="header-cell">Price</div>
                    <div className="header-cell">Duration (days)</div>
                    <div className="header-cell">Limited</div>
                    <div className="header-cell">Limit-Entrance</div>
                    <div className="header-cell">Actions</div>
                </div>
                {memberships.map((membership) => (
                    <div className="membership-row" key={membership.id}>
                        <div className="membership-cell">{membership.name}</div>
                        <div className="membership-cell">{membership.price}</div>
                        <div className="membership-cell">{membership.duration}</div>
                        <div className="membership-cell">
                            {membership.enteranceIsLimited ? 'Yes' : 'No'}
                        </div>
                        <div className="membership-cell">
                            {membership.enteranceLimitations || 'N/A'}
                        </div>
                        <div className="membership-cell">
                            <Link to={`/memberships/edit`}
                                  state={{ membershipToEdit: membership }}
                                  className="edit-link"
                            >
                                Edit
                            </Link>
                            <button onClick={() => handleDelete(membership.id)} className="delete-btn">
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MembershipList;
