'use strict';
module.exports = (sequelize, DataTypes) => {
  const Auth = sequelize.define('Auth', {
    name: DataTypes.STRING,
    password: DataTypes.STRING
  }, {});
  Auth.associate = function(models) {
    // associations can be defined here
  };
  return Auth;
};