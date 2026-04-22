// Express server entry point for SmartSeason backend APIs.
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const authRoutes = require('./src/routes/auth');
const fieldRoutes = require('./src/routes/fields');
const userRoutes = require('./src/routes/users');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/fields', fieldRoutes);
app.use('/api/users', userRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`SmartSeason backend running on port ${PORT}`);
});
