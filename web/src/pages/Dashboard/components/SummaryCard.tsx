import { Card } from "@/components/ui/card";

interface SummaryCardProps {
    title: string;
    value: number;
    children: React.ReactNode;
}

function formatCurrency(value: number) {
    return value.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

export function SummaryCard({ title, value, children }: SummaryCardProps) {
    return (
        <Card className="flex flex-col gap-4 rounded-xl border p-6 shadow-sm">
            <div className="flex items-center">
                {children}
                <p className="pl-3 text-xs font-semibold uppercase tracking-wider text-slate-500 line-clamp-1">
                    {title}
                </p>

            </div>
            <div>
                <p className="text-2xl font-bold text-slate-900"> R$ {formatCurrency(value)}</p>
            </div>
        </Card>
    );
}