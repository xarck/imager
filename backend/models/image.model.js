const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  image: [
    {
      title: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
      likedBy: {
        type: Array,
        default: [],
      },
      likes: {
        type: Number,
        default: 0,
      },
      comment: {
        type: Array,
        default: [],
      },
    },
  ],
  uploader: {
    type: String,
    ref: 'User',
  },
});

module.exports = mongoose.model('Image', imageSchema);
