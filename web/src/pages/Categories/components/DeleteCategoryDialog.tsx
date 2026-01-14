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
import { DELETE_CATEGORY } from "@/lib/graphql/mutations/Category"
import { toast } from "sonner"
import type { Category } from "@/types"
import { AlertTriangle, X } from "lucide-react"

interface DeleteCategoryDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    category: Category | null
}

export function DeleteCategoryDialog({
    open,
    onOpenChange,
    category,
}: DeleteCategoryDialogProps) {

    const [deleteCategory, { loading }] = useMutation(DELETE_CATEGORY, {
        onCompleted() {
            toast.success("Categoria removida com sucesso!")
            onOpenChange(false)
        },
        onError(error) {
            toast.error(error.message || "Falha ao remover a categoria!")
        },
        refetchQueries: ["ListCategories"]
    })

    const handleDelete = () => {
        if (!category?.id) {
            toast.error("ID da categoria não encontrado.")
            return
        }

        deleteCategory({
            variables: {
                id: category.id,
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
                        <DialogTitle className="text-xl text-gray-700">Excluir categoria</DialogTitle>
                        <DialogDescription asChild>
                            <div className="flex flex-col gap-1">
                                <span className="text-base block">
                                    Realmente deseja remover a categoria <span className="font-bold text-gray-700">"{category?.title}"</span>?
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
                        {loading ? "Removendo..." : "Confirmar Exclusão"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}