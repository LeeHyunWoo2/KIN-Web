const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const logger = require("./logger");

module.exports = (app) => {
  app.use(logger);
  app.use(compression());
  app.use(express.json());
  app.use(cookieParser());
  app.use(bodyParser.json());

  app.use(
      cors({
        origin: [process.env.FRONTEND_URL, process.env.BACKEND_API_URL],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: [
          'Content-Type',
          'Authorization',
          'Cache-Control',
          'Accept',
          'Origin',
          'Referer',
          'User-Agent',
          'X-CSRF-Token',
          'X-Requested-With',
          'cf-connecting-ip',
          'cf-clearance',
          'x-skip-interceptor',
          'x-api-key'
        ],
        credentials: true,
      })
  );
  app.options('*', cors());

  app.use(
      helmet({
        contentSecurityPolicy: false,
        hsts: {
          maxAge: 60 * 60 * 24 * 365,
          includeSubDomains: true,
        },
      })
  );
  app.use(mongoSanitize());
  app.use(xss());
  app.use(hpp());
};