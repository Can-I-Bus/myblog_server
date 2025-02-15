const { DataTypes } = require('sequelize');
const sequelize = require('../db_connect');

module.exports = sequelize.define(
    'blog_type',
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        article_count: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        order: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        tableName: 'blog_type',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);
