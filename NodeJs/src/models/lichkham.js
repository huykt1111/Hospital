'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class LichKham extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            LichKham.belongsTo(models.Allcode,
                {
                    foreignKey: 'thoiGianKham', targetKey: 'keyMap', as: 'timeTypeData'
                })
            LichKham.belongsTo(models.ThongTinBacSi, { foreignKey: 'maTk', targetKey: 'maTk', as: 'dataDoctorLK' })

            LichKham.belongsTo(models.TaiKhoan, { foreignKey: 'maTk', targetKey: 'id', as: 'doctorData' })
            LichKham.hasMany(models.DatLichKham, { foreignKey: 'lichKham', as: 'schedulePatientData' })
        }
    }
    LichKham.init({
        maTk: DataTypes.INTEGER,
        soLuongDangDat: DataTypes.INTEGER,
        ngayKham: DataTypes.STRING,
        thoiGianKham: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'LichKham',
    });
    return LichKham;
};