'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('ThongTinBacSis', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            maTk: {
                type: Sequelize.INTEGER,
            },
            chuyenKhoa: {
                type: Sequelize.INTEGER,
            },
            phongKham: {
                type: Sequelize.INTEGER,
            },
            chucDanh: {
                type: Sequelize.STRING,
            },
            giaKham: {
                type: Sequelize.STRING,
            },
            khuVucLamViec: {
                type: Sequelize.STRING,
            },
            phuongThucThanhToan: {
                type: Sequelize.STRING,
            },
            diaChiPhongKham: {
                type: Sequelize.STRING,
            },
            tenPhongKham: {
                type: Sequelize.STRING,
            },
            ghiChu: {
                type: Sequelize.STRING
            },
            mieuTa: {
                type: Sequelize.TEXT('long')
            },
            noiDungHTML: {
                type: Sequelize.TEXT('long')
            },
            noiDungMarkdown: {
                type: Sequelize.TEXT('long')
            },
            trangThai: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('ThongTinBacSis');
    }
};