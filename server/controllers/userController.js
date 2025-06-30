const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db.js');
const sendVerificationEmail = require('../utils/sendVerificationEmail.js');
const sendToken = require('../utils/sendToken');
const catchAsyncError = require('../middleware/catchAsyncError.js');
const ErrorHandler = require('../utils/errorHandler');
const sendUpdateEmail = require('../utils/sendUpdateEmail.js');

const PORT = process.env.PORT || 5001;
const BASE_URL = `http://localhost:${PORT}`;
const DEFAULT_PROFILE_PICTURE = `/public/images/default-profile.png`;


//Add new user 
const addUser = catchAsyncError(async (req, res) => {
  try {
    const { name, email, mobile, password, auth_provider = 'local', profile_picture, role } = req.body;

    if (!req.user) throw new ErrorHandler('Unauthorized: no user info', 401);

    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') throw new ErrorHandler('Forbidden: admin or super admin only can add users', 403);

    // if (req.user.role === 'admin' && role === 'superadmin') throw new ErrorHandler('Forbidden: cannot create superadmin', 403);

    if (!email || !password || !role) throw new ErrorHandler('Missing required fields', 400);

    const [[existingUser]] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser) throw new ErrorHandler('Email already registered', 409);

    const safeMobile = mobile || ""
    const finalProfilePicture = req.file?.filename ? `/uploads/${req.file.filename}` : profile_picture || DEFAULT_PROFILE_PICTURE;



    const hashPassword = await bcrypt.hash(password, 10);


    await db.execute(
      'INSERT INTO users (name, email, mobile, password, created_at, is_verified, auth_provider, profile_picture, role) VALUES (?, ?, ?, ?, NOW(), ?, ?, ?, ?)',
      [name, email, safeMobile, hashPassword, false, auth_provider, finalProfilePicture, role]
    );

    await sendVerificationEmail(email);
    res.send('User added. Verification email sent.');
  } catch (error) {
    console.error('Add user failed:', error);
    if (process.env.NODE_ENV === 'development') {
      throw new ErrorHandler(error.message, 500);
    } else {
      throw new ErrorHandler('Internal Server Error', 500);
    }
  }

});

const verifyEmail = catchAsyncError(async (req, res) => {
  const { token } = req.query;
  const { email } = jwt.verify(token, process.env.EMAIL_SECRET);
  await db.execute('UPDATE users SET is_verified = ? WHERE email = ?', [true, email]);
  res.send('Email verified successfully.');
});

const getUser = catchAsyncError(async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'superadmin') throw new ErrorHandler('Forbidden: admin or super admin only', 403);

  const [users] = await db.execute('SELECT id, name, email, mobile, role, is_verified, profile_picture FROM users');

  res.json({ user: users });
});

const updateUser = catchAsyncError(async (req, res) => {
  // const { id, name, email, mobile, password, role } = req.body;
  const { id, name, email, mobile, password, role, profile_picture, remove_profile_picture } = req.body;

  // if (!id || !name || !email || !role) throw new ErrorHandler('Missing required fields', 400);

  if (req.user.role !== 'admin' && req.user.role !== 'superadmin') throw new ErrorHandler('Forbidden: admin or super admin only', 403);


  if (req.params.id != id) throw new ErrorHandler('ID mismatch', 400);

  const [[existingUser]] = await db.execute(
    'SELECT name, email as oldEmail, mobile, role, profile_picture FROM users WHERE id = ?', [id]
  );

  if (!existingUser) throw new ErrorHandler('User not found', 404);

  //admin can't modify super admin
  if (req.user.role === 'admin' && existingUser.role === 'superadmin') throw new ErrorHandler('Forbidden: cannot modify super admin', 403);

  const finalProfilePicture = remove_profile_picture === 'true'
    ? DEFAULT_PROFILE_PICTURE
    : req.file?.filename
      ? `/uploads/${req.file.filename}`
      : profile_picture || existingUser.profile_picture;




  let query = 'UPDATE users SET name = ?, email = ?, mobile = ?, role = ?, profile_picture = ?';
  const params = [name, email, mobile || null, role, finalProfilePicture];

  if (password) {
    const hash = await bcrypt.hash(password, 10);
    query += ', password = ?';
    params.push(hash);
  }
  query += ' WHERE id = ?';
  params.push(id);

  await db.execute(query, params);

  const changes = [];
  if (existingUser.name !== name) changes.push('Name');
  if (existingUser.oldEmail !== email) changes.push('Email');
  if (existingUser.mobile !== mobile) changes.push('Mobile');
  if (existingUser.role !== role) changes.push('Role');
  if (password) changes.push('Password');
  if (req.file) changes.push('Profile Picture');

  // 📧 Send email if there are changes
  if (changes.length > 0) {
    await sendUpdateEmail(email, {
      name,
      updatedBy: req.user.email,
      changes,
    });
  }

  res.json({ message: 'User updated successfully' });
});

const deleteUser = catchAsyncError(async (req, res) => {
  const userId = req.params.id;

  if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
    throw new ErrorHandler('Forbidden: admin or super admin only', 403);
  }

  const [[targetUser]] = await db.execute('SELECT role FROM users WHERE id = ?', [userId]);

  if (!targetUser) {
    throw new ErrorHandler('User not found', 404);
  }

  // Admin can't delete superadmin
  if (req.user.role === 'admin' && targetUser.role === 'superadmin') {
    throw new ErrorHandler('Forbidden: cannot delete superadmin', 403);
  }

  // 🧹 Step 1: Delete from child tables referencing this user
  await db.execute('DELETE FROM task_assign_mention WHERE mentioned_id IN (SELECT id FROM audit_control WHERE user_id = ?)', [userId]);
  await db.execute('DELETE FROM audit_control WHERE user_id = ?', [userId]);
  await db.execute('DELETE FROM task_assign_member WHERE user_id = ?', [userId]);
  await db.execute('DELETE FROM task_notes WHERE user_id = ?', [userId]);
  await db.execute('DELETE FROM project_users WHERE user_id = ?', [userId]);

  // Optional: Nullify references (if ON DELETE SET NULL not defined)
  await db.execute('UPDATE task SET user_id = NULL WHERE user_id = ?', [userId]);

  // 🧹 Step 2: Finally delete the user
  await db.execute('DELETE FROM users WHERE id = ?', [userId]);

  res.json({ message: 'User deleted successfully.' });
});


const login = catchAsyncError(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new ErrorHandler('Please enter email and password', 400);

  const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);

  const user = rows[0];
  if (!user) throw new ErrorHandler('Invalid email or password', 401);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new ErrorHandler('Invalid email or password', 401);
  if (!user.is_verified) throw new ErrorHandler('Please verify your email first', 401);

  await sendToken(user, 200, res, db);
});

const getUserById = catchAsyncError(async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'superadmin') throw new ErrorHandler('Forbidden: admin or superadmin only', 403);

  const [[targetUser]] = await db.execute('SELECT * FROM users WHERE id = ?', [req.params.id]);

  if (!targetUser) throw new ErrorHandler('User not found', 404);

  if (req.user.role === 'admin' && targetUser.role === 'superadmin') throw new ErrorHandler('Forbidden: cannot access superadmin', 403);

  res.json(targetUser);
});

const getSingleUser = catchAsyncError(async (req, res) => {
  const [rows] = await db.execute('SELECT id, name, email, mobile, role, is_verified, profile_picture FROM users WHERE id = ?', [req.user.id]);
  if (!rows.length) return next(new ErrorHandler('User not found', 404));
  res.json(rows[0]);
});


const refreshToken = catchAsyncError(async (req, res) => {
  const tokenFromCookie = req.cookies.refreshToken || req.body.refreshToken;
  if (!tokenFromCookie) throw new ErrorHandler('Refresh token missing', 401);

  let decoded;
  try {
    decoded = jwt.verify(tokenFromCookie, process.env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    throw new ErrorHandler('Invalid or expired refresh token', 401);
  }

  const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [decoded.id]);
  const user = rows[0];
  if (!user || user.refresh_token !== tokenFromCookie) {
    throw new ErrorHandler('Invalid refresh token', 403);
  }

  const newAccessToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '2h' });

  res.cookie('token', newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 2 * 60 * 60 * 1000 // 2 hours
  });

  res.json({ success: true, token: newAccessToken });
});


const logout = catchAsyncError(async (req, res) => {
  if (req.user) {
    await db.execute('UPDATE users SET refresh_token = NULL WHERE id = ?', [req.user.id]);
  }

  res.clearCookie('token');
  res.clearCookie('refreshToken');

  res.json({ message: 'Logged out successfully' });
});


const forgotPassword = catchAsyncError(async (req, res) => {
  const { email } = req.body;
  const [userRows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
  if (!userRows.length) return next(new ErrorHandler('User not found', 404));

  const resetToken = jwt.sign({ email }, process.env.RESET_PASSWORD_SECRET, { expiresIn: '15m' });
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
  const message = `You requested a password reset. Click the link below to reset your password: ${resetUrl}`;

  await sendVerificationEmail(email, 'Password Reset Request', message);
  res.json({ message: 'Reset link sent to email' });
});

const resetPassword = catchAsyncError(async (req, res) => {
  const { email, newPassword } = req.body;
  if (req.user.role !== 'admin' && req.user.role !== 'superadmin') throw new ErrorHandler('Forbidden: admin or superadmin only', 403);

  const [[targetUser]] = await db.execute('SELECT role FROM users WHERE email = ?', [email]);
  if (!targetUser) throw new ErrorHandler('User not found', 404);
  if (req.user.role === 'admin' && targetUser.role === 'superadmin') throw new ErrorHandler('Forbidden: cannot reset password for superadmin', 403);

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await db.execute('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email]);
  res.json({ message: 'Password reset successfully by admin' });
});

module.exports = {
  addUser,
  verifyEmail,
  getUser,
  updateUser,
  deleteUser,
  login,
  getSingleUser,
  logout,
  refreshToken,
  getUserById,
  forgotPassword,
  resetPassword,
};
