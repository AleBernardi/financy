import { useState } from "react";
import logo from "@/assets/Logo.svg";

import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { LogIn, Mail, UserRound } from "lucide-react";

import { InputComponent } from "@/components/Input";
import { PasswordInput } from "@/components/PasswordInput";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/auth";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const signUpSchema = z.object({
    name: z.string().min(3, "O nome deve ter no mínimo 3 caracteres"),
    email: z.string().email("E-mail inválido"),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

type SignUpForm = z.infer<typeof signUpSchema>;

export function SignUp() {
    const [loading, setLoading] = useState(false);

    const signUp = useAuthStore((state) => state.signUp);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignUpForm>({
        resolver: zodResolver(signUpSchema),
    });

    const onSubmit = async (data: SignUpForm) => {
        setLoading(true);

        try {
            const signUpMutate = await signUp({
                name: data.name,
                email: data.email,
                password: data.password,
            });

            if (signUpMutate) {
                toast.success("Cadastro realizado com sucesso!");
            }
        } catch (error: any) {
            toast.error("Erro ao realizar o cadastro!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-[calc(100vh-4rem)] items-center justify-center">
            <img src={logo} alt="Logo" className="w-64 h-8 mb-8" />

            <Card className="w-full max-w-md rounded-xl p-8">
                <div className="text-center space-y-1 mb-8">
                    <CardTitle className="text-xl font-bold">
                        Criar conta
                    </CardTitle>
                    <CardDescription>
                        Comece a controlar suas finanças ainda hoje
                    </CardDescription>
                </div>

                <CardContent>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
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
                                <span className="text-red-500 text-sm">
                                    {errors.name.message}
                                </span>
                            )}
                        </div>
                        <div>
                            <InputComponent
                                id="email"
                                type="email"
                                placeholder="mail@example.com"
                                {...register("email")}
                                icon={Mail}
                                label="E-mail"
                            />
                            {errors.email && (
                                <span className="text-red-500 text-sm">
                                    {errors.email.message}
                                </span>
                            )}
                        </div>
                        <div>
                            <PasswordInput
                                id="password"
                                placeholder="Digite sua senha"
                                {...register("password")}
                                label="Senha"
                            />
                            {errors.password && (
                                <span className="text-red-500 text-sm">
                                    {errors.password.message}
                                </span>
                            )}
                        </div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            Cadastrar
                        </Button>
                        <div className="relative flex items-center">
                            <div className="flex-grow border-t border-border" />
                            <span className="mx-3 text-sm text-muted-foreground">
                                ou
                            </span>
                            <div className="flex-grow border-t border-border" />
                        </div>
                        <div className="space-y-4">
                            <p className="text-sm text-center text-muted-foreground">
                                Já tem uma conta?
                            </p>
                            <Button
                                variant="outline"
                                className="w-full"
                                asChild
                            >
                                <Link
                                    to="/login"
                                    className="flex items-center justify-center gap-2"
                                >
                                    <LogIn className="h-4 w-4" />
                                    Fazer login
                                </Link>
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
