import React, { useState, useEffect } from "react";
import { Monitor } from "../../types/types";
import { theme } from "../../config/theme";
import { X } from "lucide-react";

interface EditMonitorModalProps {
    isOpen: boolean;
    monitor: Monitor | null;
    onClose: () => void;
    onSave: (id: string, data: { name: string; url: string }) => void;
}

export function EditMonitorModal({ isOpen, monitor, onClose, onSave }: EditMonitorModalProps) {
    const [name, setName] = useState("");
    const [url, setUrl] = useState("");

    // Quando o modal abrir e receber o monitor, preenche os campos com os dados dele
    useEffect(() => {
        if (monitor) {
            setName(monitor.name);
            setUrl(monitor.url);
        }
    }, [monitor]);

    if (!isOpen || !monitor) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(monitor.id, { name, url });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className={`w-full max-w-md ${theme.colors.cardBg} border ${theme.colors.border} rounded-xl shadow-2xl`}>
                <div className="flex justify-between items-center p-5 border-b border-gray-800">
                    <h2 className="text-lg font-bold text-white">Editar Monitoramento</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    <div>
                        <label className={`block text-sm font-medium ${theme.colors.textSecondary} mb-1.5`}>Nome do Sistema</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full bg-[#1f2937] border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>
                    <div>
                        <label className={`block text-sm font-medium ${theme.colors.textSecondary} mb-1.5`}>URL Monitorada</label>
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            required
                            className="w-full bg-[#1f2937] border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-300 hover:bg-gray-800 transition-colors">
                            Cancelar
                        </button>
                        <button type="submit" style={{ backgroundColor: theme.colors.primary }} className="px-4 py-2 rounded-lg text-sm font-bold text-black hover:opacity-90 transition-opacity">
                            Salvar Alterações
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}