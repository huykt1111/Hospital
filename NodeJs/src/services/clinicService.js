import db from "../models/index";
require('dotenv').config();
import _ from "lodash";

let createClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.address || !data.imageBase64 || !data.descriptionHtml || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter!'
                })
            } else {
                await db.PhongKham.create({
                    tenPhongKham: data.name,
                    hinhAnh: data.imageBase64,
                    diaChi: data.address,
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

let updateClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.address || !data.imageBase64 || !data.descriptionHtml || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter!'
                })
            } else {
                let clinic = await db.PhongKham.findOne({
                    where: { id: data.idClinic },
                    raw: false
                });
                if (clinic) {
                    clinic.tenPhongKham = data.name;
                    clinic.hinhAnh = data.imageBase64;
                    clinic.diaChi = data.address;
                    clinic.mieuTaHtml = data.descriptionHtml;
                    clinic.mieuTaMarkDown = data.descriptionMarkdown;
                    await clinic.save();
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

let getAllClinic = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.PhongKham.findAll({
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

let getTopClinic = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.PhongKham.findAll({
                where: {
                    trangThai: 1
                },
                include: [
                    {
                        model: db.ThongTinBacSi, as: 'userClinicData', attributes: ['phongKham']
                    },
                ],
                attributes: [
                    'id',
                    'tenPhongKham',
                    'diaChi',
                    'hinhAnh',
                    [db.sequelize.literal('(SELECT COUNT(*) FROM ThongTinBacSis WHERE ThongTinBacSis.phongKham = PhongKham.id)'), 'clinicCount']
                ],
                order: [[db.sequelize.literal('clinicCount'), 'DESC']],
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

let deleteClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (data && data.id !== null) {
                let clinic = await db.PhongKham.findOne({
                    where: { id: data.id },
                    raw: false
                });
                if (clinic) {
                    clinic.trangThai = 0;
                    await clinic.save();
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

let getDetailClinicById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter!'
                })
            } else {

                let data = await db.PhongKham.findOne({
                    where: {
                        id: inputId,
                        trangThai: 1
                    },
                    attributes: ['tenPhongKham', 'diaChi', 'mieuTaHtml', 'mieuTaMarkDown']
                })
                if (data) {
                    let doctorClinic = [];
                    doctorClinic = await db.ThongTinBacSi.findAll({
                        where: { phongKham: inputId, trangThai: 2 },
                        include: [
                            {
                                model: db.TaiKhoan
                            },
                        ],
                        raw: false,
                        nest: true
                    });

                    if (doctorClinic && doctorClinic.length > 0) {
                        doctorClinic.map(item => {
                            item.TaiKhoan.hinhAnh = new Buffer(item.TaiKhoan.hinhAnh, 'base64').toString('binary');
                            return item;
                        })
                    }

                    data.doctorClinic = doctorClinic;

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
    createClinic: createClinic,
    getAllClinic: getAllClinic,
    getDetailClinicById: getDetailClinicById,
    deleteClinic,
    updateClinic,
    getTopClinic
}