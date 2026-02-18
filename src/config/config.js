const config = {
    apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000/api', // Fallback to local if env var is not set
};

export default config;