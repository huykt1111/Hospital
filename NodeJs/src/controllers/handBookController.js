import handBookService from '../services/handBookService';

let createHandBook = async (req, res) => {
    try {
        let infor = await handBookService.createHandBook(req.body);
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

let updateHandBook = async (req, res) => {
    try {
        let infor = await handBookService.updateHandBook(req.body);
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

let deleteHandBook = async (req, res) => {
    try {
        let infor = await handBookService.deleteHandBook(req.body);
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

let getAllHandBook = async (req, res) => {
    try {
        let infor = await handBookService.getAllHandBook();
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

let getDetailHandBookById = async (req, res) => {
    try {
        let infor = await handBookService.getDetailHandBookById(req.query.id);
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
    createHandBook,
    getAllHandBook,
    getDetailHandBookById,
    deleteHandBook,
    updateHandBook,
}