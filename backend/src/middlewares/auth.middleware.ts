import { GraphqlContext } from "@/graphql/context";
import { MiddlewareFn } from "type-graphql/build/typings/typings/middleware";


export const IsAuth: MiddlewareFn<GraphqlContext> = async ({ context }, next) => {
    if(!context.user) throw new Error("Usuário não autenticado!");

    return next();
}