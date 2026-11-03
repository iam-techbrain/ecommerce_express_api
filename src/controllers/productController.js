const { v4: uuidv4 } = require('uuid');
const supabase = require('../config/supabase');
const ApiResponse = require('../utils/apiResponse');

/**
 * CREATE Product
 * Route: POST /api/products
 * Body: { name, price, quantity (or contaty), description, category_uid }
 */
const createProduct = async (req, res, next) => {
  try {
    const { name, price, quantity, contaty, description, category_uid } = req.body;

    // Support both 'quantity' and user-specified 'contaty'
    const finalQuantity = quantity !== undefined ? quantity : contaty;

    // Validations
    if (!name || name.trim() === '') {
      return ApiResponse.badRequest(res, 'Product name is required');
    }

    if (price === undefined || price === null || isNaN(price) || Number(price) < 0) {
      return ApiResponse.badRequest(res, 'A valid non-negative price is required');
    }

    if (finalQuantity === undefined || finalQuantity === null || isNaN(finalQuantity) || Number(finalQuantity) < 0) {
      return ApiResponse.badRequest(res, 'A valid non-negative quantity is required');
    }

    // If category_uid provided, verify category exists
    if (category_uid) {
      const { data: category, error: catError } = await supabase
        .from('ecommerce_express_categories')
        .select('uid')
        .eq('uid', category_uid)
        .single();

      if (catError || !category) {
        return ApiResponse.badRequest(res, `Invalid category_uid. No category found with uid: ${category_uid}`);
      }
    }

    const uid = uuidv4();
    const newProduct = {
      uid,
      name: name.trim(),
      price: Number(price),
      quantity: Number(finalQuantity),
      description: description ? description.trim() : null,
      category_uid: category_uid || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('ecommerce_express_products')
      .insert([newProduct])
      .select('*, category:ecommerce_express_categories(uid, name, description)')
      .single();

    if (error) {
      return ApiResponse.error(res, 'Failed to create product', error.message, 500);
    }

    return ApiResponse.created(res, 'Product created successfully', data);
  } catch (err) {
    next(err);
  }
};

/**
 * READ ALL Products
 * Route: GET /api/products
 * Query: ?category_uid=... &search=...
 */
const getAllProducts = async (req, res, next) => {
  try {
    const { category_uid, search } = req.query;

    let query = supabase
      .from('ecommerce_express_products')
      .select('*, category:ecommerce_express_categories(uid, name, description)')
      .order('created_at', { ascending: false });

    if (category_uid) {
      query = query.eq('category_uid', category_uid);
    }

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      return ApiResponse.error(res, 'Failed to retrieve products', error.message, 500);
    }

    return ApiResponse.success(res, 'Products retrieved successfully', data);
  } catch (err) {
    next(err);
  }
};

/**
 * READ Product by UID
 * Route: GET /api/products/:uid
 */
const getProductByUid = async (req, res, next) => {
  try {
    const { uid } = req.params;

    const { data, error } = await supabase
      .from('ecommerce_express_products')
      .select('*, category:ecommerce_express_categories(uid, name, description)')
      .eq('uid', uid)
      .single();

    if (error || !data) {
      return ApiResponse.notFound(res, `Product not found with uid: ${uid}`);
    }

    return ApiResponse.success(res, 'Product retrieved successfully', data);
  } catch (err) {
    next(err);
  }
};

/**
 * UPDATE / EDIT Product by UID
 * Route: PUT /api/products/:uid
 */
const updateProduct = async (req, res, next) => {
  try {
    const { uid } = req.params;
    const { name, price, quantity, contaty, description, category_uid } = req.body;

    // Check if product exists
    const { data: existing, error: checkError } = await supabase
      .from('ecommerce_express_products')
      .select('*')
      .eq('uid', uid)
      .single();

    if (checkError || !existing) {
      return ApiResponse.notFound(res, `Product not found with uid: ${uid}`);
    }

    const updates = {
      updated_at: new Date().toISOString()
    };

    if (name !== undefined) {
      if (name.trim() === '') {
        return ApiResponse.badRequest(res, 'Product name cannot be empty');
      }
      updates.name = name.trim();
    }

    if (price !== undefined) {
      if (isNaN(price) || Number(price) < 0) {
        return ApiResponse.badRequest(res, 'Price must be a non-negative number');
      }
      updates.price = Number(price);
    }

    const finalQuantity = quantity !== undefined ? quantity : contaty;
    if (finalQuantity !== undefined) {
      if (isNaN(finalQuantity) || Number(finalQuantity) < 0) {
        return ApiResponse.badRequest(res, 'Quantity must be a non-negative number');
      }
      updates.quantity = Number(finalQuantity);
    }

    if (description !== undefined) {
      updates.description = description;
    }

    if (category_uid !== undefined) {
      if (category_uid !== null && category_uid !== '') {
        // Validate category exists
        const { data: category, error: catError } = await supabase
          .from('ecommerce_express_categories')
          .select('uid')
          .eq('uid', category_uid)
          .single();

        if (catError || !category) {
          return ApiResponse.badRequest(res, `Invalid category_uid. No category found with uid: ${category_uid}`);
        }
        updates.category_uid = category_uid;
      } else {
        updates.category_uid = null;
      }
    }

    const { data, error } = await supabase
      .from('ecommerce_express_products')
      .update(updates)
      .eq('uid', uid)
      .select('*, category:ecommerce_express_categories(uid, name, description)')
      .single();

    if (error) {
      return ApiResponse.error(res, 'Failed to update product', error.message, 500);
    }

    return ApiResponse.success(res, 'Product updated successfully', data);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE Product by UID
 * Route: DELETE /api/products/:uid
 */
const deleteProduct = async (req, res, next) => {
  try {
    const { uid } = req.params;

    // Check if product exists
    const { data: existing, error: checkError } = await supabase
      .from('ecommerce_express_products')
      .select('*')
      .eq('uid', uid)
      .single();

    if (checkError || !existing) {
      return ApiResponse.notFound(res, `Product not found with uid: ${uid}`);
    }

    const { error } = await supabase
      .from('ecommerce_express_products')
      .delete()
      .eq('uid', uid);

    if (error) {
      return ApiResponse.error(res, 'Failed to delete product', error.message, 500);
    }

    return ApiResponse.success(res, 'Product deleted successfully', { uid });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductByUid,
  updateProduct,
  deleteProduct
};

