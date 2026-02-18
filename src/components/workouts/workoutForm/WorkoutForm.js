import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from 'config/axiosSetup';
import config from 'config/config'; 

const WorkoutForm = ({ addWorkout }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [isRecursive, setIsRecursive] = useState(false);
  const facilityId = localStorage.getItem('facilityId');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const workoutData = { 
      name, 
      description,
      start: new Date(start), 
      end: new Date(end), 
      isRecursive 
    };

    try {
      await apiClient.post(`${config.apiUrl}/CrmWorkout`, workoutData, {
        headers: { FacilityId: facilityId }
      });
      if (addWorkout) addWorkout(workoutData);
    } catch (error) {
      console.error('Error adding workout:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>{t('workoutForm.name')}:</label>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
      </div>
      <div>
        <label>{t('workoutForm.description')}:</label>
        <textarea 
          value={description} 
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Description:</label>
        <input 
          type="datetime-local" 
          value={start} 
          onChange={(e) => setStart(e.target.value)} 
        />
      </div>
      <div>
        <label>{t('workoutForm.endTime')}:</label>
        <input 
          type="datetime-local" 
          value={end} 
          onChange={(e) => setEnd(e.target.value)} 
        />
      </div>
      <div>
        <label>
          {t('workoutForm.recursive')}:
          <input
            type="checkbox"
            checked={isRecursive}
            onChange={() => setIsRecursive(!isRecursive)}
          />
        </label>
      </div>
      <button type="submit">{t('workoutForm.submitCreate')}</button>
    </form>
  );
};

const TrainerForm = () => {
  const navigate = useNavigate();
  const facilityId = localStorage.getItem('facilityId');
  const [trainerData, setTrainerData] = useState({ name: '', description: '' });
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post(`${config.apiUrl}/CrmTrainer`, trainerData, {
        headers: { FacilityId: facilityId }
      });
      navigate('/trainers');
    } catch (error) {
      console.error('Error adding trainer:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        placeholder={t('trainerForm.name')} 
        value={trainerData.name} 
        onChange={(e) => setTrainerData({ ...trainerData, name: e.target.value })} 
      />
      <textarea 
        placeholder={t('trainerForm.description')} 
        value={trainerData.description} 
        onChange={(e) => setTrainerData({ ...trainerData, description: e.target.value })}
      ></textarea>
      <button type="submit">{t('trainerForm.submitCreate')}</button>
    </form>
  );
};

const WorkoutsList = () => {
  const [workouts, setWorkouts] = useState([]);
  const facilityId = localStorage.getItem('facilityId');
  const { t } = useTranslation();

  useEffect(() => {
    if (facilityId) {
      fetchWorkouts(facilityId);
    }
  }, [facilityId]);

  const fetchWorkouts = async (id) => {
    try {
      const response = await apiClient.get(`${config.apiUrl}/CrmWorkout/facility-id`, {
        headers: { FacilityId: id }
      });
      setWorkouts(response.data);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    }
  };

  return (
    <div>
      <h3>{t('workoutsList.title')}</h3>
      <ul>
        {workouts.map(workout => (
          <li key={workout.id}>{workout.name}</li>
        ))}
      </ul>
    </div>
  );
};

const TrainerList = () => {
  const [trainers, setTrainers] = useState([]);
  const facilityId = localStorage.getItem('facilityId');
  const { t } = useTranslation();

  useEffect(() => {
    if (facilityId) {
      fetchTrainers(facilityId);
    }
  }, [facilityId]);

  const fetchTrainers = async (id) => {
    try {
      const response = await apiClient.get(`${config.apiUrl}/CrmTrainer/facility-id`, {
        headers: { FacilityId: id }
      });
      setTrainers(response.data);
    } catch (error) {
      console.error('Error fetching trainers:', error);
    }
  };

  return (
    <div>
      <h3>{t('trainersList.title')}</h3>
      <ul>
        {trainers.map(trainer => (
          <li key={trainer.id}>{trainer.name}</li>
        ))}
      </ul>
    </div>
  );
};

export { WorkoutForm, TrainerForm, WorkoutsList, TrainerList };