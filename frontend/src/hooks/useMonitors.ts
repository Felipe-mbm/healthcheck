// hooks/useMonitors.ts
import { useState } from "react";
import { Monitor } from "../types/types.ts"; // Importe da sua definição

const INITIAL_MOCK_SITES: Monitor[] = [
    { id: 1, name: "Globals", url: "https://globals.com", status: "online", failures: 0, downtime: "0s" },
    { id: 2, name: "LENDPAY PROD", url: "https://lendpay.prod", status: "online", failures: 0, downtime: "0s" },
    { id: 3, name: "LENDPAY SBX", url: "https://lendpay.sbx", status: "offline", failures: 3, downtime: "5m" },
    { id: 4, name: "Cognit API PROD", url: "https://cognit.api", status: "online", failures: 0, downtime: "0s" },
    { id: 5, name: "Nickelpay BO PROD", url: "https://nickel.bo", status: "paused", failures: 0, downtime: "-" },
];

export function useMonitors() {
    const [monitors, setMonitors] = useState<Monitor[]>(INITIAL_MOCK_SITES);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const addMonitor = (data: { name: string; url: string; interval: number }) => {
        const newSite: Monitor = {
            id: Date.now(),
            name: data.name,
            url: data.url,
            status: "pending",
            failures: 0,
            downtime: "0s"
        };
        setMonitors(prev => [...prev, newSite]);
    };

    const toggleStatus = (id: number) => {
        setMonitors(prev => prev.map(s => {
            if (s.id !== id) return s;
            const newStatus = s.status === 'paused' ? 'online' : 'paused';
            return { ...s, status: newStatus };
        }));
    };

    const deleteMonitor = (id: number) => {
        if (confirm("Excluir este monitoramento?")) {
            setMonitors(prev => prev.filter(s => s.id !== id));
        }
    };

    const refreshMonitors = () => {
        setIsRefreshing(true);
        // Simulação de delay
        setTimeout(() => setIsRefreshing(false), 1000);
    };

    // Métricas calculadas (derived state)
    const stats = {
        total: monitors.length,
        online: monitors.filter(s => s.status === 'online').length,
        offline: monitors.filter(s => s.status === 'offline').length
    };

    return {
        monitors,
        stats,
        isRefreshing,
        addMonitor,
        toggleStatus,
        deleteMonitor,
        refreshMonitors
    };
}