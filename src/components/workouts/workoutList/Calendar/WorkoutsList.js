import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from 'config/axiosSetup';
import config from 'config/config';

const WorkoutsList = () => {
    const [workouts, setWorkouts] = useState([]);
    const facilityId = localStorage.getItem('facilityId');

    useEffect(() => {
        if (facilityId) {
            fetchWorkouts();
        }
    }, [facilityId]);

    const fetchWorkouts = async () => {
        try {
            const response = await apiClient.get(`${config.apiUrl}/CrmWorkout`);
            setWorkouts(response.data);
        } catch (error) {
            console.error("Error fetching workouts:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await apiClient.delete(`${config.apiUrl}/CrmWorkout/${id}`);
            fetchWorkouts(); // Refresh list after deletion
        } catch (error) {
            console.error("Error deleting workout", error);
        }
    };

    return (
        <div className="client-list-container">
            <div className="add-client-btn-container">
                <Link to="/workouts/add" className="add-client-btn">Add Workout</Link>
            </div>
            <div className="client-list">
                <div className="client-list-header">
                    <div className="header-cell">Name</div>
                    <div className="header-cell">Start Time</div>
                    <div className="header-cell">Duration (mins)</div>
                    <div className="header-cell">Trainer</div>
                    <div className="header-cell">Actions</div>
                </div>
                
                {workouts.map(workout => (
                    <div className="client-row" key={workout.id}>
                        <div className="client-cell">{workout.name}</div>
                        <div className="client-cell">{workout.startTime}</div>
                        <div className="client-cell">{workout.duration}</div>
                        <div className="client-cell">{workout.trainer}</div>
                        <div className="client-cell">
                            <Link 
                                to={`/workouts/edit/${workout.id}`} 
                                state={{ workoutToEdit: workout }} 
                                className="edit-link"
                            >
                                Edit
                            </Link>
                            <button 
                                onClick={() => handleDelete(workout.id)} 
                                className="delete-btn"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WorkoutsList;