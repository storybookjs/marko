const express = require('express');
const morgan = require('morgan');
const Bundler = require('parcel-bundler');
const Path = require('path');

const renderStory = require('./renderStory');

const port = process.env.PORT || 8080;

const app = express();

app.use(morgan('tiny'));

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/storybook_preview/:component/:story', (req, res) => {
  res.send(renderStory(req.params.component, req.params.story, req.query));
});

const storybookFile = Path.join(__dirname, '../client/storybook.html');
const bundler = new Bundler(storybookFile, {});
app.use(bundler.middleware());

app.listen(port);
