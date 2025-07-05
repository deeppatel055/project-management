const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const multer = require('multer');   
const errorMiddleware = require('./middleware/error');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const statusRoutes = require('./routes/statusRoutes')

require('dotenv').config();

const app = express();

app.use(cors({
  // origin: 'http://localhost:5173',
  // origin:"https://project-management-frontend-1lrl.onrender.com",
  origin: [
    "http://localhost:5173",
    'https://project-management-frontend-es5f.onrender.com'
  
  ],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Serve static files
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Error handling middleware for multer and others
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api', statusRoutes);

app.use(errorMiddleware);

module.exports = app;
