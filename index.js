const mongoose = require('mongoose');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const post = require('./routes/post');
const comment = require('./routes/comment');

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
});

mongoose.connect('mongodb://localhost/machine-test', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
})
    .then(() => console.log('<==== Connected to mongoDB =====>'))
    .catch(err => console.error('mongoDB not connected'))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', post);
app.use('/api/v1', post);
app.use('/api/v1', comment);

const port = process.env.PORT || 4500;
app.listen(port, () => console.log(`<==== Listening on port ${port} ====>`))