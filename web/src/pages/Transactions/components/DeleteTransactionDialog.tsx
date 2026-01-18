import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useMutation } from "@apollo/client/react"
import { toast } from "sonner"
import type { Transaction } from "@/types"
import { AlertTriangle, X } from "lucide-react"
import { DELETE_TRANSACTION } from "@/lib/graphql/mutations/Transaction"

interface DeleteTransactionDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    transaction: Transaction | null
}

export function DeleteTransactionDialog({
    open,
    onOpenChange,
    transaction,
}: DeleteTransactionDialogProps) {

    const [deleteTransaction, { loading }] = useMutation(DELETE_TRANSACTION, {
        onCompleted() {
            toast.success("Transação removida com sucesso!")
            onOpenChange(false)
        },
        onError(error) {
            toast.error(error.message || "Falha ao remover a transação!")
        },
        refetchQueries: ["ListTransactions"]
    })

    const handleDelete = () => {
        if (!transaction?.id) {
            toast.error("ID da transação não encontrado.")
            return
        }

        deleteTransaction({
            variables: {
                id: transaction.id,
            },
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="[&>button]:hidden max-w-[500px]">
                <DialogHeader className="space-y-3">
                    <div className="flex items-start justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                        </div>
                        <button
                            type="button"
                            onClick={() => onOpenChange(false)}
                            className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 text-gray-600 transition hover:bg-gray-100"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="space-y-1">
                        <DialogTitle className="text-xl text-gray-700">Remover transação</DialogTitle>
                        <DialogDescription asChild>
                            <div className="flex flex-col gap-1">
                                <span className="text-base block">
                                    Realmente deseja remover a transação?
                                </span>
                                <span className="text-sm text-muted-foreground block">
                                    Esta ação não pode ser desfeita.
                                </span>
                            </div>
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end sm:gap-0 mt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                        className="w-full sm:w-auto"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        onClick={handleDelete}
                        disabled={loading}
                        className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
                    >
                        {loading ? "Removendo..." : "Remover"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}