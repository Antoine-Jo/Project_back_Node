const express = require('express');
const userRoutes = require('./routes/user.routes');
const cookieParser = require('cookie-parser');
require('dotenv').config({path: './config/.env'});
require('./config/db');
const {checkUser, requireAuth} = require('./middleware/auth.middleware');
const app = express();



app.use(express.json());
app.use(cookieParser());

// jwt
app.get('*', checkUser);
app.get('/jwtid', requireAuth, (req, res) => {
    res.status(200).send(res.locals.user._id)
});

// routes
app.use('/api/user', userRoutes);

// Server
app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
});