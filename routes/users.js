const router = require('express').Router();
const { getCurrentUser, updateCurrentUser } = require('../controllers/users');
const { PATCH_USER_ME } = require('../utils/validators');

router.get('/me', getCurrentUser);
router.patch('/me', PATCH_USER_ME, updateCurrentUser);

module.exports = router;
