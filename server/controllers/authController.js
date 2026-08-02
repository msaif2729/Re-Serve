const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Donor = require('../models/Donor');
const Ngo = require('../models/Ngo');
const { JWT_SECRET } = require('../middleware/auth');

// Resolve Google Maps URL (shortened maps.app.goo.gl or full URLs) to Lat/Lng
const resolveMapUrl = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ success: false, message: 'URL is required' });
    }

    const cleanUrl = String(url).trim();

    // 1. First attempt direct regex match for coordinates in original URL
    const directMatch = cleanUrl.match(/(?:q=|@|ll=)?(-?\d+\.\d+),\s*(-?\d+\.\d+)/);
    if (directMatch) {
      const lat = parseFloat(directMatch[1]);
      const lng = parseFloat(directMatch[2]);
      if (!isNaN(lat) && !isNaN(lng)) {
        return res.status(200).json({
          success: true,
          coords: [lat, lng],
          latitude: lat,
          longitude: lng,
          resolvedUrl: cleanUrl
        });
      }
    }

    // 2. Follow HTTP redirects for shortened URLs (maps.app.goo.gl or goo.gl/maps)
    try {
      const response = await fetch(cleanUrl, {
        method: 'GET',
        redirect: 'follow',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });

      const finalUrl = response.url || cleanUrl;

      // Match @lat,lng
      const atMatch = finalUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (atMatch) {
        const lat = parseFloat(atMatch[1]);
        const lng = parseFloat(atMatch[2]);
        return res.status(200).json({
          success: true,
          coords: [lat, lng],
          latitude: lat,
          longitude: lng,
          resolvedUrl: finalUrl
        });
      }

      // Match !3d<lat>!4d<lng> format (Google Maps 3D/4D URL parameters)
      const d3d4Match = finalUrl.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
      if (d3d4Match) {
        const lat = parseFloat(d3d4Match[1]);
        const lng = parseFloat(d3d4Match[2]);
        return res.status(200).json({
          success: true,
          coords: [lat, lng],
          latitude: lat,
          longitude: lng,
          resolvedUrl: finalUrl
        });
      }

      // Match q=lat,lng or ll=lat,lng
      const qMatch = finalUrl.match(/(?:q=|ll=)(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (qMatch) {
        const lat = parseFloat(qMatch[1]);
        const lng = parseFloat(qMatch[2]);
        return res.status(200).json({
          success: true,
          coords: [lat, lng],
          latitude: lat,
          longitude: lng,
          resolvedUrl: finalUrl
        });
      }

    } catch (fetchErr) {
      console.warn('URL redirect fetch error:', fetchErr.message);
    }

    return res.status(400).json({
      success: false,
      message: 'Could not extract coordinates from the provided Google Maps URL.'
    });
  } catch (error) {
    console.error('Resolve Map URL error:', error);
    res.status(500).json({ success: false, message: 'Server error resolving map URL' });
  }
};

// Register User (Donor or NGO)
const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      phone_no,
      fssai_license,
      address_map_link,
      operational_hours,
      food_preference,
      contact_person,
      reg_no,
      fcra_reg_no,
      latitude,
      longitude
    } = req.body;

    if (!email || !password || !name || !role) {
      return res.status(400).json({ message: 'Missing required registration fields' });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email address' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create User record
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      phone_no
    });
    await user.save();

    // Default coordinates if not provided (New Delhi default coordinates)
    const coords = [longitude || 77.209, latitude || 28.6139];

    let roleProfile = null;
    if (role === 'donor') {
      if (!fssai_license) {
        return res.status(400).json({ message: 'FSSAI License is required for Donor registration' });
      }
      roleProfile = new Donor({
        userId: user._id,
        name,
        email,
        phone_no: phone_no || '9876543210',
        fssai_license,
        fssai_license_auto_verify: true,
        address_map_link: address_map_link || 'https://maps.google.com/?q=28.6139,77.2090',
        operational_hours: operational_hours || '09:00 AM - 10:00 PM',
        food_preference: food_preference || 'Cooked Meals',
        location: { type: 'Point', coordinates: coords }
      });
      await roleProfile.save();
    } else if (role === 'ngo') {
      roleProfile = new Ngo({
        userId: user._id,
        name,
        contact_person: contact_person || name,
        reg_no: reg_no || 'NGO-' + Math.floor(100000 + Math.random() * 900000),
        fcra_reg_no: fcra_reg_no || 'FCRA-IN-' + Math.floor(1000 + Math.random() * 9000),
        address_map_link: address_map_link || 'https://maps.google.com/?q=28.6200,77.2100',
        operating_hours: operational_hours || '08:00 AM - 08:00 PM',
        charity_license_verification: true,
        verified: true,
        location: { type: 'Point', coordinates: coords }
      });
      await roleProfile.save();
    }

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: roleProfile
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error during registration: ' + error.message });
  }
};

// Login User
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    let profile = null;
    if (user.role === 'donor') {
      profile = await Donor.findOne({ userId: user._id });
    } else if (user.role === 'ngo') {
      profile = await Ngo.findOne({ userId: user._id });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in: ' + error.message });
  }
};

// Get current user profile
const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let profile = null;
    if (user.role === 'donor') {
      profile = await Donor.findOne({ userId: user._id });
    } else if (user.role === 'ngo') {
      profile = await Ngo.findOne({ userId: user._id });
    }

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone_no: user.phone_no,
        profile
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
};

module.exports = { register, login, me, resolveMapUrl };
