import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import apiClient from 'config/axiosSetup';
import config from 'config/config';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './WorkoutCalendar.css';

const localizer = momentLocalizer(moment);

const WorkoutCalendar = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showMoveDatePicker, setShowMoveDatePicker] = useState(false);
  const [newDateTime, setNewDateTime] = useState('');

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const response = await apiClient.get(`${config.apiUrl}/CrmWorkout`);
      const workouts = response.data.map((workout) => {
        const startDate = new Date(workout.startTime);
        const endDate = new Date(startDate.getTime() + workout.duration * 60000);
        return {
          id: workout.id,
          title: workout.name,
          start: startDate,
          end: endDate,
          // Якщо бекенд повертає поле 'description' - додаємо його для tooltip
          description: workout.description || 'No description provided',
        };
      });
      setEvents(workouts);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    }
  };

  const handleSelectSlot = (slotInfo) => {
    const selectedDate = slotInfo.slots ? slotInfo.slots[0] : slotInfo.start;
    navigate('/workouts/add', { state: { startTime: selectedDate } });
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
    setShowMoveDatePicker(false);
    setNewDateTime('');
  };

  const handleDelete = async () => {
    if (!selectedEvent) return;
    try {
      await apiClient.delete(`${config.apiUrl}/CrmWorkout/${selectedEvent.id}`);
      setEvents((prev) => prev.filter((e) => e.id !== selectedEvent.id));
      setShowEventModal(false);
    } catch (error) {
      console.error('Error deleting workout:', error);
    }
  };

  const handleEdit = () => {
    if (!selectedEvent) return;
    setShowEventModal(false);
    navigate(`/workouts/edit/${selectedEvent.id}`, { state: { workoutToEdit: selectedEvent } });
  };

  const handleMove = () => {
    setShowMoveDatePicker(true);
  };

  const handleConfirmMove = async () => {
    if (!selectedEvent || !newDateTime) return;
    try {
      const updatedStart = new Date(newDateTime);
      const durationMs = selectedEvent.end.getTime() - selectedEvent.start.getTime();
      const updatedEnd = new Date(updatedStart.getTime() + durationMs);

      await apiClient.put(`${config.apiUrl}/CrmWorkout/${selectedEvent.id}`, {
        name: selectedEvent.title,
        startTime: updatedStart,
        duration: durationMs / 60000,
      });

      setEvents((prevEvents) =>
        prevEvents.map((evt) =>
          evt.id === selectedEvent.id
            ? { ...evt, start: updatedStart, end: updatedEnd }
            : evt
        )
      );
      setShowEventModal(false);
    } catch (error) {
      console.error('Error moving workout:', error);
    }
  };

  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  };

  const modalStyle = {
    backgroundColor: '#000',
    color: 'white',
    padding: '20px',
    borderRadius: '8px',
    minWidth: '300px',
  };

  const buttonStyle = {
    borderRadius: '8px',
    padding: '10px 20px',
    border: 'none',
    cursor: 'pointer',
    marginRight: '10px',
  };
  const actionButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'yellow',
    color: 'black',
  };

  const cancelButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'gray',
    color: 'white',
  };
  
  const deleteButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'red',
    color: 'white',
  };

  

  const renderEventModal = () => {
    if (!showEventModal || !selectedEvent) return null;

    return (
      <div style={modalOverlayStyle}>
        <div style={modalStyle}>
          <h3>Workout: {selectedEvent.title}</h3>
          {!showMoveDatePicker ? (
            <>
              <p>What would you like to do?</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <button style={deleteButtonStyle} onClick={handleDelete}>
                  Delete
                </button>
                <button style={actionButtonStyle} onClick={handleEdit}>
                  Edit
                </button>
                <button style={actionButtonStyle} onClick={handleMove}>
                  Move
                </button>
                <button style={cancelButtonStyle} onClick={() => setShowEventModal(false)}>
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <p>Select new date/time to move this workout:</p>
              <input
                type="datetime-local"
                value={newDateTime}
                onChange={(e) => setNewDateTime(e.target.value)}
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #444',
                  backgroundColor: '#222',
                  color: 'white',
                }}
              />
              <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <button style={actionButtonStyle} onClick={handleConfirmMove}>
                  Confirm Move
                </button>
                <button style={cancelButtonStyle} onClick={() => setShowMoveDatePicker(false)}>
                  Back
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ height: 'calc(100vh - 50px)', overflow: 'hidden' }}>
      <Calendar
        localizer={localizer}
        events={events}
        // Додаємо tooltipAccessor:
        tooltipAccessor="description"
        startAccessor="start"
        endAccessor="end"
        titleAccessor="title"
        style={{ height: 'calc(100% - 50px)' }}
        defaultView="week"
        views={['month', 'week', 'day']}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        min={new Date(2024, 0, 1, 6, 0)}
        max={new Date(2024, 0, 1, 21, 0)}
        step={60}
        timeslots={1}
      />
      {renderEventModal()}
    </div>
  );
};

export default WorkoutCalendar;