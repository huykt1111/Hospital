import db from "../models/index";
require('dotenv').config();
import _ from "lodash";

let createHandBook = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.imageBase64 || !data.descriptionHtml || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter!'
                })
            } else {
                await db.CamNang.create({
                    tenCamNang: data.name,
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

let getAllHandBook = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.CamNang.findAll({
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

let deleteHandBook = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (data && data.id !== null) {
                let handBook = await db.CamNang.findOne({
                    where: { id: data.id },
                    raw: false
                });
                if (handBook) {
                    handBook.trangThai = 0;
                    await handBook.save();
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

let updateHandBook = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.imageBase64 || !data.descriptionHtml || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter!'
                })
            } else {
                let handbook = await db.CamNang.findOne({
                    where: { id: data.idHandbook },
                    raw: false
                });
                if (handbook) {
                    handbook.tenCamNang = data.name;
                    handbook.hinhAnh = data.imageBase64;
                    handbook.mieuTaHtml = data.descriptionHtml;
                    handbook.mieuTaMarkDown = data.descriptionMarkdown;
                    await handbook.save();
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

let getDetailHandBookById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter!'
                })
            } else {

                let data = await db.CamNang.findOne({
                    where: {
                        id: inputId,
                        trangThai: 1
                    },
                    attributes: ['tenCamNang', 'mieuTaHtml', 'mieuTaMarkDown', 'hinhAnh']
                })
                if (data) {
                    data.hinhAnh = new Buffer(data.hinhAnh, 'base64').toString('binary');
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
    createHandBook,
    getAllHandBook,
    getDetailHandBookById,
    deleteHandBook,
    updateHandBook,

}