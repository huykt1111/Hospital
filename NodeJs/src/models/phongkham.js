'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class PhongKham extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            PhongKham.hasMany(models.ThongTinBacSi, { foreignKey: 'phongKham', as: 'userClinicData' })
        }
    }
    PhongKham.init({
        tenPhongKham: DataTypes.STRING,
        diaChi: DataTypes.STRING,
        mieuTaHtml: DataTypes.TEXT,
        mieuTaMarkDown: DataTypes.TEXT,
        hinhAnh: DataTypes.STRING,
        trangThai: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'PhongKham',
    });
    return PhongKham;
};