import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type InputIconProps = React.ComponentProps<typeof Input> & {
    icon: React.ElementType;
    label?: string;
};

export function InputIcon({
    icon: Icon,
    label,
    className,
    id,
    ...props
}: InputIconProps) {
    return (
        <div className="space-y-2">
            {label && (
                <Label htmlFor={id} className="text-sm font-medium">
                    {label}
                </Label>
            )}
            <div className="relative">
                <Icon
                    className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-placeholder pointer-events-none"
                />

                <Input
                    className={cn("pl-10", className)}
                    {...props}
                />
            </div>
        </div>
    );
}