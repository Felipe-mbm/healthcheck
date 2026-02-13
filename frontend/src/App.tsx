import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import { useEffect } from "react"
import { currentConfig } from "@/config/branding"

function Dashboard() {
    return <div className="p-8 text-2xl">Bem-vindo ao Dashboard Protegido! 🚀</div>
}

function App() {
    useEffect(() => {
        document.title = currentConfig.companyName;
        document.body.setAttribute('data-theme', currentConfig.theme);
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />

                {/* Rota Protegida (Simples por enquanto) */}
                <Route path="/dashboard" element={<Dashboard />} />

                {/* Rota 404 - Redireciona para login */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App