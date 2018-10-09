'use strict';

const express = require('express');

const PORT = 8080;
const STATIC_FOLDER = 'public';
const app = express();

app.use(express.static(STATIC_FOLDER));

app.listen(PORT);
console.log(`Running on http://localhost:${PORT}`);