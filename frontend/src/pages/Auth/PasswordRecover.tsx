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
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const sendEmailSchema = z.object({
    email: z.string().email("E-mail inválido"),
});

const verifyCodeSchema = z.object({
    code: z.string().length(6, "O código deve ter 6 dígitos"),
});

const resetPasswordSchema = z
    .object({
        password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
        confirmPassword: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "As senhas não coincidem",
        path: ["confirmPassword"],
    });

type SendEmailForm = z.infer<typeof sendEmailSchema>;
type VerifyCodeForm = z.infer<typeof verifyCodeSchema>;
type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export function PasswordRecover() {
    const [email, setEmail] = useState("");
    const [emailSent, setEmailSent] = useState(false);
    const [verifiedCode, setVerifiedCode] = useState(false);

    const [resendTimer, setResendTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);

    const navigate = useNavigate();

    const {
        register: registerEmail,
        handleSubmit: handleSubmitEmail,
        formState: { errors: errorsEmail },
    } = useForm<SendEmailForm>({
        resolver: zodResolver(sendEmailSchema),
    });

    const {
        register: registerCode,
        handleSubmit: handleSubmitCode,
        formState: { errors: errorsCode },
    } = useForm<VerifyCodeForm>({
        resolver: zodResolver(verifyCodeSchema),
    });

    const {
        register: registerReset,
        handleSubmit: handleSubmitReset,
        formState: { errors: errorsReset },
    } = useForm<ResetPasswordForm>({
        resolver: zodResolver(resetPasswordSchema),
    });

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

    const [resetPassword, { loading: loadingReset }] = useMutation(
        RESET_PASSWORD,
        {
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

    const onSendEmail = (data: SendEmailForm) => {
        setEmail(data.email);
        sendPasswordRecoveryCode({
            variables: { data: { email: data.email } },
        });
    };

    const onVerifyCode = (data: VerifyCodeForm) => {
        verifyPasswordRecoveryCode({
            variables: {
                data: {
                    email,
                    code: Number(data.code),
                },
            },
        });
    };

    const onResetPassword = (data: ResetPasswordForm) => {
        resetPassword({
            variables: {
                data: {
                    email,
                    password: data.password,
                },
            },
        });
    };

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
                            onSubmit={handleSubmitEmail(onSendEmail)}
                            className="space-y-6"
                        >
                            <div>
                                <InputComponent
                                    id="email"
                                    type="email"
                                    placeholder="mail@example.com"
                                    {...registerEmail("email")}
                                    icon={Mail}
                                    label="E-mail"
                                />
                                {errorsEmail.email && (
                                    <span className="text-red-500 text-sm">
                                        {errorsEmail.email.message}
                                    </span>
                                )}
                            </div>

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
                            onSubmit={handleSubmitCode(onVerifyCode)}
                            className="space-y-6"
                        >
                            <div>
                                <InputComponent
                                    id="code"
                                    type="text"
                                    placeholder="000000"
                                    maxLength={6}
                                    {...registerCode("code")}
                                    label="Código"
                                />
                                {errorsCode.code && (
                                    <span className="text-red-500 text-sm">
                                        {errorsCode.code.message}
                                    </span>
                                )}
                            </div>

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
                            onSubmit={handleSubmitReset(onResetPassword)}
                            className="space-y-6"
                        >
                            <div>
                                <InputComponent
                                    id="password"
                                    type="password"
                                    label="Nova senha"
                                    {...registerReset("password")}
                                />
                                {errorsReset.password && (
                                    <span className="text-red-500 text-sm">
                                        {errorsReset.password.message}
                                    </span>
                                )}
                            </div>

                            <div>
                                <InputComponent
                                    id="confirmPassword"
                                    type="password"
                                    label="Confirmar senha"
                                    {...registerReset("confirmPassword")}
                                />
                                {errorsReset.confirmPassword && (
                                    <span className="text-red-500 text-sm">
                                        {errorsReset.confirmPassword.message}
                                    </span>
                                )}
                            </div>

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
