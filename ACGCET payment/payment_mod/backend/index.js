const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();
const bcrypt = require('bcrypt');

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());

const port = 5003;
const routes = require('./main_app/routes');
app.use('/', routes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
