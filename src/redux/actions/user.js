import Axios from "axios";
import { API_URL } from "../../constants/API";
import Cookie from "universal-cookie";
import userTypes from "../types/user";

const { ON_LOGIN_SUCCESS, ON_LOGIN_FAIL, ON_LOGOUT_SUCCESS } = userTypes;

const cookieObject = new Cookie();

export const loginHandler = userLogin => {
  const { username, password } = userLogin;
  // Sebelum pake dispatch pastiin import applyMiddleware di src/index.js, karena dispatch ini asalnya dari redux-thunk
  return dispatch => {
    Axios.get(`${API_URL}/users`, {
      params: {
        username,
        password
      }
    })
      .then(res => {
        console.log(res);
        if (res.data.length > 0) {
          dispatch({
            type: ON_LOGIN_SUCCESS,
            payload: res.data[0]
          });
        } else {
          dispatch({
            type: ON_LOGIN_FAIL,
            payload: "Wrong username or password"
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
};

export const registerHandler = userRegister => {
  const { username, fullName, email, password } = userRegister;
  return dispatch => {
    Axios.get(`${API_URL}/users`, {
      params: {
        username
      }
    }).then(res => {
      console.log(res);
      if (res.data.length > 0) {
        dispatch({
          type: "ON_REGISTER_FAIL",
          payload: "Username has been registered"
        });
      } else {
        // Ini buat nembak juga sama bisa ditaro di local state register
        Axios.post(`${API_URL}/users`, { ...userRegister, role: "user" })
          .then(res => {
            console.log(res);
            dispatch({
              type: ON_LOGIN_SUCCESS,
              payload: res.data
            });
          })
          .catch(err => {
            console.log(err);
          });
      }
    });
  };
};

export const keepLoginHandler = cookieResult => {
  return dispatch => {
    Axios.get(`${API_URL}/users`, {
      params: {
        id: cookieResult.id
      }
    })
      .then(res => {
        if (res.data.length > 0) {
          dispatch({
            type: ON_LOGIN_SUCCESS,
            payload: res.data[0]
          });
        } else {
          dispatch({
            type: ON_LOGIN_FAIL,
            payload: "Wrong username or password"
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
};

export const logoutHandler = () => {
  cookieObject.remove("authData", { path: "/" });
  return {
    type: ON_LOGOUT_SUCCESS
  };
};

export const cookieChecker = () => {
  return {
    type: "COOKIE_CHECK"
  };
};
