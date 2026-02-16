import { Monitor } from "../../types/types.ts";

export function StatusDot({ status }: { status: Monitor['status'] }) {
    const config = {
        online: { color: "bg-green-500", shadow: "shadow-[0_0_8px_rgba(34,197,94,0.6)]" },
        offline: { color: "bg-red-500", shadow: "shadow-[0_0_8px_rgba(239,68,68,0.6)]" },
        paused: { color: "bg-yellow-500", shadow: "" },
        pending: { color: "bg-gray-500", shadow: "" }
    };

    const style = config[status] || config.pending;

    return (
        <div className="flex justify-center items-center gap-2">
            <div className={`h-2.5 w-2.5 rounded-full ${style.color} ${style.shadow} ${status === 'pending' ? 'animate-pulse' : ''}`} />
            {status === 'paused' && <span className="text-[10px] text-yellow-500 uppercase tracking-widest">Pausado</span>}
        </div>
    );
}