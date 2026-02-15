import { Home, BarChart2, Settings, X } from 'lucide-react';

interface SidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
}

export function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
    return (
        <>
            <div
                className={`fixed inset-0 z-20 bg-black/50 transition-opacity md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={toggleSidebar}
            />

            <aside className={`
        fixed z-30 inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        md:translate-x-0 md:static md:inset-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                <div className="flex items-center justify-between p-4 h-16 border-b">
                    <span className="text-xl font-bold text-[var(--color-primary)]">HealthCheck ✅</span>
                    <button onClick={toggleSidebar} className="md:hidden p-1 rounded hover:bg-gray-100">
                        <X size={24} />
                    </button>
                </div>

                <nav className="mt-4 px-2 space-y-2">
                    {/* Exemplo de Links */}
                    <a href="#" className="flex items-center px-4 py-2 text-gray-700 hover:bg-[var(--color-surface)] rounded-md">
                        <Home className="mr-3" size={20} /> Dashboard
                    </a>
                    <a href="#" className="flex items-center px-4 py-2 text-gray-700 hover:bg-[var(--color-surface)] rounded-md">
                        <BarChart2 className="mr-3" size={20} /> Relatórios
                    </a>
                    <a href="#" className="flex items-center px-4 py-2 text-gray-700 hover:bg-[var(--color-surface)] rounded-md">
                        <Settings className="mr-3" size={20} /> Configurações
                    </a>
                </nav>
            </aside>
        </>
    );
}