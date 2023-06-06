const User = require('../models/user.model');
const { createToken, verifyToken } = require('../middlewares/jwt.middleware');
const { isStrongPassword } = require('validator');
const {
  RESPONSES,
  RESPONSE_STATUS,
  RESPONSE_MESSAGES,
  ROLES,
} = require('../constants/constants');

// anyone
exports.register = async (req, res) => {
  try {
    let { name, email, userid, password } = req.body;
    if (!name || !email || !userid || !password) {
      return res.status(RESPONSE_STATUS.ERROR).json({
        response: RESPONSES.ERROR,
        message: RESPONSE_MESSAGES.MISSING_FIELDS,
      });
    }
    email = email.toLowerCase();
    userid = userid.toLowerCase();
    if (!isStrongPassword(password)) {
      return res.status(RESPONSE_STATUS.ERROR).json({
        response: RESPONSES.ERROR,
        message: RESPONSE_MESSAGES.INVALID_PASSWORD,
      });
    }
    const userExists = await User.findOne({
      $or: [{ userid }, { email }],
    });
    if (userExists) {
      return res.status(RESPONSE_STATUS.ERROR).json({
        response: RESPONSES.ERROR,
        message: RESPONSE_MESSAGES.USER_ALREADY_EXISTS,
      });
    }

    let profilePicUrl = undefined;
    const { file } = req;
    if (file) {
      profilePicUrl = file.path;
    }
    const user = new User({
      name,
      email,
      userid,
      password,
      role: ROLES.USER,
      profilePicUrl,
    });

    await user.save();

    return res.status(RESPONSE_STATUS.SUCCESS).json({
      response: RESPONSES.SUCCESS,
      message: RESPONSE_MESSAGES.SUCCESS,
      data: user,
    });
  } catch (err) {
    console.log(err);
    return res.status(RESPONSE_STATUS.ERROR).json({
      response: RESPONSES.ERROR,
      message: err.message,
    });
  }
};

// anyone
exports.login = async (req, res) => {
  try {
    const { userid, password } = req.body;
    const user = await User.findAndValidate(userid, password);
    if (!user) {
      return res.status(RESPONSE_STATUS.ERROR).json({
        response: RESPONSES.ERROR,
        message: RESPONSE_MESSAGES.INVALID_CREDENTIALS,
      });
    }
    if (user.blocked) {
      return res.status(RESPONSE_STATUS.ERROR).json({
        response: RESPONSES.ERROR,
        message: RESPONSE_MESSAGES.USER_BLOCKED,
      });
    }
    const token = createToken(userid);
    return res.status(RESPONSE_STATUS.SUCCESS).json({
      response: RESPONSES.SUCCESS,
      message: RESPONSE_MESSAGES.SUCCESS,
      data: {
        userid: userid,
        token: token,
        role: user.role,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(RESPONSE_STATUS.ERROR).json({
      response: RESPONSES.ERROR,
      message: err.message,
    });
  }
};

// only admin and moderators
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: ROLES.USER });
    return res.status(RESPONSE_STATUS.SUCCESS).json({
      response: RESPONSES.SUCCESS,
      message: RESPONSE_MESSAGES.SUCCESS,
      data: {
        users,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(RESPONSE_STATUS.ERROR).json({
      response: RESPONSES.ERROR,
      message: err.message,
    });
  }
};

// only admin
exports.getAllModerators = async (req, res) => {
  try {
    const users = await User.find({ role: ROLES.MODERATOR });
    return res.status(RESPONSE_STATUS.SUCCESS).json({
      response: RESPONSES.SUCCESS,
      message: RESPONSE_MESSAGES.SUCCESS,
      data: {
        users,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(RESPONSE_STATUS.ERROR).json({
      response: RESPONSES.ERROR,
      message: err.message,
    });
  }
};

// only admin
exports.deleteUser = async (req, res) => {
  try {
    const { deleteUserId } = req.body;
    if (!deleteUserId) {
      return res.status(RESPONSE_STATUS.ERROR).json({
        response: RESPONSES.ERROR,
        message: RESPONSE_MESSAGES.MISSING_FIELDS,
      });
    }
    const user = await User.findOne({ userid: deleteUserId });
    if (!user) {
      return res.status(RESPONSE_STATUS.ERROR).json({
        response: RESPONSES.ERROR,
        message: RESPONSE_MESSAGES.USER_NOT_FOUND,
      });
    }
    const deleted = await User.deleteOne({ userid: deleteUserId });
    if (deleted) {
      return res.status(RESPONSE_STATUS.SUCCESS).json({
        response: RESPONSES.SUCCESS,
        message: RESPONSE_MESSAGES.SUCCESS,
      });
    } else {
      return res.status(RESPONSE_STATUS.ERROR).json({
        response: RESPONSES.ERROR,
        message: RESPONSE_MESSAGES.ERROR,
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

// only moderator
exports.blockUser = async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ userid: username });
    if (user) {
      const blocked = await User.updateOne(
        { userid: username },
        { blocked: true }
      );
      if (blocked.acknowledged) {
        return res.status(RESPONSE_STATUS.SUCCESS).json({
          response: RESPONSES.SUCCESS,
          message: RESPONSE_MESSAGES.SUCCESS,
        });
      } else {
        return res.status(RESPONSE_STATUS.ERROR).json({
          response: RESPONSES.ERROR,
          message: RESPONSE_MESSAGES.ERROR,
        });
      }
    } else {
      return res.status(RESPONSE_STATUS.ERROR).json({
        response: RESPONSES.ERROR,
        message: RESPONSE_MESSAGES.USER_NOT_FOUND,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(RESPONSE_STATUS.ERROR).json({
      response: RESPONSES.ERROR,
      message: RESPONSE_MESSAGES.USER_NOT_FOUND,
    });
  }
};

// only moderator
exports.unblockUser = async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ userid: username });
    if (user) {
      const blocked = await User.updateOne(
        { userid: username },
        { blocked: false }
      );
      if (blocked.acknowledged) {
        return res.status(RESPONSE_STATUS.SUCCESS).json({
          response: RESPONSES.SUCCESS,
          message: RESPONSE_MESSAGES.SUCCESS,
        });
      } else {
        return res.status(RESPONSE_STATUS.ERROR).json({
          response: RESPONSES.ERROR,
          message: RESPONSE_MESSAGES.ERROR,
        });
      }
    } else {
      return res.status(RESPONSE_STATUS.ERROR).json({
        response: RESPONSES.ERROR,
        message: RESPONSE_MESSAGES.USER_NOT_FOUND,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(RESPONSE_STATUS.ERROR).json({
      response: RESPONSES.ERROR,
      message: RESPONSE_MESSAGES.USER_NOT_FOUND,
    });
  }
};

exports.getRole = async (req, res) => {
  const { username } = req.body;
  try {
    const user = await User.findOne({ userid: username });
    if (user) {
      return res.status(RESPONSE_STATUS.SUCCESS).json({
        response: RESPONSES.SUCCESS,
        message: RESPONSE_MESSAGES.SUCCESS,
        data: {
          role: user.role,
        },
      });
    } else {
      return res.status(RESPONSE_STATUS.ERROR).json({
        response: RESPONSES.ERROR,
        message: RESPONSE_MESSAGES.USER_NOT_FOUND,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(RESPONSE_STATUS.ERROR).json({
      response: RESPONSES.ERROR,
      message: err,
    });
  }
};
