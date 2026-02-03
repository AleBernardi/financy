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
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

const profileSchema = z.object({
    name: z.string().min(3, "O nome deve ter no mínimo 3 caracteres"),
});

type ProfileForm = z.infer<typeof profileSchema>;

export function Profile() {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const updateStoreUser = useAuthStore((state) => state.updateUser);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<ProfileForm>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user?.name || "",
        },
    });

    useEffect(() => {
        if (user?.name) {
            setValue("name", user.name);
        }
    }, [user, setValue]);

    const getInitials = (name: string) => {
        const names = name.trim().split(" ");
        if (names.length === 1) return names[0].charAt(0).toUpperCase();
        return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
    };

    const [updateUser, { loading }] = useMutation(UPDATE_USER, {
        onCompleted(data: any) {
            if (data?.updateUser) {
                updateStoreUser({
                    name: data.updateUser.name,
                });
            }
            toast.success("Perfil atualizado com sucesso!");
        },
        onError() {
            toast.error("Falha ao atualizar o perfil!");
        },
    });

    const onSubmit = (data: ProfileForm) => {
        updateUser({
            variables: {
                data: {
                    name: data.name,
                },
            },
        });
    };

    return (
        <div className="flex flex-col min-h-[calc(100vh-10rem)] items-center justify-center">
            <Card className="w-full max-w-md rounded-xl p-8 shadow-sm border-1">
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
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
                                    <Label className="text-xl font-bold text-gray-700">
                                        {user?.name || "Usuário"}
                                    </Label>
                                    <Label className="text-sm text-muted-foreground">{user?.email}</Label>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <div>
                                    <InputComponent
                                        id="name"
                                        type="text"
                                        placeholder="Seu nome completo"
                                        {...register("name")}
                                        icon={UserRound}
                                        label="Nome completo"
                                    />
                                    {errors.name && (
                                        <span className="text-danger text-sm">
                                            {errors.name.message}
                                        </span>
                                    )}
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
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={loading}
                                >
                                    Salvar alterações
                                </Button>

                                <Button
                                    variant="outline"
                                    className="w-full flex items-center justify-center gap-2"
                                    onClick={logout}
                                    type="button"
                                >
                                    <LogOut className="h-4 w-4 text-danger" />
                                    Sair da conta
                                </Button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}