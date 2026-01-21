import { Page } from "@/components/Page";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import type { Transaction } from "@/types";
import { LIST_TRANSACTIONS } from "@/lib/graphql/queries/Transactions";
import { CreateTransactionDialog } from "./components/CreateTransactionDialog";
import { DeleteTransactionDialog } from "./components/DeleteTransactionDialog";
import { DataTable } from "@/components/Transactions/DataTable";
import { columns } from "@/components/Transactions/Column";
import { UpdateTransactionDialog } from "./components/UpdateTransactionDialog";

export function Transactions() {
    const { data, loading } = useQuery<{ listTransactions: Transaction[] }>(LIST_TRANSACTIONS);
    const [isNewOpen, setIsNewOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

    const transactions = data?.listTransactions || [];

    const handleEditClick = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setIsEditOpen(true);
    };

    const handleDeleteClick = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setIsDeleteOpen(true);
    };

    return (
        <Page>
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <Label className="text-3xl font-medium">Transações</Label>
                        <Label className="text-sm text-muted-foreground">Gerencie todas as suas transações financeiras</Label>
                    </div>
                    <Button size="sm" onClick={() => setIsNewOpen(true)}>
                        <Plus className="h-4 w-4" />
                        Nova transação
                    </Button>
                </div>

                {loading ? (
                    <p className="text-sm text-muted-foreground">Carregando...</p>
                ) : (
                    <DataTable
                        columns={columns}
                        data={transactions}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteClick}
                    />
                )}
            </div>

            <CreateTransactionDialog open={isNewOpen} onOpenChange={setIsNewOpen} />
            <UpdateTransactionDialog
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
                transaction={selectedTransaction}
            />

            <DeleteTransactionDialog
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                transaction={selectedTransaction}
            />
        </Page>
    );
}