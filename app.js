const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const authRoutes = require('./Routes/authRoutes');
const quizRoutes = require('./Routes/quizRoutes');
const resultRoutes = require('./Routes/resultRoutes');

const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

mongoose.connect('mongodb://localhost:27017/quizdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


// Session middleware (required by Passport)
app.use(session({
    secret: 'your_session_secret',
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);
app.use('/api', quizRoutes);
app.use('/api', resultRoutes);

app.listen(3000, () => {
    console.log('Server running on port 5000');
});
