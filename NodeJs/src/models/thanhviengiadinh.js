'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ThanhVienGiaDinh extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            ThanhVienGiaDinh.belongsTo(models.Allcode, { foreignKey: 'gioiTinh', targetKey: 'keyMap', as: 'genderDataFamily' })
            ThanhVienGiaDinh.belongsTo(models.Allcode, { foreignKey: 'vaiTro', targetKey: 'keyMap', as: 'famRoleData' })
        }
    }
    ThanhVienGiaDinh.init({
        maTK: DataTypes.INTEGER,
        email: DataTypes.STRING,
        ho: DataTypes.STRING,
        ten: DataTypes.STRING,
        gioiTinh: DataTypes.STRING,
        ngaySinh: DataTypes.STRING,
        diaChi: DataTypes.STRING,
        soDienThoai: DataTypes.STRING,
        vaiTro: DataTypes.STRING,
        hinhAnh: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'ThanhVienGiaDinh',
    });
    return ThanhVienGiaDinh;
};