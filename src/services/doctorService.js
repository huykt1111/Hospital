import db from "../models/index";
require('dotenv').config();
import _ from "lodash";

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopDoctorHome = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limit,
                where: { roleId: 'R2' },
                order: [["createdAt", "DESC"]],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    {
                        model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi']
                    },
                    {
                        model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi']
                    }
                ],
                raw: true,
                nest: true
            });
            resolve({
                errCode: 0,
                data: users
            })
        } catch (e) {
            reject(e);
        }
    })
}

let getAllDoctors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: {
                    roleId: "R2"
                },
                attributes: {
                    exclude: ['password', 'image']
                }
            })
            resolve({
                errCode: 0,
                data: doctors
            })
        } catch (e) {
            reject(e);
        }
    })
}

let saveDetailInfomationDoctor = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {

            console.log(inputData.selectedPrice, inputData.selectedPayment, inputData.selectedProvince, inputData.nameClinic,
                inputData.addressClinic, inputData.note, inputData.doctorId, inputData.contentHtml, inputData.contentMarkdown, inputData.action)
            if (!inputData.doctorId || !inputData.contentHtml ||
                !inputData.contentMarkdown || !inputData.action ||
                !inputData.selectedPrice || !inputData.selectedPayment ||
                !inputData.selectedProvince || !inputData.nameClinic ||
                !inputData.addressClinic) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter!'
                })
            }
            else {
                // upsert to Markdown
                if (inputData.action === 'CREATE') {
                    await db.Markdown.create({
                        contentHtml: inputData.contentHtml,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        doctorId: inputData.doctorId,
                        // specialtyId: inputData.specialtyId,
                        // clinicId: inputData.clinicId
                    })
                }
                else if (inputData.action === 'EDIT') {
                    let doctorMarkdown = await db.Markdown.findOne({
                        where: { doctorId: inputData.doctorId },
                        raw: false,
                    })
                    if (doctorMarkdown) {
                        doctorMarkdown.contentHtml = inputData.contentHtml;
                        doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
                        doctorMarkdown.description = inputData.description;

                        await doctorMarkdown.save();
                    }
                }

                // upsert to Doctor_info
                let doctor_infor = await db.Doctor_Infor.findOne({
                    where: { doctorId: inputData.doctorId },
                    raw: false,
                })
                if (doctor_infor) {
                    // update
                    doctor_infor.doctorId = inputData.doctorId;
                    doctor_infor.priceId = inputData.selectedPrice;
                    doctor_infor.provinceId = inputData.selectedProvince;
                    doctor_infor.paymentId = inputData.selectedPayment;
                    doctor_infor.addressClinic = inputData.addressClinic;
                    doctor_infor.nameClinic = inputData.nameClinic;
                    doctor_infor.note = inputData.note;
                    await doctor_infor.save();
                } else {
                    // create
                    await db.Doctor_Infor.create({
                        doctorId: inputData.doctorId,
                        priceId: inputData.selectedPrice,
                        provinceId: inputData.selectedProvince,
                        paymentId: inputData.selectedPayment,
                        addressClinic: inputData.addressClinic,
                        nameClinic: inputData.nameClinic,
                        note: inputData.note
                    })
                }

                resolve({
                    errCode: 0,
                    errorMessage: 'Save infor doctor succeed!'
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getDetailDoctor = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            } else {
                let data = await db.User.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['description', 'contentHtml', 'contentMarkdown']
                        },
                        {
                            model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi']
                        }
                    ],
                    raw: false,
                    nest: true
                })

                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                }

                if (!data) data = {};

                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let bulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.arrSchedule || !data.doctorId || !data.formattedDate) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            }
            else {
                let schedule = data.arrSchedule;
                if (schedule && schedule.length > 0) {
                    schedule = schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item;
                    })
                }
                let existing = await db.Schedule.findAll({
                    where: {
                        doctorId: data.doctorId,
                        date: data.formattedDate
                    },

                    attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                    raw: true
                })

                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.timeType === b.timeType && +a.date === +b.date;
                });
                if (toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate);
                }
                resolve({
                    errCode: 0,
                    errMessage: "Ok"
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getScheduleByDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters!"
                })
            }
            else {
                let dataSchedule = await db.Schedule.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date
                    },
                    include: [
                        {
                            model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi']
                        }
                    ],
                    raw: false,
                    nest: true
                })

                if (!dataSchedule) dataSchedule = [];

                resolve({
                    errCode: 0,
                    data: dataSchedule
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    saveDetailInfomationDoctor: saveDetailInfomationDoctor,
    getDetailDoctor: getDetailDoctor,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleByDate: getScheduleByDate
}