import { LoginInput, PasswordRecoverInput, RegisterInput } from '@/dtos/input/auth.input';
import { LoginOutput, RegisterOutput } from "@/dtos/output/auth.output";
import { AuthService } from '@/services/auth.service';
import { Arg, Mutation, Resolver } from "type-graphql";


@Resolver()
export class AuthResolver {

    private authService = new AuthService();

    @Mutation(() => LoginOutput)
    async login(@Arg('data', () => LoginInput) data: LoginInput): Promise<LoginOutput> {
        return this.authService.login(data);
    }


    @Mutation(() => RegisterOutput)
    async register(@Arg('data', () => RegisterInput) data: RegisterInput): Promise<RegisterOutput> {
        return this.authService.register(data);
    }

    @Mutation(() => Boolean)
    async passwordRecover(
        @Arg('data', () => PasswordRecoverInput) data: PasswordRecoverInput
    ): Promise<Boolean>{
        await this.authService.passwordRecover(data);

        return true;
    }
}