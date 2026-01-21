import { useState } from "react";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, UserRound, LogOut } from "lucide-react";
import { InputComponent } from "@/components/Input";
import { useAuthStore } from "@/stores/auth";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { useMutation } from "@apollo/client/react";
import { UPDATE_USER } from "@/lib/graphql/mutations/User";

export function Profile() {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const updateStoreUser = useAuthStore((state) => state.updateUser)

    const [name, setName] = useState(user?.name || "");

    const getInitials = (name: string) => {
        const names = name.trim().split(" ");
        if (names.length === 1) return names[0].charAt(0).toUpperCase();
        return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
    };

    const [updateUser, { loading }] = useMutation(UPDATE_USER, {
        onCompleted(data: any) {
            if (data?.updateUser) {
                updateStoreUser({
                    name: data.updateUser.name
                });
            }
            toast.success("Perfil atualizado com sucesso!");
        },
        onError() {
            toast.error("Falha ao atualizar o perfil!")
        },
    })

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();

        updateUser({
            variables: {
                data: {
                    name
                },
            },
        })
    };

    return (
        <div className="flex flex-col min-h-[calc(100vh-10rem)] items-center justify-center">
            <Card className="w-full max-w-md rounded-xl p-8 shadow-sm border-1">
                <CardContent >
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-6 items-center">
                            <div>
                                <Avatar className="h-16 w-16 gray-300 border-1 border-white shadow-sm">
                                    <AvatarFallback className="text-xl font-medium text-gray-700">
                                        {user?.name ? getInitials(user.name) : ""}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="flex flex-col items-center">
                                <Label className="text-xl font-bold text-gray-700">{user?.name || "Usuário"}</Label>
                                <Label className="text-sm text-muted-foreground">{user?.email}</Label>
                            </div>
                        </div>
                        <div></div>
                        <div>
                            <form onSubmit={handleUpdateProfile} >
                                <div className="flex flex-col gap-4">
                                    <div>
                                        <InputComponent
                                            id="name"
                                            type="text"
                                            placeholder="Seu nome completo"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            icon={UserRound}
                                            label="Nome completo"
                                        />
                                    </div>
                                    <div>
                                        <InputComponent
                                            id="email"
                                            type="email"
                                            value={user?.email || ""}
                                            disabled
                                            icon={Mail}
                                            label="E-mail"
                                            className="bg-slate-50 opacity-70 cursor-not-allowed"
                                        />
                                        <span className="text-xs text-muted-foreground">Opcional</span>
                                    </div>
                                    <div>
                                        <Button
                                            type="submit"
                                            className="w-full"
                                            disabled={loading}
                                        >
                                            Salvar alterações
                                        </Button>
                                    </div>
                                    <div>
                                        <Button
                                            variant="outline"
                                            className="w-full flex items-center justify-center gap-2 "
                                            onClick={logout}
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Sair da conta
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}