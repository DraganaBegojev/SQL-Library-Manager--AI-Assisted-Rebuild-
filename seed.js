'use strict';

const { sequelize, Book, Patron, Loan } = require('./models');

async function seed() {
  try {
    // Sinhronizuj tabele (create if not exist)
    await sequelize.sync({ force: true }); // force: true briše sve stare podatke, ali tvoja baza je već prazna

    // Dodaj sample knjige
    const books = await Book.bulkCreate([
      { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Fiction', first_published: 1925 },
      { title: '1984', author: 'George Orwell', genre: 'Dystopian', first_published: 1949 },
      { title: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'Fiction', first_published: 1960 }
    ]);

    // Dodaj sample patreone
    const patrons = await Patron.bulkCreate([
      { first_name: 'Alice', last_name: 'Johnson', email: 'alice@example.com', library_id: 'P001' },
      { first_name: 'Bob', last_name: 'Smith', email: 'bob@example.com', library_id: 'P002' },
      { first_name: 'Charlie', last_name: 'Brown', email: 'charlie@example.com', library_id: 'P003' }
    ]);

    // Dodaj sample loans
    await Loan.bulkCreate([
      {
        book_id: books[0].id,
        patron_id: patrons[0].id,
        loaned_on: '2026-01-01',
        return_by: '2026-01-08',
        returned_on: null
      },
      {
        book_id: books[1].id,
        patron_id: patrons[1].id,
        loaned_on: '2025-12-20',
        return_by: '2025-12-27',
        returned_on: '2025-12-26'
      },
      {
        book_id: books[2].id,
        patron_id: patrons[2].id,
        loaned_on: '2025-12-30',
        return_by: '2026-01-06',
        returned_on: null
      }
    ]);

    console.log('✅ Sample data added successfully!');
  } catch (err) {
    console.error(err);
  }
}

seed();
