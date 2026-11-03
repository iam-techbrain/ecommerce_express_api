const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authenticateToken = require('../middlewares/authMiddleware');

/**
 * @route   GET /api/categories
 * @desc    Get all categories
 * @access  Public
 */
router.get('/', categoryController.getAllCategories);

/**
 * @route   GET /api/categories/:uid
 * @desc    Get single category by UID
 * @access  Public
 */
router.get('/:uid', categoryController.getCategoryByUid);

/**
 * @route   POST /api/categories
 * @desc    Create a new category
 * @access  Private (JWT Required)
 */
router.post('/', authenticateToken, categoryController.createCategory);

/**
 * @route   PUT /api/categories/:uid
 * @desc    Update an existing category
 * @access  Private (JWT Required)
 */
router.put('/:uid', authenticateToken, categoryController.updateCategory);

/**
 * @route   DELETE /api/categories/:uid
 * @desc    Delete category by UID
 * @access  Private (JWT Required)
 */
router.delete('/:uid', authenticateToken, categoryController.deleteCategory);

module.exports = router;

