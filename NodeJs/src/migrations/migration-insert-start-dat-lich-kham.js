'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('DatLichKhams', 'start', { type: Sequelize.INTEGER });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('DatLichKhams', 'start', { type: Sequelize.INTEGER });
    }
};