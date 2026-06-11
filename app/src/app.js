const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.json({
    service: 'docker-cicd-demo',
    version: process.env.APP_VERSION || 'dev',
    node: process.version,
    uptime_s: Math.round(process.uptime()),
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

module.exports = app;
