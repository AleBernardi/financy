import { RegisterInput } from "@/dtos/input/auth.input";
import { prismaClient } from "../../prisma/prisma";
import { hashPassword } from "@/utils/hash";
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

    genertateTokens(user: User) {
        const token = singJwt({id: user.id, email: user.email}, '15m');
        const refreshToken = singJwt({id: user.id, email: user.email}, '1d');

        return { token, refreshToken, user }
    }
}