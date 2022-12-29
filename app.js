const express = require('express');
const path = require('path');

const mongoose = require('mongoose');
const Campground = require('./models/campground');

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost:27017/yelpcamp');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'))
db.on('open', () => { 
    console.log('Database connected');
})

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
})

app.listen(3000, () => {
    console.log('Serving on port 3000');
});