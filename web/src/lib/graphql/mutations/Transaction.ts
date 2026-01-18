import { gql } from "@apollo/client"

export const CREATE_TRANSACTION = gql`
    mutation CreateTransaction($data: CreateTransactionInput!){
        createTransaction(data: $data){
            id
            description
            type
            date
            value
            userId
            user {
                id
                name
                email
            }
            categoryId
            category {
                id
                title
                description
                icon
                color
            }
            createdAt
            updatedAt
        }
    }
`

export const UPDATE_TRANSACTION = gql`
    mutation UpdateTransaction($id: String!, $data: UpdateTransactionInput!){
        updateTransaction(id: $id, data: $data){
            id
            description
            type
            date
            value
            userId
            user {
                id
                name
                email
            }
            categoryId
            category {
                id
                title
                description
                icon
                color
            }
            createdAt
            updatedAt
        }
    }
`

export const DELETE_TRANSACTION = gql`
    mutation DeleteTransaction($id: String!){
        deleteTransaction(id: $id)
    }
`