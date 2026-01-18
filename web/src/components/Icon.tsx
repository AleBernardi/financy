import { iconMap, colorMap } from "@/lib/utils";
import { Tag, type LucideIcon } from "lucide-react";

type IconProps = {
    iconName: string;
    colorName: string;
};

export function Icon({
    iconName,
    colorName,
}: IconProps) {

    const Icon = (iconMap[iconName] as LucideIcon) || Tag;

    const colorScheme = colorMap[colorName] || {
        icon: "#64748B",
        background: "#F1F5F9",
    };
    return (
        <div
            className="rounded-lg p-3"
            style={{
                backgroundColor: colorScheme.background,
                color: colorScheme.icon
            }}
        >
            <Icon className="h-4 w-4" />
        </div>
    );
}