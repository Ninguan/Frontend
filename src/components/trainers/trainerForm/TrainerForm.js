import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import apiClient from 'config/axiosSetup';
import config from 'config/config'; // Import the config for the API URL
import './trainer-form.css';

const TrainerForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const facilityId = localStorage.getItem('facilityId'); // Get FacilityId from localStorage

  const [trainerData, setTrainerData] = useState({
    name: '',
    description: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (location.state && location.state.trainerToEdit) {
      setTrainerData(location.state.trainerToEdit); // Pre-fill form for editing
      setIsEditing(true);
    } else {
      setTrainerData({
        name: '',
        description: '',
      });
      setIsEditing(false);
    }
  }, [location]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTrainerData({
      ...trainerData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEditing) {
      try {
        await apiClient.put(`${config.apiUrl}/CrmTrainer/${trainerData.id}`, trainerData, {
          headers: { FacilityId: facilityId }, // Add FacilityId to headers for updating
        });
        navigate('/trainers'); // Redirect back to the trainer list
      } catch (error) {
        console.error('Error updating trainer', error);
      }
    } else {
      try {
        await apiClient.post(`${config.apiUrl}/CrmTrainer`, trainerData, {
          headers: { FacilityId: facilityId }, // Add FacilityId to headers for creating
        });
        navigate('/trainers'); // Redirect back to the trainer list
      } catch (error) {
        console.error('Error creating trainer', error);
      }
    }
  };

  return (
    <div className="trainer-form-container">
      <h3>{isEditing ? 'Edit Trainer' : 'Create Trainer'}</h3>
      <form onSubmit={handleSubmit} className="trainer-form">
        <div className="form-row">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={trainerData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-row">
          <label>Description:</label>
          <textarea
            name="description"
            value={trainerData.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="submit-btn">
          {isEditing ? 'Update Trainer' : 'Create Trainer'}
        </button>
      </form>
    </div>
  );
};

export default TrainerForm;
