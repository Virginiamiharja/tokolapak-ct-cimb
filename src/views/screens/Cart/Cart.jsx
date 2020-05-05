import React from "react";
import "./Cart.css";
import { Modal, ModalHeader, ModalBody, Alert } from "reactstrap";
import Axios from "axios";
import { connect } from "react-redux";
import { API_URL } from "../../../constants/API";
import ButtonUI from "../../components/Button/Button";
import TextField from "../../components/TextField/TextField";
import { Link } from "react-router-dom";
import { navCartQty } from "../../../redux/actions";

import swal from "sweetalert";

class Cart extends React.Component {
  state = {
    productCart: [],

    editForm: {
      id: 0,
      userId: 0,
      productId: 0,
      qty: 0
    },

    productForm: {
      id: 0,
      productName: "",
      price: 0,
      category: "",
      image: "",
      desc: ""
    },

    transactions: {
      userId: 0,
      totalPrice: 0,
      status: "pending",
      // Check out date ini pas dia click button Confirm Order
      trxStartDate: "",
      trxEndDate: "",
      shippingOpt: 0
    },

    transactionDetail: {
      transactionId: 0,
      productId: 0,
      price: 0,
      quantity: 0,
      totalPrice: 0
    },

    orderSummary: false,
    activeProducts: [],
    modalOpen: false
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

  renderProductCart = () => {
    return this.state.productCart.map((val, idx) => {
      const { id, product, qty, productId } = val;
      return (
        <>
          <tr
            onClick={() => {
              if (this.state.activeProducts.includes(idx)) {
                this.setState({
                  activeProducts: [
                    ...this.state.activeProducts.filter(item => item !== idx)
                  ]
                });
              } else {
                this.setState({
                  activeProducts: [...this.state.activeProducts, idx]
                });
              }
            }}
          >
            <td> {productId} </td>
            <td> {product.productName} </td>
            <td>
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR"
              }).format(product.price * qty)}
            </td>
          </tr>
          <tr
            className={`collapse-item ${
              this.state.activeProducts.includes(idx) ? "active" : null
            }`}
          >
            <td className="" colSpan={3}>
              <div className="d-flex m-5 justify-content-around align-items-center">
                <div className="d-flex">
                  <img src={product.image} alt="" />
                  <div className="d-flex flex-column ml-4 justify-content-center">
                    <h5>{product.productName}</h5>
                    <h6 className="mt-2">
                      Category:
                      <span style={{ fontWeight: "normal" }}>
                        {product.category}
                      </span>
                    </h6>
                    <h6 className="mt-2">
                      Quantity:
                      <span style={{ fontWeight: "normal" }}>{qty}</span>
                    </h6>
                    <h6>
                      Price:
                      <span style={{ fontWeight: "normal" }}>
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR"
                        }).format(product.price)}
                      </span>
                    </h6>
                    <h6>
                      Description:
                      <span style={{ fontWeight: "normal" }}>
                        {product.desc}
                      </span>
                    </h6>
                  </div>
                </div>
                <div className="d-flex flex-column align-items-center">
                  <ButtonUI
                    onClick={_ => this.editBtnHandler(idx)}
                    type="contained"
                  >
                    Edit
                  </ButtonUI>
                  <ButtonUI
                    className="mt-3"
                    type="textual"
                    onClick={() => this.deleteProductCart(id)}
                  >
                    Delete
                  </ButtonUI>
                </div>
              </div>
            </td>
          </tr>
        </>
      );
    });
  };

  inputHandler = (e, field, form) => {
    let { value } = e.target;
    this.setState({
      [form]: {
        ...this.state[form],
        [field]: value
      }
    });
  };

  editBtnHandler = idx => {
    this.setState({
      editForm: {
        ...this.state.productCart[idx]
      },
      productForm: { ...this.state.productCart[idx].product },
      modalOpen: true
    });
  };

  editProductCart = () => {
    Axios.patch(`${API_URL}/carts/${this.state.editForm.id}`, {
      qty: parseInt(this.state.editForm.qty)
    })
      .then(res => {
        swal("Success!", "Your item has been edited", "success");
        this.setState({
          modalOpen: false
          // openOrderSummary: false
        });
        this.getProductCart();
        this.props.navCartQty(this.props.user.id);
      })
      .catch(err => {
        swal("Error!", "Your item could not be edited", "error");
        console.log(err);
      });
  };

  deleteProductCart = cartId => {
    Axios.delete(`${API_URL}/carts/${cartId}`)
      .then(res => {
        swal("Success", "The product has been deleted", "success");
        this.getProductCart();
        this.props.navCartQty(this.props.user.id);
      })
      .catch(err => {
        console.log(err);
      });
  };

  toggleModal = () => {
    this.setState({ modalOpen: !this.state.modalOpen });
  };

  componentDidMount() {
    this.getProductCart();
  }

  openOrderSummary = () => {
    // Supaya start date atau tanggal belanja kebikinnya pas user check out
    var date = new Date();
    var trxStartDate =
      // Jangan lupa month di + 1 karena dia start dari 0
      date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
    // Ini fungsi untuk hitung total price semuanya
    let tempTotalPrice = 0;
    this.state.productCart.map(value => {
      return (tempTotalPrice += value.qty * value.product.price);
    });
    // Ketika tombol open order summary, dia langsung nge set state transactionsnya
    this.setState({
      transactions: {
        ...this.state.transactions,
        userId: this.props.user.id,
        totalPrice: tempTotalPrice,
        trxStartDate
      },
      orderSummary: !this.state.orderSummary
    });
  };

  checkOut = () => {
    // Untuk ngepost ke table transactions
    Axios.post(`${API_URL}/transactions`, this.state.transactions)
      .then(res => {
        console.log(res.data);
        swal("Thank You", "We will proceed your order immediately", "success");
        // Trs disini kita ngeset state satu per satu barang yang ada di cart
        this.state.productCart.map(value => {
          this.setState({
            transactionDetail: {
              transactionId: res.data.id,
              productId: value.productId,
              price: value.product.price,
              quantity: value.qty,
              totalPrice: value.product.price * value.qty
            }
          });
          // Trs kita post satu persatu
          Axios.post(
            `${API_URL}/transactionDetails`,
            this.state.transactionDetail
          )
            .then(res => {
              console.log(res);
            })
            .catch(err => {
              console.log(err);
            });
          // Ini buat ngosongin cart
          this.deleteProductCart(value.id);
        });
      })
      .catch(err => {
        console.log(err);
        swal(
          "Oh No !",
          "There's something wrong with your order, try again !",
          "error"
        );
      });
  };

  render() {
    let totalPriceFinal =
      parseInt(this.state.transactions.shippingOpt) +
      parseInt(this.state.transactions.totalPrice);

    if (this.state.productCart.length == 0) {
      return (
        <Alert className="m-5">
          Your cart is empty, go <Link to="/">shopping</Link> !
        </Alert>
      );
    } else if (this.state.orderSummary) {
    }
    return (
      <div className="container py-4">
        <div className="dashboard">
          <caption className="p-3">
            <h2>Your Cart</h2>
          </caption>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Name</th>
                <th>Sub Total</th>
              </tr>
            </thead>
            <tbody>{this.renderProductCart()}</tbody>
          </table>
          <div className="ml-4 mt-3">
            <ButtonUI onClick={this.openOrderSummary} type="contained">
              Check Out
            </ButtonUI>
          </div>
        </div>
        {this.state.orderSummary ? (
          <div className="dashboard-form-container p-4">
            <caption className="p-3">
              <h2>Order Summary</h2>
            </caption>
            <div className="row">
              <div className="col-4">
                <select
                  value={this.state.transactions.shippingOpt}
                  className="custom-text-input h-100 pl-3"
                  onChange={e =>
                    this.inputHandler(e, "shippingOpt", "transactions")
                  }
                >
                  <option value="0" selected disabled>
                    All
                  </option>
                  <option value="100000">Instant</option>
                  <option value="50000">Same Day</option>
                  <option value="20000">Express</option>
                  <option value="0">Economy</option>
                </select>
              </div>
              <div className="col-8">
                <TextField
                  value={new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR"
                  }).format(totalPriceFinal)}
                  placeholder="Total Price"
                  // onChange={e =>
                  //   this.inputHandler(e, "totalPrice", "transactions")
                  // }
                />
              </div>
            </div>
            <div className=" mt-3">
              <ButtonUI onClick={this.checkOut} type="contained">
                Confirm Order
              </ButtonUI>
            </div>
          </div>
        ) : null}
        <Modal
          toggle={this.toggleModal}
          isOpen={this.state.modalOpen}
          className="edit-modal"
        >
          <ModalHeader toggle={this.toggleModal}>
            <caption>
              <h3>Edit Product</h3>
            </caption>
          </ModalHeader>
          <ModalBody>
            <div className="row">
              <div className="col-8">
                <TextField
                  value={this.state.productForm.productName}
                  placeholder="Product Name"
                />
              </div>
              <div className="col-4">
                <TextField
                  value={new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR"
                  }).format(this.state.productForm.price)}
                  placeholder="Price"
                />
              </div>
              <div className="col-12 mt-3">
                <textarea
                  value={this.state.productForm.desc}
                  style={{ resize: "none" }}
                  placeholder="Description"
                  className="custom-text-input"
                ></textarea>
              </div>
              <div className="col-6 mt-3">
                <TextField
                  value={this.state.editForm.qty}
                  type="number"
                  placeholder="Quantity"
                  onChange={e => this.inputHandler(e, "qty", "editForm")}
                />
              </div>
              <div className="col-6 mt-3">
                <select
                  value={this.state.productForm.category}
                  className="custom-text-input h-100 pl-3"
                  disabled
                >
                  <option value="Phone">Phone</option>
                  <option value="Tab">Tab</option>
                  <option value="Laptop">Laptop</option>
                  <option value="Desktop">Desktop</option>
                </select>
              </div>
              <div className="col-12 text-center my-3">
                <img src={this.state.productForm.image} alt="" />
              </div>
              <div className="col-5 mt-3 offset-1">
                <ButtonUI
                  className="w-100"
                  onClick={this.toggleModal}
                  type="outlined"
                >
                  Cancel
                </ButtonUI>
              </div>
              <div className="col-5 mt-3">
                <ButtonUI
                  className="w-100"
                  onClick={this.editProductCart}
                  type="contained"
                >
                  Save
                </ButtonUI>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

const mapDispatchToProps = {
  navCartQty
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
