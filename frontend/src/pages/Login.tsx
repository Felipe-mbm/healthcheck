import { useState } from "react";
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { currentConfig } from "@/config/branding"; // ✅ Agora será lido no título
import { useAuth } from "@/context/AuthContext";

export default function Login() {
    const navigate = useNavigate(); // ✅ Agora será lido no redirecionamento
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
            const res = await axios.post("http://localhost:8080/auth/login", {
                credential: credentialResponse.credential
            });

            // ✅ Salvando e atualizando o contexto
            localStorage.setItem("token", res.data.token);
            login(res.data.user);

            // ✅ Resolvendo o erro TS6133: navigate sendo lido aqui
            navigate("/dashboard");

        } catch (error) {
            console.error("Erro no login:", error);
            alert("Falha ao autenticar. Verifique se o e-mail está cadastrado.");
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-[#0b1120] text-white p-4 font-sans">
            <div className="w-full max-w-[400px] bg-[#111827] p-8 rounded-xl border border-gray-800 shadow-2xl">

                {/* Cabeçalho: Resolvendo o erro TS6133 de currentConfig */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold mb-2 tracking-tight">
                        {currentConfig.companyName}
                    </h1>
                    <p className="text-gray-400 text-sm">Bem-vindo de volta! Faça login para continuar.</p>
                </div>

                {/* Formulário Profissional */}
                <form onSubmit={handleEmailLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
                        <input
                            type="email"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-[#1f2937] border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-white transition-all placeholder:text-gray-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Senha</label>
                        <input
                            type="password"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-[#1f2937] border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-white transition-all placeholder:text-gray-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-lg active:scale-[0.98] disabled:opacity-50"
                    >
                        Entrar
                    </button>
                </form>

                {/* Divisor "OU" conforme a imagem d45081 */}
                <div className="my-8 flex items-center">
                    <div className="flex-grow border-t border-gray-800"></div>
                    <span className="px-4 text-gray-500 text-xs font-bold uppercase tracking-widest">OU</span>
                    <div className="flex-grow border-t border-gray-800"></div>
                </div>

                {/* Botão Google - Estilo Outline idêntico ao solicitado */}
                <div className="flex justify-center overflow-hidden rounded-lg border border-gray-700 hover:border-gray-500 transition-colors">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => setIsLoading(false)}
                        useOneTap
                        theme="outline"     // ✅ Fundo transparente e borda fina (image_d4d7a4)
                        size="large"
                        shape="rectangular"
                        width="336px"       // Ajustado para o container interno
                        text="signin_with"
                    />
                </div>

                <p className="text-center text-gray-600 text-[10px] mt-10 uppercase tracking-widest">
                    © 2026 {currentConfig.companyName}. Todos os direitos reservados.
                </p>
            </div>
        </div>
    );
}