import { useState, useEffect } from "react"
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
import { CREATE_CATEGORY } from "@/lib/graphql/mutations/Category"
import { toast } from "sonner"

interface CreateCategoryDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
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

export function CreateCategoryDialog({
    open,
    onOpenChange,
}: CreateCategoryDialogProps) {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [icon, setIcon] = useState("")
    const [color, setColor] = useState("")

    const [createCategory, { loading }] = useMutation(CREATE_CATEGORY, {
        onCompleted() {
            toast.success("Categoria cadastrada com sucesso!")
            onOpenChange(false)
        },
        onError() {
            toast.error("Falha ao cadastrar a categoria!")
        },
    })

    useEffect(() => {
        if (open) {
            setTitle("")
            setDescription("")
            setIcon("")
            setColor("")
        }
    }, [open])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!icon || !color) {
            toast.error("Selecione um ícone e uma cor")
            return
        }

        createCategory({
            variables: {
                data: {
                    title,
                    description,
                    icon,
                    color,
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
                            <DialogTitle>Nova categoria</DialogTitle>
                            <DialogDescription>
                                Organize suas transações com categorias
                            </DialogDescription>
                        </div>

                        <button
                            type="button"
                            onClick={() => onOpenChange(false)}
                            className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputComponent
                        id="title"
                        label="Título"
                        placeholder="Ex. Alimentação"
                        disabled={loading}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />

                    <InputComponent
                        id="description"
                        label="Descrição"
                        placeholder="Descrição da categoria"
                        disabled={loading}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <span className="text-xs text-muted-foreground">Opcional</span>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Ícone</label>
                        <div className="grid grid-cols-8 gap-2 place-items-center">
                            {icons.map(({ name, icon: Icon }) => (
                                <button
                                    key={name}
                                    type="button"
                                    disabled={loading}
                                    onClick={() => setIcon(name)}
                                    className={`flex h-[42px] w-[42px] items-center justify-center rounded-md border transition
                                        ${icon === name
                                            ? "border-green-600 bg-green-50"
                                            : "border-gray-200 hover:bg-gray-100"
                                        }`}
                                >
                                    <Icon className="h-5 w-5 text-gray-600" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Cor</label>
                        <div className="grid grid-cols-7 gap-2 place-items-center">
                            {colors.map(({ name, color: c }) => (
                                <button
                                    key={name}
                                    type="button"
                                    disabled={loading}
                                    onClick={() => setColor(name)}
                                    className={`h-[30px] w-[50px] rounded-md border transition
                                        ${color === name
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
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="h-11 w-full rounded-md bg-green-700 text-white font-medium hover:bg-green-800 disabled:opacity-50"
                    >
                        Salvar
                    </button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
