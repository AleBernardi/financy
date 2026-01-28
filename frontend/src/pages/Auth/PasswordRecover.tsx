import { useEffect, useState } from "react";
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
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
    SEND_PASSWORD_RECOVERY_CODE,
    VERIFY_PASSWORD_RECOVER_CODE,
    RESET_PASSWORD,
} from "@/lib/graphql/mutations/User";

import { useMutation } from "@apollo/client/react";

export function PasswordRecover() {
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [emailSent, setEmailSent] = useState(false);
    const [verifiedCode, setVerifiedCode] = useState(false);

    const [resendTimer, setResendTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);

    const navigate = useNavigate();

    const [sendPasswordRecoveryCode, { loading: loadingSend }] = useMutation(
        SEND_PASSWORD_RECOVERY_CODE,
        {
            onCompleted() {
                setEmailSent(true);
                setCanResend(false);
                setResendTimer(30);
                toast.success("E-mail enviado com sucesso!");
            },
            onError() {
                toast.error("Erro ao enviar e-mail.");
            },
        }
    );

    const [verifyPasswordRecoveryCode, { loading: loadingVerify }] = useMutation(
        VERIFY_PASSWORD_RECOVER_CODE,
        {
            onCompleted() {
                setVerifiedCode(true);
                toast.success("Código verificado com sucesso!");
            },
            onError() {
                toast.error("Código inválido ou expirado.");
            },
        }
    );

    const [resetPassword, { loading: loadingReset }] = useMutation(RESET_PASSWORD, {
            onCompleted() {
                toast.success("Senha redefinida com sucesso!");
                navigate("/login");

            },
            onError() {
                toast.error("Erro ao redefinir senha.");
            },
        }
    );

    useEffect(() => {
        if (!emailSent || canResend) return;

        const interval = setInterval(() => {
            setResendTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setCanResend(true);
                    return 30;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [emailSent, canResend]);

    return (
        <div className="flex flex-col min-h-[calc(100vh-4rem)] items-center justify-center">
            <img src={logo} alt="Logo" className="w-64 h-8 mb-8" />

            {!emailSent && (
                <Card className="w-full max-w-md rounded-xl p-8">
                    <div className="text-center space-y-1 mb-8">
                        <CardTitle className="text-xl font-bold">
                            Recuperar senha
                        </CardTitle>
                        <CardDescription>
                            Informe seu e-mail para receber o código.
                        </CardDescription>
                    </div>

                    <CardContent>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (loadingSend) return;
                                sendPasswordRecoveryCode({
                                    variables: { data: { email } },
                                });
                            }}
                            className="space-y-6"
                        >
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

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={loadingSend}
                            >
                                {loadingSend ? "Enviando..." : "Enviar"}
                            </Button>

                            <div className="relative flex items-center">
                                <div className="flex-grow border-t border-border" />
                                <span className="mx-3 text-sm text-muted-foreground">
                                    ou
                                </span>
                                <div className="flex-grow border-t border-border" />
                            </div>

                            <Button
                                variant="outline"
                                className="w-full"
                                asChild
                            >
                                <Link to="/login">
                                    <LogIn className="h-4 w-4 mr-2" />
                                    Fazer login
                                </Link>
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            {emailSent && !verifiedCode && (
                <Card className="w-full max-w-md rounded-xl p-8">
                    <div className="text-center space-y-1 mb-8">
                        <CardTitle className="text-xl font-bold">
                            Verificar código
                        </CardTitle>
                        <CardDescription>
                            Informe o código de 6 dígitos enviado ao e-mail.
                        </CardDescription>
                    </div>

                    <CardContent>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (loadingVerify) return;
                                verifyPasswordRecoveryCode({
                                    variables: {
                                        data: {
                                            email,
                                            code: Number(code),
                                        },
                                    },
                                });
                            }}
                            className="space-y-6"
                        >
                            <InputComponent
                                id="code"
                                type="text"
                                placeholder="000000"
                                maxLength={6}
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                label="Código"
                                required
                            />

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={loadingVerify}
                            >
                                {loadingVerify
                                    ? "Verificando..."
                                    : "Verificar código"}
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                disabled={!canResend || loadingSend}
                                onClick={() => {
                                    if (loadingSend) return;
                                    sendPasswordRecoveryCode({
                                        variables: { data: { email } },
                                    });
                                }}
                            >
                                {loadingSend
                                    ? "Enviando..."
                                    : canResend
                                    ? "Reenviar código"
                                    : `Reenviar em ${resendTimer}s`}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            {verifiedCode && (
                <Card className="w-full max-w-md rounded-xl p-8">
                    <div className="text-center space-y-1 mb-8">
                        <CardTitle className="text-xl font-bold">
                            Nova senha
                        </CardTitle>
                        <CardDescription>
                            Crie uma nova senha para sua conta.
                        </CardDescription>
                    </div>

                    <CardContent>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (loadingReset) return;

                                if (password !== confirmPassword) {
                                    toast.error("As senhas não coincidem.");
                                    return;
                                }

                                resetPassword({
                                    variables: {
                                        data: {
                                            email,
                                            password,
                                        },
                                    },
                                });
                            }}
                            className="space-y-6"
                        >
                            <InputComponent
                                id="password"
                                type="password"
                                label="Nova senha"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                required
                            />

                            <InputComponent
                                id="confirmPassword"
                                type="password"
                                label="Confirmar senha"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                required
                            />

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={loadingReset}
                            >
                                {loadingReset
                                    ? "Redefinindo..."
                                    : "Redefinir senha"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
