import { Field, Float, GraphQLISODateTime, ID, ObjectType } from "type-graphql";
import { UserModel } from "./user.model";

import { CategoryModel } from "./category.model";
import { TransactionType } from "../enums/transactionType.enum";

@ObjectType()
export class TransactionModel {
    
    @Field(() => ID)
    id!: string

    @Field(() => String, {nullable: true})
    description?: string

    @Field(() => TransactionType)
    type: TransactionType;

    @Field(() => GraphQLISODateTime)
    date!: Date

    @Field(() => Float) 
    value!: number;

    @Field(() => String)
    userId!: string

    @Field(() => UserModel, { nullable: true })
    user?: UserModel

    @Field(() => String)
    categoryId!: string

    @Field(() => CategoryModel, { nullable: true })
    category?: CategoryModel

    @Field(() => GraphQLISODateTime)
    createdAt!: Date

    @Field(() => GraphQLISODateTime)
    updatedAt!: Date
}
