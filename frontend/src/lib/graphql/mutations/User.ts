import { gql } from "@apollo/client"

export const UPDATE_USER = gql`
    mutation UpdateUser($data: UpdateUserInput!){
        updateUser(data: $data){
            name
        }
    }
`

export const PASSWORD_RECOVER = gql`
    mutation PasswordRecover($data: PasswordRecoverInput!){
        passwordRecover(data: $data)
    }
`