import { LoginInput, PasswordRecoverInput, RegisterInput } from "@/dtos/input/auth.input";
import { prismaClient } from "../../prisma/prisma";
import { comparePassword, hashPassword } from "@/utils/hash";
import { singJwt } from "@/utils/jwt";
import { User } from "@prisma/client";
import nodemailer from "nodemailer"


export class AuthService {
    async register(data: RegisterInput){
        const existingUser = await prismaClient.user.findUnique({
            where: {
                email: data.email
            }
        });

        if (existingUser) throw new Error("E-mail já cadastrado!");

        const hash = await hashPassword(data.password);
    
        const user = await prismaClient.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hash
            }
        });

        return this.genertateTokens(user);
    }

    async login(data: LoginInput){
        const existingUser = await prismaClient.user.findUnique({
            where: {
                email: data.email
            }
        });

        if (!existingUser) throw new Error("Usuário não cadastrado!");

        const compare = await comparePassword(data.password, existingUser.password);

        if (!compare) throw new Error("Senha inválida!");

        return this.genertateTokens(existingUser);
    }

    async sendPasswordRecoveryCode(data: PasswordRecoverInput) {
        const existingUser = await prismaClient.user.findUnique({
            where: {
                email: data.email
            }
        });

        if (!existingUser) throw new Error("Usuário não cadastrado!");

        const code = Math.floor(100000 + Math.random() * 900000)
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000)

        await prismaClient.user.update({
            where: { id: existingUser.id },
            data: {
                passwordRecoveryCode: code,
                passwordRecoveryExpiresAt: expiresAt,
            },
        })

        await this.sendPasswordRecoverEmail(existingUser, code)

        return true
    }

    async verifyPasswordRecoveryCode(data: PasswordRecoverInput) {
        const user = await prismaClient.user.findFirst({
            where: {
                email: data.email,
                passwordRecoveryCode: data.code,
                passwordRecoveryExpiresAt: {
                    gte: new Date(),
                },
            },
        });

        if (!user) {
            throw new Error("Código inválido ou expirado.");
        }

        return true;
    }

    async resetPassword(data: PasswordRecoverInput){
        const user = await prismaClient.user.findFirst({
            where: {
                email: data.email,
                passwordRecoveryCode: data.code,
                passwordRecoveryExpiresAt: {
                    gte: new Date(),
                },
            },
        });

        if (!user) {
            throw new Error("Código inválido ou expirado.");
        }

        const hash = await hashPassword(data.password);
    
        await prismaClient.user.update({
            where: {
                id: user.id
            },
            data: {
                password: hash
            }
        });

        return true;
    }

    genertateTokens(user: User) {
        const token = singJwt({id: user.id, email: user.email}, '4h');
        const refreshToken = singJwt({id: user.id, email: user.email}, '1d');

        return { token, refreshToken, user }
    }

    async sendPasswordRecoverEmail(user: User, code: number) {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        })

        await transporter.sendMail({
            from: process.env.MAIL_FROM,
            to: user.email,
            subject: "Código para recuperação de senha",
            html: `
                <p>Olá, ${user.name}</p>

                <p>Você solicitou a recuperação de senha.</p>

                <p><strong>Seu código é:</strong></p>

                <h2 style="letter-spacing: 4px;">${code}</h2>

                <p>Este código expira em 5 minutos.</p>

                <p>Se você não solicitou essa recuperação, ignore este e-mail.</p>
            `,
        })
    }
}