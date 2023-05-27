'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class NhanTin extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            NhanTin.belongsTo(models.TaiKhoan, { foreignKey: 'maND', targetKey: 'id', as: 'patientChatData' })
            NhanTin.belongsTo(models.TaiKhoan, { foreignKey: 'maBS', targetKey: 'id', as: 'doctorChatData' })
        }
    }
    NhanTin.init({
        maND: DataTypes.INTEGER,
        maBS: DataTypes.INTEGER,
        maNN: DataTypes.INTEGER,
        noiDung: DataTypes.TEXT,
    }, {
        sequelize,
        modelName: 'NhanTin',
    });
    return NhanTin;
};