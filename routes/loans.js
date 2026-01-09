const express = require('express');
const router = express.Router();
const { Loan, Book, Patron } = require('../models');
const Sequelize = require('sequelize');
const { Op } = Sequelize;

/* =========================
   Helper functions
========================= */

async function getBooksForLoanSelect() {
  const books = await Book.findAll({
    include: [{
      model: Loan,
      where: { returned_on: { [Op.is]: null } },
      required: false
    }],
    order: [['title', 'ASC']]
  });

  return books.filter(book => !book.Loans || book.Loans.length === 0);
}

async function getPatronsForSelect() {
  return Patron.findAll({
    order: [['library_id', 'ASC']]
  });
}

function todayISO() {
  return new Date().toISOString().split('T')[0];
}

/* =========================
   GET /loans - all loans
========================= */

router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;
    const search = (req.query.search || '').trim();

    const where = search
    ? {
        [Op.or]: [
            { '$Book.title$': { [Op.like]: `%${search}%` } },
            { '$Patron.first_name$': { [Op.like]: `%${search}%` } },
            { '$Patron.last_name$': { [Op.like]: `%${search}%` } },
        ],
        }
    : {};

    const result = await Loan.findAndCountAll({
      where,
      include: [
        { model: Book, required: false },
        { model: Patron, required: false }
    ],
      limit,
      offset,
      order: [['loaned_on', 'DESC']],
      distinct: true
    });

    const total = result.count;
    const loans = result.rows;
    const totalPages = Math.max(Math.ceil(total / limit), 1);

    res.render('loans/all_loans', {
      title: 'All Loans',
      loans,
      page,
      totalPages,
      search
    });
  } catch (err) {
    next(err);
  }
});

/* =========================
   GET /loans/active
========================= */

router.get('/active', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const where = { returned_on: { [Op.is]: null } };

    const total = await Loan.count({ where });
    const totalPages = Math.max(Math.ceil(total / limit), 1);

    const loans = await Loan.findAll({
      where,
      include: [Book, Patron],
      limit,
      offset,
      order: [['return_by', 'ASC']]
    });

    res.render('loans/active_loans', {
      title: 'Active Loans',
      loans,
      page,
      totalPages
    });
  } catch (err) {
    next(err);
  }
});

/* =========================
   GET /loans/overdue
========================= */

router.get('/overdue', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const where = {
      [Op.and]: [
        { return_by: { [Op.lt]: todayISO() } },
        { returned_on: { [Op.is]: null } }
      ]
    };

    const total = await Loan.count({ where });
    const totalPages = Math.max(Math.ceil(total / limit), 1);

    const loans = await Loan.findAll({
      where,
      include: [Book, Patron],
      limit,
      offset,
      order: [['return_by', 'ASC']]
    });

    res.render('loans/overdue_loans', {
      title: 'Overdue Loans',
      loans,
      page,
      totalPages
    });
  } catch (err) {
    next(err);
  }
});

/* =========================
   GET /loans/new
========================= */

router.get('/new', async (req, res, next) => {
  try {
    const books = await getBooksForLoanSelect();
    const patrons = await getPatronsForSelect();

    res.render('loans/new_loan', {
      title: 'New Loan',
      books,
      patrons
    });
  } catch (err) {
    next(err);
  }
});

/* =========================
   POST /loans/new
========================= */

router.post('/new', async (req, res, next) => {
  try {
    const { book_id, patron_id } = req.body;

    if (!book_id || !patron_id) {
      return res.render('loans/new_loan', {
        title: 'New Loan',
        books: await getBooksForLoanSelect(),
        patrons: await getPatronsForSelect(),
        errors: [{ message: 'Book and Patron are required' }]
      });
    }

    const book = await Book.findByPk(book_id);
    const patron = await Patron.findByPk(patron_id);

    if (!book || !patron) {
      return res.render('loans/new_loan', {
        title: 'New Loan',
        books: await getBooksForLoanSelect(),
        patrons: await getPatronsForSelect(),
        errors: [{ message: 'Invalid book or patron selection' }]
      });
    }

    const loaned_on = todayISO();
    const return_by = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    await Loan.create({
      book_id,
      patron_id,
      loaned_on,
      return_by
    });

    res.redirect('/loans');
  } catch (err) {
    next(err);
  }
});

/* =========================
   GET /loans/:id/return
========================= */

router.get('/:id/return', async (req, res, next) => {
  try {
    const loan = await Loan.findByPk(req.params.id, {
      include: [Book, Patron]
    });

    if (!loan) {
      const err = new Error('Loan not found');
      err.status = 404;
      throw err;
    }

    res.render('loans/return_book', {
      title: 'Return Book',
      loan,
      today: todayISO()
    });
  } catch (err) {
    next(err);
  }
});

/* =========================
   POST /loans/:id/return
========================= */

router.post('/:id/return', async (req, res, next) => {
  try {
    const loan = await Loan.findByPk(req.params.id);

    if (!loan) {
      const err = new Error('Loan not found');
      err.status = 404;
      throw err;
    }

    await loan.update({ returned_on: todayISO() });
    res.redirect('/loans');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
