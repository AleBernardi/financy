import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Eye, EyeClosed, Lock } from "lucide-react";

type PasswordInputProps = React.ComponentProps<typeof Input> & {
    label?: string;
};

export function PasswordInput({
    className,
    id,
    label,
    ...props
}: PasswordInputProps) {
    const [visible, setVisible] = React.useState(false);

    return (
        <div className="space-y-2">
            {label && (
                <Label htmlFor={id} className="text-sm font-medium">
                    {label}
                </Label>
            )}
            <div className="relative group">
                <Lock
                    className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-placeholder pointer-events-none"
                />

                <Input
                    type={visible ? "text" : "password"}
                    className={cn("pl-10 pr-10", className)}
                    {...props}
                />

                <button
                    type="button"
                    onClick={() => setVisible(!visible)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground focus:outline-none"
                    aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
                >
                    {!visible ? (
                        <EyeClosed className="h-4 w-4" />
                    ) : (
                        <Eye className="h-4 w-4" />
                    )}
                </button>
            </div>
        </div>
    );
}
