'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Users', [{
        name: 'JohnDoe',
        mail: 'dfadf@sdas.s',
        password: '1231231'
      }, {
        name: 'keker',
        mail: 'sss@ss.ri',
        password: '1234'
      }], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
