import * as React from "react"
import { format, setMonth, setYear, startOfMonth } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"

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
    const [viewDate, setViewDate] = React.useState(value || new Date())

    React.useEffect(() => {
        if (value) {
            setViewDate(value)
        }
    }, [value])

    const displayFormat = formatType === "month" ? "MMMM 'de' yyyy" : "dd/MM/yyyy"

    const handleMonthSelect = (monthIndex: number) => {
        const newDate = setMonth(startOfMonth(setYear(new Date(), viewDate.getFullYear())), monthIndex)
        onChange?.(newDate)
        setOpen(false)
    }

    const handleYearChange = (increment: number) => {
        setViewDate(prev => setYear(prev, prev.getFullYear() + increment))
    }

    const months = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ]

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
                    {formatType === "month" ? (
                        <div className="p-3">
                            <div className="flex items-center justify-between mb-4">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleYearChange(-1)}
                                    className="h-7 w-7"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <div className="font-semibold">
                                    {viewDate.getFullYear()}
                                </div>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleYearChange(1)}
                                    className="h-7 w-7"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {months.map((month, index) => (
                                    <Button
                                        key={month}
                                        variant={value && value.getMonth() === index && value.getFullYear() === viewDate.getFullYear() ? "default" : "outline"}
                                        className={`h-9 w-full text-xs justify-center ${value && value.getMonth() === index && value.getFullYear() === viewDate.getFullYear() ? "" : "text-muted-foreground"}`}
                                        onClick={() => handleMonthSelect(index)}
                                    >
                                        {month.substring(0, 3)}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <Calendar
                            mode="single"
                            selected={value}
                            onSelect={(date) => {
                                onChange?.(date)
                                setOpen(false)
                            }}
                            initialFocus
                            locale={ptBR}
                        />
                    )}
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