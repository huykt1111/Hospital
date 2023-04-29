'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ChuyenKhoa extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            ChuyenKhoa.hasMany(models.ThongTinBacSi, { foreignKey: 'chuyenKhoa', as: 'userSpecialtyData' })
        }
    }
    ChuyenKhoa.init({
        tenChuyenKhoa: DataTypes.STRING,
        mieuTaHtml: DataTypes.TEXT,
        mieuTaMarkDown: DataTypes.TEXT,
        hinhAnh: DataTypes.STRING,
        trangThai: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'ChuyenKhoa',
    });
    return ChuyenKhoa;
};