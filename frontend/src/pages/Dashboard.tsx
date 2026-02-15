import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
    Plus,
    Activity,
    MoreVertical,
    Calendar,
    RefreshCw,
    Download,
    Trash2,
    CheckCircle2,
    XCircle,
    Eye,
    Edit2,
    PauseCircle,
    PlayCircle,
    X,
    Globe
} from "lucide-react";

// --- DADOS MOCKADOS ---
const INITIAL_MOCK_SITES = [
    { id: 1, name: "Globals", url: "https://globals.com", status: "online", failures: 0, downtime: "0s" },
    { id: 2, name: "LENDPAY PROD", url: "https://lendpay.prod", status: "online", failures: 0, downtime: "0s" },
    { id: 3, name: "LENDPAY SBX", url: "https://lendpay.sbx", status: "offline", failures: 3, downtime: "5m" },
    { id: 4, name: "Cognit API PROD", url: "https://cognit.api", status: "online", failures: 0, downtime: "0s" },
    { id: 5, name: "Nickelpay BO PROD", url: "https://nickel.bo", status: "paused", failures: 0, downtime: "-" },
];

export default function Dashboard() {
    const { user } = useAuth();

    // --- ESTADOS ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sites, setSites] = useState(INITIAL_MOCK_SITES);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [activeMenuId, setActiveMenuId] = useState<number | null>(null);

    // --- AÇÕES CRUD ---
    const handleCreateMonitor = (data: { name: string; url: string; interval: number }) => {
        const newSite = {
            id: Date.now(),
            name: data.name,
            url: data.url,
            status: "pending",
            failures: 0,
            downtime: "0s"
        };
        setSites([...sites, newSite]);
    };

    const handleEdit = (site: any) => {
        alert(`✏️ Editar: ${site.name}`);
        setActiveMenuId(null);
    };

    const handleToggleStatus = (site: any) => {
        const newStatus = site.status === 'paused' ? 'online' : 'paused';
        const updatedSites = sites.map(s =>
            s.id === site.id ? { ...s, status: newStatus } : s
        );
        setSites(updatedSites);
        setActiveMenuId(null);
    };

    const handleDelete = (id: number) => {
        if(confirm("Excluir este monitoramento?")) {
            setSites(sites.filter(s => s.id !== id));
        }
        setActiveMenuId(null);
    };

    const handleViewDetails = (siteName: string) => {
        alert(`👁️ Detalhes de ${siteName}`);
        setActiveMenuId(null);
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 1000);
    };

    // Contadores
    const onlineCount = sites.filter(s => s.status === 'online').length;
    const offlineCount = sites.filter(s => s.status === 'offline').length;

    return (
        <div className="min-h-screen bg-[#050910] text-gray-100 font-sans p-6" onClick={() => setActiveMenuId(null)}>

            {/* Header */}
            <div className="max-w-[1400px] mx-auto mb-8">
                <h1 className="text-3xl font-bold text-white mb-1">System Monitor</h1>
                <p className="text-gray-400 text-sm">Painel de controle de disponibilidade</p>
            </div>

            {/* Controles */}
            <div className="max-w-[1400px] mx-auto mb-8 flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center">
                <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center bg-[#0f1623] border border-gray-800 rounded-lg px-3 py-2">
                        <Calendar size={16} className="text-gray-500 mr-2" />
                        <span className="text-sm text-gray-400">Data Inicial</span>
                    </div>
                    <span className="text-gray-600 text-sm">até</span>
                    <div className="flex items-center bg-[#0f1623] border border-gray-800 rounded-lg px-3 py-2">
                        <Calendar size={16} className="text-gray-500 mr-2" />
                        <span className="text-sm text-gray-400">Data Final</span>
                    </div>
                    <button onClick={handleRefresh} className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors">
                        <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} /> Verificar
                    </button>
                </div>

                <div className="flex items-center gap-3 w-full xl:w-auto justify-end">
                    <button className="flex items-center gap-2 border border-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition-colors">
                        <Download size={16} /> CSV
                    </button>
                    {user?.role === 'ADMIN' && (
                        <button onClick={(e) => { e.stopPropagation(); setIsModalOpen(true); }} className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors">
                            <Plus size={16} /> Nova URL
                        </button>
                    )}
                </div>
            </div>

            {/* Cards */}
            <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <CardSummary title="Total" value={sites.length} sub="URLs monitoradas" icon={Activity} color="text-blue-500" />
                <CardSummary title="Online" value={onlineCount} sub="Disponíveis agora" icon={CheckCircle2} color="text-green-500" />
                <CardSummary title="Offline" value={offlineCount} sub="Indisponíveis" icon={XCircle} color="text-red-500" />
            </div>

            {/* Tabela */}
            <div className="max-w-[1400px] mx-auto pb-24">
                <div className="bg-[#0b111a] border border-gray-800 rounded-xl overflow-visible">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-[#0f1623] border-b border-gray-800 text-gray-300 text-xs font-semibold uppercase tracking-wider">
                            <th className="p-5">Nome</th>
                            <th className="p-5 text-center">Status</th>
                            <th className="p-5 text-center">Falhas</th>
                            <th className="p-5 text-center">Tempo Off</th>
                            <th className="p-5 text-right">Ações</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                        {sites.map((site) => (
                            <tr key={site.id} className="hover:bg-gray-800/30 transition-colors relative">
                                <td className="p-5">
                                    <div className="font-semibold text-gray-200 text-sm">{site.name}</div>
                                    <div className="text-xs text-gray-600 mt-0.5">{site.url}</div>
                                </td>
                                <td className="p-5 text-center"><StatusDot status={site.status} /></td>
                                <td className="p-5 text-center text-sm font-medium text-white">{site.failures}</td>
                                <td className="p-5 text-center text-sm font-medium text-gray-400">{site.downtime}</td>
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
                                        /* AJUSTE AQUI: bottom-full mb-2 para abrir para cima */
                                        <div className="absolute right-10 bottom-full mb-2 z-[100] w-48 bg-[#111827] border border-gray-700 rounded-lg shadow-2xl py-1 shadow-black/50" onClick={(e) => e.stopPropagation()}>
                                            <div className="px-3 py-2 border-b border-gray-800 text-xs text-gray-500 uppercase font-semibold">Gerenciar</div>
                                            <button onClick={() => handleViewDetails(site.name)} className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 flex gap-2"><Eye size={14} /> Detalhes</button>
                                            <button onClick={() => handleEdit(site)} className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 flex gap-2"><Edit2 size={14} /> Editar</button>
                                            <button onClick={() => handleToggleStatus(site)} className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 flex gap-2">
                                                {site.status === 'paused' ? <PlayCircle size={14} /> : <PauseCircle size={14} />} {site.status === 'paused' ? 'Retomar' : 'Pausar'}
                                            </button>
                                            <div className="h-px bg-gray-800 my-1"></div>
                                            <button onClick={() => handleDelete(site.id)} className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-900/20 flex gap-2"><Trash2 size={14} /> Excluir</button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Interno */}
            <InternalModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleCreateMonitor} />
        </div>
    );
}

// --- SUBCOMPONENTES ---

function InternalModal({ isOpen, onClose, onSave }: any) {
    const [name, setName] = useState("");
    const [url, setUrl] = useState("");
    const [interval, setInterval] = useState(5);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ name, url, interval });
        setName(""); setUrl(""); setInterval(5);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
            <div className="bg-[#111827] border border-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-6 border-b border-gray-800 bg-[#1f2937]">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2"><Activity size={20} className="text-blue-500"/> Novo Monitor</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase">Nome</label>
                        <div className="relative"><Activity size={16} className="absolute left-3 top-2.5 text-gray-500"/><input required value={name} onChange={e => setName(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-[#0b111a] border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none" placeholder="Ex: API Prod" /></div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase">URL</label>
                        <div className="relative"><Globe size={16} className="absolute left-3 top-2.5 text-gray-500"/><input type="url" required value={url} onChange={e => setUrl(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-[#0b111a] border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none" placeholder="https://..." /></div>
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 py-2 bg-gray-800 text-gray-300 rounded-lg">Cancelar</button>
                        <button type="submit" className="flex-1 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">Criar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function CardSummary({ title, value, sub, icon: Icon, color }: any) {
    return (
        <div className="bg-[#0b111a] border border-gray-800 rounded-xl p-6 relative overflow-hidden group hover:border-gray-700 transition-colors">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-gray-400 text-sm font-medium mb-2">{title}</p>
                    <h2 className={`text-3xl font-bold ${value > 0 ? 'text-white' : 'text-gray-500'}`}>{value}</h2>
                    <p className="text-xs text-gray-500 mt-1">{sub}</p>
                </div>
                <Icon className={`text-gray-700 group-hover:${color.replace('text-', '')} transition-colors`} size={24} />
            </div>
        </div>
    );
}

function StatusDot({ status }: { status: string }) {
    let color = "bg-gray-500", shadow = "";
    if (status === 'online') { color = "bg-green-500"; shadow = "shadow-[0_0_8px_rgba(34,197,94,0.6)]"; }
    else if (status === 'offline') { color = "bg-red-500"; shadow = "shadow-[0_0_8px_rgba(239,68,68,0.6)]"; }
    else if (status === 'paused') { color = "bg-yellow-500"; }
    return (
        <div className="flex justify-center items-center gap-2">
            <div className={`h-2.5 w-2.5 rounded-full ${color} ${shadow} ${status === 'pending' ? 'animate-pulse' : ''}`}></div>
            {status === 'paused' && <span className="text-[10px] text-yellow-500 uppercase tracking-widest">Pausado</span>}
        </div>
    );
}