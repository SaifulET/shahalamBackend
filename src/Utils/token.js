import jwt from "jsonwebtoken";

/**
 * Create a short-lived Access Token (stored in memory)
 * @param {Object} user - Mongoose user document
 * @returns {string} JWT access token
 */
export const createAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" } // short-lived token
  );
};

/**
 * Create a long-lived Refresh Token (httpOnly cookie)
 * @param {Object} user - Mongoose user document
 * @returns {string} JWT refresh token
 */
export const createRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" } // long-lived token
  );
};
