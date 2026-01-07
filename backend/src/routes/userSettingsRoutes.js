const express = require('express');
const router = express.Router();
const {
    getUserSettings,
    createUserSettings,
    updateUserSettings
} = require('../controllers/userSettingsController');

router.get('/:userId', getUserSettings);
router.post('/', createUserSettings);
router.put('/:userId', updateUserSettings);

module.exports = router;
