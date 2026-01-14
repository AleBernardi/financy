import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import * as LucideIcons from "lucide-react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const iconMap: Record<string, LucideIcons.LucideIcon> = {
    BriefcaseBusiness: LucideIcons.BriefcaseBusiness,
    CarFront: LucideIcons.CarFront,
    HeartPulse: LucideIcons.HeartPulse,
    PiggyBank: LucideIcons.PiggyBank,
    ShoppingCart: LucideIcons.ShoppingCart,
    Ticket: LucideIcons.Ticket,
    ToolCase: LucideIcons.ToolCase,
    Utensils: LucideIcons.Utensils,
    PawPrint: LucideIcons.PawPrint,
    House: LucideIcons.House,
    Gift: LucideIcons.Gift,
    Dumbbell: LucideIcons.Dumbbell,
    BookOpen: LucideIcons.BookOpen,
    BaggageClaim: LucideIcons.BaggageClaim,
    Mailbox: LucideIcons.Mailbox,
    ReceiptText: LucideIcons.ReceiptText,
};
interface ColorScheme {
  icon: string;
  background: string; 
}

export const colorMap: Record<string, ColorScheme> = {
    green: {
      icon: "#16A34A",
      background: "#E0FAE9"
    },
    blue:  {
      icon: "#2563EB",
      background: "#DBEAFE"
    },
    purple:  {
      icon: "#9333EA",
      background: "#F3E8FF"
    },
    pink:  {
      icon: "#DB2777",
      background: "#FCE7F3"
    },
    red:  {
      icon: "#DC2626",
      background: "#FEE2E2"
    },
    orange:  {
      icon: "#EA580C",
      background: "#FFEDD5"
    },
    yellow:  {
      icon: "#CA8A04",
      background: "#F7F3CA"
    },
};