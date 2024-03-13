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
app.get('/ip', async (req, res) => {
    try {
        const result = await axios.get('https://api.ipify.org/?format=json');
        console.log(result.data.ip);
        return res.status(200).send({
            code: "1000",
            message: "OK",
            ip: result.data.ip
        });
    }
    catch (e){
        return res.status(400).json({
            code: "9999",
            message: "FAILED",
            reason: "Lỗi bất định"
        });
    }
});

app.get('/test-api', async (req, res) => {
    try {
        const result = await axios.get('http://rd-demo-6xx.japaneast.cloudapp.azure.com/services/api/search/achievements?systemid=000&apikey=2202a4b34a244158a7af793747cd52fa');
        delete result.data;
        console.log(result);
        return res.status(200).send({
            code: "1000",
            message: "OK",
            data: result.data
        });
    }
    catch (e){
        return res.status(400).json({
            code: "9999",
            message: "FAILED",
            reason: "Lỗi bất định"
        });
    }
});

app.use('/v1/profile', require('./routes/profile'));
app.use('/v1/vps', require('./routes/vps'));

server.listen(7070, () => {
    console.log('listening on *:7070');
});