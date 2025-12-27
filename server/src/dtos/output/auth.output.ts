import { UserModel } from "@/models/user.model"
import { Field, ObjectType } from "type-graphql"

@ObjectType()
export class RegisterOutput {

    @Field(() => String)
    token!: string

    @Field(() => String)
    refreshToken!: string

    @Field(() => UserModel)
    user!: UserModel
}