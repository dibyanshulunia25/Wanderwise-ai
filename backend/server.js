const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Route files
const userRoutes = require('./routes/userRoutes');
const guideRoutes = require('./routes/guideRoutes');
// const paymentRoutes = require('./routes/paymentRoutes'); // We'll add this later

dotenv.config();
connectDB();

const app = express();

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // To accept JSON data

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Mount routers
app.use('/api/users', userRoutes);
app.use('/api/guides', guideRoutes);
// app.use('/api/payments', paymentRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));