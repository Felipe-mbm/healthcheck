import { useState } from "react";
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { theme } from "@/config/theme"; // <--- Usando o tema centralizado
import { Input } from "@/components/ui/input"; // <--- Usando componente do Shadcn
import { Button } from "@/components/ui/button"; // <--- Usando componente do Shadcn

// Dica Senior: URL em constante ou ENV
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleEmailLogin = (e: React.FormEvent) => {
        e.preventDefault();
        alert("🚧 Login por email em construção. Use o Google.");
    };

    const handleGoogleSuccess = async (credentialResponse: any) => {
        try {
            setIsLoading(true);
            const res = await axios.post(`${API_URL}/auth/login`, {
                credential: credentialResponse.credential
            });

            localStorage.setItem("token", res.data.token);
            login(res.data.user);
            navigate("/dashboard");

        } catch (error) {
            console.error("Erro no login:", error);
            alert("Falha ao autenticar.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // 1. Fundo usando a cor do tema
        <div className={`flex min-h-screen w-full items-center justify-center ${theme.colors.background} text-white p-4 font-sans`}>

            {/* 2. Card usando a cor do tema */}
            <div className={`w-full max-w-[400px] ${theme.colors.cardBg} border ${theme.colors.border} p-8 rounded-xl shadow-2xl`}>

                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold mb-2 tracking-tight text-white">
                        {theme.companyName}
                    </h1>
                    <p className={`${theme.colors.textSecondary} text-sm`}>
                        Bem-vindo de volta! Faça login para continuar.
                    </p>
                </div>

                <form onSubmit={handleEmailLogin} className="space-y-6">
                    <div>
                        <label className={`block text-sm font-medium ${theme.colors.textSecondary} mb-1.5`}>Email</label>
                        {/* 3. Input do Shadcn (Consistência Visual) */}
                        <Input
                            type="email"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`bg-[#1f2937] border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-${theme.colors.primary}`}
                        />
                    </div>
                    <div>
                        <label className={`block text-sm font-medium ${theme.colors.textSecondary} mb-1.5`}>Senha</label>
                        <Input
                            type="password"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`bg-[#1f2937] border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-${theme.colors.primary}`}
                        />
                    </div>

                    {/* 4. Botão White Label (Usa a cor primária da marca) */}
                    <Button
                        type="submit"
                        disabled={isLoading}
                        style={{ backgroundColor: theme.colors.primary }} // A mágica acontece aqui
                        className="w-full py-6 text-black font-bold text-base hover:opacity-90 transition-opacity"
                    >
                        {isLoading ? "Entrando..." : "Entrar"}
                    </Button>
                </form>

                <div className="my-8 flex items-center">
                    <div className={`flex-grow border-t ${theme.colors.border}`}></div>
                    <span className="px-4 text-gray-500 text-xs font-bold uppercase tracking-widest">OU</span>
                    <div className={`flex-grow border-t ${theme.colors.border}`}></div>
                </div>

                <div className="flex justify-center overflow-hidden rounded-lg border border-gray-700 hover:border-gray-500 transition-colors">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => setIsLoading(false)}
                        useOneTap
                        theme="outline"
                        size="large"
                        shape="rectangular"
                        width="336px"
                        text="signin_with"
                    />
                </div>

                <p className="text-center text-gray-600 text-[10px] mt-10 uppercase tracking-widest">
                    © 2026 {theme.companyName}. Todos os direitos reservados.
                </p>
            </div>
        </div>
    );
}