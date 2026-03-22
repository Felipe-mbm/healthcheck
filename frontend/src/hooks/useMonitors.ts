import { useState, useEffect, useCallback } from "react";
import { Monitor } from "../types/types"; // Importe da sua definição

const BASE_URL = "http://localhost:8080";

// ⚠️ ATENÇÃO: Ajuste esta função para buscar o token de onde o seu login salva.
// O padrão é salvar no localStorage após o login com o Google.
const getToken = () => localStorage.getItem("token");

export function useMonitors() {
    // Começa com uma lista vazia, pois vamos buscar do banco de dados real
    const [monitors, setMonitors] = useState<Monitor[]>([]);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // GET: Busca todas as URLs cadastradas no backend
    const fetchMonitors = useCallback(async () => {
        setIsRefreshing(true);
        try {
            const token = getToken();
            const response = await fetch(`${BASE_URL}/urls`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error("Erro ao buscar URLs");

            const data = await response.json();

            // Mapeia o DTO do Java para o formato que o seu Frontend (Mock) esperava
            const mappedMonitors: Monitor[] = data.map((item: any) => {
                let currentStatus = "pending"; // Quando acaba de cadastrar
                if (!item.isActive) currentStatus = "paused";
                else if (item.lastStatus === "UP") currentStatus = "online";
                else if (item.lastStatus === "DOWN") currentStatus = "offline";

                return {
                    id: item.id, // O Java retorna um UUID (string)
                    name: item.name,
                    url: item.url,
                    status: currentStatus,
                    failures: 0,
                    downtime: `${item.totalDowntimeMinutes || 0}m`
                };
            });

            setMonitors(mappedMonitors);
        } catch (error) {
            console.error("Erro na API:", error);
        } finally {
            setIsRefreshing(false);
        }
    }, []);

    // Busca os dados assim que o componente carrega na tela
    useEffect(() => {
        fetchMonitors();
    }, [fetchMonitors]);

    // POST: Cadastra uma nova URL no banco de dados
    const addMonitor = async (data: { name: string; url: string; interval: number }) => {
        try {
            const token = getToken();
            const response = await fetch(`${BASE_URL}/urls`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                // O Backend espera apenas name e url no DTO de criação
                body: JSON.stringify({ name: data.name, url: data.url })
            });

            if (response.ok) {
                fetchMonitors(); // Atualiza a lista com o novo ID gerado pelo banco
            } else {
                alert("Erro ao salvar URL. Verifique se ela já existe.");
            }
        } catch (error) {
            console.error(error);
        }
    };

    // PUT: Edita o nome ou a URL de um monitoramento existente
    const editMonitor = async (id: string, data: { name?: string; url?: string }) => {
        try {
            const token = getToken();
            const response = await fetch(`${BASE_URL}/urls/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(data) // O DTO UpdateRequest aceita name e url opcionais
            });

            if (response.ok) {
                fetchMonitors(); // Recarrega a lista para mostrar os dados atualizados
            } else {
                alert("Erro ao editar URL. Verifique os dados.");
            }
        } catch (error) {
            console.error("Erro na API ao editar:", error);
        }
    };

    // PUT: Pausa ou retoma o monitoramento alterando o campo 'isActive'
    const toggleStatus = async (id: string | number) => {
        const monitor = monitors.find(m => m.id === id);
        if (!monitor) return;

        // Se estava pausado, queremos ativar (true). Caso contrário, pausar (false).
        const newIsActive = monitor.status === "paused" ? true : false;

        try {
            const token = getToken();
            const response = await fetch(`${BASE_URL}/urls/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ isActive: newIsActive })
            });

            if (response.ok) {
                fetchMonitors(); // Recarrega para ver o novo status
            }
        } catch (error) {
            console.error(error);
        }
    };

    // DELETE: Remove a URL do banco
    const deleteMonitor = async (id: string | number) => {
        if (confirm("Excluir este monitoramento?")) {
            try {
                const token = getToken();
                const response = await fetch(`${BASE_URL}/urls/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    // Remove da tela imediatamente sem precisar buscar tudo de novo
                    setMonitors(prev => prev.filter(s => s.id !== id));
                } else {
                    alert("Erro ao deletar URL.");
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    // Recarrega sob demanda (útil para botão de 'refresh' na tela)
    const refreshMonitors = () => {
        fetchMonitors();
    };

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
        editMonitor,     // <--- NOVA FUNÇÃO EXPORTADA AQUI
        toggleStatus,
        deleteMonitor,
        refreshMonitors
    };
}