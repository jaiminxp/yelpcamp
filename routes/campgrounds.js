const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {
  isLoggedIn,
  isAuthor,
  validateCampground,
} = require('../lib/middleware');

const campgrounds = require('../controllers/campgrounds');
const { storage } = require('../lib/cloudinary.config');
const upload = require('multer')({ storage });

router
  .route('/')
  .get(catchAsync(campgrounds.index))
  .post(upload.single('image'), (req, res) => {
    console.log('🚀 req.file', req.file);

    res.send('image uploaded');
  });
// .post(
//   isLoggedIn,
//   validateCampground,
//   catchAsync(campgrounds.createCampground)
// );

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router
  .route('/:id')
  .get(catchAsync(campgrounds.showCampground))
  .put(
    isLoggedIn,
    isAuthor,
    validateCampground,
    catchAsync(campgrounds.updateCampground)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get(
  '/:id/edit',
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
);

module.exports = router;
