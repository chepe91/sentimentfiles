

const express = require('express');
const app = express();
const port = 3000;


//Loads the handlebars module
const handlebars = require('express-handlebars');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

app.engine('handlebars', handlebars({
layoutsDir: __dirname + '/views/layouts',
}));

app.set('view engine', 'hbs');
app.engine('hbs', handlebars({
    layoutsDir: __dirname + '/views/layouts',
    extname: 'hbs',
    defaultLayout: 'index',
}));

app.use(express.static('public'))

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.use(require('./routes/login'));
app.use(require('./routes/home'));
app.use(require('./routes/file-upload'));

app.listen(port, () => 
    console.log(`App listening to port ${port}`)
);