import { Field, GraphQLISODateTime, InputType, Float } from "type-graphql";
import { TransactionType } from "../../enums/transactionType.enum";

@InputType()
export class CreateTransactionInput {
  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => TransactionType)
  type: TransactionType;

  @Field(() => GraphQLISODateTime)
  date!: Date;

  @Field(() => Float)
  value!: number;

  @Field(() => String)
  categoryId!: string;
}

@InputType()
export class UpdateTransactionInput {
  @Field(() => String, { nullable: true })
  description?: string;
  
  @Field(() => TransactionType, { nullable: true})
  type: TransactionType;

  @Field(() => GraphQLISODateTime, { nullable: true })
  date?: Date;

  @Field(() => Float, { nullable: true })
  value?: number; 

  @Field(() => String, { nullable: true })
  categoryId?: string;
}
