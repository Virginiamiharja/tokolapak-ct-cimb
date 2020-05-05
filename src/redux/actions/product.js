import Axios from "axios";
import { API_URL } from "../../constants/API";
import swal from "sweetalert";

export const addToCartHandler = (userId, productId) => {
  return dispatch => {
    // Kita cek di cart ada id product di user id yang sama ga
    Axios.get(`${API_URL}/carts`, {
      params: {
        userId,
        productId
      }
    })
      .then(res => {
        // Apabila tidak ada data yang sama
        if (res.data.length > 0) {
          // Qty nya aja yang di edit jadi nambah 1
          Axios.patch(`${API_URL}/carts/${res.data[0].id}`, {
            qty: res.data[0].qty + 1
          })
            .then(res => {
              console.log(res);
              swal(
                "Add to cart",
                "Your item has been added to your cart",
                "success"
              );
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          // Kalo tidak ada data yang sama, di post ke carts
          Axios.post(`${API_URL}/carts`, {
            userId,
            // Bisa dari state productId bisa juga dari query params
            productId,
            qty: 1
          })
            .then(res => {
              console.log(res);
              swal(
                "Add to cart",
                "Your item has been added to your cart",
                "success"
              );
            })
            .catch(err => {
              console.log(err);
            });
        }
      })
      .catch(err => console.log(err));
  };
};

export const addToWishlistHandler = (userId, productId) => {
  return dispatch => {
    // Kita cek di wishlist ada id product di user id yang sama ga
    Axios.get(`${API_URL}/wishlists`, {
      params: {
        userId,
        productId
      }
    })
      .then(res => {
        // Apabila tidak ada data yang sama
        if (res.data.length > 0) {
          // Qty nya aja yang di edit jadi nambah 1
          Axios.patch(`${API_URL}/wishlists/${res.data[0].id}`, {
            qty: res.data[0].qty + 1
          })
            .then(res => {
              console.log(res);
              swal(
                "Add to wishlist",
                "Your item has been added to your wishlist",
                "success"
              );
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          // Kalo tidak ada data yang sama, di post ke wishlist
          Axios.post(`${API_URL}/wishlists`, {
            userId,
            // Bisa dari state productId bisa juga dari query params
            productId,
            qty: 1
          })
            .then(res => {
              console.log(res);
              swal(
                "Add to wishlist",
                "Your item has been added to your wishlist",
                "success"
              );
            })
            .catch(err => {
              console.log(err);
            });
        }
      })
      .catch(err => console.log(err));
  };
};

export const navCartQty = userId => {
  return dispatch => {
    Axios.get(`${API_URL}/carts`, {
      params: {
        userId
      }
    })
      .then(res => {
        let cartQty = 0;
        res.data.map(value => {
          cartQty += value.qty;
        });
        // alert(cartQty);
        dispatch({
          type: "SET_NAVCART_QTY",
          payload: cartQty
        });
      })
      .catch(err => {
        console.log(err);
      });
  };
};
