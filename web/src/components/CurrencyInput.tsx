import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface CurrencyInputProps {
    id: string
    label?: string
    value?: number
    onChange: (value: number) => void
    disabled?: boolean
    error?: boolean
}

function formatCurrency(value: number) {
    return value
        .toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })
}

export function CurrencyInput({
    id,
    label,
    value = 0,
    onChange,
    disabled,
    error,
}: CurrencyInputProps) {
    const [displayValue, setDisplayValue] = useState("0,00")

    useEffect(() => {
        setDisplayValue(formatCurrency(value))
    }, [value])

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const numeric = e.target.value.replace(/\D/g, "")
        const number = Number(numeric) / 100

        setDisplayValue(formatCurrency(number))
        onChange(number)
    }

    return (
        <div className="flex flex-col space-y-1 w-full">
            {label && (
                <Label htmlFor={id} className="text-sm font-medium">
                    {label}
                    {error && <span className="text-red-500 ml-1">*</span>}
                </Label>
            )}

            <div
                className={cn(
                    "relative flex items-center",
                    error && "ring-1 ring-red-500 rounded-md"
                )}
            >
                <span className="absolute left-3 text-sm text-foreground">
                    R$
                </span>

                <Input
                    id={id}
                    value={displayValue}
                    onChange={handleChange}
                    disabled={disabled}
                    className={cn(
                        "h-11 pl-8",
                        error && "border-red-500 focus-visible:ring-red-500"
                    )}
                    inputMode="numeric"
                />
            </div>

            {error && (
                <span className="text-xs text-red-500">
                    Campo obrigatório
                </span>
            )}
        </div>
    )
}
