import { useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { InputComponent } from "@/components/Input"
import { Button } from "@/components/ui/button"
import { ArrowDownCircle, ArrowUpCircle, X } from "lucide-react"
import { useMutation, useQuery } from "@apollo/client/react"
import { toast } from "sonner"
import { LIST_CATEGORIES } from "@/lib/graphql/queries/Categories"
import { UPDATE_TRANSACTION } from "@/lib/graphql/mutations/Transaction"

import type { Category, Transaction } from "@/types"
import { DatePicker } from "@/components/DatePicker"
import { CurrencyInput } from "@/components/CurrencyInput"
import { SelectInput } from "@/components/SelectInput"
import { TransactionType } from "@/types/enums"
import { z } from "zod"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

interface UpdateTransactionDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    transaction: Transaction | null
}

const updateTransactionSchema = z.object({
    type: z.enum(["EXPENSE", "INCOME"]),
    description: z.string().min(1, "A descrição é obrigatória"),
    date: z.date(),
    value: z.number().min(0.01, "O valor deve ser maior que 0"),
    categoryId: z.string().min(1, "A categoria é obrigatória"),
})

type UpdateTransactionForm = z.infer<typeof updateTransactionSchema>

export function UpdateTransactionDialog({
    open,
    onOpenChange,
    transaction,
}: UpdateTransactionDialogProps) {
    const { data } = useQuery<{ listCategories: Category[] }>(LIST_CATEGORIES)
    const categories = data?.listCategories || []

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        control,
        reset,
    } = useForm<UpdateTransactionForm>({
        resolver: zodResolver(updateTransactionSchema),
        defaultValues: {
            type: TransactionType.EXPENSE,
            description: "",
            value: 0,
            categoryId: "",
        },
    })

    const type = watch("type")

    const [updateTransaction, { loading }] = useMutation(UPDATE_TRANSACTION, {
        onCompleted() {
            toast.success("Transação atualizada com sucesso!")
            onOpenChange(false)
        },
        onError(error) {
            toast.error(error.message || "Erro ao atualizar transação")
        },
        refetchQueries: ["ListTransactions"],
    })

    useEffect(() => {
        if (open && transaction) {
            reset({
                type: transaction.type as TransactionType,
                description: transaction.description || "",
                date: transaction.date ? new Date(transaction.date) : undefined,
                value: transaction.value || 0,
                categoryId: transaction.category?.id ?? "",
            })
        }
    }, [open, transaction, reset])

    const onSubmit = (data: UpdateTransactionForm) => {
        if (!transaction?.id) return

        updateTransaction({
            variables: {
                id: transaction.id,
                data: {
                    type: data.type,
                    description: data.description,
                    date: data.date,
                    value: Number(data.value),
                    categoryId: data.categoryId,
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
                            variant="outline"
                            size="icon"
                            onClick={() => onOpenChange(false)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setValue("type", TransactionType.EXPENSE)}
                            className={`${type === TransactionType.EXPENSE
                                ? "border-danger text-danger"
                                : ""
                                }`}
                        >
                            <ArrowDownCircle size={16} />
                            Despesa
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setValue("type", TransactionType.INCOME)}
                            className={`${type === TransactionType.INCOME
                                ? "border-brand-base text-brand-base"
                                : ""
                                }`}
                        >
                            <ArrowUpCircle size={16} />
                            Receita
                        </Button>
                    </div>

                    <div>
                        <InputComponent
                            id="description"
                            label="Descrição"
                            disabled={loading}
                            {...register("description")}
                        />
                        {errors.description && (
                            <span className="text-red-500 text-sm">
                                {errors.description.message}
                            </span>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Controller
                                name="date"
                                control={control}
                                render={({ field }) => (
                                    <DatePicker
                                        label="Data"
                                        value={field.value}
                                        onChange={field.onChange}
                                        error={!!errors.date}
                                    />
                                )}
                            />
                            {errors.date && (
                                <span className="text-red-500 text-sm">
                                    {errors.date.message}
                                </span>
                            )}
                        </div>

                        <div>
                            <Controller
                                name="value"
                                control={control}
                                render={({ field }) => (
                                    <CurrencyInput
                                        id="value"
                                        label="Valor"
                                        value={field.value}
                                        onChange={field.onChange}
                                        error={!!errors.value}
                                        disabled={loading}
                                    />
                                )}
                            />
                            {errors.value && (
                                <span className="text-red-500 text-sm">
                                    {errors.value.message}
                                </span>
                            )}
                        </div>
                    </div>

                    <div>
                        <Controller
                            name="categoryId"
                            control={control}
                            render={({ field }) => (
                                <SelectInput
                                    id="category"
                                    label="Categoria"
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={!!errors.categoryId}
                                    disabled={loading}
                                    options={categories.map((category) => ({
                                        value: category.id,
                                        label: category.title,
                                    }))}
                                />
                            )}
                        />
                        {errors.categoryId && (
                            <span className="text-red-500 text-sm">
                                {errors.categoryId.message}
                            </span>
                        )}
                    </div>

                    <Button
                        type="submit"
                        variant="default"
                        disabled={loading}
                        className="w-full"
                    >
                        Salvar
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}