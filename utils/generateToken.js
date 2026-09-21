const jwt = require("jsonwebtoken");
const env = require("../config/env");

/**
 * Generate signed JWT token
 * Payload: { id, role }
 */
const generateToken = (id, role = "user") => {
  return jwt.sign(
    {
      id,
      role,
    },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRES_IN,
    }
  );
};

module.exports = generateToken;
