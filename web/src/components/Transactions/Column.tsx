import { Badge } from "@/components/Badge";
import type { Transaction } from "@/types";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpCircle, ArrowDownCircle, Trash2, Edit3 } from "lucide-react";
import { Icon } from "../Icon";
import { Button } from "../ui/button";
import { TransactionType } from "@/types/enums";
import { Label } from "../ui/label";

function formatCurrency(value: number) {
    return value.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

export const columns: ColumnDef<Transaction>[] = [
    {
        accessorKey: "description",
        header: () => <div className="text-left">Descrição</div>,
        cell: ({ row }) => (
            <div className="flex items-center gap-4 text-left">
                <Icon iconName={row.original.category.icon} colorName={row.original.category.color} />
                <Label className="text-gray-800">{row.original.description}</Label>
            </div>
        ),
    },
    {
        accessorKey: "date",
        header: () => <div className="text-center">Data</div>,
        cell: ({ row }) => (
            <div className="text-center">
                <Label>{new Intl.DateTimeFormat("pt-BR").format(new Date(row.original.date))}</Label>
            </div>
        ),
        filterFn: (row, columnId, filterValue) => {
            if (!filterValue) return true;
            const rowDate = new Date(row.getValue(columnId));
            const [year, month] = filterValue.split("-");
            return (
                rowDate.getFullYear() === parseInt(year) &&
                (rowDate.getMonth() + 1) === parseInt(month)
            );
        },
    },
    {
        id: "category_title",
        accessorKey: "category.title",
        header: () => <div className="text-center">Categoria</div>,
        cell: ({ row }) => (
            <div className="flex justify-center">
                <Badge title={row.original.category.title} colorName={row.original.category.color} />
            </div>
        ),
    },
    {
        accessorKey: "type",
        header: () => <div className="text-center">Tipo</div>,
        cell: ({ row }) => {
            const isExpense = row.original.type === TransactionType.EXPENSE;
            return (
                <div className={`flex items-center justify-center gap-2 ${isExpense ? "text-danger" : "text-brand-base"}`}>
                    {isExpense ? <ArrowDownCircle size={16} /> : <ArrowUpCircle size={16} />}
                    <span>{isExpense ? "Saída" : "Entrada"}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "value",
        header: () => <div className="text-right">Valor</div>,
        cell: ({ row }) => {
            const isExpense = row.original.type === TransactionType.EXPENSE;
            return (
                <div className="text-right font-bold text-gray-800">
                    <Label>
                        {isExpense ? "- " : "+ "} R$ {formatCurrency(row.original.value)}
                    </Label>
                </div>
            );
        },
    },
    {
        id: "action",
        header: () => <div className="text-right">Ação</div>,
        cell: ({ row, table }) => {
            const meta = table.options.meta as any;
            return (
                <div className="flex justify-end gap-1">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => meta.onDelete(row.original)}
                        className="h-8 w-8 text-danger"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => meta.onEdit(row.original)}
                        className="h-8 w-8 text-gray-700"
                    >
                        <Edit3 className="h-4 w-4" />
                    </Button>
                </div>
            );
        },
    },
];