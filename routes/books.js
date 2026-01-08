const express = require('express');
const router = express.Router();
const { Book } = require('../models');
const Sequelize = require('sequelize');
const { Op } = Sequelize;

// GET /books - list all books with search + pagination
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;
    const search = (req.query.search || '').trim();

    const where = {};
    if (search) {
      const q = `%${search.toLowerCase()}%`;
      where[Op.or] = [
        Sequelize.where(Sequelize.fn('lower', Sequelize.col('title')), { [Op.like]: q }),
        Sequelize.where(Sequelize.fn('lower', Sequelize.col('author')), { [Op.like]: q }),
        Sequelize.where(Sequelize.fn('lower', Sequelize.col('genre')), { [Op.like]: q }),
        Sequelize.where(Sequelize.fn('lower', Sequelize.cast(Sequelize.col('first_published'), 'TEXT')), { [Op.like]: q }),
      ];
    }

    const total = await Book.count({ where });
    const totalPages = Math.max(Math.ceil(total / limit), 1);

    const books = await Book.findAll({ where, limit, offset });

    res.render('books/all_books', {
      title: 'Books',
      books,
      page,
      totalPages,
      search,
    });
  } catch (err) {
    next(err);
  }
});

// GET /books/new - new book form
router.get('/new', (req, res) => {
  res.render('books/new_book', { title: 'New Book' });
});

// POST /books/new - create a new book
router.post('/new', async (req, res, next) => {
  try {
    await Book.create(req.body);
    res.redirect('/books');
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      res.render('books/new_book', {
        title: 'New Book',
        book: req.body,
        errors: err.errors
      });
    } else {
      next(err);
    }
  }
});

// GET /books/:id - book detail
router.get('/:id', async (req, res, next) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      res.render('books/update_book', { 
        title: book.title, 
        book 
      });
    } else {
      const err = new Error('Book not found');
      err.status = 404;
      throw err;
    }
  } catch (err) {
    next(err);
  }
});

// POST /books/:id - update book
router.put('/:id', async (req, res, next) => {
  try {
    const book = await Book.findByPk(req.params.id);

    if (!book) {
      const err = new Error('Book not found');
      err.status = 404;
      throw err;
    }

    await book.update(req.body);
    res.redirect('/books');
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      const book = await Book.findByPk(req.params.id);
      res.render('books/update_book', {
        title: book.title,
        book,
        errors: err.errors
      });
    } else {
      next(err);
    }
  }
});


module.exports = router;