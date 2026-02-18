import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import InterceptorSetup from 'components/loginAndDesign/InterceptorSetup'; // Import the wrapper
import ClientList from 'components/clients/clientList/ClientList';
import ClientForm from 'components/clients/clientForm/ClientForm';
import WorkoutCalendar from 'components/workouts/workoutList/Calendar/WorkoutCalendar';
import WorkoutsList from 'components/workouts/workoutList/Calendar/WorkoutsList';
import WorkoutEditForm from 'components/workouts/workoutForm/WorkoutEditForm';
import ConsentEditForm from 'components/consents/consentForm/ConsentEditForm';
import ConsentsList from 'components/consents/consentList/ConsentsList';
import MembershipList from 'components/memberships/membershipList/MembershipList';
import MembershipForm from 'components/memberships/membershipForm/MembershipForm';
import TrainerList from 'components/trainers/trainerList/TrainerList';
import TrainerForm from 'components/trainers/trainerForm/TrainerForm';
import PrivateRoute from 'components/loginAndDesign/PrivateRoute';
import LoginPage from 'components/loginAndDesign/LoginPage';
import TopBar from 'components/loginAndDesign/TopBar';

function App() {
    return (
        <Router>
            {/* Move InterceptorSetup inside Router */}
            <InterceptorSetup>
                <TopBar />
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    {/* Redirect from root to /clients */}
                    <Route path="/" element={<Navigate to="/clients" />} />
                    <Route path="/clients" element={<PrivateRoute> <ClientList /> </PrivateRoute>} />
                    <Route path="/clients/edit" element={<PrivateRoute> <ClientForm /> </PrivateRoute>} />
                    <Route path="/calendar" element={<PrivateRoute> <WorkoutCalendar /> </PrivateRoute>} />
                    <Route path="/workouts" element={<PrivateRoute> <WorkoutsList /> </PrivateRoute>} />
                    <Route path="/workouts/edit/:id" element={<PrivateRoute><WorkoutEditForm /></PrivateRoute>} />
                    <Route path="/memberships" element={<PrivateRoute> <MembershipList /> </PrivateRoute>} />
                    <Route path="/memberships/edit" element={<PrivateRoute> <MembershipForm /> </PrivateRoute>} />
                    <Route path="/workouts/add" element={<PrivateRoute><WorkoutEditForm /></PrivateRoute>} />
                    <Route path="/trainers" element={<PrivateRoute> <TrainerList /> </PrivateRoute>} />
                    <Route path="/trainers/edit" element={<PrivateRoute> <TrainerForm /> </PrivateRoute>} />
                    <Route path="/consents" element={<PrivateRoute> <ConsentsList /> </PrivateRoute>} />
                    <Route path="/consents/new" element={<PrivateRoute> <ConsentEditForm /> </PrivateRoute>} />
                    <Route path="/consents/edit/:id" element={<PrivateRoute> <ConsentEditForm /> </PrivateRoute>} />            
                </Routes>
            </InterceptorSetup>
        </Router>
    );
}

export default App;
