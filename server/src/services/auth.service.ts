import { LoginInput, RegisterInput } from "@/dtos/input/auth.input";
import { prismaClient } from "../../prisma/prisma";
import { comparePassword, hashPassword } from "@/utils/hash";
import { singJwt } from "@/utils/jwt";
import { User } from "@prisma/client";


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

    genertateTokens(user: User) {
        const token = singJwt({id: user.id, email: user.email}, '15m');
        const refreshToken = singJwt({id: user.id, email: user.email}, '1d');

        return { token, refreshToken, user }
    }
}