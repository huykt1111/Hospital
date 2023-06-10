import patientService from '../services/patientService';

let postBookAppointment = async (req, res) => {
    try {
        let infor = await patientService.postBookAppointment(req.body);
        return res.status(200).json(infor)
    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}

let cancelBook = async (req, res) => {
    try {
        let infor = await patientService.cancelBook(req.body);
        return res.status(200).json(infor)
    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}

let racingBook = async (req, res) => {
    try {
        let infor = await patientService.racingBook(req.body);
        return res.status(200).json(infor)
    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}

let postVerifyBookAppointment = async (req, res) => {
    try {
        let infor = await patientService.postVerifyBookAppointment(req.body);
        return res.status(200).json(infor)
    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}

let getAllBookedByUser = async (req, res) => {
    try {
        let infor = await patientService.getAllBookedByUser(req.query);
        return res.status(200).json(infor)
    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}

let getAllBookByUser = async (req, res) => {
    try {
        let infor = await patientService.getAllBookByUser(req.query);
        return res.status(200).json(infor)
    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}

let getAllPatientBookSchedule = async (req, res) => {
    try {
        let infor = await patientService.getAllPatientBookSchedule(req.query);
        return res.status(200).json(infor)
    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}

let getAllPatientBookAndCancel = async (req, res) => {
    try {
        let infor = await patientService.getAllPatientBookAndCancel(req.query);
        return res.status(200).json(infor)
    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}

let getPatientBookSucceed = async (req, res) => {
    try {
        let infor = await patientService.getPatientBookSucceed(req.query);
        return res.status(200).json(infor)
    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}

let cancelBookOverdue = async (req, res) => {
    try {
        let infor = await patientService.cancelBookOverdue(req.query);
        return res.status(200).json(infor)
    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}

let lockAccount = async (req, res) => {
    try {
        let infor = await patientService.lockAccount(req.query);
        return res.status(200).json(infor)
    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}

module.exports = {
    postBookAppointment: postBookAppointment,
    postVerifyBookAppointment: postVerifyBookAppointment,
    getAllBookedByUser,
    getAllBookByUser,
    cancelBook,
    racingBook,
    getAllPatientBookSchedule,
    getAllPatientBookAndCancel,
    getPatientBookSucceed,
    cancelBookOverdue,
    lockAccount
}