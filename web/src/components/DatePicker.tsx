import * as React from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

type DatePickerProps = {
    label?: string
    value?: Date | undefined
    onChange?: (date?: Date) => void
    error?: boolean
    placeholder?: string
    formatType?: "default" | "month"
}

export function DatePicker({
    label,
    value,
    onChange,
    error = false,
    placeholder = "Selecione",
    formatType = "default"
}: DatePickerProps) {
    const [open, setOpen] = React.useState(false)

    // Define o formato de exibição
    const displayFormat = formatType === "month" ? "MMMM 'de' yyyy" : "dd/MM/yyyy"

    return (
        <div className="flex flex-col w-full">
            {label && (
                <Label className="text-sm font-medium">
                    {label}
                    {error && <span className="text-danger ml-1">*</span>}
                </Label>
            )}

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        className={`w-full justify-between font-normal ${error ? "border-danger" : ""}`}
                    >
                        <span className="capitalize">
                            {value
                                ? format(value, displayFormat, { locale: ptBR })
                                : placeholder}
                        </span>
                        <CalendarIcon className="h-4 w-4 opacity-50" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={value}
                        onSelect={(date) => {
                            onChange?.(date)
                            setOpen(false)
                        }}
                        initialFocus
                    />
                    {value && (
                        <div className="p-2 border-t">
                            <Button
                                variant="outline"
                                className="w-full h-8 text-xs"
                                onClick={() => {
                                    onChange?.(undefined)
                                    setOpen(false)
                                }}
                            >
                                Limpar filtro
                            </Button>
                        </div>
                    )}
                </PopoverContent>
            </Popover>
        </div>
    )
}