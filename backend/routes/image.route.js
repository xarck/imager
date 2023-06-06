const express = require('express');
const router = express.Router();
const ImagesController = require('../controllers/images.controller');

const { verifyToken } = require('../middlewares/jwt.middleware');

const upload = require('../utils/imageupload.util');

router
  .post(
    '/uploadimage',
    verifyToken,
    upload.single('image'),
    ImagesController.uploadImage
  )
  .get('/getallimages', ImagesController.getAllImages)
  .get('/getimage/:id', ImagesController.getImageById)
  .get('/getimages/:userid', ImagesController.getImageByUserId)
  .post('/deleteimage', verifyToken, ImagesController.deleteImage)
  .post('/likeimage', verifyToken, ImagesController.likeImage)
  .post('/commentonimage', verifyToken, ImagesController.commentOnImage)
  .post('/deletecomment', verifyToken, ImagesController.deleteComment)
  .post('/getuploader', ImagesController.getUploader);

module.exports = router;
