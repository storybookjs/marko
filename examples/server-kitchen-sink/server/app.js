const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const webpackConfig = require('../webpack.config.js');

const port = process.env.PORT || 8080;

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', (req, res) => res.send('Hello World!'));

app.get(/storybook_preview\/(.*)/, (req, res) => {
  res.render(req.params[0], req.query);
});

app.use(webpackMiddleware(webpack(webpackConfig)));
app.use(webpackHotMiddleware(webpack(webpackConfig)));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/storybook.html'));
});

app.listen(port);
