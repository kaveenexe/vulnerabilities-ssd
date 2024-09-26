require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const csrf = require("csurf");
const cookieParser = require("cookie-parser");

const app = express();

// Import routes
const orderRoutes = require("./routes/order-route");

// Middleware
const cors = require("cors");
app.use(cors());

// Connect to the database
connectDB();

// Initialize middleware
app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Middleware to parse cookies

// Disable X-Powered-By header
app.disable("x-powered-by");

// Set up CSRF protection
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

// Expose CSRF token to all routes
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.get("/", (req, res) => res.send("Server up and running"));

/* ROUTES */
app.use("/order", orderRoutes);

// Handle CSRF token errors
app.use((err, req, res, next) => {
  if (err.code === "EBADCSRFTOKEN") {
    // CSRF token errors
    res.status(403).send("Form tampered with");
  } else {
    // Other errors
    next(err);
  }
});

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 8010;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
