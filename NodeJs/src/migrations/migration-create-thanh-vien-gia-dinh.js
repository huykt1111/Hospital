'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('ThanhVienGiaDinhs', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            maTK: {
                type: Sequelize.INTEGER
            },
            email: {
                type: Sequelize.STRING
            },
            ho: {
                type: Sequelize.STRING
            },
            ten: {
                type: Sequelize.STRING
            },
            gioiTinh: {
                type: Sequelize.STRING
            },
            ngaySinh: {
                type: Sequelize.STRING
            },
            diaChi: {
                type: Sequelize.STRING
            },
            soDienThoai: {
                type: Sequelize.STRING
            },
            vaiTro: {
                type: Sequelize.STRING
            },
            hinhAnh: {
                type: Sequelize.BLOB('long')
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
        await queryInterface.dropTable('ThanhVienGiaDinhs');
    }
};

