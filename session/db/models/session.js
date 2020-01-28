'use strict';
module.exports = (sequelize, DataTypes) => {
  const Session = sequelize.define('Session', {
    userId: DataTypes.STRING,
    serviceName: DataTypes.STRING,
    appId: DataTypes.STRING,
    appSecret: DataTypes.STRING,
    code: DataTypes.STRING,
    token: DataTypes.STRING,
    refreshToken: DataTypes.STRING,
    date: DataTypes.STRING
  }, {});
  Session.associate = function(models) {
    // associations can be defined here
  };
  return Session;
};