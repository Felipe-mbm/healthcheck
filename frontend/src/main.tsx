import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google';

// --- MUDE AQUI ---
// Comente a linha do import.meta
// const ID_GOOGLE = import.meta.env.VITE_ID_GOOGLE;

// Cole o ID direto aqui entre aspas (Hardcode)
const ID_GOOGLE = "665879874118-76vu54pkef7ad1l8qvbuv7ts4rcvbjbh.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId={ID_GOOGLE}>
            <App />
        </GoogleOAuthProvider>
    </React.StrictMode>,
)