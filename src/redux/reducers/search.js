const init_state = {
  searchInput: ""
};

export default (state = init_state, action) => {
  switch (action.type) {
    case "SEARCH_PRODUCT":
      return { ...state, searchInput: action.payload };
    default:
      return { ...state };
  }
};
