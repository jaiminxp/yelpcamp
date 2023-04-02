const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const User = require('../models/user');
const dbUrl = process.env.DB_URL

mongoose.set('strictQuery', true);
mongoose.connect(dbUrl)

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.on('open', () => {
  console.log('✅ Database connected');
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  await User.deleteMany({});

  const user = new User({
    username: 'jaimax',
    email: 'jaimax@yelpcamp.com',
  });

  await User.register(user, 'monkey');

  const camps = [];
  for (let i = 0; i < 300; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20 + 10);
    const campgroundLocation = cities[random1000]

    const camp = new Campground({
      author: user,
      location: `${campgroundLocation.city}, ${campgroundLocation.state}`,
      geometry: { type: 'Point', coordinates: [campgroundLocation.longitude, campgroundLocation.latitude] },
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident accusantium voluptatum voluptas tenetur beatae praesentium consequuntur aut, porro sapiente dolore rerum eos atque officia deserunt hic, nostrum unde aliquam repudiandae?',
      price,
      images: [
        {
          filename: 'YelpCamp/lggttieafa94o2xnb28v',
          url: 'https://res.cloudinary.com/webonhire/image/upload/v1678878770/YelpCamp/lggttieafa94o2xnb28v.jpg',
        },
        {
          filename: 'YelpCamp/phnqygwrzzs7ndj3t9e0',
          url: 'https://res.cloudinary.com/webonhire/image/upload/v1678878770/YelpCamp/phnqygwrzzs7ndj3t9e0.jpg',
        },
      ],
    })
    camps.push(camp);
  }

  await Campground.insertMany(camps);
};

seedDB().then(() => {
  console.log('✅ Seeding complete');
  mongoose.connection.close();
});
