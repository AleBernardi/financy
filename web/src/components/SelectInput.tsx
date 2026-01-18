import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface SelectInputProps {
    id: string
    label?: string
    value: string | null
    onChange: (value: string) => void
    placeholder?: string
    disabled?: boolean
    required?: boolean
    error?: boolean
    options: {
        value: string
        label: string
    }[]
}

export function SelectInput({
    id,
    label,
    value,
    onChange,
    placeholder = "Selecione",
    disabled,
    required,
    error,
    options,
}: SelectInputProps) {
    return (
        <div className="flex flex-col space-y-1 w-full">
            {label && (
                <Label htmlFor={id} className="text-sm font-medium">
                    {label}
                    {required && <span className="ml-1 text-red-500">*</span>}
                </Label>
            )}

            <Select value={value ?? ""} onValueChange={onChange} disabled={disabled}>
                <SelectTrigger
                    id={id}
                    className={cn(
                        "h-11",
                        error && "border-red-500 ring-1 ring-red-500 focus:ring-red-500"
                    )}
                >
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>

                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {error && (
                <span className="text-xs text-red-500">
                    Campo obrigatório
                </span>
            )}
        </div>
    )
}
