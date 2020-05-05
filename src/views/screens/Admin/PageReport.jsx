import React from "react";
import "./AdminDashboard.css";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import Axios from "axios";
import { API_URL } from "../../../constants/API";
import ButtonUI from "../../components/Button/Button";
import TextField from "../../components/TextField/TextField";
import swal from "sweetalert";

class PageReport extends React.Component {
  state = {
    userList: [],
    transactionList: [],
    productList: [],
    transactionDetails: [],
    activePage: "user",
    activeTransactions: [],
    modalOpen: false,
    shoppingExpenses: 0
  };

  getUserList = () => {
    Axios.get(`${API_URL}/users`)
      .then(res => {
        this.setState({ userList: res.data });
      })
      .catch(err => {
        console.log(err);
      });
  };

  getTransactionList = () => {
    Axios.get(`${API_URL}/transactions`, {
      params: {
        _expand: "user",
        status: "approved"
      }
    })
      .then(res => {
        this.setState({ transactionList: res.data });
      })
      .catch(err => {
        console.log(err);
      });
  };

  renderUserList = () => {
    return this.state.userList.map((val, idx) => {
      const { id, username, fullName, email, password } = val;
      return (
        <>
          <tr>
            <td> {id} </td>
            <td> {username} </td>
            <td> {fullName} </td>
            <td> {this.calculateShoppingExpenses(id)} </td>
            <td>
              <ButtonUI
                className="mt-3"
                type="textual"
                onClick={() => {
                  if (this.state.activeTransactions.includes(idx)) {
                    this.setState({
                      activeTransactions: [
                        ...this.state.activeTransactions.filter(
                          item => item !== idx
                        )
                      ]
                    });
                  } else {
                    this.setState({
                      activeTransactions: [
                        ...this.state.activeTransactions,
                        idx
                      ]
                    });
                  }
                }}
              >
                Detail
              </ButtonUI>
            </td>
          </tr>
          {this.renderTransactionList(id, idx)}
        </>
      );
    });
  };

  renderTransactionList = (id, idx) => {
    return this.state.transactionList.map(value => {
      // Dia bakal keluarin transactionDetails sesuai dengan transactionId
      if (id == value.userId) {
        return (
          <>
            <tr
              className={`collapse-item ${
                this.state.activeTransactions.includes(idx) ? "active" : null
              }`}
            >
              <td colSpan={2}> Transaction ID {value.id} </td>
              <td colSpan={2}>
                Total Price per Transaction{" "}
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR"
                }).format(
                  parseInt(value.totalPrice) + parseInt(value.shippingOpt)
                )}
              </td>
              <td>Status {value.status}</td>
            </tr>
          </>
        );
      }
    });
  };

  getProductList = () => {
    Axios.get(`${API_URL}/products`)
      .then(res => {
        console.log(res);
        this.setState({ productList: res.data });
      })
      .catch(err => {
        console.log(err);
      });
  };

  getTransactionDetails = () => {
    Axios.get(`${API_URL}/transactiondetails`, {
      params: {
        _expand: "product",
        _expand: "transaction"
      }
    })
      .then(res => {
        console.log(res.data);
        this.setState({ transactionDetails: res.data });
      })
      .catch(err => {
        console.log(err);
      });
  };

  renderProductList = () => {
    return this.state.productList.map((val, idx) => {
      const { id, productName, price, category } = val;
      return (
        <>
          <tr>
            <td> {id} </td>
            <td> {productName} </td>
            <td>
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR"
              }).format(price)}
            </td>
            <td> {category} </td>
            <td> {this.calculateProductQty(id)} </td>
            <td>
              <ButtonUI
                className="mt-3"
                type="textual"
                onClick={() => {
                  if (this.state.activeTransactions.includes(idx)) {
                    this.setState({
                      activeTransactions: [
                        ...this.state.activeTransactions.filter(
                          item => item !== idx
                        )
                      ]
                    });
                  } else {
                    this.setState({
                      activeTransactions: [
                        ...this.state.activeTransactions,
                        idx
                      ]
                    });
                  }
                }}
              >
                Detail
              </ButtonUI>
            </td>
          </tr>
          {this.renderTransactionDetails(id, idx)}
        </>
      );
    });
  };

  renderTransactionDetails = (productId, idx) => {
    return this.state.transactionDetails.map(value => {
      if (
        productId == value.productId &&
        value.transaction.status == "approved"
      )
        return (
          <>
            <tr
              className={`collapse-item ${
                this.state.activeTransactions.includes(idx) ? "active" : null
              }`}
            >
              <td colSpan={2}> Transaction Detail ID {value.id} </td>
              <td>
                Price{" "}
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR"
                }).format(parseInt(value.price))}
              </td>
              <td>Quantity {value.quantity}</td>
              <td>
                Total Price{" "}
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR"
                }).format(
                  parseInt(value.quantity) * parseInt(value.price)
                )}{" "}
              </td>
              <td>Status {value.transaction.status}</td>
            </tr>
          </>
        );
    });
  };

  calculateShoppingExpenses = id => {
    let shoppingExpenses = 0;
    this.state.transactionList.map(value => {
      if (id == value.userId)
        // Buat ngitung pengeluaran yang per user yang udah di approved
        shoppingExpenses +=
          parseInt(value.totalPrice) + parseInt(value.shippingOpt);
      //   this.setState({ userList: [...this.state.userList, shoppingExpenses] });
    });
    return (
      <>
        {new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR"
        }).format(shoppingExpenses)}
      </>
    );
  };

  calculateProductQty = productId => {
    let productQty = 0;
    this.state.transactionDetails.map(value => {
      if (
        productId == value.productId &&
        value.transaction.status == "approved"
      )
        productQty += value.quantity;
    });
    return <>{productQty}</>;
  };

  toggleModal = () => {
    this.setState({ modalOpen: !this.state.modalOpen });
  };

  componentDidMount() {
    this.getTransactionList();
    this.getUserList();
    this.getProductList();
    this.getTransactionDetails();
  }

  render() {
    return (
      <div className="container py-4">
        <div className="d-flex mb-3">
          <ButtonUI
            className={`auth-screen-btn ${
              this.state.activePage == "user" ? "active" : null
            }`}
            type="outlined"
            onClick={() => this.setState({ activePage: "user" })}
          >
            User
          </ButtonUI>
          <ButtonUI
            className={`ml-3 auth-screen-btn ${
              this.state.activePage == "product" ? "active" : null
            }`}
            type="outlined"
            onClick={() => {
              this.setState({ activePage: "product" });
            }}
          >
            Product
          </ButtonUI>
        </div>

        <div className="dashboard">
          {this.state.activePage == "user" ? (
            <>
              <caption className="p-3">
                <h2>User Transactions</h2>
                <span>
                  the detail button can only be clicked if shopping expenses > 0
                </span>
              </caption>
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Full Name</th>
                    <th>Shopping Expenses + Shipping Fee</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>{this.renderUserList()}</tbody>
              </table>
            </>
          ) : (
            <>
              <caption className="p-3">
                <h2>Product Transactions</h2>
                <span>
                  the detail button can only be clicked if approved quantity > 0
                </span>
              </caption>
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Approved Quantity</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>{this.renderProductList()}</tbody>
              </table>
            </>
          )}
        </div>
      </div>
    );
  }
}

export default PageReport;
