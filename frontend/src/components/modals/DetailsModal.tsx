import { useState, useEffect } from "react";
import { theme } from "../../config/theme";
import { X, Clock, AlertTriangle } from "lucide-react";

interface DetailsModalProps {
    isOpen: boolean;
    siteId: string | null;
    onClose: () => void;
}

export function DetailsModal({ isOpen, siteId, onClose }: DetailsModalProps) {
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && siteId) {
            const fetchStats = async () => {
                setIsLoading(true);
                try {
                    const token = localStorage.getItem("token");
                    const response = await fetch(`http://localhost:8080/urls/${siteId}/stats`, {
                        headers: { "Authorization": `Bearer ${token}` }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setStats(data);
                    }
                } catch (error) {
                    console.error("Erro ao buscar estatísticas", error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchStats();
        }
    }, [isOpen, siteId]);

    if (!isOpen || !siteId) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className={`w-full max-w-md ${theme.colors.cardBg} border ${theme.colors.border} rounded-xl shadow-2xl`}>
                <div className="flex justify-between items-center p-5 border-b border-gray-800">
                    <h2 className="text-lg font-bold text-white">Estatísticas do Sistema</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-5">
                    {isLoading ? (
                        <div className="text-center text-gray-400 py-6 animate-pulse">Carregando dados oficiais do servidor...</div>
                    ) : stats ? (
                        <div className="space-y-4">
                            <div className="bg-[#1f2937] border border-gray-700 rounded-lg p-4">
                                <h3 className="text-xl font-bold text-white mb-1">{stats.urlName}</h3>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">ID: {stats.urlId}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-[#1f2937] border border-gray-700 rounded-lg p-4 flex flex-col items-center justify-center">
                                    <AlertTriangle size={24} className="text-yellow-500 mb-2" />
                                    <span className="text-2xl font-bold text-white">{stats.totalOutages}</span>
                                    <span className="text-xs text-gray-400 mt-1">Total de Quedas</span>
                                </div>

                                <div className="bg-[#1f2937] border border-gray-700 rounded-lg p-4 flex flex-col items-center justify-center">
                                    <Clock size={24} className="text-red-400 mb-2" />
                                    <span className="text-xl font-bold text-white">{stats.formattedDowntime}</span>
                                    <span className="text-xs text-gray-400 mt-1">Tempo Offline</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-red-400 py-6">Erro ao carregar dados.</div>
                    )}
                </div>
            </div>
        </div>
    );
}