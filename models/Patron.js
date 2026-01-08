"use strict";

module.exports = (sequelize, DataTypes) => {
  const Patron = sequelize.define("Patron", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "First name is required" },
          notEmpty: { msg: "First name is required" },
        },
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Last name is required" },
          notEmpty: { msg: "Last name is required" },
        },
      },
      address: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Email is required" },
          notEmpty: { msg: "Email is required" },
          isEmail: { msg: "Must be a valid email address" },
        },
      },
      zip_code: {
        type: DataTypes.INTEGER,
      },
      library_id: {
        type: DataTypes.INTEGER,
        unique: { args: true, msg: "Library ID must be unique" },
      },
    });

  Patron.associate = function (models) {
    // associations can be defined here
  };

  return Patron;
};
