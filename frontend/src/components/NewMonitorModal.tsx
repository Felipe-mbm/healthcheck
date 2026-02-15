import { useState } from "react";
import { X, Globe, Clock, Activity } from "lucide-react";

interface NewMonitorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { name: string; url: string; interval: number }) => void;
}

export function NewMonitorModal({ isOpen, onClose, onSave }: NewMonitorModalProps) {
    const [name, setName] = useState("");
    const [url, setUrl] = useState("");
    const [interval, setInterval] = useState(5); // Padrão: 5 minutos

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Aqui enviamos os dados para o Dashboard (que enviará para o Backend)
        onSave({ name, url, interval });

        // Limpa o form e fecha
        setName("");
        setUrl("");
        setInterval(5);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#111827] border border-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Header do Modal */}
                <div className="flex items-center justify-between p-6 border-b border-gray-800 bg-[#1f2937]">
                    <div className="flex items-center gap-2">
                        <Activity className="text-blue-500" size={20} />
                        <h2 className="text-lg font-bold text-white">Novo Monitoramento</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Formulário */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">

                    {/* Campo Nome */}
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
                            Nome do Serviço
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                <Activity size={16} />
                            </span>
                            <input
                                type="text"
                                required
                                placeholder="Ex: API de Pagamentos"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-[#0b1120] border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Campo URL */}
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
                            URL do Endpoint
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                <Globe size={16} />
                            </span>
                            <input
                                type="url"
                                required
                                placeholder="https://api.suaempresa.com/health"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-[#0b1120] border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Campo Intervalo */}
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
                            Intervalo de Checagem (min)
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                <Clock size={16} />
                            </span>
                            <input
                                type="number"
                                min="1"
                                max="60"
                                required
                                value={interval}
                                onChange={(e) => setInterval(Number(e.target.value))}
                                className="w-full pl-10 pr-4 py-2.5 bg-[#0b1120] border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Footer com Botões */}
                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 px-4 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-lg transition-colors border border-gray-700"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-lg active:scale-95"
                        >
                            Criar Monitor
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}