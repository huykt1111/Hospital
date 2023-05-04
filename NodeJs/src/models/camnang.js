'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class CamNang extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
        }
    }
    CamNang.init({
        tenCamNang: DataTypes.STRING,
        mieuTaHtml: DataTypes.TEXT,
        mieuTaMarkDown: DataTypes.TEXT,
        hinhAnh: DataTypes.STRING,
        trangThai: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'CamNang',
    });
    return CamNang;
};