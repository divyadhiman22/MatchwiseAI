import bcrypt from 'bcrypt';
export const encryptPassword = (plainPassword)=>{
    console.log(process.env.SALT, 'Type of ', typeof process.env.SALT);
    return bcrypt.hashSync(plainPassword, parseInt(process.env.SALT));
}
export const compareHash = (plainPassword, dbPassword)=>{
    return bcrypt.compareSync(plainPassword, dbPassword);
}