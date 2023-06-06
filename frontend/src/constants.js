export const API_DOMAIN = 'https://gifted-worm-mittens.cyclic.app';
const BASE_USER_API = API_DOMAIN + '/api/user';
const BASE_IMAGE_API = API_DOMAIN + '/api/image';

export const USER_URL = {
  register: BASE_USER_API + '/register',
  login: BASE_USER_API + '/login',
  getallusers: BASE_USER_API + '/getallusers/',
  getallmoderators: BASE_USER_API + '/getallmoderators/',
  deleteuser: BASE_USER_API + '/deleteuser/',
  blockuser: BASE_USER_API + '/blockuser/',
  unblockuser: BASE_USER_API + '/unblockuser/',
  getrole: BASE_USER_API + '/getrole',
};

export const IMAGE_URL = {
  uploadimage: BASE_IMAGE_API + '/uploadimage',
  getallimages: BASE_IMAGE_API + '/getallimages',
  getimage: BASE_IMAGE_API + '/getimage/',
  getimages: BASE_IMAGE_API + '/getimages/',
  deleteimage: BASE_IMAGE_API + '/deleteimage',
  likeimage: BASE_IMAGE_API + '/likeimage',
  commentonimage: BASE_IMAGE_API + '/commentonimage',
  deletecomment: BASE_IMAGE_API + '/deletecomment',
  getuploader: BASE_IMAGE_API + '/getuploader',
};
