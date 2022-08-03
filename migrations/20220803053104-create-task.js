module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => Promise.all([
      queryInterface.addColumn('Tasks', 'taskDescription', {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        defaultValue: '',
      }, { transaction: t }),
    ]));
  },
  async down(queryInterface) {
    return queryInterface.sequelize.transaction((t) => Promise.all([
      queryInterface.removeColumn('Tasks', 'taskDescription', { transaction: t }),
    ]));
  },
};
