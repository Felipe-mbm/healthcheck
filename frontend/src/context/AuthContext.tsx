import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
    email: string;
    role: 'ADMIN' | 'USER';
    name?: string;
    picture?: string;
}

interface AuthContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem('user');

        if (storedUser && storedUser !== "undefined") {
            try {
                return JSON.parse(storedUser);
            } catch (error) {
                console.error("Erro ao carregar usuário do LocalStorage", error);
                localStorage.removeItem('user');
            }
        }
        return null;
    });

    const login = (userData: User) => {
        if (!userData) {
            console.error("Tentativa de login com userData indefinido!");
            return;
        }
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    return context;
};