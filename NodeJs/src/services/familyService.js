import db from "../models/index";

let createNewMember = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.ThanhVienGiaDinh.create({
                maTK: data.id,
                email: data.email,
                ho: data.lastName,
                ten: data.firstName,
                gioiTinh: data.gender,
                ngaySinh: data.birthday,
                diaChi: data.address,
                soDienThoai: data.phoneNumber,
                vaiTro: data.positionId,
                hinhAnh: data.avatar
            });
            resolve({
                errCode: 0,
                message: 'OK'
            });

        } catch (e) {
            reject(e);
        }
    })
}

let updateMemberData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            let member = await db.ThanhVienGiaDinh.findOne({
                where: { id: data.id },
                raw: false
            });
            if (member) {
                member.email = data.email;
                member.ho = data.lastName;
                member.ten = data.firstName;
                member.gioiTinh = data.gender;
                if (data.birthday !== "") {
                    member.ngaySinh = data.birthday;
                }
                member.diaChi = data.address;
                member.soDienThoai = data.phoneNumber;
                member.vaiTro = data.positionId;
                if (data.avatar !== "") {
                    member.hinhAnh = data.avatar;
                }

                await member.save();

                resolve({
                    errCode: 0,
                    message: 'Update the member success!'
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

let getAllMember = (idUser) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!idUser.id_user) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter!'
                })
            } else {
                let data = await db.ThanhVienGiaDinh.findAll({
                    where: {
                        maTK: idUser.id_user
                    },
                    include: [
                        {
                            model: db.Allcode, as: 'famRoleData', attributes: ['valueEn', 'valueVi']
                        },
                        {
                            model: db.Allcode, as: 'genderDataFamily', attributes: ['valueEn', 'valueVi']
                        }
                    ],
                    raw: false,
                    nest: true
                });
                if (data && data.length > 0) {
                    data.map(item => {
                        if (item.hinhAnh !== null) {
                            item.hinhAnh = new Buffer(item.hinhAnh, 'base64').toString('binary');
                        }
                        return item;
                    })
                }
                resolve({
                    errMessage: 'ok',
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getMember = (idUser) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!idUser.id_user) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter!'
                })
            } else {
                let data = await db.ThanhVienGiaDinh.findOne({
                    where: {
                        id: idUser.id_user
                    },
                    // include: [
                    //     {
                    //         model: db.Allcode, as: 'famRoleData', attributes: ['valueEn', 'valueVi']
                    //     },
                    //     {
                    //         model: db.Allcode, as: 'genderDataFamily', attributes: ['valueEn', 'valueVi']
                    //     }
                    // ],
                    raw: false,
                    nest: true
                });
                // console.log(data);
                if (data && JSON.stringify(data).length > 0) {
                    data.hinhAnh = new Buffer(data.hinhAnh, 'base64').toString('binary');
                }

                resolve({
                    errMessage: 'ok',
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    createNewMember,
    getAllMember,
    getMember,
    updateMemberData
}