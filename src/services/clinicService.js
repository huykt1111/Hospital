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
                await db.Clinic.create({
                    name: data.name,
                    image: data.imageBase64,
                    address: data.address,
                    descriptionHtml: data.descriptionHtml,
                    descriptionMarkdown: data.descriptionMarkdown
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


module.exports = {
    createClinic: createClinic,
}