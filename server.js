const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const logMiddleware = require('./middleware/logger'); // ✅ Import the function
const urlRoutes = require('./routes/urlRoutes');

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(logMiddleware); // ✅ USE the logging middleware
app.use('/', urlRoutes);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
