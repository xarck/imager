const UserController = require('../controllers/user.controller');
const {
  isAdmin,
  isModerator,
  isAdminOrModerator,
} = require('../middlewares/user.middleware');
const express = require('express');
const router = express.Router();

const { verifyToken } = require('../middlewares/jwt.middleware');

const upload = require('../utils/imageupload.util');

router
  .post('/register', upload.single('image'), UserController.register)
  .post('/login', UserController.login)
  .post(
    '/getallusers/:userid',
    verifyToken,
    isAdminOrModerator,
    UserController.getAllUsers
  )
  .post(
    '/getallmoderators/:userid',
    verifyToken,
    isAdmin,
    UserController.getAllModerators
  )
  .delete(
    '/deleteuser/:userid',
    verifyToken,
    isAdmin,
    UserController.deleteUser
  )
  .post(
    '/blockuser/:userid',
    verifyToken,
    isAdminOrModerator,
    UserController.blockUser
  )
  .post(
    '/unblockuser/:userid',
    verifyToken,
    isAdminOrModerator,
    UserController.unblockUser
  )
  .post('/getrole', verifyToken, UserController.getRole);

module.exports = router;
