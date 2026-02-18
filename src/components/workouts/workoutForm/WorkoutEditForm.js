import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import apiClient from 'config/axiosSetup';
import './workout-form.css';

const WorkoutEditForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [workoutData, setWorkoutData] = useState({
        name: '',
        description: '', // нове поле опису
        startTime: '',
        duration: 0,
        trainerId: '',
        capacity: 0,
        membershipIds: []
    });

    const [trainers, setTrainers] = useState([]);
    const [memberships, setMemberships] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (id) {
                    // Отримуємо дані тренування для редагування
                    const response = await apiClient.get(`/CrmWorkout/${id}/edit`);
                    const { workout, trainers, memberships } = response.data;
                    setWorkoutData({
                        name: workout.name || '',
                        description: workout.description || '', // читаємо опис
                        startTime: workout.startTime || '',
                        duration: workout.duration || 0,
                        trainerId: workout.trainerId || '',
                        capacity: workout.capacity || 0,
                        membershipIds: workout.membershipIds || []
                    });
                    setTrainers(trainers);
                    setMemberships(memberships);
                } else {
                    // Якщо створюємо нове тренування, завантажуємо тренерів та абонементи
                    const trainersResponse = await apiClient.get('/CrmTrainer');
                    const membershipsResponse = await apiClient.get('/CrmMembership');
                    setTrainers(trainersResponse.data);
                    setMemberships(membershipsResponse.data);
                }
            } catch (error) {
                console.error('Error fetching workout details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setWorkoutData({
            ...workoutData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleMembershipChange = (selectedOptions) => {
        const selectedIds = selectedOptions.map((option) => option.value);
        setWorkoutData({
            ...workoutData,
            membershipIds: selectedIds
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                // PUT-запит із даними, включаючи опис
                await apiClient.put(`/CrmWorkout/${id}`, workoutData);
            } else {
                await apiClient.post('/CrmWorkout', workoutData);
            }
            navigate('/workouts');
        } catch (error) {
            console.error('Error saving workout:', error);
        }
    };

    if (loading) {
        return <p>Loading workout details...</p>;
    }

    return (
        <div className="workout-form-container">
            <h3>{id ? 'Edit Workout' : 'Create Workout'}</h3>
            <form onSubmit={handleSubmit} className="client-form">
                <div className="form-row">
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={workoutData.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                {/* Нове поле для опису */}
                <div className="form-row">
                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={workoutData.description}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-row">
                    <label>Start Time:</label>
                    <input
                        type="datetime-local"
                        name="startTime"
                        value={workoutData.startTime}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-row">
                    <label>Duration (minutes):</label>
                    <input
                        type="number"
                        name="duration"
                        value={workoutData.duration}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-row">
                    <label>Capacity:</label>
                    <input
                        type="number"
                        name="capacity"
                        value={workoutData.capacity}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-row">
                    <label>Trainer:</label>
                    <select
                        name="trainerId"
                        value={workoutData.trainerId || ''}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="" disabled>Select Trainer</option>
                        {trainers.map((trainer) => (
                            <option key={trainer.id} value={trainer.id}>
                                {trainer.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-row">
                    <label>Memberships:</label>
                    <Select
                        isMulti
                        name="membershipIds"
                        options={memberships.map((membership) => ({
                            value: membership.id,
                            label: membership.name
                        }))}
                        value={memberships
                            .filter((membership) => workoutData.membershipIds.includes(membership.id))
                            .map((membership) => ({
                                value: membership.id,
                                label: membership.name
                            }))}
                        onChange={handleMembershipChange}
                        styles={{
                            control: (provided) => ({
                                ...provided,
                                backgroundColor: '#222',
                                color: '#fff',
                                borderColor: '#444',
                            }),
                            menu: (provided) => ({
                                ...provided,
                                backgroundColor: '#333',
                                color: '#fff',
                            }),
                            option: (provided, state) => ({
                                ...provided,
                                backgroundColor: state.isFocused ? '#444' : '#333',
                                color: '#fff',
                            }),
                            multiValue: (provided) => ({
                                ...provided,
                                backgroundColor: '#444',
                                color: '#fff',
                            }),
                            multiValueLabel: (provided) => ({
                                ...provided,
                                color: '#fff',
                            }),
                            multiValueRemove: (provided) => ({
                                ...provided,
                                color: '#ff4d4d',
                                ':hover': {
                                    backgroundColor: '#ff1a1a',
                                    color: 'white',
                                },
                            }),
                        }}
                    />
                </div>
                <button type="submit" className="submit-btn">
                    {id ? 'Update Workout' : 'Create Workout'}
                </button>
            </form>
        </div>
    );
};

export default WorkoutEditForm;
