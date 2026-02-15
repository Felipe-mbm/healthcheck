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

const ID_GOOGLE = "628891440062-0qu4upbmn7hgs1du1g23d8j9nhd11lk1.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId={ID_GOOGLE}>
            <App />
        </GoogleOAuthProvider>
    </React.StrictMode>,
)