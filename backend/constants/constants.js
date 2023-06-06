const ROLES = {
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  USER: 'user',
};
const RESPONSES = {
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
};

const RESPONSE_STATUS = {
  SUCCESS: 200,
  ERROR: 400,
};

const RESPONSE_MESSAGES = {
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
  MISSING_FIELDS: 'Please fill all the fields',
  INVALID_PASSWORD:
    'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  NOT_ENOUGH_PRIVILEGES:
    'You do not have enough privileges to perform this action',
  INVALID_TOKEN: 'Invalid token',
  MISSING_TOKEN: 'Token missing',
  USER_ALREADY_EXISTS: 'User already exists',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  TOKEN_EXPIRED: 'Token expired',
  IMAGE_MISSING: 'Image missing',
  USER_NOT_FOUND: 'User not found',
  INVALID_CREDENTIALS: 'Id or password did not match',
  NO_IMAGE_UPLOADED: 'No image uploaded',
  NO_IMAGE_FOUND: 'No image found',
  IMAGE_ALREADY_LIKED: 'Image is already liked by this user',
  USER_BLOCKED: 'You are blocked from using this service',
};

module.exports = {
  ROLES,
  RESPONSES,
  RESPONSE_STATUS,
  RESPONSE_MESSAGES,
};
