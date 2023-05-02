import db from "../models/index";
require('dotenv').config();
import _ from "lodash";

let createSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.imageBase64 || !data.descriptionHtml || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter!'
                })
            } else {
                await db.ChuyenKhoa.create({
                    tenChuyenKhoa: data.name,
                    hinhAnh: data.imageBase64,
                    mieuTaHtml: data.descriptionHtml,
                    mieuTaMarkDown: data.descriptionMarkdown,
                    trangThai: 1
                })

                resolve({
                    errCode: 0,
                    errMessage: 'Succeed!'
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getAllSpecialty = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.ChuyenKhoa.findAll({
                where: {
                    trangThai: 1
                },
            });
            if (data && data.length > 0) {
                data.map(item => {
                    item.hinhAnh = new Buffer(item.hinhAnh, 'base64').toString('binary');
                    return item;
                })
            }
            resolve({
                errMessage: 'ok',
                errCode: 0,
                data: data
            })
        } catch (e) {
            reject(e);
        }
    })
}

let getTopSpecialty = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.ChuyenKhoa.findAll({
                where: {
                    trangThai: 1
                },
                include: [
                    {
                        model: db.ThongTinBacSi, as: 'userSpecialtyData', attributes: ['chuyenKhoa']
                    },
                ],
                attributes: [
                    'id',
                    'tenChuyenKhoa',
                    'hinhAnh',
                    [db.sequelize.literal('(SELECT COUNT(*) FROM ThongTinBacSis WHERE ThongTinBacSis.chuyenKhoa = ChuyenKhoa.id)'), 'specialtyCount']
                ],
                order: [[db.sequelize.literal('specialtyCount'), 'DESC']],
                raw: false,
                nest: true
            });
            if (data && data.length > 0) {
                data = data.slice(0, 8);

                data.map(item => {
                    item.hinhAnh = new Buffer(item.hinhAnh, 'base64').toString('binary');
                    return item;
                })
            }
            resolve({
                errMessage: 'ok',
                errCode: 0,
                data: data
            })
        } catch (e) {
            reject(e);
        }
    })
}

let deleteSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (data && data.id !== null) {
                let specialty = await db.ChuyenKhoa.findOne({
                    where: { id: data.id },
                    raw: false
                });
                if (specialty) {
                    specialty.trangThai = 0;
                    await specialty.save();
                }

                resolve({
                    errCode: 0,
                    errorMessage: 'Delete succeed!'
                })
            }
            else {
                resolve({
                    errCode: 0,
                    errorMessage: 'Delete faided!'
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let updateSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.imageBase64 || !data.descriptionHtml || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter!'
                })
            } else {
                let specialty = await db.ChuyenKhoa.findOne({
                    where: { id: data.idSpecialty },
                    raw: false
                });
                if (specialty) {
                    specialty.tenChuyenKhoa = data.name;
                    specialty.hinhAnh = data.imageBase64;
                    specialty.mieuTaHtml = data.descriptionHtml;
                    specialty.mieuTaMarkDown = data.descriptionMarkdown;
                    await specialty.save();
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Succeed!'
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getDetailSpecialtyById = (inputId, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId || !location) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter!'
                })
            } else {

                let data = await db.ChuyenKhoa.findOne({
                    where: {
                        id: inputId,
                        trangThai: 1
                    },
                    attributes: ['tenChuyenKhoa', 'mieuTaHtml', 'mieuTaMarkDown', 'hinhAnh']
                })
                if (data) {
                    data.hinhAnh = new Buffer(data.hinhAnh, 'base64').toString('binary');
                    let doctorSpecialty = [];
                    if (location === 'ALL') {
                        doctorSpecialty = await db.ThongTinBacSi.findAll({
                            where: { chuyenKhoa: inputId, trangThai: 2 },
                            include: [
                                {
                                    model: db.TaiKhoan,
                                },
                            ],
                            raw: false,
                            nest: true
                        });

                        if (doctorSpecialty && doctorSpecialty.length > 0) {
                            doctorSpecialty.map(item => {
                                item.TaiKhoan.hinhAnh = new Buffer(item.TaiKhoan.hinhAnh, 'base64').toString('binary');
                                return item;
                            })
                        }
                    }
                    else {
                        doctorSpecialty = await db.ThongTinBacSi.findAll({
                            where: {
                                chuyenKhoa: inputId,
                                trangThai: 2,
                                khuVucLamViec: location
                            },
                            include: [
                                {
                                    model: db.TaiKhoan,
                                },
                            ],
                            raw: false,
                            nest: true
                        })

                        if (doctorSpecialty && doctorSpecialty.length > 0) {
                            doctorSpecialty.map(item => {
                                item.TaiKhoan.hinhAnh = new Buffer(item.TaiKhoan.hinhAnh, 'base64').toString('binary');
                                return item;
                            })
                        }
                    }
                    data.doctorSpecialty = doctorSpecialty;

                } else data = {}

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
    createSpecialty: createSpecialty,
    getAllSpecialty: getAllSpecialty,
    getDetailSpecialtyById: getDetailSpecialtyById,
    deleteSpecialty,
    updateSpecialty,
    getTopSpecialty
}