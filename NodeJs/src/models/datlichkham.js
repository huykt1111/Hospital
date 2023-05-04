'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class DatLichKham extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            DatLichKham.belongsTo(models.TaiKhoan, { foreignKey: 'maND', targetKey: 'id', as: 'patientData' })
            DatLichKham.belongsTo(models.Allcode, { foreignKey: 'gioiTinh', targetKey: 'keyMap', as: 'genderDataDLK' })
            DatLichKham.belongsTo(models.LichKham, { foreignKey: 'lichKham', targetKey: 'id', as: 'schedulePatientData' })
            DatLichKham.belongsTo(models.ThongTinBacSi, { foreignKey: 'maBS', targetKey: 'maTk', as: 'userPatientCommentDoctor' });
        }
    }
    DatLichKham.init({
        maBS: DataTypes.INTEGER,
        maND: DataTypes.INTEGER,
        lichKham: DataTypes.INTEGER,
        hoTen: DataTypes.STRING,
        soDienThoai: DataTypes.STRING,
        email: DataTypes.STRING,
        diaChi: DataTypes.STRING,
        ngaySinh: DataTypes.STRING,
        gioiTinh: DataTypes.STRING,
        lyDoKham: DataTypes.STRING,
        ngayTaiKham: DataTypes.STRING,
        keDonThuoc: DataTypes.TEXT,
        fileDinhKem: DataTypes.TEXT,
        danhGia: DataTypes.TEXT,
        start: DataTypes.INTEGER,
        trangThai: DataTypes.STRING,
        token: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'DatLichKham',
    });
    return DatLichKham;
};