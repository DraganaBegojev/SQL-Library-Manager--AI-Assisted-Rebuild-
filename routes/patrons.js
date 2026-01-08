const express = require('express');
const router = express.Router();
const { Patron } = require('../models');

// GET /patrons - list all patrons
router.get('/', async (req, res, next) => {
  try {
    const patrons = await Patron.findAll();
    res.render('patrons/all_patrons', { title: 'Patrons', patrons });
  } catch (err) {
    next(err);
  }
});

// GET /patrons/new - new patron form
router.get('/new', (req, res) => {
  res.render('patrons/new_patron', { title: 'New Patron' });
});

// POST /patrons/new - create a new patron (auto-increment library_id)
router.post('/new', async (req, res, next) => {
  try {
    // determine next library_id
    const maxLibId = await Patron.max('library_id');
    const nextLibraryId = (Number.isInteger(maxLibId) ? maxLibId : 0) + 1;

    const payload = { 
        ...req.body, 
        library_id: nextLibraryId 
    };
    await Patron.create(payload);
    res.redirect('/patrons');
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      res.render('patrons/new_patron', {
        title: 'New Patron',
        patron: req.body,
        errors: err.errors,
      });
    } else {
      next(err);
    }
  }
});

// GET /patrons/:id - patron detail
router.get('/:id', async (req, res, next) => {
  try {
    const patron = await Patron.findByPk(req.params.id);
    if (patron) {
      res.render('patrons/update_patron', { title: `Patron: ${patron.first_name} ${patron.last_name}`, patron });
    } else {
      const err = new Error('Patron not found');
      err.status = 404;
      throw err;
    }
  } catch (err) {
    next(err);
  }
});

// PUT /patrons/:id - update patron
router.put('/:id', async (req, res, next) => {
  try {
    const patron = await Patron.findByPk(req.params.id);
    if (!patron) {
      const err = new Error('Patron not found');
      err.status = 404;
      throw err;
    }

    await patron.update(req.body);
    res.redirect('/patrons');
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      const patron = await Patron.findByPk(req.params.id);
      res.render('patrons/update_patron', {
        title: `Patron: ${patron.first_name} ${patron.last_name}`,
        patron,
        errors: err.errors,
      });
    } else {
      next(err);
    }
  }
});

module.exports = router;
