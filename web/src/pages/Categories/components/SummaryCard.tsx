import { Card } from "@/components/ui/card";

interface SummaryCardProps {
    title: string;
    value: string | number;
    children: React.ReactNode;
}

export function SummaryCard({ title, value, children }: SummaryCardProps) {
    return (
        <Card className="flex gap-4 rounded-xl border p-6 shadow-sm">
            {children}

            <div className="flex flex-col gap-2">
                <p className="text-2xl font-bold text-slate-900">{value}</p>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 line-clamp-1">
                    {title}
                </p>
            </div>
        </Card>
    );
}