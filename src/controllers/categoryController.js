const { v4: uuidv4 } = require('uuid');
const supabase = require('../config/supabase');
const ApiResponse = require('../utils/apiResponse');

// Create new category
const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name || name.trim() === '') {
      return ApiResponse.badRequest(res, 'Category name is required');
    }

    // Check if category already exists
    const { data: existing } = await supabase
      .from('ecommerce_express_categories')
      .select('uid')
      .ilike('name', name.trim())
      .single();

    if (existing) {
      return ApiResponse.badRequest(res, 'Category with this name already exists');
    }

    const uid = uuidv4();
    const newCategory = {
      uid,
      name: name.trim(),
      description: description ? description.trim() : null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('ecommerce_express_categories')
      .insert([newCategory])
      .select()
      .single();

    if (error) {
      return ApiResponse.error(res, 'Failed to create category', error.message, 500);
    }

    return ApiResponse.created(res, 'Category created successfully', data);
  } catch (err) {
    next(err);
  }
};

// Get all categories (to select from when adding/updating products)
const getAllCategories = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('ecommerce_express_categories')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return ApiResponse.error(res, 'Failed to retrieve categories', error.message, 500);
    }

    return ApiResponse.success(res, 'Categories retrieved successfully', data);
  } catch (err) {
    next(err);
  }
};

// Get single category by uid
const getCategoryByUid = async (req, res, next) => {
  try {
    const { uid } = req.params;

    const { data, error } = await supabase
      .from('ecommerce_express_categories')
      .select('*')
      .eq('uid', uid)
      .single();

    if (error || !data) {
      return ApiResponse.notFound(res, `Category not found with uid: ${uid}`);
    }

    return ApiResponse.success(res, 'Category retrieved successfully', data);
  } catch (err) {
    next(err);
  }
};

// Update category by uid
const updateCategory = async (req, res, next) => {
  try {
    const { uid } = req.params;
    const { name, description } = req.body;

    // Check if category exists
    const { data: existing, error: checkError } = await supabase
      .from('ecommerce_express_categories')
      .select('*')
      .eq('uid', uid)
      .single();

    if (checkError || !existing) {
      return ApiResponse.notFound(res, `Category not found with uid: ${uid}`);
    }

    const updates = {
      updated_at: new Date().toISOString()
    };

    if (name !== undefined) {
      if (name.trim() === '') {
        return ApiResponse.badRequest(res, 'Category name cannot be empty');
      }
      updates.name = name.trim();
    }

    if (description !== undefined) {
      updates.description = description;
    }

    const { data, error } = await supabase
      .from('ecommerce_express_categories')
      .update(updates)
      .eq('uid', uid)
      .select()
      .single();

    if (error) {
      return ApiResponse.error(res, 'Failed to update category', error.message, 500);
    }

    return ApiResponse.success(res, 'Category updated successfully', data);
  } catch (err) {
    next(err);
  }
};

// Delete category by uid
const deleteCategory = async (req, res, next) => {
  try {
    const { uid } = req.params;

    // Check if category exists
    const { data: existing, error: checkError } = await supabase
      .from('ecommerce_express_categories')
      .select('*')
      .eq('uid', uid)
      .single();

    if (checkError || !existing) {
      return ApiResponse.notFound(res, `Category not found with uid: ${uid}`);
    }

    const { error } = await supabase
      .from('ecommerce_express_categories')
      .delete()
      .eq('uid', uid);

    if (error) {
      return ApiResponse.error(res, 'Failed to delete category', error.message, 500);
    }

    return ApiResponse.success(res, 'Category deleted successfully', { uid });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryByUid,
  updateCategory,
  deleteCategory
};

