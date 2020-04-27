import userTypes from "../types/user";

const { ON_LOGIN_SUCCESS, ON_LOGIN_FAIL, ON_LOGOUT_SUCCESS } = userTypes;

const init_state = {
  id: 0,
  username: "",
  email: "",
  address: {},
  role: "",
  errMsg: "",
  isLoggedIn: false,

  //Button
  option: ""
};

export default (state = init_state, action) => {
  switch (action.type) {
    case ON_LOGIN_SUCCESS:
      const { id, username, email, role } = action.payload;
      return {
        ...state,
        id,
        username,
        email,
        role,
        isLoggedIn: true
      };
    case ON_LOGIN_FAIL:
      return { ...state, errMsg: action.payload };
    case ON_LOGOUT_SUCCESS:
      return { ...init_state };
    case "ON_REGISTER_FAIL":
      return { ...state, errMsg: action.payload };
    case "ON_CHANGE_LOGIN":
      return { ...state, option: action.payload };
    case "ON_CHANGE_REGISTER":
      return { ...state, option: action.payload };
    default:
      return { ...state };
  }
};
