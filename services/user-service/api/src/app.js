const express = require('express'),
    path = require('path'),
    Session = require('express-session'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    middleware = require('connect-ensure-login'),
    FileStore = require('session-file-store')(Session),
    config = require('./config/default'),
    flash = require('connect-flash'),
    cookieParser = require('cookie-parser'),
    port = config.server.port,
    passport = require('./auth/passport'),
    app = express();


mongoose.connect(config.mongodb.connection_url, { useNewUrlParser: true })
    .then(() => {
        console.log("connected to user database");
    }).catch((err) => {
        console.error(`connection url: ${config.mongodb.connection_url}`);
        console.error("ERROR: not connected to database! ", err);
    });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));
app.use(express.static('public'));
app.use(flash());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));

app.use(Session({
    store: new FileStore({
        path: './sessions'
    }),
    secret: config.server.secret,
    maxAge: Date().now + (60 * 1000 * 30),
    resave: true,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/login', require('./routes/login'));
app.use('/register', require('./routes/register'));
app.use('/settings', require('./routes/settings'));
app.use('/user', require('./routes/user'));

app.get('/logout', (req, res) => {
    req.logout();
    return res.redirect('/login');
});

app.get('*', middleware.ensureLoggedIn(), (req, res) => {
    res.render('index');
});

app.listen(port, () => console.log(`App listening on ${port}!`));
