const express = require("express");
const helmet = require("helmet");
const xss = require("xss-clean");
const compression = require("compression");
const cors = require("cors");
const routes = require("./routes");
require("dotenv/config");

const app = express();

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options("*", cors());

app.use(routes);

const PORT = process.env.PORT || "3000";

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}

module.exports = app;
