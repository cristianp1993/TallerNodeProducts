

const express = require('express'); // Importar express
const roots = require('./routes');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');

const app = express(); 
const PORT = process.env.PORT || 3000;


app.use(morgan('dev'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


roots(app); 

app.listen(PORT, ()=> {
    console.log(`Listening  EN  port ${PORT}`);
});


