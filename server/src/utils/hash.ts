import bcrypt from 'bcryptjs'

export const hashPassword = async (plainPassord: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(plainPassord, salt)
}