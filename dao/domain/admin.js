const { DataTypes } = require('sequelize');
const sequelize = require('../db_connect');

module.exports = sequelize.define(
    'admin',
    {
        login_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        login_pwd: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: 'admin',
        createdAt: false,
        updatedAt: false,
    }
);
