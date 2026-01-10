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

import { InputIcon } from "@/components/InputIcon";
import { PasswordInput } from "@/components/PasswordInput";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/auth";
import { toast } from "sonner";

export function SignUp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const signUp = useAuthStore((state) => state.signUp);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        console.log({
            name,
            email,
            password,
        });

        try {
            const signUpMutate = await signUp({
                name,
                email,
                password
            })

            if (signUpMutate) {
                toast.success("Cadastro realizado com sucesso!");
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
                        Criar conta
                    </CardTitle>
                    <CardDescription>
                        Comece a controlar suas finanças ainda hoje
                    </CardDescription>
                </div>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <InputIcon
                            id="name"
                            type="text"
                            placeholder="Seu nome completo"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            icon={UserRound}
                            label="Nome completo"
                        />
                        <InputIcon
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
                        <Button type="submit" className="w-full" disabled={loading}>
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
        </div >
    );
}
