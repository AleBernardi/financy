import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type InputComponentProps = React.ComponentProps<typeof Input> & {
    icon?: React.ElementType;
    label?: string;
    className?: string;
    id?: string;
};

export function InputComponent({
    icon: Icon,
    label,
    className,
    id,
    ...props
}: InputComponentProps) {
    return (
        <div className="space-y-1">
            {label && (
                <Label htmlFor={id} className="text-sm font-medium">
                    {label}
                </Label>
            )}
            {Icon && (
                <div className="relative">
                    <Icon
                        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-placeholder pointer-events-none"
                    />

                    <Input
                        className={cn("pl-10", className)}
                        {...props}
                    />
                </div>
            ) || (
                    <Input
                        className={className}
                        {...props}
                    />
                )}
        </div>
    );
}