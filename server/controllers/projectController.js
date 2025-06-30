const db = require('../config/db');
const catchAsyncError = require('../middleware/catchAsyncError');
const ErrorHandler = require('../utils/errorHandler');
const sendProjectEmail = require('../utils/sendProjectEmail');

const createProject = catchAsyncError(async (req, res, next) => {
  const { user_ids = [], title, description, starting_date, due_date, status } = req.body;
  const created_by = req.user.id;

  if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
    return next(new ErrorHandler('Forbidden: admin or superadmin only', 403));
  }

  if (!title || !Array.isArray(user_ids)) {
    return next(new ErrorHandler('Missing title or user IDs', 400));
  }

  const filteredUserIds = user_ids.filter((id) => id !== created_by);
  const [superadmins] = await db.execute('SELECT id FROM users WHERE role = ?', ['superadmin']);
  const superadminIds = superadmins.map(user => user.id);
  const assignedUserIds = Array.from(new Set([...filteredUserIds, created_by, ...superadminIds]));

  const [result] = await db.execute(
    `INSERT INTO projects (title, description, due_date, starting_date, status, created_by, created_at)
     VALUES (?, ?, ?, ?, ?, ?, NOW())`,
    [title, description || '', due_date || null, starting_date || null, status || 'Backlog', created_by]
  );

  const projectId = result.insertId;

  // const values = assignedUserIds.map(userId => [projectId, userId]);
  // await db.query('INSERT INTO project_users (project_id, user_id) VALUES ?', [values]);
  const values = assignedUserIds.map(userId => [projectId, userId]);
  const placeholders = values.map(() => '(?, ?)').join(', ');
  const flatValues = values.flat(); // Converts [[1,2],[1,3]] to [1,2,1,3]
  await db.query(`INSERT INTO project_users (project_id, user_id) VALUES ${placeholders}`, flatValues);

  for (const userId of filteredUserIds) {
    const [[user]] = await db.execute('SELECT email, name FROM users WHERE id = ?', [userId]);
    if (user && user.email) {
      await sendProjectEmail({
        to: user.email,
        subject: 'You have been added to a new project',
        html: `<p>Hi ${user.name},</p><p>You have been added to project <strong>${title}</strong>.</p>`
      });
    }
  }

  res.status(201).json({ message: 'Project created successfully', projectId });
});

const updateProject = catchAsyncError(async (req, res, next) => {
  const { title, description, due_date, starting_date, status, user_ids } = req.body;
  const projectId = req.params.id;

  if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
    return next(new ErrorHandler('Forbidden: admin or superadmin only', 403));
  }

  const fields = [];
  const values = [];

  if (title !== undefined) fields.push('title = ?'), values.push(title);
  if (description !== undefined) fields.push('description = ?'), values.push(description);
  if (due_date !== undefined) fields.push('due_date = ?'), values.push(due_date);
  if (starting_date !== undefined) fields.push('starting_date = ?'), values.push(starting_date);
  if (status !== undefined) fields.push('status = ?'), values.push(status);

  if (fields.length > 0) {
    const updateQuery = `UPDATE projects SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`;
    values.push(projectId);
    await db.execute(updateQuery, values);
  }

  if (Array.isArray(user_ids)) {
    const [superadmins] = await db.execute('SELECT id FROM users WHERE role = ?', ['superadmin']);
    const superadminIds = superadmins.map(user => user.id);
    const uniqueUserIds = Array.from(new Set([...user_ids, req.user.id, ...superadminIds]));

    await db.execute('DELETE FROM project_users WHERE project_id = ?', [projectId]);
    const insertValues = uniqueUserIds.map(userId => [projectId, userId]);
    await db.query('INSERT INTO project_users (project_id, user_id) VALUES ?', [insertValues]);
  }

  res.json({ message: 'Project updated successfully' });
});

const getProjectsByUser = catchAsyncError(async (req, res) => {
  const user_id = req.user.id;
  const role = req.user.role;
  let projects;
  console.log('project');

  if (role === 'superadmin') {
    [projects] = await db.execute(`
     SELECT 
      p.id, p.title, p.description, p.due_date, p.starting_date, p.status, p.created_by,
      JSON_ARRAYAGG(JSON_OBJECT('id', u.id, 'email', u.email, 'name', u.name, 'role', u.role, 'profile_picture', u.profile_picture)) AS members
    FROM projects p
    JOIN project_users pu ON p.id = pu.project_id
    JOIN users u ON pu.user_id = u.id
    GROUP BY p.id
    `);
  } else {
    [projects] = await db.execute(`
      SELECT 
        p.id, p.title, p.description, p.due_date, p.starting_date, p.status, p.created_by,
        JSON_ARRAYAGG(JSON_OBJECT('id', u.id, 'email', u.email, 'name', u.name, 'role', u.role, 'profile_picture', u.profile_picture)) AS members
      FROM projects p
      JOIN project_users pu ON p.id = pu.project_id
      JOIN project_users pu_self ON p.id = pu_self.project_id AND pu_self.user_id = ?
      JOIN users u ON pu.user_id = u.id
      GROUP BY p.id
    `, [user_id]);
  }

  const formattedProjects = projects.map(project => ({
    ...project,
    members: typeof project.members === 'string' ? JSON.parse(project.members) : project.members || []
  }));

  console.log('formattedProjects',formattedProjects);
  
  res.status(200).json({ projects: formattedProjects });
});

const deleteProject = catchAsyncError(async (req, res, next) => {
  const projectId = req.params.id;

  if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
    return next(new ErrorHandler('Forbidden: admin or superadmin only', 403));
  }

  await db.execute('DELETE FROM project_users WHERE project_id = ?', [projectId]);
  await db.execute('DELETE FROM projects WHERE id = ?', [projectId]);

  res.json({ message: 'Project deleted successfully' });
});

const getProjectDetails = catchAsyncError(async (req, res, next) => {
  const projectId = req.params.id;
  const userId = req.user.id;
  const role = req.user.role;

  let [projectRows] = [];

  if (role === 'superadmin') {
    [projectRows] = await db.execute(`
      SELECT 
        p.id, p.title, p.description, p.due_date, p.starting_date, p.status, p.created_by,
        JSON_ARRAYAGG(JSON_OBJECT('id', u.id, 'email', u.email, 'name', u.name, 'role', u.role, 'profile_picture', u.profile_picture)) AS members
      FROM projects p
      JOIN project_users pu ON p.id = pu.project_id
      JOIN users u ON pu.user_id = u.id
      WHERE p.id = ?
      GROUP BY p.id
    `, [projectId]);
  } else {
    [projectRows] = await db.execute(`
      SELECT 
        p.id, p.title, p.description, p.due_date, p.starting_date, p.status, p.created_by,
        JSON_ARRAYAGG(JSON_OBJECT('id', u.id, 'email', u.email, 'name', u.name, 'role', u.role, 'profile_picture', u.profile_picture)) AS members
      FROM projects p
      JOIN project_users pu_self ON p.id = pu_self.project_id AND pu_self.user_id = ?
      JOIN project_users pu ON p.id = pu.project_id
      JOIN users u ON pu.user_id = u.id
      WHERE p.id = ?
      GROUP BY p.id
    `, [userId, projectId]);
  }

  if (!projectRows.length) {
    return next(new ErrorHandler('Project not found', 404));
  }

  const project = projectRows[0];
  project.members = typeof project.members === 'string'
    ? JSON.parse(project.members)
    : project.members || [];

  res.status(200).json({ project });
});


module.exports = {
  createProject,
  getProjectsByUser,
  updateProject,
  deleteProject,
  getProjectDetails
};
