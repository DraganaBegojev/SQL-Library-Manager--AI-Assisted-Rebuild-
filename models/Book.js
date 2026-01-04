"use strict";

module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define("Book", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Title is required" },
          notEmpty: { msg: "Title is required" },
        },
      },
      author: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Author is required" },
          notEmpty: { msg: "Author is required" },
        },
      },
      genre: {
        type: DataTypes.STRING,
      },
      first_published: {
        type: DataTypes.INTEGER,
      },
    });

  Book.associate = function (models) {
    // associations can be defined here
  };

  return Book;
};
