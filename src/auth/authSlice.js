import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import StorageAPI from 'common/storageAPI';
import { AUTH_TOKEN_KEY } from './constants';

const API_URL = process.env.REACT_APP_API_URL;

const initialState = {
  loading: false,
  userData: null,
  loginSuccess: null,
  errorMessage: null,
};

// Actions

/**
 * authenticate authentification user by username and password
 *
 * @param {Object} login - ther login data with username and password
 * @param {string} login.username - username of user
 * @param {string} login.password - password of user
 * @param {boolean} login.rememberMe - remember me flag
 * @return {Promise} the promise of response
 *
 * @example
 * dispatch(authenticate({ username: 'admin1', password: 'admin1' }));
 *
 * @example <caption>Response:</caption>
 * {
 *  "id" : 1,
 *  "login" : "admin1",
 *  "firstName" : "Ad",
 *  "lastName" : "Min",
 *  "name" : null,
 *  "email" : "admin1@example.com",
 *  "bio" : null,
 *  "avatarUrl" : null,
 *  "roles" : [ "ROLE_ADMIN" ],
 *  "id_token" : "jwt-token"
 * }
 */
export const authenticate = createAsyncThunk(
  'auth/signin',
  async ({ username, password, rememberMe }) =>
    fetch(`${API_URL}/authenticate`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, rememberMe }),
    }).then((resp) => resp.json())
);

/**
 * signin signin user by username, password and rememberMe
 *
 * @param {Object} signin - the signin data with username, email, password and rememberMe
 * @returns {Promise} the promise of response
 *
 * @example
 * dispatch(signin({username: 'admin1', password: 'admin1', rememberMe: true}));
 */
export const signin =
  ({ username, password, rememberMe }) =>
  async (dispatch) => {
    const result = await dispatch(authenticate({ username, password, rememberMe }));
    const res = result.payload;
    const bearerToken = res.id_token;
    if (rememberMe) {
      StorageAPI.local.set(AUTH_TOKEN_KEY, bearerToken);
    } else {
      StorageAPI.session.set(AUTH_TOKEN_KEY, bearerToken);
    }
  };

export const getUserData = createAsyncThunk('auth/getUserData', async () =>
  fetch(`${API_URL}/account`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${
        StorageAPI.local.get(AUTH_TOKEN_KEY) || StorageAPI.session.get(AUTH_TOKEN_KEY)
      }`,
    },
  }).then((resp) => resp.json())
);

export const signup = createAsyncThunk('auth/signUp', async ({ login, name, email, password }) =>
  fetch(`${API_URL}/register`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ login, name, email, password }),
  })
);

// Authentication slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  extraReducers(builder) {
    builder
      .addCase(authenticate.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
        state.loginSuccess = true;
        state.errorMessage = null;
      })
      .addCase(authenticate.pending, (state) => {
        state.loading = true;
        state.loginSuccess = null;
        state.errorMessage = null;
      })
      .addCase(authenticate.rejected, (state, action) => {
        state.loading = false;
        state.loginSuccess = false;
        state.errorMessage = action.error.message || 'Something went wrong';
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
        state.loginSuccess = true;
        state.errorMessage = null;
      })
      .addCase(getUserData.pending, (state) => {
        state.loading = true;
        state.loginSuccess = null;
        state.errorMessage = null;
      })
      .addCase(getUserData.rejected, (state, action) => {
        state.loading = false;
        state.loginSuccess = false;
        state.errorMessage = action.error.message || 'Something went wrong';
      })
      .addCase(signup.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message || 'Something went wrong';
      });
  },
});

export default authSlice.reducer;
