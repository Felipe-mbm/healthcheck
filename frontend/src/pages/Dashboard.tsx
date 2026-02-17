import { useState } from "react";
import { useAuth } from "@/context/AuthContext"; // Seu contexto existente
import { useMonitors } from "@/hooks/useMonitors"; // O Hook que criamos
import { theme } from "@/config/theme"; // O Tema White Label
import { StatusDot } from "@/components/layout/StatusDot";
import { CardSummary } from "@/components/layout/CardSummary";
import { NewMonitorModal } from "@/components/modals/NewMonitorModal.tsx";

import {
    Plus, Activity, MoreVertical, Calendar, RefreshCw, Download,
    CheckCircle2, XCircle, Eye, Edit2, PauseCircle, PlayCircle, Trash2
} from "lucide-react";

export default function Dashboard() {
    const { user } = useAuth();

    // Usando nosso Custom Hook (Toda a lógica complexa está aqui dentro)
    const {
        monitors,
        stats,
        isRefreshing,
        refreshMonitors,
        deleteMonitor,
        toggleStatus,
        addMonitor
    } = useMonitors();

    // Estados puramente de UI (Visual)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeMenuId, setActiveMenuId] = useState<number | null>(null);

    // --- Handlers de UI ---
    const closeMenu = () => setActiveMenuId(null);

    return (
        <div className={`min-h-screen ${theme.colors.background} ${theme.colors.textMain} font-sans p-6`} onClick={closeMenu}>

            {/* 1. Header Section */}
            <header className="max-w-[1400px] mx-auto mb-8">
                <h1 className="text-3xl font-bold text-white mb-1">System Monitor</h1>
                <p className={`${theme.colors.textSecondary} text-sm`}>Painel de controle de disponibilidade</p>
            </header>

            {/* 2. Controls Toolbar */}
            <div className="max-w-[1400px] mx-auto mb-8 flex flex-col xl:flex-row gap-4 justify-between items-center">
                <div className="flex gap-3" onClick={(e) => e.stopPropagation()}>
                    {/* Exemplo de DatePicker estático simplificado */}
                    <div className={`flex items-center ${theme.colors.headerBg} ${theme.colors.border} border rounded-lg px-3 py-2`}>
                        <Calendar size={16} className="text-gray-500 mr-2" />
                        <span className="text-sm text-gray-400">Filtro de Data</span>
                    </div>

                    <button onClick={refreshMonitors} className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200">
                        <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} /> Verificar
                    </button>
                </div>

                <div className="flex gap-3">
                    <button className={`flex items-center gap-2 border ${theme.colors.border} text-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-800`}>
                        <Download size={16} /> CSV
                    </button>
                    {user?.role === 'ADMIN' && (
                        <button onClick={(e) => { e.stopPropagation(); setIsModalOpen(true); }} className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-200">
                            <Plus size={16} /> Nova URL
                        </button>
                    )}
                </div>
            </div>

            {/* 3. KPI Cards */}
            <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <CardSummary title="Total" value={stats.total} sub="URLs monitoradas" icon={Activity} colorClass="text-blue-500" />
                <CardSummary title="Online" value={stats.online} sub="Disponíveis agora" icon={CheckCircle2} colorClass="text-green-500" />
                <CardSummary title="Offline" value={stats.offline} sub="Indisponíveis" icon={XCircle} colorClass="text-red-500" />
            </div>

            {/* 4. Main Table */}
            <div className="max-w-[1400px] mx-auto pb-24">
                <div className={`${theme.colors.cardBg} ${theme.colors.border} border rounded-xl overflow-visible`}>
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className={`${theme.colors.headerBg} border-b ${theme.colors.border} text-gray-300 text-xs font-semibold uppercase tracking-wider`}>
                            <th className="p-5">Nome</th>
                            <th className="p-5 text-center">Status</th>
                            <th className="p-5 text-center">Falhas</th>
                            <th className="p-5 text-center">Tempo Off</th>
                            <th className="p-5 text-right">Ações</th>
                        </tr>
                        </thead>
                        <tbody className={`divide-y ${theme.colors.border}`}>
                        {monitors.map((site) => (
                            <tr key={site.id} className="hover:bg-gray-800/30 transition-colors relative">
                                <td className="p-5">
                                    <div className="font-semibold text-gray-200 text-sm">{site.name}</div>
                                    <div className="text-xs text-gray-600 mt-0.5">{site.url}</div>
                                </td>
                                <td className="p-5 text-center"><StatusDot status={site.status} /></td>
                                <td className="p-5 text-center text-sm font-medium text-white">{site.failures}</td>
                                <td className="p-5 text-center text-sm font-medium text-gray-400">{site.downtime}</td>

                                {/* Actions Column */}
                                <td className="p-5 text-right relative overflow-visible">
                                    <div className="flex justify-end">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === site.id ? null : site.id); }}
                                            className={`p-2 rounded-full transition-colors ${activeMenuId === site.id ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-white hover:bg-gray-800'}`}
                                        >
                                            <MoreVertical size={18} />
                                        </button>
                                    </div>

                                    {activeMenuId === site.id && (
                                        <div className={`absolute right-10 bottom-full mb-2 z-[100] w-48 ${theme.colors.cardBg} border ${theme.colors.border} rounded-lg shadow-2xl py-1 shadow-black/50`} onClick={(e) => e.stopPropagation()}>
                                            <div className="px-3 py-2 border-b border-gray-800 text-xs text-gray-500 uppercase font-semibold">Gerenciar</div>
                                            <button onClick={() => alert(`Detalhes: ${site.name}`)} className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 flex gap-2"><Eye size={14} /> Detalhes</button>
                                            <button onClick={() => alert(`Editar: ${site.name}`)} className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 flex gap-2"><Edit2 size={14} /> Editar</button>
                                            <button onClick={() => { toggleStatus(site.id); closeMenu(); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 flex gap-2">
                                                {site.status === 'paused' ? <PlayCircle size={14} /> : <PauseCircle size={14} />}
                                                {site.status === 'paused' ? 'Retomar' : 'Pausar'}
                                            </button>
                                            <div className="h-px bg-gray-800 my-1"></div>
                                            <button onClick={() => { deleteMonitor(site.id); closeMenu(); }} className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-900/20 flex gap-2"><Trash2 size={14} /> Excluir</button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <NewMonitorModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={addMonitor} />
        </div>
    );
}