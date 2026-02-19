import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { currentConfig } from "@/config/branding";

import { AuthProvider } from "@/context/AuthContext";
import { PrivateRoute } from "@/components/auth/PrivateRoute";

import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";

function App() {

    window.addEventListener('storage', (event) => {
        if (event.key === 'user') {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
    });

    useEffect(() => {
        document.title = currentConfig.companyName;
        if (currentConfig.colors) {
            document.documentElement.style.setProperty('--color-primary', currentConfig.colors.primary);
            document.documentElement.style.setProperty('--color-secondary', currentConfig.colors.secondary);
        }
    }, []);

    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/login" element={<Login />} />

                    <Route
                        path="/dashboard"
                        element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        }
                    />

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;