import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

const initialState = {
  userInfo: { userData: {}, token: {} },
  data: [],
  pending: false,
  error: false,
  refreshError: false,
  errorText: '',
  isBlocked: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    actionStart: (state) => {
      state.pending = true;
    },
    getAllUsersSuccess: (state, action) => {
      state.pending = false;
      state.data = action.payload.data.data;
      state.error = false;
    },
    modifyUsersSuccess: (state) => {
      state.pending = false;
      state.error = false;
    },

    actionSuccess: (state, action) => {
      state.pending = false;
      state.userInfo.userData = action.payload.data.user;
      state.userInfo.token = action.payload.token;
      state.error = false;
    },
    actionError: (state, action) => {
      state.error = true;
      state.errorText = action.payload;
      state.pending = false;
    },
    actionRefreshError: (state) => {
      state.refreshError = true;
    },
    logoutSuccess: (state) => {
      state.pending = false;
      state.userInfo.userData = {};
      state.userInfo.token = {};
    },
    blockUser: (state) => {
      console.log('blocking');
      state.isBlocked = true;
    },
    unblockUser: (state) => {
      state.isBlocked = false;
    },
  },
});

export const getAllUsers = async (user, dispatch) => {
  dispatch(actionStart());
  try {
    const res = await axios.get(`${API_URL}/users/`);
    dispatch(getAllUsersSuccess(res.data));
  } catch (err) {
    console.log(err);
    if (err.response.status == 403) dispatch(blockUser());
  }
};
export const modifyUsers = async (data, dispatch) => {
  dispatch(actionStart());
  try {
    const res = await axios.post(`${API_URL}/users/modifyUsers`, data);

    dispatch(modifyUsersSuccess(res.data));
  } catch (err) {
    dispatch(actionError());
  }
};

export const refresh = async (dispatch) => {
  dispatch(actionStart());
  try {
    const res = await axios.post(`${API_URL}/users/refresh`, {
      withCredentials: true,
    });
    dispatch(actionSuccess(res.data));
  } catch (err) {
    dispatch(actionRefreshError());
  }
};

export const signup = async (user, dispatch) => {
  dispatch(actionStart());
  try {
    const res = await axios.post(`${API_URL}/users/signup`, user);
    dispatch(actionSuccess(res.data));
  } catch (err) {
    dispatch(actionError());
  }
};

export const login = async (user, dispatch) => {
  dispatch(actionStart());
  try {
    const res = await axios.post(`${API_URL}/users/login`, user);
    dispatch(actionSuccess(res.data));
  } catch (err) {
    dispatch(actionError(err.response.data.message));
  }
};

export const logout = async (dispatch) => {
  dispatch(actionStart());
  try {
    const res = await axios.get(`${API_URL}/users/logout`);
    dispatch(logoutSuccess(res.data));
  } catch (err) {
    throw new Error('An error occurred while fetching logOut');
  }
};

export const {
  blockUser,
  unblockUser,
  actionStart,
  getAllUsersSuccess,
  modifyUsersSuccess,
  actionSuccess,
  actionError,
  actionRefreshError,
  logoutSuccess,
} = userSlice.actions;
export default userSlice.reducer;
