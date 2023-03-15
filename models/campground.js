const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const imageSchema = new Schema(
  {
    filename: String,
    url: String,
  },
  {
    virtuals: {
      thumbnail: {
        get() {
          return this.url.replace('/upload', '/upload/w_200');
        },
      },
    },
  }
);

const campgroundSchema = new Schema({
  title: String,
  price: Number,
  images: [imageSchema],
  description: String,
  location: String,
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],
});

campgroundSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await Review.deleteMany({ _id: { $in: doc.reviews } });
  }
});

module.exports = mongoose.model('Campground', campgroundSchema);
