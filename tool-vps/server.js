require('dotenv').config()
const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const server = http.createServer(app);

app.use(express.json());
app.use(bodyParser.urlencoded({ limit: '1gb', extended: true }));
app.use(bodyParser.json({ limit: '1gb' }));
app.use(cors());

global.__pythonService = __dirname;
// connect to MongoDB
const url = process.env.mongoURI;
mongoose.connect(url,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(`errors: ${err}`)
    );
const axios = require('axios');
app.get('/', async (req, res) => {
    res.json('tool-vps');
});

app.use('/v1/profile', require('./routes/profile'));
app.use('/v1/vps', require('./routes/vps'));

server.listen(7070, () => {
    console.log('listening on *:7070');
});