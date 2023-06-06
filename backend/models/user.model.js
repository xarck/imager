const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { ROLES } = require('../constants/constants');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: [ROLES.USER, ROLES.MODERATOR, ROLES.ADMIN],
      default: ROLES.USER,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    userid: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicUrl: {
      type: String,
      required: false,
      default: 'https://www.pngmart.com/files/21/Admin-Profile-PNG-Clipart.png',
    },
    blocked: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.statics.findAndValidate = async function (userid, password) {
  const foundUser = await this.findOne({ userid: userid });
  if (!foundUser) {
    return false;
  }
  const isValid = await bcrypt.compare(password, foundUser.password);
  return isValid ? foundUser : false;
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model('User', userSchema);
