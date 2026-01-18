import { colorMap } from "@/lib/utils";

type BadgeProps = {
    title: string;
    colorName: string;
};

export function Badge({ title, colorName }: BadgeProps) {

    const colorScheme = colorMap[colorName] || {
        icon: "#64748B",
        background: "#F1F5F9",
    };
    return (
        <span
            className="rounded-full px-3 py-1 text-xs font-bold inline-block"
            style={{
                backgroundColor: colorScheme.background,
                color: colorScheme.icon,
            }}
        >
            {title}
        </span>
    );
}