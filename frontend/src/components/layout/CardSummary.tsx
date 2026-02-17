import { theme } from "../../config/theme.ts";

export function CardSummary({ title, value, sub, icon: Icon, colorClass }: any) {
    return (
        <div className={`${theme.colors.cardBg} ${theme.colors.border} border rounded-xl p-6 relative overflow-hidden group hover:border-gray-700 transition-colors`}>
            <div className="flex justify-between items-start">
                <div>
                    <p className={`${theme.colors.textSecondary} text-sm font-medium mb-2`}>{title}</p>
                    <h2 className={`text-3xl font-bold ${value > 0 ? 'text-white' : 'text-gray-500'}`}>{value}</h2>
                    <p className="text-xs text-gray-500 mt-1">{sub}</p>
                </div>
                <Icon className={`text-gray-700 group-hover:${colorClass} transition-colors`} size={24} />
            </div>
        </div>
    );
}