const express = require('express');

const {
  addUser,
  verifyEmail,
  getUser,
  updateUser,
  deleteUser,
  login,
  getUserById,
  logout,
  getSingleUser,
  refreshToken,
  forgotPassword,
  resetPassword
} = require('../controllers/userController');

const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');
const { upload } = require('../utils/profilePicture');

const router = express.Router();

// ✅ Routes

// Add a user (admin only)
router.post('/add', isAuthenticatedUser, authorizeRoles('admin', 'superadmin'), upload.single('profile_picture'), addUser);

// Email verification link callback
router.get('/verify', verifyEmail);

// Get all users (admin only)
router.get('/', isAuthenticatedUser, authorizeRoles('admin', 'superadmin'), getUser);

// Update user (admin or self-edit with role-based logic inside controller)
router.put('/edit/:id', isAuthenticatedUser, upload.single('profile_picture'), updateUser);

// Login route
router.post('/login', login);

// Logout route
router.post('/logout', isAuthenticatedUser, logout);

// Get logged-in user's info
router.get('/me', isAuthenticatedUser, getSingleUser);
router.post('/refresh-token', refreshToken)
// Get single user by IDx`
router.get('/:id', isAuthenticatedUser, getUserById);

// Delete a user (admin only)
router.delete('/:id', isAuthenticatedUser, authorizeRoles('admin', 'superadmin'), deleteUser);
router.post('/forgot-password', forgotPassword)
router.post('/reset-password',isAuthenticatedUser, resetPassword)
module.exports = router;
