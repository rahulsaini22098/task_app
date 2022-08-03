const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Users', [{
      id: uuidv4(),
      name: 'Jiraya',
      email: 'jir@anoi.com',
      password: 'test@123',
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
  },

  // eslint-disable-next-line no-unused-vars
  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
