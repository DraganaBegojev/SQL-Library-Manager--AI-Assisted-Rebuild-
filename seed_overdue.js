// seed_overdue.js
'use strict';

const { Loan, Book, Patron } = require('./models');

async function createOverdueLoan() {
  try {
    const book = await Book.findOne();
    const patron = await Patron.findOne();

    if (!book || !patron) {
      throw new Error('No books or patrons found in DB');
    }

    const loan = await Loan.create({
      book_id: book.id,
      patron_id: patron.id,
      loaned_on: '2024-01-01',
      return_by: '2024-01-08',
      returned_on: null
    });

    console.log('Overdue loan created:', loan.id);
  } catch (err) {
    console.error(err.message);
  }
}

createOverdueLoan().then(() => process.exit());
// To run this script, use the command: node seed_overdue.js