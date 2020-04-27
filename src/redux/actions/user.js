import Axios from "axios";
import { API_URL } from "../../constants/API";
import swal from "sweetalert";
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
        if (res.data.length > 0) {
          swal(
            `Hi ${res.data[0].fullName}`,
            "Welcome to your account",
            "success"
          );
          dispatch({
            type: ON_LOGIN_SUCCESS,
            payload: res.data[0]
          });
        } else {
          swal("Oops !", "Wrong username or password", "error");
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
  const { username, fullName, password, rptPassword, role } = userRegister;
  return dispatch => {
    Axios.get(`${API_URL}/users`, {
      params: {
        username
      }
    }).then(res => {
      console.log(res);
      if (res.data.length > 0) {
        swal("Oops", "That username has been registered", "error");
        dispatch({
          type: "ON_REGISTER_FAIL",
          payload: "Username has been registered"
        });
      } else {
        if (password == rptPassword) {
          Axios.post(`${API_URL}/users`, userRegister)
            .then(res => {
              console.log(res);
              swal("Congrats", "You already have an account", "success");
              dispatch({
                type: ON_LOGIN_SUCCESS,
                payload: res.data
              });
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          swal("Oops", "Your password doesnt match", "error");
        }
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
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
};

export const logoutHandler = () => {
  cookieObject.remove("authData");
  return {
    type: ON_LOGOUT_SUCESS
  };
};
