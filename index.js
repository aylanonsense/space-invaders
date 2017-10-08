// set up a web server
const express = require('express');
const app = express();

// let's just serve everything under /public
app.use(express.static(__dirname + '/public'));

// run the server on port 3000 by default
app.listen(process.env.PORT || 3000);