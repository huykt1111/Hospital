import familyService from "../services/familyService";

let createNewMember = async (req, res) => {
    let message = await familyService.createNewMember(req.body);
    return res.status(200).json(message);
}

let updateMemberData = async (req, res) => {
    let message = await familyService.updateMemberData(req.body);
    return res.status(200).json(message);
}

let deleteMemberData = async (req, res) => {
    let message = await familyService.deleteMemberData(req.body);
    return res.status(200).json(message);
}

let getAllMember = async (req, res) => {
    try {
        let message = await familyService.getAllMember(req.query);
        return res.status(200).json(message)
    }
    catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}

let getMember = async (req, res) => {
    try {
        let message = await familyService.getMember(req.query);
        return res.status(200).json(message)
    }
    catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}


module.exports = {
    createNewMember,
    getAllMember,
    getMember,
    updateMemberData,
    deleteMemberData
}