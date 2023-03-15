const Campground = require('../models/campground');
const { cloudinary } = require('../lib/cloudinary.config');

async function index(req, res) {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
}

function renderNewForm(req, res) {
  res.render('campgrounds/new');
}

async function createCampground(req, res, next) {
  const campground = new Campground(req.body.campground);
  campground.author = req.user._id;
  campground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));

  await campground.save();
  req.flash('success', 'Successfully created a new campground!');
  res.redirect(`/campgrounds/${campground._id}`);
}

async function showCampground(req, res) {
  const campground = await Campground.findById(req.params.id)
    .populate({
      path: 'reviews',
      populate: {
        path: 'author', //author of review
      },
    })
    .populate('author'); //author of the campground

  if (!campground) {
    req.flash('error', 'Cannot find that campground!');
    return res.redirect('/campgrounds');
  }

  res.render('campgrounds/show', { campground });
}

async function renderEditForm(req, res) {
  const campground = await Campground.findById(req.params.id);

  if (!campground) {
    req.flash('error', 'Cannot find that campground!');
    return res.redirect('/campgrounds');
  }

  res.render('campgrounds/edit', { campground });
}

async function updateCampground(req, res) {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });

  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  campground.images.push(...imgs);

  await campground.save();

  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }

  req.flash('success', 'Successfully updated campground!');
  res.redirect(`/campgrounds/${campground._id}`);
}

async function deleteCampground(req, res) {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);

  req.flash('success', 'Successfully deleted campground');
  res.redirect('/campgrounds');
}

module.exports = {
  index,
  renderNewForm,
  createCampground,
  showCampground,
  renderEditForm,
  updateCampground,
  deleteCampground,
};
