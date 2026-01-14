import { Trash2, Edit3, Tag, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { iconMap, colorMap } from "@/lib/utils";

interface CategoryCardProps {
    title: string;
    description?: string | null; // Aceita null vindo do GraphQL
    iconName: string;
    colorName: string;
    count: number;
    onEdit?: () => void;
    onDelete?: () => void;
}

export function CategoryCard({
    title,
    description,
    iconName,
    colorName,
    count,
    onEdit,
    onDelete,
}: CategoryCardProps) {

    // 1. Busca o ícone no mapa pelo nome (string)
    // Se não encontrar, usa o ícone 'Tag' como padrão
    const Icon = (iconMap[iconName] as LucideIcon) || Tag;

    // 2. Busca as cores no colorMap pelo nome (ex: 'green')
    // Se não encontrar, usa um cinza padrão
    const colorScheme = colorMap[colorName] || {
        icon: "#64748B",
        background: "#F1F5F9",
    };

    return (
        <div className="flex flex-col justify-between rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <div className="space-y-4">
                <div className="flex items-start justify-between">
                    <div
                        className="rounded-lg p-2.5"
                        style={{
                            backgroundColor: colorScheme.background,
                            color: colorScheme.icon
                        }}
                    >
                        <Icon className="h-5 w-5" />
                    </div>

                    <div className="flex gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onDelete}
                            className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onEdit}
                            className="h-8 w-8 text-slate-400 hover:bg-slate-50"
                        >
                            <Edit3 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2 min-h-[40px]">
                        {description || "Sem descrição"}
                    </p>
                </div>
            </div>

            {/* Footer do Card: Badge da categoria e contador */}
            <div className="mt-6 flex items-center justify-between">
                <span
                    className="rounded-full px-3 py-1 text-xs font-bold"
                    style={{
                        backgroundColor: colorScheme.background,
                        color: colorScheme.icon,
                    }}
                >
                    {title}
                </span>
                <span className="text-sm font-medium text-slate-400">
                    {count} {count === 1 ? "item" : "itens"}
                </span>
            </div>
        </div>
    );
}