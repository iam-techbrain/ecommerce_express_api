const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const supabase = require('../config/supabase');
const ApiResponse = require('../utils/apiResponse');

const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return ApiResponse.badRequest(res, 'Email and password are required');
    }

    if (password.length < 6) {
      return ApiResponse.badRequest(res, 'Password must be at least 6 characters long');
    }

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('ecommerce_express_users')
      .select('uid, email')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (existingUser) {
      return ApiResponse.badRequest(res, 'User with this email already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const uid = uuidv4();
    const newUser = {
      uid,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      name: name || null,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('ecommerce_express_users')
      .insert([newUser])
      .select('uid, email, name, created_at')
      .single();

    if (error) {
      return ApiResponse.error(res, 'Failed to register user', error.message, 500);
    }

    // Generate JWT
    const secret = process.env.JWT_SECRET || 'super_secret_jwt_key_crud_2026_xyz';
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
    const token = jwt.sign(
      { uid: data.uid, email: data.email, name: data.name },
      secret,
      { expiresIn }
    );

    return ApiResponse.created(res, 'User registered successfully', {
      token,
      user: data
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return ApiResponse.badRequest(res, 'Email and password are required');
    }

    // Find user by email
    const { data: user, error } = await supabase
      .from('ecommerce_express_users')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (error || !user) {
      return ApiResponse.badRequest(res, 'Invalid email or password');
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return ApiResponse.badRequest(res, 'Invalid email or password');
    }

    // Generate JWT
    const secret = process.env.JWT_SECRET || 'super_secret_jwt_key_crud_2026_xyz';
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
    const token = jwt.sign(
      { uid: user.uid, email: user.email, name: user.name },
      secret,
      { expiresIn }
    );

    const userData = {
      uid: user.uid,
      email: user.email,
      name: user.name,
      created_at: user.created_at
    };

    return ApiResponse.success(res, 'Login successful', {
      token,
      user: userData
    });
  } catch (err) {
    next(err);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const { uid } = req.user;

    const { data: user, error } = await supabase
      .from('ecommerce_express_users')
      .select('uid, email, name, created_at')
      .eq('uid', uid)
      .single();

    if (error || !user) {
      return ApiResponse.notFound(res, 'User not found');
    }

    return ApiResponse.success(res, 'User profile retrieved successfully', user);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  getProfile
};

