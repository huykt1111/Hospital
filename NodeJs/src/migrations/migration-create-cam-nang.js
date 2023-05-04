'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('CamNangs', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            tenCamNang: {
                type: Sequelize.STRING
            },
            mieuTaHtml: {
                type: Sequelize.TEXT
            },
            mieuTaMarkDown: {
                type: Sequelize.TEXT
            },
            hinhAnh: {
                type: Sequelize.BLOB('long')
            },
            trangThai: {
                type: Sequelize.INTEGER
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
        await queryInterface.dropTable('CamNangs');
    }
};