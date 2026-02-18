import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setupAxiosInterceptors } from 'config/axiosSetup';

const InterceptorSetup = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        console.log('Initializing Axios Interceptors'); // Add logging
        setupAxiosInterceptors(navigate); // Pass navigate to the interceptor
    }, [navigate]);

    return children; // Render child components
};

export default InterceptorSetup;
