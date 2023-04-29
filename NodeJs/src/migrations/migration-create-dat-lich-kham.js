'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('DatLichKhams', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            maBS: {
                type: Sequelize.INTEGER
            },
            maND: {
                type: Sequelize.INTEGER
            },
            lichKham: {
                type: Sequelize.INTEGER
            },
            hoTen: {
                type: Sequelize.STRING
            },
            soDienThoai: {
                type: Sequelize.STRING
            },
            email: {
                type: Sequelize.STRING
            },
            diaChi: {
                type: Sequelize.STRING
            },
            ngaySinh: {
                type: Sequelize.STRING
            },
            gioiTinh: {
                type: Sequelize.STRING
            },
            lyDoKham: {
                type: Sequelize.STRING
            },
            ngayTaiKham: {
                type: Sequelize.STRING
            },
            danhGia: {
                type: Sequelize.STRING
            },
            keDonThuoc: {
                type: Sequelize.TEXT
            },
            fileDinhKem: {
                type: Sequelize.TEXT
            },
            trangThai: {
                type: Sequelize.STRING
            },
            token: {
                type: Sequelize.STRING
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
        await queryInterface.dropTable('DatLichKhams');
    }
};