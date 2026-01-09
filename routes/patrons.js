const express = require('express');
const router = express.Router();
const { Patron } = require('../models');
const Sequelize = require('sequelize');
const { Op } = Sequelize;

// GET /patrons - list all patrons with search + pagination
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
        Sequelize.where(Sequelize.fn('lower', Sequelize.col('first_name')), { [Op.like]: q }),
        Sequelize.where(Sequelize.fn('lower', Sequelize.col('last_name')), { [Op.like]: q }),
        Sequelize.where(Sequelize.fn('lower', Sequelize.col('address')), { [Op.like]: q }),
        Sequelize.where(Sequelize.fn('lower', Sequelize.col('email')), { [Op.like]: q }),
        Sequelize.where(Sequelize.fn('lower', Sequelize.cast(Sequelize.col('zip_code'), 'TEXT')), { [Op.like]: q }),
        Sequelize.where(Sequelize.fn('lower', Sequelize.cast(Sequelize.col('library_id'), 'TEXT')), { [Op.like]: q }),
      ];
    }

    const total = await Patron.count({ where });
    const totalPages = Math.max(Math.ceil(total / limit), 1);

    const patrons = await Patron.findAll({ where, limit, offset });

    res.render('patrons/all_patrons', {
      title: 'Patrons',
      patrons,
      page,
      totalPages,
      search,
    });
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
    const nextLibraryId = maxLibId ? maxLibId + 1 : 1001;

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
    const { Loan, Book } = require('../models');
    const patron = await Patron.findByPk(req.params.id, {
      include: [{
        model: Loan,
        include: [{ model: Book }],
        order: [['loaned_on', 'DESC']]
      }]
    });
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
    const { Loan, Book } = require('../models');
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
      const { Loan, Book } = require('../models');
      const patron = await Patron.findByPk(req.params.id, {
        include: [{
          model: Loan,
          include: [{ model: Book }],
          order: [['loaned_on', 'DESC']]
        }]
      });
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
