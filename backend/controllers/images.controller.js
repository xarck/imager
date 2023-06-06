const {
  RESPONSES,
  RESPONSE_STATUS,
  RESPONSE_MESSAGES,
  ROLES,
} = require('../constants/constants');
const Image = require('../models/image.model');
const User = require('../models/user.model');

exports.uploadImage = async (req, res) => {
  try {
    const { userid, title } = req.body;
    if (!userid) {
      return res.status(RESPONSE_STATUS.ERROR).json({
        response: RESPONSES.ERROR,
        message: RESPONSE_MESSAGES.MISSING_FIELDS,
      });
    }
    const { file } = req;
    if (!file) {
      return res.status(RESPONSE_STATUS.ERROR).json({
        response: RESPONSES.ERROR,
        message: RESPONSE_MESSAGES.IMAGE_MISSING,
      });
    }
    const imgUrl = file.path;
    const imgData = {
      title: title,
      url: imgUrl,
    };

    const userExistInImage = await Image.findOne({ uploader: userid });
    if (!userExistInImage) {
      await new Image({ uploader: userid }).save();
    }

    const saved = await Image.updateOne(
      { uploader: userid },
      { $push: { image: imgData } }
    );

    if (saved.modifiedCount !== 0) {
      return res.status(RESPONSE_STATUS.SUCCESS).json({
        response: RESPONSES.SUCCESS,
        message: RESPONSE_MESSAGES.SUCCESS,
      });
    } else {
      return res.status(RESPONSE_STATUS.ERROR).json({
        response: RESPONSES.ERROR,
        message: RESPONSE_MESSAGES.NO_IMAGE_UPLOADED,
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

exports.getAllImages = async (req, res) => {
  try {
    const images = await Image.find({});
    const imageArray = [];

    for (const img of images) {
      for (const i of img.image) imageArray.push(i);
    }

    if (imageArray.length) {
      return res.status(RESPONSE_STATUS.SUCCESS).json({
        response: RESPONSES.SUCCESS,
        message: RESPONSE_MESSAGES.SUCCESS,
        data: imageArray,
      });
    } else {
      return res.status(RESPONSE_STATUS.ERROR).json({
        response: RESPONSES.ERROR,
        message: RESPONSE_MESSAGES.NO_IMAGE_FOUND,
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

exports.getImageById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(RESPONSE_STATUS.ERROR).json({
        response: RESPONSES.ERROR,
        message: RESPONSE_MESSAGES.MISSING_FIELDS,
      });
    }
    const foundImg = await Image.findOne({ 'image._id': id });
    if (foundImg) {
      return res.status(RESPONSE_STATUS.SUCCESS).json({
        response: RESPONSES.SUCCESS,
        message: RESPONSE_MESSAGES.SUCCESS,
        data: foundImg,
      });
    } else {
      return res.status(RESPONSE_STATUS.ERROR).json({
        response: RESPONSES.ERROR,
        message: RESPONSE_MESSAGES.NO_IMAGE_FOUND,
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

exports.getImageByUserId = async (req, res) => {
  try {
    const { userid } = req.params;
    const images = await Image.findOne({ uploader: userid });
    if (!images) {
      return res.status(RESPONSE_STATUS.ERROR).json({
        response: RESPONSES.ERROR,
        message: RESPONSE_MESSAGES.NO_IMAGE_FOUND,
      });
    }
    return res.status(RESPONSE_STATUS.SUCCESS).json({
      response: RESPONSES.SUCCESS,
      message: RESPONSE_MESSAGES.SUCCESS,
      data: images,
    });
  } catch (err) {
    console.log(err);
    return res.status(RESPONSE_STATUS.ERROR).json({
      response: RESPONSES.ERROR,
      message: err,
    });
  }
};

// and admin and moderator
exports.deleteImage = async (req, res) => {
  try {
    const { uploader, id } = req.body;
    if (!id || !uploader) {
      return res.status(RESPONSE_STATUS.ERROR).json({
        response: RESPONSES.ERROR,
        message: RESPONSE_MESSAGES.MISSING_FIELDS,
      });
    }
    const foundImg = await Image.findOne({ 'image._id': id });
    const role = await User.findOne({ userid: uploader });

    if (
      foundImg.uploader === uploader ||
      role.role === ROLES.ADMIN ||
      role.role === ROLES.MODERATOR
    ) {
      await Image.updateOne(
        { 'image._id': id },
        {
          $pull: {
            image: { _id: id },
          },
        }
      );
      return res.status(RESPONSE_STATUS.SUCCESS).json({
        response: RESPONSES.SUCCESS,
        message: RESPONSE_MESSAGES.SUCCESS,
      });
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
      message: err,
    });
  }
};

exports.likeImage = async (req, res) => {
  try {
    const { id, user } = req.body;
    if (!id || !user) {
      return res.status(RESPONSE_STATUS.ERROR).json({
        response: RESPONSES.ERROR,
        message: RESPONSE_MESSAGES.MISSING_FIELDS,
      });
    }
    const foundImg = await Image.findOne({ 'image._id': id });

    let likes = null;
    let currentElement = null;
    for (let i = 0; i < foundImg.image.length; i++) {
      if (foundImg.image[i]._id.toString() === id) {
        likes = foundImg.image[i].likes;
        currentElement = foundImg.image[i];
        break;
      }
    }
    currentElement.likes += 1;

    if (currentElement.likedBy.indexOf(user) !== -1) {
      return res.status(RESPONSE_STATUS.ERROR).json({
        response: RESPONSES.ERROR,
        message: RESPONSE_MESSAGES.IMAGE_ALREADY_LIKED,
      });
    }
    currentElement.likedBy.push(user);

    if (likes !== null) {
      await Image.updateOne(
        { 'image._id': id },
        {
          $pull: {
            image: { _id: id },
          },
        }
      );
      await Image.updateOne(
        { uploader: foundImg.uploader },
        {
          $push: {
            image: currentElement,
          },
        }
      );

      return res.status(RESPONSE_STATUS.SUCCESS).json({
        response: RESPONSES.SUCCESS,
        message: RESPONSE_MESSAGES.SUCCESS,
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

exports.commentOnImage = async (req, res) => {
  try {
    const { id, comment } = req.body;
    if (!id || !comment) {
      return res.status(RESPONSE_STATUS.ERROR).json({
        response: RESPONSES.ERROR,
        message: RESPONSE_MESSAGES.MISSING_FIELDS,
      });
    }
    const foundImg = await Image.findOne({ 'image._id': id });

    let currentElement = null;
    for (let i = 0; i < foundImg.image.length; i++) {
      if (foundImg.image[i]._id.toString() === id) {
        currentElement = foundImg.image[i];
        break;
      }
    }
    currentElement.comment.push(comment);

    if (currentElement !== null) {
      await Image.updateOne(
        { 'image._id': id },
        {
          $pull: {
            image: { _id: id },
          },
        }
      );
      await Image.updateOne(
        { uploader: foundImg.uploader },
        {
          $push: {
            image: currentElement,
          },
        }
      );
      return res.status(RESPONSE_STATUS.SUCCESS).json({
        response: RESPONSES.SUCCESS,
        message: RESPONSE_MESSAGES.SUCCESS,
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

exports.getUploader = async (req, res) => {
  try {
    const { imgId } = req.body;
    const Uploader = await Image.findOne({ 'image._id': imgId });
    if (Uploader) {
      return res.status(RESPONSE_STATUS.SUCCESS).json({
        response: RESPONSES.SUCCESS,
        message: RESPONSE_MESSAGES.SUCCESS,
        data: {
          uploader: Uploader.uploader,
        },
      });
    } else {
      return res.status(RESPONSE_STATUS.ERROR).json({
        response: RESPONSES.ERROR,
        message: RESPONSE_MESSAGES.NO_IMAGE_FOUND,
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

exports.deleteComment = async (req, res) => {
  try {
    const { id, comment, username } = req.body;
    if (!id || !comment || !username) {
      return res.status(RESPONSE_STATUS.ERROR).json({
        response: RESPONSES.ERROR,
        message: RESPONSE_MESSAGES.MISSING_FIELDS,
      });
    }
    const role = await User.findOne({ userid: username });

    if (role.role !== ROLES.ADMIN && role.role !== ROLES.MODERATOR) {
      return res.status(RESPONSE_STATUS.ERROR).json({
        response: RESPONSES.ERROR,
        message: RESPONSE_MESSAGES.ERROR,
      });
    }

    const foundImg = await Image.findOne({ 'image._id': id });

    let currentElement = null;
    for (let i = 0; i < foundImg.image.length; i++) {
      if (foundImg.image[i]._id.toString() === id) {
        currentElement = foundImg.image[i];
        break;
      }
    }
    const index = currentElement.comment.indexOf(comment);
    index > -1 ? currentElement.comment.splice(index, 1) : null;

    if (currentElement !== null) {
      await Image.updateOne(
        { 'image._id': id },
        {
          $pull: {
            image: { _id: id },
          },
        }
      );
      await Image.updateOne(
        { uploader: foundImg.uploader },
        {
          $push: {
            image: currentElement,
          },
        }
      );
      return res.status(RESPONSE_STATUS.SUCCESS).json({
        response: RESPONSES.SUCCESS,
        message: RESPONSE_MESSAGES.SUCCESS,
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
