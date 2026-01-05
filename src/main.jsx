import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Remove the initial HTML loader once React is ready to take over
const initialLoader = document.getElementById('initial-loader');
if (initialLoader) {
  // Keep the loader visible until React's own loader takes over
  // React will handle the loading state, so we remove this immediately
  initialLoader.style.display = 'none';
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

