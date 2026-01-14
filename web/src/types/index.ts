export interface User {
    id: string
    name: string
    email: string
    createdAt?: string
    updatedAt?: string
}

export interface RegisterInput {
    name: string
    email: string
    password: string
}

export interface LoginInput {
    email: string
    password: string
}

export interface Category {
    id: string
    title: string
    description?: string | null
    icon: string
    color: string
    userId: string
    user: User
    countTransactions?: number
    createdAt: string
    updatedAt?: string | null
}