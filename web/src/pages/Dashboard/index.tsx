import { LIST_TRANSACTIONS } from "@/lib/graphql/queries/Transactions";
import type { Transaction } from "@/types";
import { useQuery } from "@apollo/client/react";
import { useState } from "react";
import { SummaryCard } from "./components/SummaryCard";
import { colorMap } from "@/lib/utils";
import { ChevronRight, CircleArrowDown, CircleArrowUp, Wallet } from "lucide-react";
import { TransactionType } from "@/types/enums";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { CreateTransactionDialog } from "../Transactions/components/CreateTransactionDialog";
import { Badge } from "@/components/Badge";
import { Icon } from "@/components/Icon";

export function Dashboard() {
    const { data } = useQuery<{ listTransactions: Transaction[] }>(LIST_TRANSACTIONS);
    const [isNewOpen, setIsNewOpen] = useState(false);

    const transactions = data?.listTransactions || [];

    const incomeTotal = transactions
        .filter(t => t.type === TransactionType.INCOME)
        .reduce((acc, t) => acc + t.value, 0);

    const expenseTotal = transactions
        .filter(t => t.type === TransactionType.EXPENSE)
        .reduce((acc, t) => acc + t.value, 0);

    const totalBalance = incomeTotal - expenseTotal;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const currentMonthTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return (
            transactionDate.getMonth() === currentMonth &&
            transactionDate.getFullYear() === currentYear
        );
    });

    const incomeMonth = currentMonthTransactions
        .filter(t => t.type === TransactionType.INCOME)
        .reduce((acc, t) => acc + t.value, 0);

    const expenseMonth = currentMonthTransactions
        .filter(t => t.type === TransactionType.EXPENSE)
        .reduce((acc, t) => acc + t.value, 0);

    const recentTransactions = [...transactions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

    const categorySummary = transactions.reduce((acc, t) => {
        const categoryTitle = t.category.title;
        if (!acc[categoryTitle]) {
            acc[categoryTitle] = {
                count: 0,
                totalValue: 0,
                color: t.category.color
            };
        }
        acc[categoryTitle].count += 1;
        acc[categoryTitle].totalValue += t.value;
        return acc;
    }, {} as Record<string, { count: number; totalValue: number; color: string }>);

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    return (
        <div className="flex flex-col gap-6">
            <div className="grid gap-6 md:grid-cols-3">
                <SummaryCard title="Saldo total" value={totalBalance}>
                    <div style={{ color: colorMap['purple'].icon }}>
                        <Wallet className="h-5 w-5" />
                    </div>
                </SummaryCard>
                <SummaryCard title="Receitas do mês" value={incomeMonth}>
                    <div style={{ color: colorMap['green'].icon }}>
                        <CircleArrowUp className="h-6 w-6" />
                    </div>
                </SummaryCard>
                <SummaryCard title="Despesas do mês" value={expenseMonth}>
                    <div style={{ color: colorMap['red'].icon }}>
                        <CircleArrowDown className="h-6 w-6" />
                    </div>
                </SummaryCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <Card className="lg:col-span-2 flex flex-col h-fit">
                    <div className="flex items-center justify-between px-6 py-5 border-b">
                        <Label className="font-bold text-slate-400 uppercase text-xs tracking-wider">
                            Transações Recentes
                        </Label>
                        <Button variant="link" className="text-green-600 font-semibold gap-1 p-0 h-auto" asChild>
                            <Link to="/transactions" className="flex items-center">
                                Ver todas
                                <ChevronRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </div>

                    <div className="flex flex-col">
                        {recentTransactions.map((t) => (
                            <div key={t.id} className="grid grid-cols-[1fr_auto_200px] items-center border-b last:border-0 hover:bg-slate-50 transition-colors">
                                <div className="py-5 px-6 text-left">
                                    <div className="flex items-center gap-4">
                                        <Icon iconName={t.category.icon} colorName={t.category.color} />
                                        <div className="flex flex-col text-left">
                                            <Label className="font-bold text-slate-700 text-left">
                                                {t.description}
                                            </Label>
                                            <Label className="text-xs text-slate-400 text-left">
                                                {new Intl.DateTimeFormat("pt-BR").format(new Date(t.date))}
                                            </Label>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end px-6">
                                    <Badge title={t.category.title} colorName={t.category.color} />
                                </div>

                                <div className="flex items-center justify-end gap-3 px-6 text-right">
                                    <div className="flex items-center gap-1 justify-end">
                                        <span className="font-bold text-sm text-slate-600">
                                            {t.type === TransactionType.EXPENSE ? '- ' : '+ '}
                                        </span>
                                        <Label className="font-bold text-slate-800 whitespace-nowrap">
                                            {formatCurrency(t.value)}
                                        </Label>
                                    </div>
                                    {t.type === TransactionType.EXPENSE ? (
                                        <CircleArrowDown className="h-5 w-5 text-red-500" />
                                    ) : (
                                        <CircleArrowUp className="h-5 w-5 text-green-500" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="py-5 px-6">
                        <Button
                            variant="ghost"
                            className="w-full border-2 border-dashed border-slate-100 text-green-600 font-semibold hover:bg-slate-50"
                            onClick={() => setIsNewOpen(true)}
                        >
                            + Nova transação
                        </Button>
                    </div>
                </Card>

                <Card className="flex flex-col h-fit text-left">
                    <div className="flex items-center justify-between px-6 py-5 border-b">
                        <Label className="font-bold text-slate-400 uppercase text-xs tracking-wider">
                            Categorias
                        </Label>
                        <Button variant="link" className="text-green-600 font-semibold gap-1 p-0 h-auto" asChild>
                            <Link to="/categories" className="flex items-center">
                                Gerenciar
                                <ChevronRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </div>

                    <div className="flex flex-col gap-5 p-6">
                        {Object.entries(categorySummary).map(([title, data]) => (
                            <div key={title} className="grid grid-cols-[1fr_auto_auto] items-center gap-4">
                                <div className="flex justify-start text-left">
                                    <Badge title={title} colorName={data.color} />
                                </div>
                                <div className="text-right min-w-[60px]">
                                    <Label className="text-[11px] text-slate-400 font-medium whitespace-nowrap">
                                        {data.count} itens
                                    </Label>
                                </div>
                                <div className="text-right min-w-[80px]">
                                    <Label className="font-bold text-slate-800 whitespace-nowrap">
                                        {formatCurrency(data.totalValue)}
                                    </Label>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
            <CreateTransactionDialog open={isNewOpen} onOpenChange={setIsNewOpen} />
        </div>
    );
}