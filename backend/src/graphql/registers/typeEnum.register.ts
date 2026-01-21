import { registerEnumType } from "type-graphql";
import { TransactionType } from "../../enums/transactionType.enum";

registerEnumType(TransactionType, {
  name: "TransactionType",
  description: "Tipo da transação",
});