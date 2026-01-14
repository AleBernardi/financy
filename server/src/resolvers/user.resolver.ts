import { UpdateUserInput } from "@/dtos/input/user.input";
import { GqlUser } from "@/graphql/decorators/user.decorator";
import { IsAuth } from "@/middlewares/auth.middleware";
import { UserModel } from "@/models/user.model";
import { UserService } from "@/services/user.service";
import { User } from "@prisma/client";
import { Arg, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";


@Resolver(() => UserModel)
@UseMiddleware(IsAuth)
export class UserResolver {
    
    private userService = new UserService();

    @Query(() => UserModel)
    async getUser(
        @Arg('id', () => String) id: string
    ):Promise<UserModel>{
        return this.userService.findUser(id);
    }
    
    @Mutation(() => UserModel)
    async updateUser(
        @Arg('data', () => UpdateUserInput) data: UpdateUserInput,
        @GqlUser() user: User
    ): Promise<UserModel>{
        return this.userService.updateUser(user.id, data);
    }
}