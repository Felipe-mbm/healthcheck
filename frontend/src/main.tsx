import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { theme } from "@/config/theme.ts";

const applyTheme = () => {
    const root = document.documentElement;
    if (theme.colors) {
        root.style.setProperty('--color-primary', theme.colors.primary);
        root.style.setProperty('--color-secondary', theme.colors.secondary);
    }
};

applyTheme();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_ID_GOOGLE}>
            <App />
        </GoogleOAuthProvider>
    </React.StrictMode>,
)