const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authenticateToken = require('../middlewares/authMiddleware');

/**
 * @route   GET /api/products
 * @desc    Get all products (supports ?category_uid=... and ?search=...)
 * @access  Public
 */
router.get('/', productController.getAllProducts);

/**
 * @route   GET /api/products/:uid
 * @desc    Get single product by UID
 * @access  Public
 */
router.get('/:uid', productController.getProductByUid);

/**
 * @route   POST /api/products
 * @desc    Create a new product (Select category by category_uid)
 * @access  Private (JWT Required)
 */
router.post('/', authenticateToken, productController.createProduct);

/**
 * @route   PUT /api/products/:uid
 * @desc    Update product by UID
 * @access  Private (JWT Required)
 */
router.put('/:uid', authenticateToken, productController.updateProduct);

/**
 * @route   DELETE /api/products/:uid
 * @desc    Delete product by UID
 * @access  Private (JWT Required)
 */
router.delete('/:uid', authenticateToken, productController.deleteProduct);

module.exports = router;

