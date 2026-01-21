import { CreateCategoryInput, UpdateCategoryInput } from "@/dtos/input/category.input";
import { CreateTransactionInput, UpdateTransactionInput } from "@/dtos/input/transaction.input";
import { GqlUser } from "@/graphql/decorators/user.decorator";
import { IsAuth } from "@/middlewares/auth.middleware";
import { CategoryModel } from "@/models/category.model";
import { TransactionModel } from "@/models/transaction.model";
import { UserModel } from "@/models/user.model";
import { CategoryService } from "@/services/category.service";
import { TransactionService } from "@/services/transaction.service";
import { UserService } from "@/services/user.service";
import { User } from "@prisma/client";
import { Arg, FieldResolver, Mutation, Query, Resolver, Root, UseMiddleware } from "type-graphql";


@Resolver(() => TransactionModel)
@UseMiddleware(IsAuth)
export class TransactionResolver {
        private transactionService = new TransactionService();
        private categoryService = new CategoryService();
        private userService = new UserService();

    @Mutation(() => TransactionModel)
    async createTransaction(
        @Arg('data', () => CreateTransactionInput) data: CreateTransactionInput,
        @GqlUser() user: User
    ): Promise<TransactionModel>{ 
        return this.transactionService.createTransaction(data, user.id);
    }

    @Mutation(() => TransactionModel)
    async updateTransaction(
        @Arg('data', () => UpdateTransactionInput) data: UpdateTransactionInput,
        @Arg('id', () => String) id: string,
        @GqlUser() user: User
    ): Promise<TransactionModel>{ 
        return this.transactionService.updateTransaction(id, data, user.id);
    }

    @Mutation(() => Boolean)
    async deleteTransaction(
        @Arg('id', () => String) id: string,
        @GqlUser() user: User
    ): Promise<Boolean>{
        await this.transactionService.deleteTransaction(id, user.id);

        return true;
    }

    @Query(() => [TransactionModel])
    async listTransactions(
        @GqlUser() user: User
    ): Promise<TransactionModel[]>{
        return this.transactionService.listTransactionsByUser(user.id);
    }

    @FieldResolver(() => UserModel)
    async user(@Root() transaction: TransactionModel): Promise<UserModel>{

        return this.userService.findUser(transaction.userId);
    }

    @FieldResolver(() => CategoryModel)
    async category(@Root() transaction: TransactionModel): Promise<CategoryModel>{

        return this.categoryService.findCategory(transaction.categoryId);
    }
}