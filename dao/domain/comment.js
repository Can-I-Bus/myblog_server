const { DataTypes } = require('sequelize');
const sequelize = require('../db_connect');

module.exports = sequelize.define(
    'comment',
    {
        nickname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        article_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        tableName: 'comment',
        createdAt: 'created_at',
        updatedAt: false,
    }
);
