import {gql} from "@apollo/client"

export const LIST_TRANSACTIONS = gql`
    query ListTransactions {
        listTransactions {
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
                userId
                user {
                    id
                    name
                    email
                }
                createdAt
                updatedAt
            }
            createdAt
            updatedAt
        }
    }
`;