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
import { CREATE_TRANSACTION } from "@/lib/graphql/mutations/Transaction"

import type { Category } from "@/types"
import { DatePicker } from "@/components/DatePicker"
import { CurrencyInput } from "@/components/CurrencyInput"
import { SelectInput } from "@/components/SelectInput"

import { TransactionType } from "@/types/enums"

interface CreateTransactionDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
}

export function CreateTransactionDialog({
    open,
    onOpenChange,
    onSuccess,
}: CreateTransactionDialogProps) {
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

    const [createTransaction, { loading }] = useMutation(CREATE_TRANSACTION, {
        onCompleted() {
            toast.success("Transação cadastrada com sucesso!")
            onSuccess?.()
            onOpenChange(false)
        },
        onError() {
            toast.error("Erro ao cadastrar transação")
        },
        refetchQueries: ["ListTransactions"]
    })

    useEffect(() => {
        if (open) {
            setType(TransactionType.EXPENSE)
            setDescription("")
            setDate(undefined)
            setValue(0)
            setCategoryId("")
        }
    }, [open])

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()


        const isDateInvalid = date === undefined
        const isValueInvalid = value === 0
        const isCategoryInvalid = categoryId === ""

        setDateError(isDateInvalid)
        setValueError(isValueInvalid)
        setCategoryError(isCategoryInvalid)

        if (isDateInvalid || isValueInvalid || isCategoryInvalid) {
            return
        }

        setDateError(false)
        setValueError(false)
        setCategoryError(false)

        createTransaction({
            variables: {
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
                            <DialogTitle>Nova transação</DialogTitle>
                            <DialogDescription>
                                Registre sua despesa ou receita
                            </DialogDescription>
                        </div>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => onOpenChange(false)}
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
                        placeholder="Ex. Almoço no restaurante"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={loading}
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
                        onChange={(value) => {
                            setCategoryId(value)
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
                        Salvar
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
