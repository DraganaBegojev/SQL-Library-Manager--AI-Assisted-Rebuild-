const express = require('express');
const router = express.Router();
const { Book } = require('../models');

// GET /books - list all books
router.get('/', async (req, res, next) => {
  try {
    const books = await Book.findAll();
    res.render('books/all_books', { title: 'Books', books });
  } catch (err) {
    next(err);
  }
});

// GET /books/new - new book form
router.get('/new', (req, res) => {
  res.render('books/new_book', { title: 'New Book' });
});

module.exports = router;


