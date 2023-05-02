'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class TaiKhoan extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            TaiKhoan.hasOne(models.ThongTinBacSi, { foreignKey: 'maTk' })
            TaiKhoan.belongsTo(models.Allcode, { foreignKey: 'gioiTinh', targetKey: 'keyMap', as: 'genderData' })
            TaiKhoan.hasMany(models.LichKham, { foreignKey: 'maTk', as: 'doctorData' })
            TaiKhoan.hasMany(models.DatLichKham, { foreignKey: 'maND', as: 'patientData' })
        }
    }
    TaiKhoan.init({
        email: DataTypes.STRING,
        matKhau: DataTypes.STRING,
        ho: DataTypes.STRING,
        ten: DataTypes.STRING,
        gioiTinh: DataTypes.STRING,
        ngaySinh: DataTypes.STRING,
        diaChi: DataTypes.STRING,
        soDienThoai: DataTypes.STRING,
        hinhAnh: DataTypes.STRING,
        vaiTro: DataTypes.STRING,
        trangThai: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'TaiKhoan',
    });
    return TaiKhoan;
};