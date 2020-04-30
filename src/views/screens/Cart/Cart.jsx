import React from "react";
import "./Cart.css";
import { connect } from "react-redux";
import Axios from "axios";
import { API_URL } from "../../../constants/API";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import swal from "sweetalert";
import { Table, Alert } from "reactstrap";
import { Link } from "react-router-dom";

class Cart extends React.Component {
  state = {
    delete: false,
    productCart: []
  };

  getProductCart = () => {
    Axios.get(`${API_URL}/carts`, {
      params: {
        userId: this.props.user.id,
        // http://localhost:3001/carts?_expand=product&_expand=user
        _expand: "product"
      }
    })
      .then(res => {
        console.log(res);
        this.setState({ productCart: res.data });
      })
      .catch(err => console.log(err));
  };

  componentDidMount() {
    this.getProductCart();
  }

  renderProductCart = () => {
    return this.state.productCart.map((value, index) => {
      const { id, qty, product } = value;
      return (
        <>
          <tr>
            <td> {index + 1} </td>
            <td> {product.productName} </td>
            <td> {qty} </td>
            <td>
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR"
              }).format(product.price)}
            </td>
            <td>
              <img style={{ height: "100px" }} src={product.image} alt="" />
            </td>
            <td>
              <FontAwesomeIcon
                icon={faTrashAlt}
                style={{ fontSize: 20 }}
                onClick={() => this.deleteProductCart(id, index)}
              />
            </td>
          </tr>
        </>
      );
    });
  };

  deleteProductCart = (productCartId, index) => {
    Axios.delete(`${API_URL}/carts/${productCartId}`)
      .then(res => {
        console.log(res);
        swal(
          "Success",
          "The product has been deleted from your cart",
          "success"
        );

        // Tapi ini kita nge set state
        this.getProductCart();

        // Supaya dia ngerender ulang kita juga ubah statenya
        // let tempProductCart = this.state.productCart;
        // console.log(tempProductCart);
        // tempProductCart.splice(index, 1);
        // this.setState({ productCart: tempProductCart });
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    if (this.state.productCart.length == 0) {
      return (
        <Alert className="m-5">
          Your cart is empty, go <Link to="/">shopping</Link> !
        </Alert>
      );
    }
    return (
      <div className="m-5">
        <Table className="text-center">
          <thead>
            <tr>
              <td> No {this.state.hallo} </td>
              <td> Name </td>
              <td> Quantity </td>
              <td> Price </td>
              <td> Image </td>
              <td> Action </td>
            </tr>
          </thead>
          <tbody>{this.renderProductCart()}</tbody>
        </Table>
      </div>
    );
  }
}

const MapStateToProps = state => {
  return {
    user: state.user
  };
};

export default connect(MapStateToProps)(Cart);
