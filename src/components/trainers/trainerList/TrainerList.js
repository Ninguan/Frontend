import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from 'config/axiosSetup';
import config from 'config/config'; 
import './trainer-list.css';

const TrainerList = () => {
  const [trainers, setTrainers] = useState([]);

  // 1. facilityId from localStorage
  const facilityId = localStorage.getItem('facilityId');

  useEffect(() => {
    if (facilityId) {
      fetchTrainers(facilityId);
    }
  }, [facilityId]);

  const fetchTrainers = async () => {
    try {
        const response = await apiClient.get(`${config.apiUrl}/CrmTrainer`);
        setTrainers(response.data);
    } catch (error) {
        console.error("Error fetching trainers:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiClient.delete(`${config.apiUrl}/CrmTrainer/${id}`);
      if (facilityId) {
        fetchTrainers(facilityId);
      }
    } catch (error) {
      console.error('Error deleting trainer', error);
    }
  };

  return (
    <div className="trainer-list-container">
      <div className="add-trainer-btn-container">
        <Link to="/trainers/edit" className="add-trainer-btn">Add Trainer</Link>
      </div>
      <div className="trainer-list">
        <div className="trainer-list-header">
          <div className="header-cell">Name</div>
          <div className="header-cell">Description</div>
          <div className="header-cell">Actions</div>
        </div>

        {trainers.map((trainer) => (
          <div className="trainer-row" key={trainer.id}>
            <div className="trainer-cell">{trainer.name}</div>
            <div className="trainer-cell">{trainer.description}</div>
            <div className="trainer-cell">
              <Link to={`/trainers/edit`}
                    state={{ trainerToEdit: trainer }}
                    className="edit-link"
              >
                Edit
              </Link>
              <button onClick={() => handleDelete(trainer.id)} className="delete-btn">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainerList;
