'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('Tasks', 'taskDescription', {
          type: Sequelize.DataTypes.STRING,
          allowNull: false,
          defaultValue: ""
        }, { transaction: t })
      ]);
    });
  },
  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('Tasks', 'taskDescription', { transaction: t }),
      ]);
    });
  }
};