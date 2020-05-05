const init_state = {
  navCartQty: 0
};

export default (state = init_state, action) => {
  switch (action.type) {
    case "SET_NAVCART_QTY":
      return { ...state, navCartQty: action.payload };
    default:
      return { ...state };
  }
};
