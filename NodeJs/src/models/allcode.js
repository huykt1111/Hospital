'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Allcode extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Allcode.hasMany(models.ThongTinBacSi, { foreignKey: 'chucDanh', as: 'positionData' })
            Allcode.hasMany(models.TaiKhoan, { foreignKey: 'gioiTinh', as: 'genderData' })
            Allcode.hasMany(models.DatLichKham, { foreignKey: 'gioiTinh', as: 'genderDataDLK' })

            Allcode.hasMany(models.ThanhVienGiaDinh, { foreignKey: 'gioiTinh', as: 'genderDataFamily' })
            Allcode.hasMany(models.ThanhVienGiaDinh, { foreignKey: 'vaiTro', as: 'famRoleData' })

            Allcode.hasMany(models.LichKham, { foreignKey: 'thoiGianKham', as: 'timeTypeData' })
        }
    }
    Allcode.init({
        keyMap: DataTypes.STRING,
        type: DataTypes.STRING,
        valueEn: DataTypes.STRING,
        valueVi: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Allcode',
    });
    return Allcode;
};