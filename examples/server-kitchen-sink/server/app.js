const express = require('express');
const morgan = require('morgan');
const Bundler = require('parcel-bundler');
const Path = require('path');

const port = process.env.PORT || 8080;

const app = express();

app.use(morgan('dev'));
app.set('views', Path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', (req, res) => res.send('Hello World!'));

app.get(/storybook_preview\/(.*)/, (req, res) => {
  res.render(req.params[0], req.query);
});

const storybookFile = Path.join(__dirname, '../client/storybook.html');
const bundler = new Bundler(storybookFile, {});
app.use(bundler.middleware());

app.listen(port);
