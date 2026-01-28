import { Field, InputType } from "type-graphql"

@InputType()
export class RegisterInput {
    @Field(() => String)
    name!: string

    @Field(() => String)
    email!: string

    @Field(() => String)
    password!: string
}

@InputType()
export class LoginInput {
    @Field(() => String)
    email!: string

    @Field(() => String)
    password!: string
}

@InputType()
export class PasswordRecoverInput {
    @Field(() => String)
    email!: string

    @Field(() => Number, {nullable: true})
    code?: number

    @Field(() => String, {nullable: true})
    password?: string
}