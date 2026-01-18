import { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { InputComponent } from "@/components/Input"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useMutation, useQuery } from "@apollo/client/react"
import { toast } from "sonner"
import { LIST_CATEGORIES } from "@/lib/graphql/queries/Categories"
import { UPDATE_TRANSACTION } from "@/lib/graphql/mutations/Transaction"

import type { Category, Transaction } from "@/types"
import { DatePicker } from "@/components/DatePicker"
import { CurrencyInput } from "@/components/CurrencyInput"
import { SelectInput } from "@/components/SelectInput"
import { TransactionType } from "@/types/enums"

interface UpdateTransactionDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    transaction: Transaction | null
}

export function UpdateTransactionDialog({
    open,
    onOpenChange,
    transaction,
}: UpdateTransactionDialogProps) {
    const { data } = useQuery<{ listCategories: Category[] }>(LIST_CATEGORIES)
    const categories = data?.listCategories || []

    const [type, setType] = useState<"EXPENSE" | "INCOME">(TransactionType.EXPENSE)
    const [description, setDescription] = useState("")
    const [date, setDate] = useState<Date | undefined>()
    const [dateError, setDateError] = useState(false)
    const [value, setValue] = useState(0)
    const [valueError, setValueError] = useState(false)
    const [categoryId, setCategoryId] = useState("")
    const [categoryError, setCategoryError] = useState(false)

    const [updateTransaction, { loading }] = useMutation(UPDATE_TRANSACTION, {
        onCompleted() {
            toast.success("Transação atualizada com sucesso!")
            onOpenChange(false)
        },
        onError(error) {
            toast.error(error.message || "Erro ao atualizar transação")
        },
        refetchQueries: ["ListTransactions"]
    })

    useEffect(() => {
        if (open && transaction) {
            setType(transaction.type as TransactionType)
            setDescription(transaction.description || "")
            setDate(transaction.date ? new Date(transaction.date) : undefined)
            setValue(transaction.value || 0)

            // A correção está aqui: garantimos que sempre passamos uma string
            setCategoryId(transaction.category?.id ?? "")
        }
    }, [open, transaction])

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (!transaction?.id) return

        const isDateInvalid = date === undefined
        const isValueInvalid = value === 0
        const isCategoryInvalid = categoryId === ""

        setDateError(isDateInvalid)
        setValueError(isValueInvalid)
        setCategoryError(isCategoryInvalid)

        if (isDateInvalid || isValueInvalid || isCategoryInvalid) {
            return
        }

        updateTransaction({
            variables: {
                id: transaction.id,
                data: {
                    type,
                    description,
                    date,
                    value: Number(value),
                    categoryId,
                },
            },
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="[&>Button]:hidden">
                <DialogHeader className="space-y-1">
                    <div className="flex items-start justify-between">
                        <div>
                            <DialogTitle>Editar transação</DialogTitle>
                            <DialogDescription>
                                Altere os dados da sua transação
                            </DialogDescription>
                        </div>

                        <Button
                            type="button"
                            onClick={() => onOpenChange(false)}
                            className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                        <Button
                            type="button"
                            onClick={() => setType(TransactionType.EXPENSE)}
                            className={`h-10 rounded-md border font-medium ${type === TransactionType.EXPENSE
                                ? "border-red-500 bg-red-50 text-red-600"
                                : "border-gray-200"
                                }`}
                        >
                            Despesa
                        </Button>

                        <Button
                            type="button"
                            onClick={() => setType(TransactionType.INCOME)}
                            className={`h-10 rounded-md border font-medium ${type === TransactionType.INCOME
                                ? "border-green-600 bg-green-50 text-green-700"
                                : "border-gray-200"
                                }`}
                        >
                            Receita
                        </Button>
                    </div>

                    <InputComponent
                        id="description"
                        label="Descrição"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={loading}
                        required
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <DatePicker
                            label="Data"
                            value={date}
                            onChange={(d) => {
                                setDate(d)
                                setDateError(false)
                            }}
                            error={dateError}
                        />

                        <CurrencyInput
                            id="value"
                            label="Valor"
                            value={value}
                            onChange={(v) => {
                                setValue(v)
                                setValueError(false)
                            }}
                            error={valueError}
                            disabled={loading}
                        />
                    </div>

                    <SelectInput
                        id="category"
                        label="Categoria"
                        value={categoryId}
                        onChange={(val) => {
                            setCategoryId(val)
                            setCategoryError(false)
                        }}
                        error={categoryError}
                        disabled={loading}
                        options={categories.map((category) => ({
                            value: category.id,
                            label: category.title,
                        }))}
                    />

                    <Button
                        type="submit"
                        disabled={loading}
                        className="h-11 w-full rounded-md text-white font-medium"
                    >
                        {loading ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}