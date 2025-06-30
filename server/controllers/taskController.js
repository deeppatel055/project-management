const db = require('../config/db');
const catchAsyncError = require('../middleware/catchAsyncError');
const ErrorHandler = require('../utils/errorHandler');
const sendProjectEmail = require('../utils/sendProjectEmail');


function getChanges(oldData, newData) {
  const changed = {};
  for (const key in newData) {
    if (
      newData[key] !== undefined &&
      newData[key] !== oldData[key]
    ) {
      changed[key] = newData[key];
    }
  }
  return changed;
}


const createTask = catchAsyncError(async (req, res, next) => {
  const { project_id } = req.params;
  const {
    title,
    description,
    due_date,
    start_date,
    priority,
    status_id,
    user_ids = []
  } = req.body;

  const created_by = req.user.id;
  const userRole = req.user.role;

  // Role check
  if (!['admin', 'superadmin'].includes(userRole)) {
    return next(new ErrorHandler('Forbidden: admin or superadmin only', 403));
  }

  // Validate required fields
  if (!title || !project_id) {
    return next(new ErrorHandler('Missing title or project ID', 400));
  }

  // Insert task
  const [result] = await db.execute(
    `INSERT INTO task (user_id, title, description, due_date, start_date, priority, status_id, project_id, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
    [created_by, title, description || '', due_date || null, start_date || null, priority || 'Medium', status_id || null, project_id]
  );

  const taskId = result.insertId;

  // Filter out creator from user_ids to avoid duplicate assignment emails
  const filteredUserIds = user_ids.filter(id => id !== created_by);
   const [superadmins] = await db.execute('SELECT id FROM users WHERE role = ?', ['superadmin']);
  const superadminIds = superadmins.map(user => user.id);

  // Unique assigned members (including creator)
  const assignedUserIds = Array.from(new Set([...filteredUserIds, created_by, ...superadminIds]));

  // Insert task assignment records
  const assignValues = assignedUserIds.map(userId => [taskId, userId, created_by]);
  if (assignValues.length > 0) {
    await db.query(`INSERT INTO task_assign_member (task_id, user_id, assigned_by) VALUES ?`, [assignValues]);
  }

  // Email only explicitly assigned users (not superadmins, not creator)
  if (filteredUserIds.length > 0) {
    const [assignedUsers] = await db.query(
      `SELECT email, name FROM users WHERE id IN (?)`,
      [filteredUserIds]
    );

    for (const user of assignedUsers) {
      await sendProjectEmail({
        to: user.email,
        subject: 'New Task Assigned',
        html: `<p>Hi ${user.name},</p><p>You have been assigned to a task: <strong>${title}</strong>.</p>`
      });
    }
  }

  // Insert audit control record
  await db.execute(
    `INSERT INTO audit_control (created_by, task_id, user_id, change_summary, previous_data, new_data, action_type, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
    [
      created_by,
      taskId,
      created_by,
      'Task created',
      null,
      JSON.stringify(req.body),
      'CREATE'
    ]
  );

  res.status(201).json({
    message: 'Task created successfully',
    taskId
  });
});



const getTasksByProject = catchAsyncError(async (req, res, next) => {
  const { project_id } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;

  let query = `
      SELECT t.*, ts.name AS status,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', u.id,
            'name', u.name,
            'email', u.email,
            'user_role', u.role
          )
        ) AS assigned_members
      FROM task t
      LEFT JOIN task_status ts ON t.status_id = ts.id
      LEFT JOIN task_assign_member tam ON t.id = tam.task_id
      LEFT JOIN users u ON tam.user_id = u.id
      WHERE t.project_id = ?
    `;

  const values = [project_id];

  if (!['admin', 'superadmin'].includes(userRole)) {
    query += ` AND t.id IN (SELECT task_id FROM task_assign_member WHERE user_id = ?)`;
    values.push(userId);
  }

  query += ` GROUP BY t.id`;


  const [tasks] = await db.execute(query, values);

  res.status(200).json({
    tasks: tasks.map(task => ({
      ...task,
      assigned_members: typeof task.assigned_members === 'string'
        ? JSON.parse(task.assigned_members)
        : task.assigned_members || []

    }))
  });
});

const deleteTask = catchAsyncError(async (req, res, next) => {
  const taskId = req.params.id;
  const userId = req.user.id;

  if (!['admin', 'superadmin'].includes(req.user.role)) {
    return next(new ErrorHandler('Forbidden: admin or superadmin only', 403));
  }

  const [[task]] = await db.execute('SELECT * FROM task WHERE id = ?', [taskId]);
  if (!task) return next(new ErrorHandler('Task not found', 404));

  await db.execute('DELETE FROM task_assign_member WHERE task_id = ?', [taskId]);
  await db.execute('DELETE FROM task_notes WHERE task_id = ?', [taskId]);
  await db.execute('DELETE FROM audit_control WHERE task_id = ?', [taskId]);
  await db.execute('DELETE FROM task WHERE id = ?', [taskId]);

  try {
    await db.execute(
      `INSERT INTO audit_control (created_by, task_id, user_id, change_summary, previous_data, new_data, action_type, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [userId, taskId, userId, 'Task deleted', JSON.stringify(task), null, 'DELETE']
    );
  } catch (auditError) {
    console.error('Audit log insert failed:', auditError);
  }

  res.json({ message: 'Task deleted successfully' });
});

const updateTask = catchAsyncError(async (req, res, next) => {
  const taskId = req.params.id;
  const { title, description, due_date, start_date, priority, status_id, user_ids } = req.body;
  const userId = req.user.id;
  const userRole = req.user.role;

  const [[oldTask]] = await db.execute('SELECT * FROM task WHERE id = ?', [taskId]);
  if (!oldTask) return next(new ErrorHandler('Task not found', 404));

  const isWriteUser = userRole === 'write';
  const isAdmin = userRole === 'admin';
  const isSuperAdmin = userRole === 'superadmin';

  const fields = [];
  const values = [];
  const previousData = {};
  const newData = {};

  const allowedFields = isWriteUser
    ? ['description', 'priority', 'status_id']
    : ['title', 'description', 'due_date', 'start_date', 'priority', 'status_id'];

  // Check what fields changed
  allowedFields.forEach(key => {
    if (req.body[key] !== undefined && req.body[key] !== oldTask[key]) {
      fields.push(`${key} = ?`);
      values.push(req.body[key]);
      previousData[key] = oldTask[key];
      newData[key] = req.body[key];
    }
  });

  // Create readable summary like: "priority updated, status_id updated"
  const changedFields = Object.keys(newData);
  const changeSummary = changedFields.map(field => `${field} updated`).join(', ');

  // Update task if there are field changes
  if (fields.length > 0) {
    const updateQuery = `UPDATE task SET ${fields.join(', ')}, updated_time = NOW() WHERE id = ?`;
    values.push(taskId);
    await db.execute(updateQuery, values);

    await db.execute(
      `INSERT INTO audit_control (updated_by, task_id, user_id, change_summary, previous_data, new_data, action_type, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        userId,
        taskId,
        userId,
        changeSummary || 'Task updated',
        JSON.stringify(previousData),
        JSON.stringify(newData),
        'UPDATE'
      ]
    );
  }

  // Handle member assignment changes for admin/superadmin
  if ((isAdmin || isSuperAdmin) && Array.isArray(user_ids)) {
    const [existingMembers] = await db.query('SELECT user_id FROM task_assign_member WHERE task_id = ?', [taskId]);
    const oldMembers = existingMembers.map(m => m.user_id);

    // Remove all old and re-insert new assignments
    await db.execute('DELETE FROM task_assign_member WHERE task_id = ?', [taskId]);

    if (user_ids.length > 0) {
      const assignValues = user_ids.map(uid => [taskId, uid, userId]);
      await db.query('INSERT INTO task_assign_member (task_id, user_id, assigned_by) VALUES ?', [assignValues]);
    }

    // Log audit only if the members actually changed
    const oldSet = new Set(oldMembers);
    const newSet = new Set(user_ids);
    const membersChanged = oldMembers.length !== user_ids.length ||
      [...oldSet].some(id => !newSet.has(id));

    if (membersChanged) {
      await db.execute(
        `INSERT INTO audit_control (updated_by, task_id, user_id, change_summary, previous_data, new_data, action_type, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          userId,
          taskId,
          userId,
          'Members assigned',
          JSON.stringify({ assigned_members: oldMembers }),
          JSON.stringify({ assigned_members: user_ids }),
          'ASSIGN'
        ]
      );
    }
  }

  // If nothing changed at all
  if (fields.length === 0 && !(isAdmin || isSuperAdmin && Array.isArray(user_ids))) {
    return res.status(400).json({ message: "No changes provided for update" });
  }

  res.json({ message: 'Task updated successfully' });
});




const addTaskNote = catchAsyncError(async (req, res, next) => {
  const { task_id } = req.params;
  const { note } = req.body;
  const userId = req.user.id;

  if (!note) return next(new ErrorHandler('Note is required', 400));

  await db.execute(
    'INSERT INTO task_notes (task_id, user_id, content, created_at) VALUES (?, ?, ?, NOW())',
    [task_id, userId, note]
  );

  // Audit log
  await db.execute(
    `INSERT INTO audit_control (created_by, task_id, user_id, change_summary, previous_data, new_data, action_type, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
    [userId, task_id, userId, 'Note added', null, JSON.stringify({ note }), 'NOTE_ADD']
  );

  res.status(201).json({ message: 'Note added successfully' });
});


const getSingleTaskDetail = catchAsyncError(async (req, res, next) => {
  const { task_id } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;

  // 1. Get task and assigned members
  let taskQuery = `
      SELECT t.*, ts.name AS status,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', u.id,
            'name', u.name,
            'email', u.email,
            'user_role', u.role
          )
        ) AS assigned_members
      FROM task t
      LEFT JOIN task_status ts ON t.status_id = ts.id
      LEFT JOIN task_assign_member tam ON t.id = tam.task_id
      LEFT JOIN users u ON tam.user_id = u.id
      WHERE t.id = ?
    `;

  const taskValues = [task_id];

  // Limit visibility for non-admin/write
  if (!['admin', 'superadmin'].includes(userRole)) {
    taskQuery += ` AND t.id IN (SELECT task_id FROM task_assign_member WHERE user_id = ?)`;
    taskValues.push(userId);
  }

  taskQuery += ` GROUP BY t.id`;

  const [taskResult] = await db.execute(taskQuery, taskValues);
  const task = taskResult[0];

  if (!task) return next(new ErrorHandler("Task not found", 404));

  // Parse assigned_members JSON
  task.assigned_members = typeof task.assigned_members === 'string'
    ? JSON.parse(task.assigned_members)
    : task.assigned_members || [];

  // 2. Get task notes
  const [notes] = await db.execute(
    `SELECT tn.*, u.name FROM task_notes tn 
      JOIN users u ON tn.user_id = u.id 
      WHERE tn.task_id = ? 
      ORDER BY tn.created_at DESC`,
    [task_id]
  );

  // 3. Get audit control history
  const [auditLogs] = await db.execute(
    `SELECT ac.*, u.name AS user_name FROM audit_control ac
      JOIN users u ON ac.user_id = u.id
      WHERE ac.task_id = ?
      ORDER BY ac.created_at DESC`,
    [task_id]
  );

  res.json({
    task,
    notes,
    auditLogs
  });
});


const getTaskNotes = catchAsyncError(async (req, res, next) => {
  const { task_id } = req.params;
  const [notes] = await db.execute(
    'SELECT tn.*, u.name FROM task_notes tn JOIN users u ON tn.user_id = u.id WHERE tn.task_id = ? ORDER BY tn.created_at DESC',
    [task_id]
  );

  res.json({ notes });
});


const deleteTaskNote = catchAsyncError(async (req, res, next) => {
  const { note_id } = req.params;
  const userId = req.user.id;

  const [[note]] = await db.execute('SELECT * FROM task_notes WHERE id = ?', [note_id]);
  if (!note) return next(new ErrorHandler('Note not found', 404));
  if (note.user_id !== userId && !['admin', 'superadmin'].includes(req.user.role)) {
    return next(new ErrorHandler('Forbidden to delete this note', 403));
  }

  await db.execute('DELETE FROM task_notes WHERE id = ?', [note_id]);

  // Audit log
  await db.execute(
    `INSERT INTO audit_control (created_by, task_id, user_id, change_summary, previous_data, new_data, action_type, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
    [userId, note.task_id, userId, 'Note deleted', JSON.stringify(note), null, 'NOTE_DELETE']
  );

  res.json({ message: 'Note deleted successfully' });
});

const getAllTasks = catchAsyncError(async (req, res, next) => {
  const userRole = req.user.role;

  // Optional: Only allow admin or superadmin
  if (!['admin', 'superadmin'].includes(userRole)) {
    return next(new ErrorHandler('Forbidden: admin or superadmin only', 403));
  }

  const query = `
    SELECT t.*, ts.name AS status,
      JSON_ARRAYAGG(
        JSON_OBJECT(
          'id', u.id,
          'name', u.name,
          'email', u.email,
          'user_role', u.role
        )
      ) AS assigned_members
    FROM task t
    LEFT JOIN task_status ts ON t.status_id = ts.id
    LEFT JOIN task_assign_member tam ON t.id = tam.task_id
    LEFT JOIN users u ON tam.user_id = u.id
    GROUP BY t.id
    ORDER BY t.created_at DESC
  `;

  const [tasks] = await db.execute(query);

  res.status(200).json({
    tasks: tasks.map(task => ({
      ...task,
      assigned_members: typeof task.assigned_members === 'string'
        ? JSON.parse(task.assigned_members)
        : task.assigned_members || []
    }))
  });
});

module.exports = {
  createTask,
  getSingleTaskDetail,
  getTasksByProject,
  updateTask,
  deleteTask,
  addTaskNote,
  getTaskNotes,
  deleteTaskNote,
  getAllTasks 
};

