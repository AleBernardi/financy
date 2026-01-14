interface SummaryCardProps {
    title: string;
    value: string | number;
    children: React.ReactNode;
}

export function SummaryCard({ title, value, children }: SummaryCardProps) {
    return (
        <div className="flex items-center gap-4 rounded-xl border bg-white p-6 shadow-sm">
            {children}

            <div>
                <p className="text-2xl font-bold text-slate-900">{value}</p>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 line-clamp-1">
                    {title}
                </p>
            </div>
        </div>
    );
}