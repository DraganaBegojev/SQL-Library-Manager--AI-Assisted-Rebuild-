"use strict";

module.exports = (sequelize, DataTypes) => {
  const Loan = sequelize.define("Loan", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      book_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Book is required" },
          notEmpty: { msg: "Book is required" },
        },
      },
      patron_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Patron is required" },
          notEmpty: { msg: "Patron is required" },
        },
      },
      loaned_on: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          notNull: { msg: "Loaned on date is required" },
          notEmpty: { msg: "Loaned on date is required" },
        },
      },
      return_by: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          notNull: { msg: "Return by date is required" },
          notEmpty: { msg: "Return by date is required" },
        },
      },
      returned_on: {
        type: DataTypes.DATEONLY,
      },
    });

  Loan.associate = function (models) {
    // associations can be defined here
  };

  return Loan;
};
