import { gql } from "@apollo/client"

export const UPDATE_USER = gql`
    mutation UpdateUser($data: UpdateUserInput!){
        updateUser(data: $data){
            name
        }
    }
`

export const SEND_PASSWORD_RECOVERY_CODE = gql`
    mutation SendPasswordRecoveryCode($data: PasswordRecoverInput!){
        sendPasswordRecoveryCode(data: $data)
    }
`

export const VERIFY_PASSWORD_RECOVER_CODE = gql`
    mutation VerifyPasswordRecoveryCode($data: PasswordRecoverInput!){
        verifyPasswordRecoveryCode(data: $data)
    }
`

export const RESET_PASSWORD = gql`
    mutation ResetPassword($data: PasswordRecoverInput!){
        resetPassword(data: $data)
    }
`