require('./config/config')
const path = require('path');
const express = require('express');

const publicPath = path.join(__dirname, '../public');

var app = express();
app.use(express.static(publicPath));

app.listen(process.env.PORT, () => {
	console.log(`Listening on port ${process.env.PORT}`);
});