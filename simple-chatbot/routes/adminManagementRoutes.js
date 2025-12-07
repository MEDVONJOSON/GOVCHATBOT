const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const {
    isSuperAdmin,
    createAdmin,
    createAdminValidation,
    updateProfile,
    changePassword,
    changePasswordValidation,
    deleteUser,
    getAllAdmins,
    getActivityLog
} = require('../controllers/adminManagementController');

// All routes require admin authentication
router.use(authMiddleware, adminMiddleware);

// Super Admin only routes
router.post('/create', isSuperAdmin, createAdminValidation, createAdmin);
router.get('/list', isSuperAdmin, getAllAdmins);
router.get('/activity-log', isSuperAdmin, getActivityLog);

// Admin and Super Admin routes
router.put('/profile/:userId', updateProfile);
router.put('/password/:userId', changePasswordValidation, changePassword);
router.delete('/user/:userId', deleteUser);

module.exports = router;
