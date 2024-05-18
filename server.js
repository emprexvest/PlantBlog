// Environment Configuration 
if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
};


// Import Dependencies
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const Plant = require('./models/plant');
// const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const plantRouter = require('./routes/plants');


// Application Settings
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');


// Mounted Middleware
app.use(expressLayouts);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));
app.use(methodOverride('_method'));
app.use(express.static('public'));


// Verification of Settings
console.log('View Engine set to: ', app.get('view engine'));
console.log('View set to: ', app.get('views'));
console.log('Layout set to: ', app.get('layout'));


// Mongoose Configuraton and Connection
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', error => console.error(error));
db.once('open', () => console.log('Connected to Mongoose'));


// Routes and Application Start
app.get('/', async (req, res) => {
    const article = await Plant.find().sort({
        createdAt: 'desc'
    });
    res.render('index', { article: article });
});


app.use('/plants', plantRouter);

// Start the server and listen for incoming request on the specificed port or default to 3000
app.listen(process.env.PORT || 3000); 