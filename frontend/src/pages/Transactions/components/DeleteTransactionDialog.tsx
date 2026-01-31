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
import { X } from "lucide-react"
import { DELETE_TRANSACTION } from "@/lib/graphql/mutations/Transaction"
import { Icon } from "@/components/Icon"

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
                        <Icon iconName="AlertTriangle" colorName="red" />
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => onOpenChange(false)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
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
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        {loading ? "Removendo..." : "Remover"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}