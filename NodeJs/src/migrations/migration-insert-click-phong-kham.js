'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('PhongKhams', 'click', { type: Sequelize.INTEGER });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('PhongKhams', 'click', { type: Sequelize.INTEGER });
    }
};

