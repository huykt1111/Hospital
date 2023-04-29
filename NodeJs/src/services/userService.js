import db from "../models/index";
import bcrypt from "bcrypt";

const salt = bcrypt.genSaltSync(10);

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

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {}
            let isExist = await checkUserEmail(email);
            if (isExist) {
                let user = await db.TaiKhoan.findOne({
                    where: { email: email, trangThai: 1 },
                    attributes: ['id', 'email', 'vaiTro', 'matKhau', 'ho', 'ten'],
                    raw: true
                });
                if (user) {
                    let check = await bcrypt.compareSync(password, user.matKhau);
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = 'Ok';
                        delete user.matKhau;
                        userData.user = user;
                    }
                    else {
                        userData.errCode = 3;
                        userData.errMessage = 'Wrong password';
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = `User does not exist or is locked!`
                }
            } else {
                userData.errCode = 1;
                userData.errMessage = `Your's Email isn't exist in system. Please try other email!`
            }
            resolve(userData)
        } catch (e) {
            reject(e);
        }
    })
}

let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.TaiKhoan.findOne({
                where: { email: userEmail }
            })
            if (user) {
                resolve(true)
            }
            else {
                resolve(false)
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = '';
            if (userId === 'ALL') {
                users = await db.TaiKhoan.findAll({
                    where: {
                        trangThai: 1,
                        vaiTro: ['R3', 'R2']
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {
                            model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi']
                        },
                    ],
                    raw: false,
                    nest: true
                });
                if (users && users.length > 0) {
                    users.map(item => {
                        if (item.hinhAnh !== null) {
                            item.hinhAnh = new Buffer(item.hinhAnh, 'base64').toString('binary');
                        }
                        return item;
                    })
                }
            }

            if (userId && userId !== 'ALL') {
                users = await db.TaiKhoan.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ['password']
                    }
                });
                if (users && JSON.stringify(users).length > 0) {
                    if (users.hinhAnh !== null) {
                        users.hinhAnh = new Buffer(users.hinhAnh, 'base64').toString('binary');
                    }
                }
            }
            resolve(users);
        } catch (e) {
            reject(e);
        }
    })
}

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Check email is exist
            let check = await checkUserEmail(data.email);
            if (check) {
                resolve({
                    errCode: 1,
                    errMessage: 'Your emaili is already in used, Please try another email!'
                });
            } else {
                let hashPasswordFromBcrypt = await hashUserPassword(data.password);
                await db.TaiKhoan.create({
                    email: data.email,
                    matKhau: hashPasswordFromBcrypt,
                    ho: data.lastName,
                    ten: data.firstName,
                    gioiTinh: data.gender,
                    ngaySinh: data.birthday,
                    diaChi: data.address,
                    soDienThoai: data.phoneNumber,
                    vaiTro: 'R3',
                    trangThai: '1'
                });
                resolve({
                    errCode: 0,
                    message: 'OK'
                });
            }

        } catch (e) {
            reject(e);
        }
    })
}

let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.TaiKhoan.findOne({
                where: { id: userId },
                raw: false
            })
            if (!user) {
                resolve({
                    errCode: 2,
                    errMessage: `The user isn't exist`
                });
            }
            // await user.destroy();
            user.trangThai = 0;
            await user.save();
            resolve({
                errCode: 0,
                message: `The user is deleted`
            })
        } catch (e) {
            reject(e);
        }
    })
}

let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: 'Missing required parameters'
                })
            }

            let user = await db.TaiKhoan.findOne({
                where: { id: data.id },
                raw: false
            });

            if (user) {
                user.ho = data.lastName;
                user.ten = data.firstName;
                user.gioiTinh = data.gender;
                user.ngaySinh = data.birthday;
                user.diaChi = data.address;
                user.soDienThoai = data.phoneNumber;

                if (data.avatar) {
                    user.hinhAnh = data.avatar;
                }

                await user.save();

                resolve({
                    errCode: 0,
                    message: 'Update the user success!'
                })
            }
            else {
                resolve({
                    errCode: 1,
                    errMessage: 'User not found!'
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getAllCodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                });

            } else {
                let res = {};
                let allcode = await db.Allcode.findAll({
                    where: { type: typeInput }
                });
                res.errCode = 0;
                res.data = allcode;
                resolve(res);
            }
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    updateUserData: updateUserData,
    getAllCodeService: getAllCodeService,
}