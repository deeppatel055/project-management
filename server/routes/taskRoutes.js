const express = require('express');
const {
  createTask,
  getTasksByProject,
  updateTask,
  deleteTask,
  addTaskNote,
  getTaskNotes,
  deleteTaskNote,
  getSingleTaskDetail,
  getAllTasks,
  getTasksByUser,
} = require('../controllers/taskController');

const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

const router = express.Router();


// Create a new task under a project (admin only)
router.post(
  '/:project_id/add',
  isAuthenticatedUser,
  authorizeRoles('admin', 'superadmin'),
  createTask
);

// Get all tasks for a specific project (any authenticated user)
router.get(
  '/project/:project_id',
  isAuthenticatedUser,
  getTasksByProject
);

router.get(
  '/:task_id/detail',
  isAuthenticatedUser,
  getSingleTaskDetail
);

router.get(
  '/alltask',
  isAuthenticatedUser,
  getAllTasks 
)

// Update a task (admin only)
router.put(
  '/:id',
  isAuthenticatedUser,
  authorizeRoles('admin', 'superadmin'),
  updateTask
);

// Delete a task (admin only)
router.delete(
  '/:id',
  isAuthenticatedUser,
  authorizeRoles('admin', 'superadmin'),
  deleteTask
);

// 🗒️ TASK NOTES ROUTES

// Add a note to a task
router.post(
  '/:task_id/notes',
  isAuthenticatedUser,
  addTaskNote
);

// Get all notes for a task
router.get(
  '/:task_id/notes',
  isAuthenticatedUser,
  getTaskNotes
);

// Delete a note from a task (owner or admin)
router.delete(
  '/notes/:note_id',
  isAuthenticatedUser,
  deleteTaskNote
);

router.get('/taskByUser', isAuthenticatedUser, getTasksByUser);


module.exports = router;