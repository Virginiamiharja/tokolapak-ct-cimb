import userTypes from "../types/user";

const { ON_LOGIN_SUCCESS, ON_LOGIN_FAIL, ON_LOGOUT_SUCCESS } = userTypes;

const init_state = {
  id: 0,
  username: "",
  fullName: "",
  // email: "",
  address: {},
  role: "",
  errMsg: "",
  // Cart dan app.jsx sama2 menggunakan component did mount, jadi ketika kita buka cart dia userId 0 karena blm ke set sama component did mount di app.jsx
  cookieChecked: false
};

export default (state = init_state, action) => {
  switch (action.type) {
    case ON_LOGIN_SUCCESS:
      const { id, username, fullName, role } = action.payload;
      return {
        ...state,
        id,
        username,
        fullName,
        role,
        cookieChecked: true
      };
    case ON_LOGIN_FAIL:
      return { ...state, errMsg: action.payload, cookieChecked: true };
    case ON_LOGOUT_SUCCESS:
      return { ...init_state, cookieChecked: true };
    case "ON_REGISTER_FAIL":
      return { ...state, errMsg: action.payload, cookieChecked: true };
    case "COOKIE_CHECK":
      return { ...state, cookieChecked: true };
    default:
      return { ...state };
  }
};
