import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { currentConfig } from "@/config/branding";

export default function Login() {
    const navigate = useNavigate();

    const handleGoogleSuccess = async (credentialResponse: any) => {
        try {
            // O Google devolve o campo 'credential' (o token JWT dele)
            const googleToken = credentialResponse.credential;

            console.log("Token do Google recebido:", googleToken);

            // Enviamos para o SEU backend validar
            const res = await axios.post("http://localhost:8080/auth/login", {
                credential: googleToken // O nome do campo bate com seu AuthenticationDto Java
            });

            // O seu backend devolve o token da sua aplicação (JWT próprio)
            const appToken = res.data.token;
            localStorage.setItem("token", appToken);

            // Redireciona
            navigate("/dashboard");

        } catch (error) {
            console.error("Erro ao logar no backend:", error);
            alert("Falha ao autenticar com o servidor.");
        }
    };

    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900">
            <Card className="w-full max-w-md mx-4 text-center">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        <img src={currentConfig.logoUrl} alt="Logo" className="h-12 w-12" />
                    </div>
                    <CardTitle>Bem-vindo ao {currentConfig.companyName}</CardTitle>
                    <CardDescription>Faça login com sua conta Google</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center pb-8">

                    {/* Botão Oficial do Google */}
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => {
                            console.log('Login Failed');
                        }}
                        useOneTap
                    />

                </CardContent>
            </Card>
        </div>
    );
}