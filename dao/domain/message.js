const { DataTypes } = require('sequelize');
const sequelize = require('../db_connect');

module.exports = sequelize.define(
    'message',
    {
        avatar: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        nickname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: 'message',
        createdAt: 'created_at',
        updatedAt: false,
    }
);
