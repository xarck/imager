import axios from 'axios';
import { IMAGE_URL, USER_URL } from '../constants';
import { showToast } from '../utils/showToast';

export const handleLoginSubmit = async (
  e,
  username,
  password,
  setIsLoggedIn,
  navigate
) => {
  e.preventDefault();
  if (!username || !password) {
    showToast('Please Fill all the fields', 'info');
    return;
  }
  if (username.match(/^[a-zA-Z]+$/)) {
    try {
      let response = axios.post(USER_URL.login, {
        userid: username,
        password: password,
      });
      showToast('Please Wait!!', 'info');
      response = await response;
      if (response.status === 200) {
        const token = response.data.data.token;
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        showToast('User Logged in Successfully!!, Redirecting', 'success');
        setIsLoggedIn(true);
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (err) {
      console.log(err);
      showToast('Cannot Login', 'fail');
      showToast(err.response.data.message, 'fail');
    }
  } else {
    showToast('Please Check the inputs', 'fail');
  }
};

export const handleRegisterSubmit = async (
  e,
  name,
  username,
  email,
  password,
  image,
  navigate
) => {
  e.preventDefault();
  if (!name || !username || !email || !password) {
    showToast('Please Fill all the fields', 'info');
    return;
  }
  if (
    name.match(/^[a-zA-Z ]+$/) &&
    username.match(/^[a-zA-Z]+$/) &&
    email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)
  ) {
    try {
      let response = axios.post(
        USER_URL.register,
        {
          name: name,
          email: email,
          userid: username,
          password: password,
          image: image,
        },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      showToast('Please Wait!!', 'info');
      response = await response;
      if (response.status === 200) {
        showToast('User Registered Successfully!!', 'success');
        setTimeout(() => {
          navigate('/login');
        }, 2500);
      }
    } catch (err) {
      console.log(err);
      showToast('Cannot Register User', 'fail');
      showToast(err.response.data.message, 'fail');
    }
  } else {
    showToast('Please Check the inputs', 'fail');
  }
};

export const blockUser = async (user, username, token, setUpdateUI) => {
  try {
    const response = await axios.post(
      USER_URL.blockuser + user,
      { username: username },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (response.status === 200) {
      showToast('User Blocked', 'success');
      setUpdateUI(true);
      setTimeout(() => {
        setUpdateUI(false);
      }, 2000);
    }
  } catch (err) {
    showToast('Cannot block User', 'fail');
  }
};

export const unblockUser = async (user, username, token, setUpdateUI) => {
  try {
    const response = await axios.post(
      USER_URL.unblockuser + user,
      { username: username },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (response.status === 200) {
      showToast('User Unblocked', 'success');
      setUpdateUI(true);
      setTimeout(() => {
        setUpdateUI(false);
      }, 2000);
    }
  } catch (err) {
    showToast('Cannot unblock User', 'fail');
  }
};

export const getUserRole = async (setIsAdmin, setIsModerator) => {
  const username = localStorage.getItem('username');
  const token = localStorage.getItem('token');
  try {
    const response = await axios.post(
      USER_URL.getrole,
      {
        username: username,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (response.status === 200) {
      if (response.data.data.role === 'moderator') {
        setIsModerator(true);
        setIsAdmin(false);
      } else if (response.data.data.role === 'admin') {
        setIsAdmin(true);
        setIsModerator(false);
      } else {
        setIsModerator(false);
        setIsAdmin(false);
      }
    } else {
      console.log('Cannot get user role');
    }
  } catch (err) {
    console.log(err);
  }
};

export const getUsersRole = async (user) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.post(
      USER_URL.getrole,
      {
        username: user,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (response.status === 200) {
      return response.data.data.role;
    } else {
      console.log('Cannot get user role');
    }
  } catch (err) {
    console.log(err);
  }
};

export const getModerators = async (setMods) => {
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  try {
    const response = await axios.post(
      USER_URL.getallmoderators + username,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (response.status === 200) {
      const mod = [];
      for (let i = 0; i < response.data.data.users.length; i++) {
        mod.push(response.data.data.users[i]);
      }
      setMods(mod);
    }
  } catch (err) {
    console.log(err);
  }
};

export const getAllUsers = async (setUsers) => {
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  try {
    const response = await axios.post(
      USER_URL.getallusers + username,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const user = [];
    for (let i = 0; i < response.data.data.users.length; i++) {
      user.push(response.data.data.users[i]);
    }
    setUsers(user);
  } catch (err) {
    console.log(err);
  }
};

export const getUploader = async (id, setUploader) => {
  try {
    const response = await axios.post(IMAGE_URL.getuploader, { imgId: id });
    if (response.status === 200) {
      setUploader(response.data.data.uploader);
    }
  } catch (err) {
    console.log(err);
  }
};
