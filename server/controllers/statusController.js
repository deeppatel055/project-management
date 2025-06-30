const db = require('../config/db');
const catchAsyncError = require('../middleware/catchAsyncError');


const getTaskStatuses = catchAsyncError(async (req, res, next) => {
  const [statuses] = await db.execute('SELECT id, name FROM task_status');
  res.status(200).json({ statuses });
});

module.exports = {
  getTaskStatuses,
};
