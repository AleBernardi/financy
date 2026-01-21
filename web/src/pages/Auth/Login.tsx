import { useState } from "react";
import logo from "@/assets/Logo.svg";

import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { Mail, UserRoundPlus } from "lucide-react";

import { InputComponent } from "@/components/Input";
import { PasswordInput } from "@/components/PasswordInput";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/auth";
import { toast } from "sonner";

export function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [loading, setLoading] = useState(false);

    const login = useAuthStore((state) => state.login);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const signUpMutate = await login({
                email,
                password
            })

            if (signUpMutate) {
                toast.success("Login realizado com sucesso!");
            }
        } catch (error: any) {
            toast.error("Erro ao realizar o cadastro!");
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className="flex flex-col min-h-[calc(100vh-4rem)] items-center justify-center">
            <img src={logo} alt="Logo" className="w-64 h-8 mb-8" />

            <Card className="w-full max-w-md rounded-xl p-8">
                <div className="text-center space-y-1 mb-8">
                    <CardTitle className="text-xl font-bold">
                        Fazer login
                    </CardTitle>
                    <CardDescription>
                        Entre na sua conta para continuar
                    </CardDescription>
                </div>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <InputComponent
                            id="email"
                            type="email"
                            placeholder="mail@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            icon={Mail}
                            label="E-mail"
                        />
                        <PasswordInput
                            id="password"
                            placeholder="Digite sua senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            label="Senha"
                        />
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="remember"
                                    checked={remember}
                                    onCheckedChange={(checked) =>
                                        setRemember(checked === true)
                                    }
                                />
                                <Label
                                    htmlFor="remember"
                                    className="text-sm font-normal text-muted-foreground cursor-pointer"
                                >
                                    Lembrar-me
                                </Label>
                            </div>
                            <Button
                                variant="link"
                                asChild
                            >
                                <Link
                                    to="/"
                                >
                                    Recuperar senha
                                </Link>
                            </Button>
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            Entrar
                        </Button>
                        <div className="relative flex items-center">
                            <div className="flex-grow border-t border-border" />
                            <span className="mx-4 text-sm text-muted-foreground">
                                ou
                            </span>
                            <div className="flex-grow border-t border-border" />
                        </div>
                        <div className="space-y-4">
                            <p className="text-sm text-center text-muted-foreground">
                                Ainda não tem uma conta?
                            </p>
                            <Button
                                variant="outline"
                                className="w-full"
                                asChild
                            >
                                <Link
                                    to="/signup"
                                    className="flex items-center justify-center gap-2"
                                >
                                    <UserRoundPlus className="h-4 w-4" />
                                    Criar conta
                                </Link>
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div >
    );
}
