'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ThongTinBacSi extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            ThongTinBacSi.belongsTo(models.TaiKhoan, { foreignKey: 'maTk' });
            ThongTinBacSi.hasMany(models.LichKham, { foreignKey: 'maTk', as: 'dataDoctorLK' });
            ThongTinBacSi.belongsTo(models.PhongKham, { foreignKey: 'phongKham', targetKey: 'id', as: 'userClinicData' });
            ThongTinBacSi.belongsTo(models.ChuyenKhoa, { foreignKey: 'chuyenKhoa', targetKey: 'id', as: 'userSpecialtyData' });
            ThongTinBacSi.belongsTo(models.Allcode, { foreignKey: 'chucDanh', targetKey: 'keyMap', as: 'positionData' });
            ThongTinBacSi.belongsTo(models.Allcode, { foreignKey: 'giaKham', targetKey: 'keyMap', as: 'priceIdData' });
            ThongTinBacSi.belongsTo(models.Allcode, { foreignKey: 'khuVucLamViec', targetKey: 'keyMap', as: 'provinceIdData' });
            ThongTinBacSi.belongsTo(models.Allcode, { foreignKey: 'phuongThucThanhToan', targetKey: 'keyMap', as: 'paymentIdData' });
            ThongTinBacSi.hasMany(models.DatLichKham, { foreignKey: 'maBS', as: 'userPatientCommentDoctor' });
        }
    }
    ThongTinBacSi.init({
        maTk: DataTypes.INTEGER,
        chuyenKhoa: DataTypes.INTEGER,
        phongKham: DataTypes.INTEGER,
        chucDanh: DataTypes.STRING,
        giaKham: DataTypes.STRING,
        khuVucLamViec: DataTypes.STRING,
        phuongThucThanhToan: DataTypes.STRING,
        diaChiPhongKham: DataTypes.STRING,
        tenPhongKham: DataTypes.STRING,
        ghiChu: DataTypes.STRING,
        mieuTa: DataTypes.TEXT('long'),
        noiDungHTML: DataTypes.TEXT('long'),
        noiDungMarkdown: DataTypes.TEXT('long'),
        trangThai: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'ThongTinBacSi',
    });
    return ThongTinBacSi;
};