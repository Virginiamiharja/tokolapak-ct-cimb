import userTypes from "../types/user";

const { ON_LOGIN_SUCCESS, ON_LOGIN_FAIL, ON_LOGOUT_SUCCESS } = userTypes;

const init_state = {
  id: 0,
  username: "",
  fullName: "",
  // email: "",
  address: {},
  role: "",
  errMsg: ""
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
        role
      };
    case ON_LOGIN_FAIL:
      return { ...state, errMsg: action.payload };
    case ON_LOGOUT_SUCCESS:
      return { ...init_state };
    case "ON_REGISTER_FAIL":
      return { ...state, errMsg: action.payload };
    default:
      return { ...state };
  }
};
