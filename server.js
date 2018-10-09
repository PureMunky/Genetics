'use strict';

const express = require('express');

const PORT = 8080;
const HOST = 'localhost';
const STATIC_FOLDER = 'public';
const app = express();

app.use(express.static(STATIC_FOLDER));

app.listen(PORT);
console.log(`Running on http://${HOST}:${PORT}`);
