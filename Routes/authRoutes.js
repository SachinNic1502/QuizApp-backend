const express = require('express');
const router = express.Router();
const User = require('../Model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const JWT_SECRET = 'your_jwt_secret';

passport.use(new GoogleStrategy({
    clientID: '5859402211-04qunsbm08o6qaj8oh2eotl1i5jf6grm.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:3000/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
            user = await User.create({
                googleId: profile.id,
                email: profile.emails[0].value
            });
        }
        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));
// Serialize user to the session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Google OAuth login route
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback route
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    // Generate a JWT token
    const token = jwt.sign({ id: req.user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.send({ token, user: req.user });
    res.redirect('/');
});


// Signup route
router.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = new User({ email, password: hashedPassword });
        await user.save();
        res.status(201).send({ message: 'User created successfully' });
    } catch (error) {
        res.status(400).send(error);
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send({ message: 'Invalid credentials' });
        }

        console.log(`User found: ${user.email}, password hash: ${user.password}`);

        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log(`Password valid: ${isPasswordValid}`);

        if (!isPasswordValid) {
            return res.status(401).send({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.send({ token, user});
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error' });
    }
});






module.exports = router;