import { X, Globe, Clock, Activity } from "lucide-react";
import { useForm } from "react-hook-form"; // Apenas React Hook Form
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { theme } from "@/config/theme";

// 1. Definimos o tipo dos dados na mão (Sem Zod)
interface FormValues {
    name: string;
    url: string;
    interval: number;
}

interface NewMonitorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: FormValues) => void;
}

export function NewMonitorModal({ isOpen, onClose, onSave }: NewMonitorModalProps) {

    // 2. useForm simples e tipado com a interface acima
    const form = useForm<FormValues>({
        defaultValues: {
            name: "",
            url: "",
            interval: 5,
        },
    });

    if (!isOpen) return null;

    const onSubmit = (values: FormValues) => {
        onSave(values);
        form.reset();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className={`relative ${theme.colors.cardBg} border ${theme.colors.border} rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200`}>

                {/* Header */}
                <div className={`flex items-center justify-between p-6 border-b ${theme.colors.border} ${theme.colors.headerBg}`}>
                    <div className="flex items-center gap-2">
                        <Activity style={{ color: theme.colors.primary }} size={20} />
                        <h2 className={`text-lg font-bold ${theme.colors.textMain}`}>Novo Monitoramento</h2>
                    </div>
                    <button onClick={onClose} className={`${theme.colors.textSecondary} hover:text-white transition-colors p-1 rounded-full hover:bg-white/10`}>
                        <X size={20} />
                    </button>
                </div>

                {/* Form Body */}
                <div className="p-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                            {/* Campo Nome */}
                            <FormField
                                control={form.control}
                                name="name"
                                // 3. Validação nativa do React Hook Form (rules)
                                rules={{ required: "O nome é obrigatório", minLength: { value: 2, message: "Mínimo 2 caracteres" } }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-medium text-gray-400 uppercase tracking-wider">Nome do Serviço</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Activity className="absolute left-3 top-2.5 text-gray-500" size={16} />
                                                <Input {...field} placeholder="Ex: API Pagamentos" className="pl-10 bg-[#0b1120] border-gray-700 text-white placeholder:text-gray-600" />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-red-400 text-xs" />
                                    </FormItem>
                                )}
                            />

                            {/* Campo URL */}
                            <FormField
                                control={form.control}
                                name="url"
                                rules={{
                                    required: "A URL é obrigatória",
                                    pattern: {
                                        value: /^(https?:\/\/)/,
                                        message: "A URL deve começar com http:// ou https://"
                                    }
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-medium text-gray-400 uppercase tracking-wider">URL do Endpoint</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Globe className="absolute left-3 top-2.5 text-gray-500" size={16} />
                                                <Input {...field} placeholder="https://api..." className="pl-10 bg-[#0b1120] border-gray-700 text-white placeholder:text-gray-600" />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-red-400 text-xs" />
                                    </FormItem>
                                )}
                            />

                            {/* Campo Intervalo */}
                            <FormField
                                control={form.control}
                                name="interval"
                                rules={{ required: true, min: { value: 1, message: "Mínimo 1 min" } }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-medium text-gray-400 uppercase tracking-wider">Intervalo (min)</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Clock className="absolute left-3 top-2.5 text-gray-500" size={16} />
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    // Convertendo input string para number ao mudar
                                                    onChange={e => field.onChange(+e.target.value)}
                                                    className="pl-10 bg-[#0b1120] border-gray-700 text-white placeholder:text-gray-600"
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-red-400 text-xs" />
                                    </FormItem>
                                )}
                            />

                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={onClose} className="flex-1 py-2.5 px-4 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-lg transition-colors border border-gray-700">Cancelar</button>
                                <button type="submit" style={{ backgroundColor: theme.colors.primary }} className="flex-1 py-2.5 px-4 text-black font-bold rounded-lg transition-opacity hover:opacity-90 shadow-lg active:scale-95">Criar Monitor</button>
                            </div>

                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}