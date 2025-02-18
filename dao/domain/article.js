const { DataTypes } = require('sequelize');
const sequelize = require('../db_connect');

module.exports = sequelize.define(
    'article',
    {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        toc: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        html_content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        thumb: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        scan_number: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        comment_number: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        tableName: 'article',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);
