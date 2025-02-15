const { DataTypes } = require('sequelize');
const sequelize = require('../db_connect');

module.exports = sequelize.define(
    'banner',
    {
        mid_img: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        big_img: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: 'banner',
        createdAt: false,
        updatedAt: false,
    }
);
