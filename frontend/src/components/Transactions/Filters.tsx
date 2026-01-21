import type { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { SelectInput } from "@/components/SelectInput"; // Assumindo que você já tem este componente
import { TransactionType } from "@/types/enums";
import { useQuery } from "@apollo/client/react";
import { LIST_CATEGORIES } from "@/lib/graphql/queries/Categories";
import type { Category } from "@/types/index";
import { DatePicker } from "../DatePicker";

interface TableFiltersProps<TData> {
    table: Table<TData>;
}

export function Filters<TData>({ table }: TableFiltersProps<TData>) {
    const { data } = useQuery<{ listCategories: Category[] }>(LIST_CATEGORIES);
    const categories = data?.listCategories || [];

    return (
        <div className="flex gap-4 p-6 bg-white border rounded-xl">
            <div className="flex flex-col w-full">
                <span className="text-sm font-bold">Buscar</span>
                <Input
                    placeholder="Descrição..."
                    value={(table.getColumn("description")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => table.getColumn("description")?.setFilterValue(event.target.value)}
                />
            </div>

            <div className="flex flex-col w-full">
                <span className="text-sm font-bold">Tipo</span>
                <SelectInput
                    id="type-filter"
                    value={(table.getColumn("type")?.getFilterValue() as string) ?? "ALL"}
                    onChange={(val) => table.getColumn("type")?.setFilterValue(val === "ALL" ? "" : val)}
                    options={[
                        { label: "Todos", value: "ALL" },
                        { label: "Receita", value: TransactionType.INCOME },
                        { label: "Despesa", value: TransactionType.EXPENSE },
                    ]}
                />
            </div>

            <div className="flex flex-col w-full">
                <span className="text-sm font-bold">Categoria</span>
                <SelectInput
                    id="category-filter"
                    value={(table.getColumn("category_title")?.getFilterValue() as string) ?? "ALL"}
                    onChange={(val) => table.getColumn("category_title")?.setFilterValue(val === "ALL" ? "" : val)}
                    options={[
                        { label: "Todas", value: "ALL" },
                        ...categories.map(cat => ({ label: cat.title, value: cat.title }))
                    ]}
                />
            </div>

            <div className="flex flex-col w-full">
                <DatePicker
                    label="Mês / Ano"
                    value={table.getColumn("date")?.getFilterValue() as Date | undefined}
                    onChange={(date) => table.getColumn("date")?.setFilterValue(date)}
                    formatType="month" // Exibe apenas Mês e Ano no botão
                    placeholder="Todos os meses"
                />
            </div>
        </div>
    );
}