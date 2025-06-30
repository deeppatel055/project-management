const express = require('express');
const {
  createProject,
  getProjectsByUser,
  updateProject,
  deleteProject,
  getProjectDetails,
} = require('../controllers/projectController');

const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Create Project
router.post(
  '/add',
  isAuthenticatedUser,
  authorizeRoles('admin', 'superadmin'),
  createProject
);

// Update Project
router.put(
  '/:id',
  isAuthenticatedUser,
  authorizeRoles('admin', 'superadmin'),
  updateProject
);

// Delete Project
router.delete(
  '/:id',
  isAuthenticatedUser,
  authorizeRoles('admin', 'superadmin'),
  deleteProject
);

router.get(
  '/',
  isAuthenticatedUser,
  getProjectsByUser
);

router.get('/:id', isAuthenticatedUser, getProjectDetails);

module.exports = router;
