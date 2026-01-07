import { CreateCategoryInput, UpdateCategoryInput } from "@/dtos/input/category.input";
import { prismaClient } from "../../prisma/prisma";


export class CategoryService {
    async createCategory(data: CreateCategoryInput, userId: string){
        return prismaClient.category.create({
            data: {
                title: data.title,
                description: data.description,
                icon: data.icon,
                color: data.color,
                userId: userId
            }
        })
    }

    async updateCategory(id: string, data: UpdateCategoryInput, userId: string) {
        const category = await prismaClient.category.findUnique({
            where: {
                id,
                userId
            }
        });

        if(!category) throw new Error("Categoria não foi encontrada!");

        return prismaClient.category.update({
            where:{
                id
            },
            data: {
                title: data.title,
                description: data.description,
                icon: data.icon,
                color: data.color
            }
        })
    }

    async deleteCategory(id: string, userId: string){
        const category = await prismaClient.category.findUnique({
            where: {
                id,
                userId
            }
        });

        if(!category) throw new Error("Categoria não foi encontrada!");

        return prismaClient.category.delete({
            where: {
                id
            }
        })
    }

    async listCategories(userId: string){
        return prismaClient.category.findMany({
            where: {
                userId
            }
        })
    }
} 