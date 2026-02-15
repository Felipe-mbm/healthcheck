import { useState, ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function DashboardLayout({ children }: { children: ReactNode }) {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Header toggleSidebar={toggleSidebar} />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
                    {children}
                </main>
            </div>
        </div>
    );
}