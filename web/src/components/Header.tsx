import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/stores/auth"
import logo from "@/assets/logo.svg"

export function Header() {
    const { user, isAuthenticated } = useAuthStore()
    const location = useLocation()

    const getInitials = (name: string) => {
        const names = name.trim().split(" ")
        if (names.length === 1) return names[0].charAt(0).toUpperCase()

        const firstInitial = names[0].charAt(0)
        const lastInitial = names[names.length - 1].charAt(0)

        return (firstInitial + lastInitial).toUpperCase()
    }

    const navItems = [
        { label: "Dashboard", href: "/" },
        { label: "Transações", href: "/transactions" },
        { label: "Categorias", href: "/categories" },
    ]

    return (
        <header className="w-full px-12 py-4 bg-white border-b border-gray-200">
            {isAuthenticated && (
                <div className="flex items-center justify-between w-full mx-auto">
                    <div className="flex-1">
                        <Link to="/" className="inline-block transition-opacity hover:opacity-80">
                            <img src={logo} alt="Financy Logo" className="h-8" />
                        </Link>
                    </div>

                    <nav className="flex items-center gap-5">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-brand-base",
                                    location.pathname === item.href
                                        ? "text-brand-base font-semibold"
                                        : "text-gray-600"
                                )}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex-1 flex justify-end">
                        <Link to="/profile">
                            <Avatar className="h-10 w-10 border border-gray-200 bg-slate-100 cursor-pointer transition-transform hover:scale-105 active:scale-95">
                                <AvatarFallback className="text-sm font-semibold text-slate-600">
                                    {user?.name ? getInitials(user.name) : "CT"}
                                </AvatarFallback>
                            </Avatar>
                        </Link>
                    </div>
                </div>
            )}
        </header>
    )
}