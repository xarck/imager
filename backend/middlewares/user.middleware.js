const User = require('../models/user.model');
const {
  ROLES,
  RESPONSES,
  RESPONSE_STATUS,
  RESPONSE_MESSAGES,
} = require('../constants/constants');

exports.isAdmin = async (req, res, next) => {
  try {
    const { userid } = req.params;
    if (!userid) {
      return res.status(RESPONSE_STATUS.ERROR).json({
        response: RESPONSES.ERROR,
        message: RESPONSE_MESSAGES.MISSING_FIELDS,
      });
    }
    const user = await User.findOne({ userid });
    if (!user) {
      return res.status(RESPONSE_STATUS.ERROR).json({
        response: RESPONSES.ERROR,
        message: RESPONSE_MESSAGES.USER_NOT_FOUND,
      });
    }
    if (user.role === ROLES.ADMIN) {
      next();
    } else {
      return res.status(RESPONSE_STATUS.ERROR).json({
        response: RESPONSES.ERROR,
        message: RESPONSE_MESSAGES.NOT_ENOUGH_PRIVILEGES,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(RESPONSE_STATUS.ERROR).json({
      response: RESPONSES.ERROR,
      message: err.message,
    });
  }
};

exports.isModerator = async (req, res, next) => {
  try {
    const { userid } = req.params;
    if (!userid) {
      return res.status(RESPONSE_STATUS.ERROR).json({
        response: RESPONSES.ERROR,
        message: RESPONSE_MESSAGES.MISSING_FIELDS,
      });
    }
    const user = await User.findOne({ userid });
    if (!user) {
      return res.status(RESPONSE_STATUS.ERROR).json({
        response: RESPONSES.ERROR,
        message: RESPONSE_MESSAGES.USER_NOT_FOUND,
      });
    }
    if (user.role === ROLES.MODERATOR) {
      next();
    } else {
      return res.status(RESPONSE_STATUS.ERROR).json({
        response: RESPONSES.ERROR,
        message: RESPONSE_MESSAGES.NOT_ENOUGH_PRIVILEGES,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(RESPONSE_STATUS.ERROR).json({
      response: RESPONSES.ERROR,
      message: err.message,
    });
  }
};

exports.isAdminOrModerator = async (req, res, next) => {
  try {
    const { userid } = req.params;
    if (!userid) {
      return res.status(RESPONSE_STATUS.ERROR).json({
        response: RESPONSES.ERROR,
        message: RESPONSE_MESSAGES.MISSING_FIELDS,
      });
    }
    const user = await User.findOne({ userid });
    if (!user) {
      return res.status(RESPONSE_STATUS.ERROR).json({
        response: RESPONSES.ERROR,
        message: RESPONSE_MESSAGES.USER_NOT_FOUND,
      });
    }
    if (user.role === ROLES.MODERATOR || user.role === ROLES.ADMIN) {
      next();
    } else {
      return res.status(RESPONSE_STATUS.ERROR).json({
        response: RESPONSES.ERROR,
        message: RESPONSE_MESSAGES.NOT_ENOUGH_PRIVILEGES,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(RESPONSE_STATUS.ERROR).json({
      response: RESPONSES.ERROR,
      message: err.message,
    });
  }
};
