const jwt = require('jsonwebtoken');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

exports.createToken = (userid) => {
  const token = jwt.sign(
    {
      userid: userid,
    },
    ACCESS_TOKEN_SECRET,
    {
      expiresIn: '7d',
    }
  );
  return token;
};

exports.verifyToken = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(400).json({
        status: 'FAIL',
        message: 'Missing Token',
      });
    }
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET);
    const userid = decodedToken.userid;
    if (req.body.userid && req.body.userid !== userid) {
      throw new Error('Invalid user id');
    } else {
      next();
    }
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(400).json({
        status: 'FAIL',
        message: 'Token Expired',
      });
    }
    return res.status(400).json({
      status: 'FAIL',
      message: 'Something Went Wrong',
    });
  }
};
