const express = require('express');
const mongoose = require('mongoose');
const app = express();


require('dotenv').config();



// Basic middleware
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Successfully connected to the database'))
  .catch(err => console.error('Database connection error:', err));

  
// Import Routes
const eventRoutes = require('./routes/eventRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const userRoutes = require('./routes/userRoutes');



// Use Routes
app.use('/api/events', eventRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/users', userRoutes);


// Welcome page
app.get('/', (req, res) => {
  res.send('Event Management System - Welcome!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
