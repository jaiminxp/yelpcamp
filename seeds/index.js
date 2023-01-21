const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost:27017/yelpcamp');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.on('open', () => {
  console.log('Database connected');
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});

  const camps = [];
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20 + 10);

    const camp = new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: 'https://source.unsplash.com/collection/483251',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident accusantium voluptatum voluptas tenetur beatae praesentium consequuntur aut, porro sapiente dolore rerum eos atque officia deserunt hic, nostrum unde aliquam repudiandae?',
      price,
    });
    camps.push(camp);
  }

  await Campground.insertMany(camps);
};

seedDB().then(() => {
  mongoose.connection.close();
});
