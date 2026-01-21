import { Prisma } from "@prisma/client";
import { prismaClient } from "../../prisma/prisma";
import { CreateTransactionInput, UpdateTransactionInput } from "@/dtos/input/transaction.input";


export class TransactionService {
    async createTransaction(data: CreateTransactionInput, userId: string){
        return prismaClient.transaction.create({
            data: {
                description: data.description,
                type: data.type,
                date: data.date,
                value: data.value,
                categoryId: data.categoryId,
                userId: userId
            }
        })
    }

    async updateTransaction(id: string, data: UpdateTransactionInput, userId: string) {
        const transaction = await prismaClient.transaction.findUnique({
            where: {
                id,
                userId
            }
        });

        if(!transaction) throw new Error("Transação não foi encontrada!");

        return prismaClient.transaction.update({
            where:{
                id
            },
            data: {
                description: data.description,
                type: data.type,
                date: data.date,
                value: data.value,
                categoryId: data.categoryId,
            }
        })
    }

    async deleteTransaction(id: string, userId: string){
        const transaction = await prismaClient.transaction.findUnique({
            where: {
                id,
                userId
            }
        });

        if(!transaction) throw new Error("Transação não foi encontrada!");

        return prismaClient.transaction.delete({
            where: {
                id
            }
        })
    }

    async listTransactionsByUser(userId: string){
        return prismaClient.transaction.findMany({
            where: {
                userId
            },
            orderBy: {
                date: 'desc'
            }
        })
    }

    async listTransactionsByCategory(categoryId: string){
        return prismaClient.transaction.findMany({
            where: {
                categoryId
            }
        })
    }

    async countTransactions(categoryId: string){
        return prismaClient.transaction.count({
            where: {
                categoryId
            }
        })
    }
}
