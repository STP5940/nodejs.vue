const rateLimit = require('express-rate-limit');
const bodyParser = require("body-parser");
const requestIp = require('request-ip');
const express = require("express");
const logger = require('morgan');
const cors = require("cors");
const path = require("path");

const pathviews = path.join(__dirname, 'app', 'views');

const app = express();

// Rate limiter maximum of 100 requests per 1 hour per IP address
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 400,
  message: 'Too many requests from this IP, please try again later.',
  skip: (req) => {
      const pathsToSkip = [
          '/api',                         // api
      ];

      const filesToSkip = [
          '/sw.js'                        // Service Worker
      ];

      // Check if the request path starts with any of the pathsToSkip
      if (pathsToSkip.some(path => req.path.startsWith(path))) {
          return true;
      }

      // Check if the request path ends with any of the filesToSkip
      if (filesToSkip.some(file => req.path.endsWith(file))) {
          return true;
      }

      // Check if the request path ends with '.js'
      if (req.path.endsWith('.js')) {
          return true;
      }

      return false; // Allow all other requests
  }
});

// Apply the rate limiter middleware to all requests
app.use(limiter);

// Middleware to get user IP address
app.use(requestIp.mw());

app.use(express.static(pathviews));

require("./app/routes/turorial.routes")(app);

// Handle SPA routes
app.get('*', (req, res) => {
  res.sendFile(path.join(pathviews, 'index.html'));
});

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// logger dev
app.use(logger('dev'));

const db = require("./app/models");

db.sequelize.sync();
// // drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🦊 Server is running on port http://localhost:${PORT}.`);
});
