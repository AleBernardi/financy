import { useAuthStore } from "@/stores/auth"
import logo from "@/assets/logo.svg"



export function Header() {
    const { user, isAuthenticated } = useAuthStore()
    return (
        <div className="w-full p-12 py-4 bg-white border-b border-gray-200">
            {isAuthenticated && (
                <div className="flex justify-between w-full">
                    <div className="min-w-48">
                        <img src={logo} />
                    </div>
                </div>
            )}
        </div>
    )
}