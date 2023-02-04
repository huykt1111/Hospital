import db from '../models/index';
import bcrypt from "bcrypt";

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

let createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPasswordFromBcrypt = await hashUserPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hashPasswordFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phonenumber: data.phonenumber,
                gender: data.gender === '1' ? true : false,
                roleId: data.roleId
            })

            resolve('OK! Create a new user success!');
        } catch (e) {
            reject(e);
        }
    })
    console.log('data from service');
    console.log(data);
    console.log(hashPasswordFromBcrypt);
}

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }
    });
}

let getAllUser = () => {
    return new Promise((resolve, reject) => {
        try {
            let users = db.User.findAll({
                raw: true,
            });
            resolve(users);
        } catch (e) {
            reject(e);
        }
    });
}

module.exports = {
    createNewUser: createNewUser,
    getAllUser: getAllUser,
}