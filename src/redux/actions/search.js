export const searchProduct = e => {
  const { value } = e.target;
  return {
    type: "SEARCH_PRODUCT",
    payload: value
  };
};

// export const searchProduct = searchInput => {
//   return {
//     type: "SEARCH_PRODUCT",
//     payload: searchInput
//   };
// };
