import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Organization from '../models/Organization.js';
import OrganizationMember from '../models/OrganizationMember.js';
import { hashPassword, comparePassword, generateAccessToken, generateRefreshToken } from '../utils/auth.utils.js';
import { redis } from '../config/redis.js';
import { env } from '../config/env.js';

const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60; // 7 days in seconds

const getCookieOptions = () => ({
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: REFRESH_TOKEN_EXPIRY * 1000 // milliseconds
});

export const register = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, organizationName } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email is already registered' });
    }

    const hashedPassword = await hashPassword(password);

    // Create User
    const user = await User.create({ email, passwordHash: hashedPassword, firstName, lastName });

    // Create Tenant/Organization
    const organization = await Organization.create({ name: organizationName });

    // Assign User as Owner of the Organization
    await OrganizationMember.create({
      userId: user._id,
      organizationId: organization._id,
      role: 'owner'
    });

    res.status(201).json({ message: 'Registration successful. Please log in.' });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const membership = await OrganizationMember.findOne({ userId: user._id });
    if (!membership) {
      return res.status(403).json({ error: 'User is not assigned to any organization' });
    }

    const tokenPayload = {
      userId: user._id,
      organizationId: membership.organizationId,
      role: membership.role
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken({ userId: user._id });

    // Store refresh token in Redis for revocation checks
    await redis.setex(`refreshToken:${user._id}`, REFRESH_TOKEN_EXPIRY, refreshToken);

    res.cookie('refreshToken', refreshToken, getCookieOptions());
    res.status(200).json({
      message: 'Login successful',
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: membership.role,
        organizationId: membership.organizationId
      }
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token not found' });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }

    // Verify token exists in Redis (hasn't been revoked/logged out)
    const storedToken = await redis.get(`refreshToken:${decoded.userId}`);
    if (storedToken !== refreshToken) {
      return res.status(401).json({ error: 'Refresh token revoked or invalid' });
    }

    const membership = await OrganizationMember.findOne({ userId: decoded.userId });
    if (!membership) {
      return res.status(403).json({ error: 'Organization context lost' });
    }

    const accessToken = generateAccessToken({
      userId: decoded.userId,
      organizationId: membership.organizationId,
      role: membership.role
    });

    res.status(200).json({ accessToken });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (refreshToken) {
      try {
        const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);
        // Remove from Redis to revoke
        await redis.del(`refreshToken:${decoded.userId}`);
      } catch (err) {
        // Ignore jwt verification errors on logout, just clear the cookie
      }
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};