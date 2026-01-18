import { Trash2, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/Icon";
import { Badge } from "@/components/Badge";

interface CategoryCardProps {
    title: string;
    description?: string | null;
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

    return (
        <div className="flex flex-col gap-5 justify-between rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <div>
                <div className="flex items-start justify-between">

                    <Icon iconName={iconName} colorName={colorName} />

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

            </div>
            <div>
                <div>
                    <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2 min-h-[40px]">
                        {description || "Sem descrição"}
                    </p>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
                <Badge title={title} colorName={colorName} />
                <span className="text-sm font-medium text-slate-400">
                    {count} {count === 1 ? "item" : "itens"}
                </span>
            </div>
        </div>
    );
}