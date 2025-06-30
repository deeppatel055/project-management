const express = require('express');
const router = express.Router();
const { getTaskStatuses } = require('../controllers/statusController');

router.get('/statuses', getTaskStatuses);

module.exports = router;
