import { combineReducers } from "redux";
import userReducer from "./user";
import searchReducer from "./search";
import productReducer from "./product";

export default combineReducers({
  user: userReducer,
  search: searchReducer,
  product: productReducer
});
