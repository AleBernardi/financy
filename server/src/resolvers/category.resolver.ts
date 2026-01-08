import { CreateCategoryInput, UpdateCategoryInput } from "@/dtos/input/category.input";
import { GqlUser } from "@/graphql/decorators/user.decorator";
import { IsAuth } from "@/middlewares/auth.middleware";
import { CategoryModel } from "@/models/category.model";
import { UserModel } from "@/models/user.model";
import { CategoryService } from "@/services/category.service";
import { UserService } from "@/services/user.service";
import { User } from "@prisma/client";
import { Arg, FieldResolver, Mutation, Query, Resolver, Root, UseMiddleware } from "type-graphql";


@Resolver(() => CategoryModel)
@UseMiddleware(IsAuth)
export class CategoryResolver {
    private categoryService = new CategoryService();
        private userService = new UserService();

    @Mutation(() => CategoryModel)
    async createCategory(
        @Arg('data', () => CreateCategoryInput) data: CreateCategoryInput,
        @GqlUser() user: User
    ): Promise<CategoryModel>{ 
        return this.categoryService.createCategory(data, user.id);
    }

    @Mutation(() => CategoryModel)
    async updateCategory(
        @Arg('data', () => UpdateCategoryInput) data: UpdateCategoryInput,
        @Arg('id', () => String) id: string,
        @GqlUser() user: User
    ): Promise<CategoryModel>{ 
        return this.categoryService.updateCategory(id, data, user.id);
    }

    @Mutation(() => Boolean)
    async deleteCategory(
        @Arg('id', () => String) id: string,
        @GqlUser() user: User
    ): Promise<Boolean>{
        await this.categoryService.deleteCategory(id, user.id);

        return true;
    }

    @Query(() => [CategoryModel])
    async listCategories(
        @GqlUser() user: User
    ): Promise<CategoryModel[]>{
        return this.categoryService.listCategories(user.id);
    }

    @FieldResolver(() => UserModel)
    async user(@Root() category: CategoryModel): Promise<UserModel>{

        return this.userService.findUser(category.userId);
    }
}