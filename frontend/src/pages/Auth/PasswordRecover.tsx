import { useState } from "react";
import logo from "@/assets/Logo.svg";

import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { LogIn, Mail } from "lucide-react";

import { InputComponent } from "@/components/Input";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { PASSWORD_RECOVER } from "@/lib/graphql/mutations/User";
import { useMutation } from "@apollo/client/react";

export function PasswordRecover() {
    const [email, setEmail] = useState("");
    const [emailSent, setEmailSent] = useState(false);
    
    const [passwordRecover, { loading }] = useMutation(PASSWORD_RECOVER, {
            onCompleted() {
                setEmailSent(true);
                toast.success("Email enviado com sucesso!");
            },
            onError() {
                toast.error("Erro ao enviar email!");
            },
        })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        passwordRecover({
            variables: {
                data: {
                    email
                },
            },
        })
    };

    return (
        <div className="flex flex-col min-h-[calc(100vh-4rem)] items-center justify-center">
            <img src={logo} alt="Logo" className="w-64 h-8 mb-8" />
            { !emailSent ? (
            <Card className="w-full max-w-md rounded-xl p-8">
                <div className="text-center space-y-1 mb-8">
                    <CardTitle className="text-xl font-bold">
                        Recuperar senha
                    </CardTitle>
                    <CardDescription>
                        Informe seu e-mail para receber o código de recuperação da senha.
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
                        <Button type="submit" className="w-full" disabled={loading}>
                            Enviar
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
                                Lembrou da senha?
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

            ) : (
                
            <Card className="w-full max-w-md rounded-xl p-8">
                <div className="text-center space-y-1 mb-8">
                    <CardTitle className="text-xl font-bold">
                        Recuperar senha
                    </CardTitle>
                    <CardDescription>
                        Informe seu e-mail para receber o código de recuperação da senha.
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
                        <Button type="submit" className="w-full" disabled={loading}>
                            Enviar
                        </Button>
                    </form>
                </CardContent>
            </Card>
            )}
        </div >
    );
}
