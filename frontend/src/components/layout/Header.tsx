import { Menu, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface HeaderProps {
    toggleSidebar: () => void;
}

export function Header({ toggleSidebar }: HeaderProps) {
    const { user, logout } = useAuth();

    return (
        <header className="bg-white h-16 shadow-sm flex items-center justify-between px-4 sticky top-0 z-10">
            <button onClick={toggleSidebar} className="md:hidden p-2 rounded-md hover:bg-gray-100">
                <Menu size={24} />
            </button>

            <h2 className="hidden md:block text-lg font-semibold text-gray-700">Visão Geral</h2>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 hidden sm:block">
                {user?.name || user?.email}
            </span>
                    <div className="w-8 h-8 rounded-full bg-[var(--color-secondary)] flex items-center justify-center text-white">
                        {user?.picture ? <img src={user.picture} alt="Avatar" className="rounded-full"/> : <UserIcon size={18} />}
                    </div>
                </div>

                <button
                    onClick={logout}
                    className="text-gray-500 hover:text-red-600 transition-colors"
                    title="Sair"
                >
                    <LogOut size={20} />
                </button>
            </div>
        </header>
    );
}