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
import ButtonUI from "../../components/Button/Button";
import TextField from "../../components/TextField/TextField";

class Cart extends React.Component {
  state = {
    delete: false,
    productCart: [],
    showProductDetails: false,
    transactionDetails: {
      userId: 0,
      totalPrice: 0,
      paymentStatus: "pending",
      products: []
    }
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
            <td> {product.productName} </td>
            <td>
              <img style={{ height: "100px" }} src={product.image} alt="" />
            </td>
            <td>
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR"
              }).format(product.price)}
            </td>
            <td> {qty} </td>
            <td>
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR"
              }).format(product.price * qty)}
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

  showTransactionDetails = () => {
    // Untuk nampung sementara semua product di 1 user ID
    let tempProduct = [];
    let totalPrice = 0;

    this.state.productCart.map(value => {
      tempProduct.push(value.product);
      totalPrice += value.product.price * value.qty;
    });

    this.setState({
      showProductDetails: true,
      transactionDetails: {
        ...this.state.transactionDetails,
        userId: this.props.user.id,
        totalPrice,
        // paymentStatus
        products: tempProduct
      }
    });
  };

  cancelPayment = () => {
    this.setState({
      showProductDetails: false
    });
  };

  renderTransactionDetails = () => {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center">
        <div>
          <h3 className="m-5"> Order Summary </h3>
          <p>
            Full Name <TextField value={this.props.user.fullName} />
            <br />
            Address
            <TextField
              value={
                this.state.transactionDetails.userId + " ini isinya user ID"
              }
            />
            <br />
            Total Price
            <TextField
              className="mb-3"
              value={new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR"
              }).format(this.state.transactionDetails.totalPrice)}
            />
            <h6> Product List </h6>
            <Table>
              <thead>
                <tr>
                  <td> Product ID </td>
                  <td> Product Name </td>
                  <td> Product Category </td>
                  <td> Product Price </td>
                </tr>
              </thead>
              <tbody>
                {this.state.transactionDetails.products.map(value => {
                  return (
                    <tr>
                      <td>{value.id}</td>
                      <td>{value.productName}</td>
                      <td>{value.category}</td>
                      <td>
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR"
                        }).format(value.price)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </p>
          <div className=" mt-4 d-flex justify-content-end">
            <ButtonUI
              onClick={this.cancelPayment}
              type="outlined"
              className="mr-2"
            >
              Cancel
            </ButtonUI>
            <ButtonUI onClick={this.confirmPayment}> Confirm </ButtonUI>
          </div>
        </div>
      </div>
    );
  };

  confirmPayment = () => {
    Axios.post(`${API_URL}/transactions`, this.state.transactionDetails)
      .then(res => {
        swal("Thank you", "For shopping with us", "success");
      })
      .catch(err => {
        console.log(err);
      });

    // Untuk kosongin cart
    this.state.productCart.map(value => {
      return this.deleteProductCart(value.id);
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
      <div className="m-5 text-center">
        <h4 className="m-5"> Your Cart </h4>
        <div>
          <Table>
            <thead>
              <tr>
                <td colSpan={2}> Product </td>
                <td> Price </td>
                <td> Quantity </td>
                <td> Total </td>
                <td> </td>
              </tr>
            </thead>
            <tbody>{this.renderProductCart()}</tbody>
          </Table>
          <div className="d-flex justify-content-end">
            <ButtonUI type="contained" onClick={this.showTransactionDetails}>
              Check Out
            </ButtonUI>
          </div>
          {this.state.showProductDetails
            ? this.renderTransactionDetails()
            : null}
        </div>
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
