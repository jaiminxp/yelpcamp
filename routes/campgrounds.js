const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {
  isLoggedIn,
  isAuthor,
  validateCampground,
} = require('../lib/middleware');

const campgrounds = require('../controllers/campgrounds');

router.get('/', catchAsync(campgrounds.index));

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.get('/:id', catchAsync(campgrounds.showCampground));

router.post(
  '/',
  isLoggedIn,
  validateCampground,
  catchAsync(campgrounds.createCampground)
);

router.get(
  '/:id/edit',
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
);

router.put(
  '/:id',
  isLoggedIn,
  isAuthor,
  validateCampground,
  catchAsync(campgrounds.updateCampground)
);

router.delete(
  '/:id',
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.deleteCampground)
);

module.exports = router;
