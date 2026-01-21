import {gql} from "@apollo/client"

export const LIST_CATEGORIES = gql`
    query ListCategories {
        listCategories {
            id
            title
            description
            icon
            color
            countTransactions
            user {
                id
                name
                email
            }
            transactions {
                id
                description
                value
                date
                type
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