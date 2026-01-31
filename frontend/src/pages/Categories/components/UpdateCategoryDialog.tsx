import { useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { InputComponent } from "@/components/Input"
import {
    BaggageClaim,
    BookOpen,
    BriefcaseBusiness,
    CarFront,
    Dumbbell,
    Gift,
    HeartPulse,
    House,
    Mailbox,
    PawPrint,
    PiggyBank,
    ReceiptText,
    ShoppingCart,
    Ticket,
    ToolCase,
    Utensils,
    X,
} from "lucide-react"
import { useMutation } from "@apollo/client/react"
import { UPDATE_CATEGORY } from "@/lib/graphql/mutations/Category"
import { toast } from "sonner"
import type { Category } from "@/types"
import { Button } from "@/components/ui/button"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

interface UpdateCategoryDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
    category: Category | null
}

type CategoryColor = {
    name: string
    color: string
}

type CategoryIcon = {
    name: string
    icon: React.ElementType
}

const icons: CategoryIcon[] = [
    { name: "BriefcaseBusiness", icon: BriefcaseBusiness },
    { name: "CarFront", icon: CarFront },
    { name: "HeartPulse", icon: HeartPulse },
    { name: "PiggyBank", icon: PiggyBank },
    { name: "ShoppingCart", icon: ShoppingCart },
    { name: "Ticket", icon: Ticket },
    { name: "ToolCase", icon: ToolCase },
    { name: "Utensils", icon: Utensils },
    { name: "PawPrint", icon: PawPrint },
    { name: "House", icon: House },
    { name: "Gift", icon: Gift },
    { name: "Dumbbell", icon: Dumbbell },
    { name: "BookOpen", icon: BookOpen },
    { name: "BaggageClaim", icon: BaggageClaim },
    { name: "Mailbox", icon: Mailbox },
    { name: "ReceiptText", icon: ReceiptText },
]

const colors: CategoryColor[] = [
    { name: "green", color: "#16A34A" },
    { name: "blue", color: "#2563EB" },
    { name: "purple", color: "#9333EA" },
    { name: "pink", color: "#DB2777" },
    { name: "red", color: "#DC2626" },
    { name: "orange", color: "#EA580C" },
    { name: "yellow", color: "#CA8A04" },
]

const updateCategorySchema = z.object({
    title: z.string().min(1, "O título é obrigatório"),
    description: z.string().optional(),
    icon: z.string().min(1, "Selecione um ícone"),
    color: z.string().min(1, "Selecione uma cor"),
})

type UpdateCategoryForm = z.infer<typeof updateCategorySchema>

export function UpdateCategoryDialog({
    open,
    onOpenChange,
    category,
}: UpdateCategoryDialogProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        reset,
    } = useForm<UpdateCategoryForm>({
        resolver: zodResolver(updateCategorySchema),
        defaultValues: {
            title: "",
            description: "",
            icon: "",
            color: "",
        },
    })

    const selectedIcon = watch("icon")
    const selectedColor = watch("color")

    useEffect(() => {
        if (open && category) {
            reset({
                title: category.title,
                description: category.description || "",
                icon: category.icon,
                color: category.color,
            })
        }
    }, [open, category, reset])

    const [updateCategory, { loading }] = useMutation(UPDATE_CATEGORY, {
        onCompleted() {
            toast.success("Categoria alterada com sucesso!")
            onOpenChange(false)
        },
        onError(error) {
            toast.error(error.message || "Falha ao alterar a categoria!")
        },
        refetchQueries: ["ListCategories"],
    })

    const onSubmit = (data: UpdateCategoryForm) => {
        if (!category?.id) {
            toast.error("ID da categoria não encontrado.");
            return;
        }

        updateCategory({
            variables: {
                id: category.id,
                data: {
                    title: data.title,
                    description: data.description,
                    icon: data.icon,
                    color: data.color,
                },
            },
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="[&>button]:hidden">
                <DialogHeader className="space-y-1">
                    <div className="flex items-start justify-between">
                        <div>
                            <DialogTitle>Editar categoria</DialogTitle>
                            <DialogDescription>
                                Altere as informações da categoria
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
                    <div>
                        <InputComponent
                            id="title"
                            label="Título"
                            disabled={loading}
                            {...register("title")}
                        />
                        {errors.title && (
                            <span className="text-red-500 text-sm">
                                {errors.title.message}
                            </span>
                        )}
                    </div>

                    <InputComponent
                        id="description"
                        label="Descrição"
                        disabled={loading}
                        {...register("description")}
                    />

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Ícone</label>
                        <div className="grid grid-cols-8 gap-2 place-items-center">
                            {icons.map(({ name, icon: Icon }) => (
                                <button
                                    key={name}
                                    type="button"
                                    disabled={loading}
                                    onClick={() => setValue("icon", name, { shouldValidate: true })}
                                    className={`flex h-[42px] w-[42px] items-center justify-center rounded-md border transition
                                        ${selectedIcon === name
                                            ? "border-green-600 bg-green-50"
                                            : "border-gray-200 hover:bg-gray-100"
                                        }`}
                                >
                                    <Icon className="h-5 w-5 text-gray-600" />
                                </button>
                            ))}
                        </div>
                        {errors.icon && (
                            <span className="text-red-500 text-sm">
                                {errors.icon.message}
                            </span>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Cor</label>
                        <div className="grid grid-cols-7 gap-2 place-items-center">
                            {colors.map(({ name, color: c }) => (
                                <button
                                    key={name}
                                    type="button"
                                    disabled={loading}
                                    onClick={() => setValue("color", name, { shouldValidate: true })}
                                    className={`h-[30px] w-[50px] rounded-md border transition
                                        ${selectedColor === name
                                            ? "border-green-600 bg-green-50"
                                            : "border-gray-200 hover:bg-gray-100"
                                        }`}
                                >
                                    <div className="h-full w-full rounded-[6px] bg-white p-1">
                                        <div
                                            className="h-full w-full rounded-[4px]"
                                            style={{ backgroundColor: c }}
                                        />
                                    </div>
                                </button>
                            ))}
                        </div>
                        {errors.color && (
                            <span className="text-red-500 text-sm">
                                {errors.color.message}
                            </span>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="h-11 w-full rounded-md bg-green-700 text-white font-medium hover:bg-green-800 disabled:opacity-50"
                    >
                        Salvar alterações
                    </button>
                </form>
            </DialogContent>
        </Dialog>
    )
}