import React from 'react';
import ReactDOM from 'react-dom/client';

// якщо "index.css" лежить у src, 
// можна імпортувати так (або залишити, як було):
import 'index.css';

import App from 'App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);